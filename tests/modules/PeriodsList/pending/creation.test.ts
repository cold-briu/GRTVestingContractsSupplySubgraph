import { integer } from "@protofire/subgraph-toolkit"
import { PendingPeriods } from "../../../../generated/schema"
import { periodsLists, tests } from "../../../../src/modules"

export function creation(): void {

	let id = periodsLists.constants.PENDING_LISTS_ID
	let entity = periodsLists.pending.getOrCreateList()

	tests.logs.global.started(
		"PeriodsList.creation.test", id
	)

	tests.helpers.asserts.assertBigInt(integer.ZERO, entity.amount)
	tests.helpers.asserts.assertStringArray([], entity.keys)

	tests.logs.global.success("PeriodsList.creation.test", id)
}