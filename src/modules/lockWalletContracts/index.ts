import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { integer } from "@protofire/subgraph-toolkit";
import { GraphTokenLockWallet } from "../../../generated/GTLSEAN/GraphTokenLockWallet";
import { FactoryTokenLockWallet, CustomTokenLockWallet } from "../../../generated/schema";

export namespace lockWalletContracts {

	export namespace factory {

		export function createFactoryLockWallet(
			address: Bytes, periods: BigInt, managedAmount: BigInt,
			startTime: BigInt, endTime: BigInt
		): FactoryTokenLockWallet {

			let id = address.toHexString()
			let entity = new FactoryTokenLockWallet(id)

			entity.address = address
			entity.periodsAmount = periods
			entity.startTime = startTime
			entity.endTime = endTime
			entity.managedAmount = managedAmount
			entity.releasedAmount = integer.ZERO
			entity.pendingAmount = integer.ZERO

			return entity as FactoryTokenLockWallet
		}

	}

	export namespace custom {

		export function createCustomLockWallet(
			address: Bytes, periods: BigInt, managedAmount: BigInt,
			startTime: BigInt, endTime: BigInt
		): CustomTokenLockWallet {

			let id = address.toHexString()
			let entity = new CustomTokenLockWallet(id)

			entity.address = address
			entity.periodsAmount = periods
			entity.startTime = startTime
			entity.endTime = endTime
			entity.managedAmount = managedAmount

			return entity as CustomTokenLockWallet
		}

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
