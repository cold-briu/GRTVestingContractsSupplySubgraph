import { integer } from "@protofire/subgraph-toolkit";
import { BigInt, log } from "@graphprotocol/graph-ts"
import { GraphCirculatingSupply } from "../../../generated/schema"
import { periodsLists } from "..";

export namespace circulatingSupply {

	export namespace constants {
		export let CIRCULATING_SUPPLY_ID = '1'
	}

	export function createCirculatingSupply(): GraphCirculatingSupply {
		let graphCirculatingSupply = new GraphCirculatingSupply(constants.CIRCULATING_SUPPLY_ID)
		graphCirculatingSupply.burned = integer.ZERO
		graphCirculatingSupply.minted = integer.ZERO
		graphCirculatingSupply.totalSupply = integer.ZERO
		graphCirculatingSupply.circulatingSupply = integer.ZERO
		graphCirculatingSupply.minPeriodToProcessDate = integer.ZERO
		graphCirculatingSupply.periodsToProcess = periodsLists.constants.PENDING_LISTS_ID
		graphCirculatingSupply.periodsProcessed = periodsLists.constants.PROCESSED_LISTS_ID
		return graphCirculatingSupply
	}

	export function createOrLoadGraphCirculatingSupply(): GraphCirculatingSupply {
		let graphCirculatingSupply = GraphCirculatingSupply.load(constants.CIRCULATING_SUPPLY_ID)
		if (graphCirculatingSupply == null) {
			graphCirculatingSupply = createCirculatingSupply()
		}
		return graphCirculatingSupply as GraphCirculatingSupply

	}

	export function mintTokens(
		cs: GraphCirculatingSupply, value: BigInt
	): GraphCirculatingSupply {
		let graphCirculatingSupply = cs

		graphCirculatingSupply = circulatingSupply.mutations.increaseTotalSupply(
			graphCirculatingSupply, value
		)

		graphCirculatingSupply = circulatingSupply.mutations.increaseCirculatingSupply(
			graphCirculatingSupply, value
		)

		graphCirculatingSupply = circulatingSupply.mutations.increaseMinted(
			graphCirculatingSupply, value
		)

		return graphCirculatingSupply
	}


	export function burnTokens(
		cs: GraphCirculatingSupply, value: BigInt
	): GraphCirculatingSupply {
		let graphCirculatingSupply = cs

		graphCirculatingSupply = circulatingSupply.mutations.decreaseTotalSupply(
			graphCirculatingSupply, value
		)

		graphCirculatingSupply = circulatingSupply.mutations.decreaseCirculatingSupply(
			graphCirculatingSupply, value
		)

		graphCirculatingSupply = circulatingSupply.mutations.increaseBurned(
			graphCirculatingSupply, value
		)

		return graphCirculatingSupply
	}

	export namespace mutations {

		export function increaseBurned(
			circulatingSupply: GraphCirculatingSupply, amount: BigInt
		): GraphCirculatingSupply {
			let cs = circulatingSupply
			let supply = cs.burned as BigInt
			supply = supply.plus(amount)
			cs.burned = supply
			return cs
		}

		export function increaseMinted(
			circulatingSupply: GraphCirculatingSupply, amount: BigInt
		): GraphCirculatingSupply {
			let cs = circulatingSupply
			let supply = cs.minted as BigInt
			supply = supply.plus(amount)
			cs.minted = supply
			return cs
		}


		export function decreaseTotalSupply(
			circulatingSupply: GraphCirculatingSupply, amount: BigInt
		): GraphCirculatingSupply {
			let cs = circulatingSupply
			let supply = cs.totalSupply as BigInt
			supply = supply.minus(amount)
			cs.totalSupply = supply
			return cs
		}

		export function increaseTotalSupply(
			circulatingSupply: GraphCirculatingSupply, amount: BigInt
		): GraphCirculatingSupply {
			let cs = circulatingSupply
			let supply = cs.totalSupply as BigInt
			supply = supply.plus(amount)
			cs.totalSupply = supply
			return cs
		}

		export function decreaseCirculatingSupply(
			circulatingSupply: GraphCirculatingSupply, amount: BigInt
		): GraphCirculatingSupply {
			let cs = circulatingSupply
			let supply = cs.circulatingSupply as BigInt
			supply = supply.minus(amount)
			cs.circulatingSupply = supply
			return cs
		}

		export function increaseCirculatingSupply(
			circulatingSupply: GraphCirculatingSupply, amount: BigInt
		): GraphCirculatingSupply {
			let cs = circulatingSupply
			let supply = cs.circulatingSupply as BigInt
			supply = supply.plus(amount)
			cs.circulatingSupply = supply
			return cs
		}

		export function updateMinProcessToDate(
			circulatingSupply: GraphCirculatingSupply, releaseDate: BigInt
		): GraphCirculatingSupply {
			let cs = circulatingSupply
			let minDate = cs.minPeriodToProcessDate
			minDate = helpers.setNewMinProcessDate(
				cs.minPeriodToProcessDate, releaseDate
			)
			cs.minPeriodToProcessDate = minDate
			return cs
		}

	}

	export namespace helpers {

		export function setNewMinProcessDate(
			minProcessDate: BigInt, releaseDate: BigInt
		): BigInt {
			if (minProcessDate.isZero() ||
				releaseDate.lt(minProcessDate)) {
				return releaseDate
			}
			return minProcessDate
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

	}

}