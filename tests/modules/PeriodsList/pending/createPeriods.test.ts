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

	let periodReleaseDate = startTime
	// log generating dummy data
	for (let index = 0; index < periods.toI32(); index++) {

		periodReleaseDate = releasePeriods.calculate.increasePeriodReleaseDate(
			periodReleaseDate, periodsDuration
		)

		entity = periodsLists.pending.mutations.addPeriodKey(
			entity,
			releasePeriods.keys.encode(
				releasePeriods.getPeriodId(contractId, index.toString()),
				periodReleaseDate
			),
		)

	}

	tests.helpers.asserts.assertBigInt(managedAmount, storedEntity.amount)
	tests.helpers.asserts.assertStringArray(entity.keys, storedEntity.keys)

	tests.logs.global.success("PeriodsList.pending.createPeriods.test", id)
}