import { TypedMap } from "@graphprotocol/graph-ts"
import { tests } from "../../src/modules"


export function contractDataCreation(
	entityId: string, periods: string, managedAmount: string,
	startTime: string, endTime: string
): void {
	let params = new TypedMap<string, string>()

	params.set("periods", periods)
	params.set("startTime", startTime)
	params.set("endTime", endTime)
	params.set("managedAmount", managedAmount)

	tests.helpers.asserts.assertMany(
		"ContractData", entityId, params
	)
}