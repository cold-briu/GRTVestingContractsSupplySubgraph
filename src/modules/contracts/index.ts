import { BigInt, TypedMap } from "@graphprotocol/graph-ts";
import { ContractData } from "../../../generated/schema";

export namespace contracts {

	export function createContractData(
		id: string, periods: BigInt, managedAmount: BigInt,
		startTime: BigInt, endTime: BigInt
	): ContractData {
		let contract = new ContractData(id)
		contract.contract = id
		contract.periods = periods
		contract.startTime = startTime
		contract.endTime = endTime
		contract.managedAmount = managedAmount
		return contract as ContractData
	}
}
