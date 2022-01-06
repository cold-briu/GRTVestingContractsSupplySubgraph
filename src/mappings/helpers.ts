import { BigInt, log } from '@graphprotocol/graph-ts'
import { circulatingSupply, periodsLists, releasePeriods } from '../modules'

export function createPeriodsForContract(
  contractId: string, periods: BigInt, managedAmount: BigInt,
  startTime: BigInt, endTime: BigInt
): void {

  let graphCirculatingSupply = circulatingSupply.createOrLoadGraphCirculatingSupply()
  graphCirculatingSupply.save()

  let pendingPeriodsList = periodsLists.pending.getOrCreatePendingPeriodsList()
  pendingPeriodsList.save()

  // [periodAmount, periodsAmount, managedAmount] naming may introduce confusion: some of them talk about GRT but others don't
  let releaseDuration = releasePeriods.calculate.walletReleaseDuration(startTime, endTime)
  let periodsDuration = releasePeriods.calculate.periodReleaseDuration(releaseDuration, periods)
  let periodAmount = releasePeriods.calculate.periodAmount(managedAmount, periods)
  let periodReleaseDate = startTime

  log.warning('[RELEASE PERIODS] creating release periods for contract: {}', [contractId])

  for (let i = 0; i < periods.toI32(); i++) {

    periodReleaseDate = releasePeriods.calculate.increasePeriodReleaseDate(
      periodReleaseDate, periodsDuration
    )

    let releasePeriod = releasePeriods.createReleasePeriod(
      contractId, i, periodReleaseDate, periodAmount
    )
    releasePeriod.save()

    let periodsToProcess = graphCirculatingSupply.periodsToProcess as string[]

    if (i == 0) {
      if (graphCirculatingSupply.minPeriodToProcessDate.isZero() ||
        graphCirculatingSupply.minPeriodToProcessDate > periodReleaseDate) { // FIXME: may use < instead?
        graphCirculatingSupply.minPeriodToProcessDate = periodReleaseDate
      }
    }

    periodsToProcess.push(releasePeriod.id)
    graphCirculatingSupply.periodsToProcess = periodsToProcess
  }
  /*
  {
    let prevCirculatingSupply = graphCirculatingSupply.circulatingSupply
    graphCirculatingSupply.circulatingSupply = prevCirculatingSupply.minus(managedAmount)
  }
   is the same as :
  */
  graphCirculatingSupply.circulatingSupply = graphCirculatingSupply.circulatingSupply.minus(managedAmount) // FIXME: this may broke

  graphCirculatingSupply.periodsToProcessTotalAmount = graphCirculatingSupply.periodsToProcessTotalAmount.plus(managedAmount)
  graphCirculatingSupply.save()
}