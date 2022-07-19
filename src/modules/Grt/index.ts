import { integer } from "@protofire/subgraph-toolkit";
import { BigInt, log } from "@graphprotocol/graph-ts"
import { Grt } from "../../../generated/schema"
import { periodsLists } from "..";

export namespace grt {

	export namespace constants {
		export let CIRCULATING_SUPPLY_ID = '1'
	}

	export function createGrt(): Grt {
		let Grt = new Grt(constants.CIRCULATING_SUPPLY_ID)
		Grt.periodsToProcess = periodsLists.constants.PENDING_LISTS_ID
		Grt.periodsProcessed = periodsLists.constants.PROCESSED_LISTS_ID
		return Grt
	}

	export function createOrLoadGrt(): Grt {
		let Grt = Grt.load(constants.CIRCULATING_SUPPLY_ID)
		if (Grt == null) {
			Grt = createGrt()
		}
		return Grt as Grt

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

	export function lockGenesisExchanges(e: Grt, value: BigInt
	): Grt {
		let Grt = e

		Grt = grt.mutations.increaseLockedSupply(Grt, value)
		Grt = grt.mutations.increaseLockedSupplyGenesis(Grt, value)
		Grt = grt.mutations.decreaseTotalSupply(Grt, value)

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

		export function increaseLockedSupply(
			grt: Grt, amount: BigInt
		): Grt {
			let e = grt
			let supply = e.lockedSupply as BigInt
			supply = supply.plus(amount)
			e.lockedSupply = supply
			return e
		}

	}



	export namespace test {

		export function safeLoad(): Grt {
			let Grt = Grt.load(grt.constants.CIRCULATING_SUPPLY_ID)
			if (Grt == null) {
				log.warning("Grt@SafeLoad :: failed to load w/ id ={}", [grt.constants.CIRCULATING_SUPPLY_ID])
				return new Grt(grt.constants.CIRCULATING_SUPPLY_ID)
			}
			return Grt as Grt
		}

	}

}