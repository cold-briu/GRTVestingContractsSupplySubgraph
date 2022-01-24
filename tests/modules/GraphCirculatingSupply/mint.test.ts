import { BigInt } from "@graphprotocol/graph-ts"
import { GraphCirculatingSupply } from "../../../generated/schema"
import { circulatingSupply, tests } from "../../../src/modules"

export function mint(mintedAmount: BigInt): void {

	let id = circulatingSupply.constants.CIRCULATING_SUPPLY_ID
	let storedEntity = GraphCirculatingSupply.load(id)
	if (storedEntity == null) {
		tests.logs.global.error(
			"GraphCirculatingSupply.createPeriods.test",
			"failed to load entity w/ id=" + id
		)
		return
	}

	tests.logs.global.started(
		"GraphCirculatingSupply.createPeriods.test", id
	)

	tests.helpers.asserts.assertBigInt(mintedAmount, storedEntity.totalSupply)
	tests.helpers.asserts.assertBigInt(mintedAmount, storedEntity.minted)

	tests.logs.global.success("GraphCirculatingSupply.creation.test", id)
}