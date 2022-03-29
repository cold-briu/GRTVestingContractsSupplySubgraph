import { BigInt } from "@graphprotocol/graph-ts"
import { circulatingSupply, tests } from "../../../src/modules"

export function releasePeriods(
	managedAmount: BigInt
): void {

	let entity = circulatingSupply.createOrLoadGraphCirculatingSupply()

	tests.logs.global.started(
		"GraphCirculatingSupply.releasePeriods.test", entity.id
	)

	tests.helpers.asserts.assertBigInt(managedAmount, entity.circulatingSupply)

	tests.logs.global.success("GraphCirculatingSupply.releasePeriods.test", entity.id)
}