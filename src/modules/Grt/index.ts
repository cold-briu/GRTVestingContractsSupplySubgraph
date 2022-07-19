import { integer } from "@protofire/subgraph-toolkit";
import { BigInt, log } from "@graphprotocol/graph-ts"
import { Grt } from "../../../generated/schema"
import { periodsLists } from "..";

export namespace grt {

	export namespace constants {
		export let CIRCULATING_SUPPLY_ID = '1'
	}

	export function createGrt(): Grt {
		let grt = new Grt(constants.CIRCULATING_SUPPLY_ID)
		grt.periodsToProcess = periodsLists.constants.PENDING_LISTS_ID
		grt.periodsProcessed = periodsLists.constants.PROCESSED_LISTS_ID
		return grt
	}

	export function createOrLoadGrt(): Grt {
		let grt = Grt.load(constants.CIRCULATING_SUPPLY_ID)
		if (grt == null) {
			grt = createGrt()
		}
		return grt as Grt

	}

	export function mintTokens(
		e: Grt, value: BigInt
	): Grt {
		let grt = e

		grt = mutations.increaseTotalSupply(
			grt, value
		)

		grt = mutations.increaseCirculatingSupply(
			grt, value
		)

		grt = mutations.increaseLiquidSupply(
			grt, value
		)

		grt = mutations.increaseMinted(
			grt, value
		)

		return grt
	}


	export function burnTokens(
		e: Grt, value: BigInt
	): Grt {
		let grt = e

		grt = mutations.decreaseTotalSupply(
			grt, value
		)

		grt = mutations.decreaseCirculatingSupply(
			grt, value
		)

		grt = mutations.decreaseLiquidSupply(
			grt, value
		)

		grt = mutations.increaseBurned(
			grt, value
		)

		return grt
	}

	export function lockGenesisExchanges(e: Grt, value: BigInt
	): Grt {
		let grt = e

		grt = mutations.increaseLockedSupply(grt, value)
		grt = mutations.increaseLockedSupplyGenesis(grt, value)
		grt = mutations.decreaseTotalSupply(grt, value)

		return grt
	}

	export function lockGenesisTransfer(e: Grt, value: BigInt
	): Grt {
		let grt = e
		grt = mutations.increaseTransferredSupplyGenesis(grt, value)
		grt = mutations.increaseLockedSupply(grt, value)
		grt = mutations.increaseLockedSupplyGenesis(grt, value)
		grt = mutations.decreaseCirculatingSupply(grt, value)

		return grt
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
			let grt = Grt.load(constants.CIRCULATING_SUPPLY_ID)
			if (grt == null) {
				log.warning("Grt@SafeLoad :: failed to load w/ id ={}", [constants.CIRCULATING_SUPPLY_ID])
				return new Grt(constants.CIRCULATING_SUPPLY_ID)
			}
			return grt as Grt
		}

	}

}