import { BigInt } from "@graphprotocol/graph-ts"
import { GraphCirculatingSupply } from "../../../generated/schema"
import { circulatingSupply, tests } from "../../../src/modules"

export function burn(populationAmount: BigInt, burnedAmount: BigInt): void {

	let id = circulatingSupply.constants.CIRCULATING_SUPPLY_ID
	let storedEntity = GraphCirculatingSupply.load(id)
	if (storedEntity == null) {
		tests.logs.global.error(
			"GraphToken.burn.test",
			"failed to load entity w/ id=" + id
		)
		return
	}

	tests.logs.global.started(
		"GraphToken.burn.test", id
	)

	let processedAmount = populationAmount.minus(burnedAmount)
	tests.helpers.asserts.assertBigInt(
		processedAmount, storedEntity.totalSupply
	)

	tests.helpers.asserts.assertBigInt(
		processedAmount, storedEntity.circulatingSupply
	)
	tests.helpers.asserts.assertBigInt(burnedAmount, storedEntity.burned)

	tests.logs.global.success("GraphToken.burn.test", id)
}