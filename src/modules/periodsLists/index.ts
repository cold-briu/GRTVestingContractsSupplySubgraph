import { BigInt } from "@graphprotocol/graph-ts";
import { integer } from "@protofire/subgraph-toolkit";
import { PendingPeriods, ProcessedPeriods } from "../../../generated/schema";

export namespace periodsLists {

	export namespace constants {
		export let PENDING_LISTS_ID = "0x0"
		export let PROCESSED_LISTS_ID = "0x1"
	}

	export namespace pending {

		export function getOrCreateList(): PendingPeriods {
			let entity = PendingPeriods.load(constants.PENDING_LISTS_ID)
			if (entity == null) {
				entity = new PendingPeriods(constants.PENDING_LISTS_ID)
				entity.amount = integer.ZERO
			}
			return entity as PendingPeriods
		}

		export namespace mutations {
			export function increaseAmount(
				_list: PendingPeriods, amount: BigInt
			): PendingPeriods {
				let list = _list
				let totalAmount = list.amount
				totalAmount = totalAmount.plus(amount)
				list.amount = totalAmount
				return list
			}
		}
	}

	export namespace processed {

		export function getOrCreateList(): ProcessedPeriods {
			let entity = ProcessedPeriods.load(constants.PROCESSED_LISTS_ID)
			if (entity == null) {
				entity = new PendingPeriods(constants.PROCESSED_LISTS_ID)
				entity.amount = integer.ZERO
			}
			return entity as ProcessedPeriods
		}

		export namespace mutations {
			export function increaseAmount(
				_list: PendingPeriods, amount: BigInt
			): PendingPeriods {
				let list = _list
				let totalAmount = list.amount
				totalAmount = totalAmount.plus(amount)
				list.amount = totalAmount
				return list
			}
			export function decreaseAmount(
				_list: PendingPeriods, amount: BigInt
			): PendingPeriods {
				let list = _list
				let totalAmount = list.amount
				totalAmount = totalAmount.minus(amount)
				list.amount = totalAmount
				return list
			}
		}
	}

}