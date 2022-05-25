import { BigInt } from '@graphprotocol/graph-ts'
import {
  circulatingSupply as circulatingSupplyModule,
  periodsLists,
  releasePeriods,
} from '../../modules'

export function createPeriodsForContract(
  contractId: string, periods: BigInt, managedAmount: BigInt,
  startTime: BigInt, endTime: BigInt
): void {

  let graphCirculatingSupply = circulatingSupplyModule.createOrLoadGraphCirculatingSupply()
  let pendingPeriodsList = periodsLists.pending.getOrCreateList()

  // [periodAmount, periodsAmount, managedAmount] naming may introduce confusion: some of them talk about GRT but others don't
  let contractReleaseDuration = releasePeriods.calculate.walletReleaseDuration(startTime, endTime)
  // tests.logs.global.warn("calculate.walletReleaseDuration", `start: ${startTime} - end: ${endTime} - duration: ${contractReleaseDuration}`)

  let periodReleaseDuration = releasePeriods.calculate.periodReleaseDuration(contractReleaseDuration, periods)
  // tests.logs.global.warn("calculate.periodReleaseDuration", `duration: ${contractReleaseDuration} - periods: ${periods}`)

  let periodAmount = releasePeriods.calculate.periodAmount(managedAmount, periods)


  // tests.logs.global.warn("startTime.plus", `periodDuration: ${periodReleaseDuration} - startTime: ${startTime}`)

  let periodsCount = periods.toI32()
  for (let i = 0; i < periodsCount; i++) {
    let periodReleaseStart = startTime.plus(periodReleaseDuration.times(BigInt.fromI32(i + 1)))

    // tests.logs.global.warn("calculate.increasePeriodReleaseDate", `post.periodReleaseDate: ${periodReleaseStart}`)


    // periodsToProcess is a derived list, periods are created w/ this relationship
    let releasePeriod = releasePeriods.createReleasePeriod(
      contractId, i, periodReleaseStart, periodAmount
    )
    releasePeriod.save()
    // tests.logs.global.warn("releasePeriods.createReleasePeriod", `contactId: ${releasePeriod.id} - i: ${i} - periodReleaseDate: ${releasePeriod.releaseDate}`)


    pendingPeriodsList = periodsLists.pending.mutations.addPeriodKey(
      pendingPeriodsList, releasePeriods.keys.encode(
        releasePeriod.id,
        releasePeriod.releaseDate
      )
    )

    if (i == 0) {
      graphCirculatingSupply = circulatingSupplyModule.mutations.updateMinProcessToDate(
        graphCirculatingSupply, periodReleaseStart
      )
    }
  }

  graphCirculatingSupply = circulatingSupplyModule.mutations.decreaseCirculatingSupply(
    graphCirculatingSupply,
    managedAmount
  )
  graphCirculatingSupply.save()

  // grt amount
  pendingPeriodsList = periodsLists.pending.mutations.increaseAmount(
    pendingPeriodsList, managedAmount
  )
  pendingPeriodsList.save()
}