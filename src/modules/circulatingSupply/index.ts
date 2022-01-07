import { integer } from "@protofire/subgraph-toolkit";
import { BigInt, log } from "@graphprotocol/graph-ts"
import { GraphCirculatingSupply } from "../../../generated/schema"
import { periodsLists } from "..";

export namespace circulatingSupply {

	export namespace constants {
		export let CIRCULATING_SUPPLY_ID = '1'
	}

	export function createOrLoadGraphCirculatingSupply(): GraphCirculatingSupply {
		let graphCirculatingSupply = GraphCirculatingSupply.load(constants.CIRCULATING_SUPPLY_ID)
		if (graphCirculatingSupply == null) {
			graphCirculatingSupply = new GraphCirculatingSupply(constants.CIRCULATING_SUPPLY_ID)
			graphCirculatingSupply.totalSupply = integer.ZERO
			graphCirculatingSupply.circulatingSupply = integer.ZERO
			graphCirculatingSupply.minPeriodToProcessDate = integer.ZERO
			graphCirculatingSupply.periodsToProcess = periodsLists.constants.PENDING_LISTS_ID
			graphCirculatingSupply.periodsProcessed = periodsLists.constants.PROCESSED_LISTS_ID
		}
		return graphCirculatingSupply as GraphCirculatingSupply
	}

	export namespace mutations {

		export function decreaseCirculatingSupply(cs: GraphCirculatingSupply, amount: BigInt): BigInt {
			let supply = cs.circulatingSupply as BigInt
			supply = supply.minus(amount)
			return supply
		}

		export function increaseCirculatingSupply(cs: GraphCirculatingSupply, amount: BigInt): BigInt {
			let supply = cs.circulatingSupply as BigInt
			supply = supply.plus(amount)
			return supply
		}

	}

	export namespace test {

		export function safeLoad(): GraphCirculatingSupply {
			let entity = GraphCirculatingSupply.load(circulatingSupply.constants.CIRCULATING_SUPPLY_ID)
			if (entity == null) {
				log.warning("GraphCirculatingSupply@SafeLoad :: failed to load w/ id ={}", [circulatingSupply.constants.CIRCULATING_SUPPLY_ID])
				return new GraphCirculatingSupply(circulatingSupply.constants.CIRCULATING_SUPPLY_ID)
			}
			return entity as GraphCirculatingSupply
		}

		export function safeLoadPendingPeriods(entity: GraphCirculatingSupply): Array<string> {
			return (entity.periodsToProcess || []) as Array<string>
		}

		export function safeLoadProcessedPeriods(entity: GraphCirculatingSupply): Array<string> {
			return (entity.periodsProcessed || []) as Array<string>

		}
	}

}