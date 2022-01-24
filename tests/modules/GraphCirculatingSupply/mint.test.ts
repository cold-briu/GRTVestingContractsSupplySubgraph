import { BigInt } from "@graphprotocol/graph-ts"
import { GraphCirculatingSupply } from "../../../generated/schema"
import { circulatingSupply, tests } from "../../../src/modules"

export function mint(mintedAmount: BigInt): void {

	let id = circulatingSupply.constants.CIRCULATING_SUPPLY_ID
	let storedEntity = GraphCirculatingSupply.load(id)
	if (storedEntity == null) {
		tests.logs.global.error(
			"GraphToken.mint.test",
			"failed to load entity w/ id=" + id
		)
		return
	}

	tests.logs.global.started(
		"GraphToken.mint.test", id
	)

	tests.helpers.asserts.assertBigInt(mintedAmount, storedEntity.circulatingSupply)
	tests.helpers.asserts.assertBigInt(mintedAmount, storedEntity.totalSupply)
	tests.helpers.asserts.assertBigInt(mintedAmount, storedEntity.minted)

	tests.logs.global.success("GraphToken.mint.test", id)
}