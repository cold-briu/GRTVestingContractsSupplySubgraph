import { BigInt } from "@graphprotocol/graph-ts"
import { integer } from "@protofire/subgraph-toolkit"
import { periodsLists, tests } from "../../../../src/modules"

export function releasePeriods(): void {

	let id = periodsLists.constants.PENDING_LISTS_ID
	let entity = periodsLists.pending.createList()

	tests.logs.global.started(
		"PeriodsList.pending.releasePeriods.test", id
	)

	tests.helpers.asserts.assertBigInt(integer.ZERO, entity.amount)

	tests.logs.global.success("PeriodsList.pending.releasePeriods.test", id)
}