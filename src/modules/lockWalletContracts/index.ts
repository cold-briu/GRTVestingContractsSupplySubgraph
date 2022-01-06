import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { integer } from "@protofire/subgraph-toolkit";
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
			entity.releasedAmount = integer.ZERO
			entity.pendingAmount = integer.ZERO

			return entity as CustomTokenLockWallet
		}

	}
}
