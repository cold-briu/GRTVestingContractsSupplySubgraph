import { integer } from "@protofire/subgraph-toolkit"
import { periodsLists, tests } from "../../../../src/modules"

export function creation(): void {

	let id = periodsLists.constants.PENDING_LISTS_ID
	let entity = periodsLists.pending.createList()

	tests.logs.global.started(
		"PeriodsList.pending.creation.test", id
	)

	tests.helpers.asserts.assertBigInt(integer.ZERO, entity.amount)
	tests.helpers.asserts.assertStringArray([], entity.keys)

	tests.logs.global.success("PeriodsList.pending.creation.test", id)
}