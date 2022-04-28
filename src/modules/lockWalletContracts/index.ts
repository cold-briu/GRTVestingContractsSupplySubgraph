import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";
import { integer } from "@protofire/subgraph-toolkit";
import { GraphTokenLockWallet } from "../../../generated/GTLSEAN/GraphTokenLockWallet";
import { LockWalletContract } from "../../../generated/schema";

export namespace lockWalletContracts {

	export namespace constants {
		export let FACTORY_CONTRACT_TYPENAME = "FACTORY"
		export let CUSTOM_CONTRACT_TYPENAME = "CUSTOM"
    export let EXCHANGE_CONTRACT_TYPENAME = "EXCHANGE"
	}

	export function safeLoadLockWalletContract(id: string): LockWalletContract {
		let contract = LockWalletContract.load(id)
		if (!contract) {
			log.warning("!couldn't find entity lock wallet with id", [id])
			contract = new LockWalletContract(id)
		}
		return contract
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
			entity.amountPerPeriod = managedAmount.div(periods)
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

	export function createLockWallet(
		address: Bytes, 
    periods: BigInt, 
    managedAmount: BigInt,
		startTime: BigInt, 
    endTime: BigInt,
    walletType: string
	): LockWalletContract {

		let entity = getOrCreateLockWalletContract(
			address,
			periods,
			managedAmount,
			startTime,
			endTime,
			walletType,
		)

		return entity as LockWalletContract
	}

	export namespace mutators {
		export function increaseReleaseAmount(wallet: LockWalletContract, amount: BigInt): LockWalletContract {
			let w = wallet
			w.releasedAmount = w.releasedAmount!.plus(amount)
			return w
		}

		export function increasePassedPeriods(wallet: LockWalletContract): LockWalletContract {
			let w = wallet
			w.passedPeriods = w.passedPeriods!.plus(integer.ONE)
			return w
		}

		export function updateavAilableAmount(wallet: LockWalletContract): LockWalletContract {
			let w = wallet
			w.availableAmount = w.amountPerPeriod!.times(w.passedPeriods!)
			return w
			// function availableAmount() public override view returns (uint256) {
			// 	uint256 current = currentTime();

			// 	// Before contract start no funds are available
			// 	if (current < startTime) {
			// 		return 0;
			// 	}

			// 	// After contract ended all funds are available
			// 	if (current > endTime) {
			// 		return managedAmount;
			// 	}

			// 	// Get available amount based on period
			// 	return passedPeriods().mul(amountPerPeriod());
			// }

		}

		export function updateavTotalLocked(wallet: LockWalletContract): LockWalletContract {
			let w = wallet
			w.totalLocked = w.managedAmount!.minus(w.availableAmount!)
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

		export class GraphTokenLockWalletCallValues {
			periods: BigInt
			managedAmount: BigInt
			startTime: BigInt
			endTime: BigInt

			constructor(
				_periods: BigInt,
				_managedAmount: BigInt,
				_startTime: BigInt,
				_endTime: BigInt
			) {
				this.periods = _periods
				this.managedAmount = _managedAmount
				this.startTime = _startTime
				this.endTime = _endTime
			}
		}

		export function getValuesFromContract(contract: GraphTokenLockWallet): GraphTokenLockWalletCallValues | null {
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
			return new GraphTokenLockWalletCallValues(
				periods_result.value,
				managedAmount_result.value,
				start_result.value,
				end_result.value)
		}
	}

}
