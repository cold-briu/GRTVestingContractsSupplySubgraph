import { TypedMap } from "@graphprotocol/graph-ts"
import { tests } from "../../src/modules"

export namespace helpers {
	export function contractDataCreation(
		entityId: string, periods: string, managedAmount: string,
		startTime: string, endTime: string
	): void {
		let params = new TypedMap<string, string>()

		params.set("periods", periods)
		params.set("startTime", startTime)
		params.set("endTime", endTime)
		params.set("managedAmount", managedAmount)

		tests.helpers.runtime.assertMany(
			"ContractData", entityId, params
		)
	}
}