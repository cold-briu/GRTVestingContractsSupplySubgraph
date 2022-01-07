import { assert } from "matchstick-as"
import { integer } from "@protofire/subgraph-toolkit";
import { BigInt, ethereum, TypedMap } from "@graphprotocol/graph-ts";
import { releasePeriods, tests, circulatingSupply } from "../../src/modules";

export function circulatingSupplyPeriodsCreation(
	contractId: string, periods: i32, managedAmount: BigInt
): void {

	// let periodsToProcess = releasePeriods.createPeriodsIdList(contractId, periods)

	// let params = new TypedMap<string, string>()
	// params.set("circulatingSupply", integer.ZERO.minus(managedAmount).toString())
	// params.set("periodsToProcessTotalAmount", integer.ZERO.plus(managedAmount).toString())

	// tests.helpers.asserts.assertMany(
	// 	"GraphCirculatingSupply", circulatingSupply.constants.CIRCULATING_SUPPLY_ID, params
	// )

	// let cs = circulatingSupply.test.safeLoad()
	// let pendingPeriods = circulatingSupply.test.safeLoadPendingPeriods(cs)
	// assert.equals(ethereum.Value.fromStringArray(periodsToProcess), ethereum.Value.fromStringArray(pendingPeriods))

}