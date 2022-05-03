import { BigInt } from "@graphprotocol/graph-ts"
import { periodsLists, releasePeriods, tests } from "../../../../src/modules"

export function createPeriods(
	contractId: string,
	periods: BigInt, managedAmount: BigInt,
	startTime: BigInt, endTime: BigInt
): void {

	let id = periodsLists.constants.PENDING_LISTS_ID
	let storedEntity = periodsLists.pending.getOrCreateList()

	tests.logs.global.started(
		"PeriodsList.pending.createPeriods.test", id
	)

	let entity = periodsLists.pending.createList()
	let releaseDuration = releasePeriods.calculate.walletReleaseDuration(startTime, endTime)
	let periodsDuration = releasePeriods.calculate.periodReleaseDuration(releaseDuration, periods)
	let periodAmount = releasePeriods.calculate.periodAmount(managedAmount, periods)
	// let periodReleaseDate = startTime
	let periodReleaseDate = startTime.plus(periodsDuration)

	let periodsCount = periods.toI32()
	for (let i = 0; i < periodsCount; i++) {
		periodReleaseDate = releasePeriods.calculate.increasePeriodReleaseDate(
			periodReleaseDate, periodsDuration
		)

		// periodsToProcess is a derived list, periods are created w/ this relationship
		let releasePeriod = releasePeriods.createReleasePeriod(
			contractId, i, periodReleaseDate, periodAmount
		)
		releasePeriod.save()
	}


	// tests.helpers.asserts.assertBigInt(managedAmount, storedEntity.amount)
	// tests.helpers.asserts.assertStringArray(entity.keys, storedEntity.keys)

	tests.logs.global.success("PeriodsList.pending.createPeriods.test", id)
}