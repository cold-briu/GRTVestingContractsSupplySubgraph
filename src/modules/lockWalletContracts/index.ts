import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { integer } from "@protofire/subgraph-toolkit";
import { GraphTokenLockWallet } from "../../../generated/GTLSEAN/GraphTokenLockWallet";
import { LockWalletContract } from "../../../generated/schema";

export namespace lockWalletContracts {

	export namespace constants {
		export let FACTORY_CONTRACT_TYPENAME = "FACTORY"
		export let CUSTOM_CONTRACT_TYPENAME = "CUSTOM"
	}

	export function getOrCreateLockWalletContract(
		address: Bytes, periods: BigInt, managedAmount: BigInt,
		startTime: BigInt, endTime: BigInt, type: string
	): LockWalletContract {
		let id = address.toHexString()
		let entity = LockWalletContract.load(id)
		if (entity == null) {
			entity = new LockWalletContract(id)
			entity.address = address
			entity.passedPeriods = integer.ZERO
			entity.periodsAmount = periods
			entity.startTime = startTime
			entity.endTime = endTime
			entity.managedAmount = managedAmount
			entity.releasedAmount = integer.ZERO
			entity.pendingAmount = integer.ZERO
			entity.totalLocked = integer.ZERO
			entity.availableAmount = integer.ZERO
			entity.type = type
		}
		return entity as LockWalletContract
	}

	export function createFactoryLockWallet(
		address: Bytes, periods: BigInt, managedAmount: BigInt,
		startTime: BigInt, endTime: BigInt
	): LockWalletContract {

		let entity = getOrCreateLockWalletContract(
			address,
			periods,
			managedAmount,
			startTime,
			endTime,
			constants.FACTORY_CONTRACT_TYPENAME
		)

		return entity as LockWalletContract
	}

	export function createCustomLockWallet(
		address: Bytes, periods: BigInt, managedAmount: BigInt,
		startTime: BigInt, endTime: BigInt
	): LockWalletContract {

		let entity = getOrCreateLockWalletContract(
			address,
			periods,
			managedAmount,
			startTime,
			endTime,
			constants.CUSTOM_CONTRACT_TYPENAME
		)

		return entity as LockWalletContract
	}

	export namespace mutators {
		export function increaseReleaseAmount(wallet: LockWalletContract, amount: BigInt): LockWalletContract {
			let w = wallet
			w.releasedAmount = w.releasedAmount.plus(amount)
			return w
		}

		export function increasePassedPeriods(wallet: LockWalletContract): LockWalletContract {
			let w = wallet
			w.passedPeriods = w.passedPeriods.plus(integer.ONE)
			return w
		}

		export function updateavAilableAmount(wallet: LockWalletContract): LockWalletContract {
			let w = wallet
			w.availableAmount = w.periodsAmount.times(w.passedPeriods)
			return w
		}

		export function updateavTotalLocked(wallet: LockWalletContract): LockWalletContract {
			let w = wallet
			w.totalLocked = w.managedAmount.minus(w.availableAmount)
			return w
		}
	}

	export namespace contract {

		export function getInitializedLockWalletContract(address: Address): GraphTokenLockWallet | null {
			let contract = GraphTokenLockWallet.bind(address)
			let result = contract.try_isInitialized()
			if (!result.reverted && result.value) {
				return contract
			}
			return null
		}

		export function getValuesFromContract(contract: GraphTokenLockWallet): BigInt[] | null {
			let periods_result = contract.try_periods()
			let managedAmount_result = contract.try_managedAmount()
			let start_result = contract.try_startTime()
			let end_result = contract.try_endTime()

			if (
				periods_result.reverted ||
				managedAmount_result.reverted ||
				start_result.reverted ||
				end_result.reverted
			) {
				return null
			}
			return [
				periods_result.value,
				managedAmount_result.value,
				start_result.value,
				end_result.value
			]
		}
	}

}
