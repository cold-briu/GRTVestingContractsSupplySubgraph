import { BigInt, log } from '@graphprotocol/graph-ts'
import { circulatingSupply as circulatingSupplyModule, periodsLists, releasePeriods } from '../modules'

export function createPeriodsForContract(
  contractId: string, periods: BigInt, managedAmount: BigInt,
  startTime: BigInt, endTime: BigInt
): void {

  let graphCirculatingSupply = circulatingSupplyModule.createOrLoadGraphCirculatingSupply()
  let pendingPeriodsList = periodsLists.pending.getOrCreateList()

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

    pendingPeriodsList = periodsLists.pending.mutations.addPeriodKey(
      pendingPeriodsList, releasePeriods.keys.encode(releasePeriod.id, releasePeriod.releaseDate)
    )

    if (i == 0) {
      graphCirculatingSupply = circulatingSupplyModule.mutations.updateMinProcessToDate(
        graphCirculatingSupply, periodReleaseDate
      )
    }

  }

  graphCirculatingSupply = circulatingSupplyModule.mutations.decreaseCirculatingSupply(
    graphCirculatingSupply,
    managedAmount
  )
  graphCirculatingSupply.save()

  pendingPeriodsList = periodsLists.pending.mutations.increaseAmount(
    pendingPeriodsList, managedAmount
  )
  pendingPeriodsList.save()
}