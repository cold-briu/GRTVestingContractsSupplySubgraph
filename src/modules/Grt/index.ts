import { integer } from "@protofire/subgraph-toolkit";
import { BigInt, log } from "@graphprotocol/graph-ts"
import { Grt } from "../../../generated/schema"
import { periodsLists } from "..";

export namespace grt {

	export namespace constants {
		export let CIRCULATING_SUPPLY_ID = '1'
	}

	export function createGrt(): Grt {
		let entity = new Grt(constants.CIRCULATING_SUPPLY_ID)
		entity.burned = integer.ZERO
		entity.minted = integer.ZERO
		entity.totalSupply = integer.ZERO
		entity.circulatingSupply = integer.ZERO
		entity.liquidSupply = integer.ZERO
		entity.totalAvailableAmount = integer.ZERO
		entity.totalLockedAmount = integer.ZERO
		entity.periodsToProcess = periodsLists.constants.PENDING_LISTS_ID
		entity.periodsProcessed = periodsLists.constants.PROCESSED_LISTS_ID
		return entity
	}

	export function createOrLoadGrt(): Grt {
		let entity = Grt.load(constants.CIRCULATING_SUPPLY_ID)
		if (entity == null) {
			entity = createGrt()
		}
		return entity as Grt

	}

	export function mintTokens(
		e: Grt, value: BigInt
	): Grt {
		let Grt = e

		Grt = grt.mutations.increaseTotalSupply(
			Grt, value
		)

		Grt = grt.mutations.increaseCirculatingSupply(
			Grt, value
		)

		Grt = grt.mutations.increaseLiquidSupply(
			Grt, value
		)

		Grt = grt.mutations.increaseMinted(
			Grt, value
		)

		return Grt
	}


	export function burnTokens(
		e: Grt, value: BigInt
	): Grt {
		let Grt = e

		Grt = grt.mutations.decreaseTotalSupply(
			Grt, value
		)

		Grt = grt.mutations.decreaseCirculatingSupply(
			Grt, value
		)

		Grt = grt.mutations.decreaseLiquidSupply(
			Grt, value
		)

		Grt = grt.mutations.increaseBurned(
			Grt, value
		)

		return Grt
	}

	export namespace mutations {

		export function increaseBurned(
			grt: Grt, amount: BigInt
		): Grt {
			let e = grt
			let supply = e.burned as BigInt
			supply = supply.plus(amount)
			e.burned = supply
			return e
		}

		export function increaseMinted(
			grt: Grt, amount: BigInt
		): Grt {
			let e = grt
			let supply = e.minted as BigInt
			supply = supply.plus(amount)
			e.minted = supply
			return e
		}


		export function decreaseTotalSupply(
			grt: Grt, amount: BigInt
		): Grt {
			let e = grt
			let supply = e.totalSupply as BigInt
			supply = supply.minus(amount)
			e.totalSupply = supply
			return e
		}

		export function increaseTotalSupply(
			grt: Grt, amount: BigInt
		): Grt {
			let e = grt
			let supply = e.totalSupply as BigInt
			supply = supply.plus(amount)
			e.totalSupply = supply
			return e
		}

		export function decreaseCirculatingSupply(
			grt: Grt, amount: BigInt
		): Grt {
			let e = grt
			let supply = e.circulatingSupply as BigInt
			supply = supply.minus(amount)
			e.circulatingSupply = supply
			return e
		}

		export function increaseCirculatingSupply(
			grt: Grt, amount: BigInt
		): Grt {
			let e = grt
			let supply = e.circulatingSupply as BigInt
			supply = supply.plus(amount)
			e.circulatingSupply = supply
			return e
		}

		export function decreaseLiquidSupply(
			grt: Grt, amount: BigInt
		): Grt {
			let e = grt
			let supply = e.liquidSupply as BigInt
			supply = supply.minus(amount)
			e.liquidSupply = supply
			return e
		}

		export function increaseLiquidSupply(
			grt: Grt, amount: BigInt
		): Grt {
			let e = grt
			let supply = e.liquidSupply as BigInt
			supply = supply.plus(amount)
			e.liquidSupply = supply
			return e
		}

		export function increaseLockedSupplyGenesis(
			grt: Grt, amount: BigInt
		): Grt {
			let e = grt
			let supply = e.lockedSupplyGenesis as BigInt
			supply = supply.plus(amount)
			e.lockedSupplyGenesis = supply
			return e
		}

		export function increaseTransferredSupplyGenesis(
			grt: Grt, amount: BigInt
		): Grt {
			let e = grt
			let supply = e.transferredSupplyGenesis as BigInt
			supply = supply.plus(amount)
			e.transferredSupplyGenesis = supply
			return e
		}

	}



	export namespace test {

		export function safeLoad(): Grt {
			let entity = Grt.load(grt.constants.CIRCULATING_SUPPLY_ID)
			if (entity == null) {
				log.warning("Grt@SafeLoad :: failed to load w/ id ={}", [grt.constants.CIRCULATING_SUPPLY_ID])
				return new Grt(grt.constants.CIRCULATING_SUPPLY_ID)
			}
			return entity as Grt
		}

	}

}