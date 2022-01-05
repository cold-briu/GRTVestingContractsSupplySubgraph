import { integer } from "@protofire/subgraph-toolkit";
import { BigInt } from "@graphprotocol/graph-ts"
import { GraphCirculatingSupply } from "../../../generated/schema"

export namespace circulatingSupply {

	export function createOrLoadGraphCirculatingSupply(): GraphCirculatingSupply {
		let graphCirculatingSupply = GraphCirculatingSupply.load('1')
		if (graphCirculatingSupply == null) {
			graphCirculatingSupply = new GraphCirculatingSupply('1')
			graphCirculatingSupply.totalSupply = integer.ZERO
			graphCirculatingSupply.circulatingSupply = integer.ZERO
			graphCirculatingSupply.periodsToProcess = []
			graphCirculatingSupply.periodsToProcessTotalAmount = integer.ZERO
			graphCirculatingSupply.periodsProcessed = []
			graphCirculatingSupply.periodsProcessedTotalAmount = integer.ZERO
			graphCirculatingSupply.minPeriodToProcessDate = integer.ZERO
		}
		return graphCirculatingSupply as GraphCirculatingSupply
	}
}