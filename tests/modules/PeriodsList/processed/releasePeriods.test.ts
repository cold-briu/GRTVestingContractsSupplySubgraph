import { BigInt } from "@graphprotocol/graph-ts"
import { periodsLists, tests } from "../../../../src/modules"

export function releasePeriods(
	expectedProcessedAmount: BigInt
): void {

	let entity = periodsLists.processed.getOrCreateList()

	tests.logs.global.started(
		"PeriodsList.processed.releasePeriods.test", entity.id
	)

	tests.helpers.asserts.assertBigInt(expectedProcessedAmount, entity.amount)

	tests.logs.global.success("PeriodsList.processed.releasePeriods.test", entity.id)
}