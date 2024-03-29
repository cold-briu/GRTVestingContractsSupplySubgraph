import { integer } from "@protofire/subgraph-toolkit"
import { circulatingSupply, periodsLists, tests } from "../../../src/modules"

export function creation(): void {

	let entity = circulatingSupply.createCirculatingSupply()

	tests.logs.global.started(
		"GraphCirculatingSupply.creation.test", entity.id
	)

	tests.helpers.asserts.assertBigInt(integer.ZERO, entity.totalSupply)
	tests.helpers.asserts.assertBigInt(integer.ZERO, entity.circulatingSupply)
	tests.helpers.asserts.assertBigInt(integer.ZERO, entity.minPeriodToProcessDate)
	tests.helpers.asserts.assertString(periodsLists.constants.PENDING_LISTS_ID, entity.periodsToProcess)
	tests.helpers.asserts.assertString(periodsLists.constants.PROCESSED_LISTS_ID, entity.periodsProcessed)


	tests.logs.global.success("GraphCirculatingSupply.creation.test", entity.id)
}