import { BigInt, log } from '@graphprotocol/graph-ts'
import { circulatingSupply, periodsLists, releasePeriods } from '../modules'

export function createPeriodsForContract(
  contractId: string, periods: BigInt, managedAmount: BigInt,
  startTime: BigInt, endTime: BigInt
): void {

  let graphCirculatingSupply = circulatingSupply.createOrLoadGraphCirculatingSupply()

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

    // periodsToProcess is a derived list, periods are created w/ this relationship
    let releasePeriod = releasePeriods.createReleasePeriod(
      contractId, i, periodReleaseDate, periodAmount
    )
    releasePeriod.save()

    // TODO crete helper for this
    if (i == 0) {
      if (
        graphCirculatingSupply.minPeriodToProcessDate.isZero() ||
        graphCirculatingSupply.minPeriodToProcessDate > periodReleaseDate
      ) {
        graphCirculatingSupply.minPeriodToProcessDate = periodReleaseDate
      }
    }

  }

  graphCirculatingSupply.circulatingSupply = circulatingSupply.mutations.decreaseCirculatingSupply(
    graphCirculatingSupply,
    managedAmount
  )
  graphCirculatingSupply.save()

  let pendingPeriodsList = periodsLists.pending.getOrCreateList()
  pendingPeriodsList = periodsLists.pending.mutations.increaseAmount(
    pendingPeriodsList, managedAmount
  )
  pendingPeriodsList.save()
}