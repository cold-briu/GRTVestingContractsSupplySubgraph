import { assert, log } from "matchstick-as"
import { integer } from "@protofire/subgraph-toolkit";
import { BigInt, TypedMap } from "@graphprotocol/graph-ts";
import { releasePeriods, tests, circulatingSupply } from "../../src/modules";

export function circulatingSupplyPeriodsCreation(
	contractId: string, periods: i32, managedAmount: BigInt
): void {

	let periodsToProcess = releasePeriods.createPeriodsIdList(contractId, periods)

	let params = new TypedMap<string, string>()
	params.set("circulatingSupply", integer.ZERO.minus(managedAmount).toString())
	params.set("periodsToProcessTotalAmount", integer.ZERO.plus(managedAmount).toString())
	params.set("periodsToProcess", periodsToProcess.toString())

	log.warning("!!! cannot test circulatingSupplyPeriodsCreation", [])
	// tests.helpers.runtime.assertMany(
	// 	"GraphCirculatingSupply", circulatingSupply.constants.CIRCULATING_SUPPLY_ID, params
	// )

}