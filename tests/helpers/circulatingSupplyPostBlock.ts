import { integer } from "@protofire/subgraph-toolkit";
import { BigInt, ethereum, TypedMap } from "@graphprotocol/graph-ts";
import { circulatingSupply, releasePeriods, tests } from "../../src/modules";
import { assert } from "matchstick-as";

export function circulatingSupplyPreBlock(
	contractId: string, periods: i32, managedAmount: BigInt
): void {

	let periodsToProcess = releasePeriods.createPeriodsIdList(contractId, periods)
	let processed = periodsToProcess.shift()
	let processedAmount = managedAmount.div(BigInt.fromI32(periods))

	let params = new TypedMap<string, string>()

	params.set("periodsProcessedTotalAmount", processedAmount.toString())
	params.set("periodsToProcessTotalAmount", managedAmount.minus(processedAmount).toString())

	tests.helpers.runtime.assertMany(
		"GraphCirculatingSupply", circulatingSupply.constants.CIRCULATING_SUPPLY_ID, params
	)

	let cs = circulatingSupply.test.safeLoad()
	let pendingPeriods = circulatingSupply.test.safeLoadPendingPeriods(cs)
	assert.equals(ethereum.Value.fromStringArray(periodsToProcess), ethereum.Value.fromStringArray(pendingPeriods))

	let processedPeriods = circulatingSupply.test.safeLoadProcessedPeriods(cs)
	assert.equals(ethereum.Value.fromStringArray([processed]), ethereum.Value.fromStringArray(processedPeriods))



}