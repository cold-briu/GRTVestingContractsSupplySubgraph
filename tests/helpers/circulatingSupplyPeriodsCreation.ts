import { integer } from "@protofire/subgraph-toolkit";
import { BigInt, TypedMap } from "@graphprotocol/graph-ts";
import { releasePeriods, tests } from "../../src/modules";

export function circulatingSupplyPeriodsCreation(
	contractId: string, periods: i32, managedAmount: BigInt
): void {

	let periodsToProcess: string[] = []
	for (let index = 0; index < periods; index++) {
		let periodId = releasePeriods.getPeriodId(contractId, index.toString())
		periodsToProcess.push(periodId)
	}

	let params = new TypedMap<string, string>()

	params.set("circulatingSupply", integer.ZERO.minus(managedAmount).toString())
	params.set("periodsToProcessTotalAmount", integer.ZERO.plus(managedAmount).toString())

	// how to test periodsToProcess arr?

	tests.helpers.runtime.assertMany(
		"GraphCirculatingSupply", "1", params
	)

}