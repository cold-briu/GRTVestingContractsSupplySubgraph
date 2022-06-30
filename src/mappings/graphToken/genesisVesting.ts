import { BigInt } from "@graphprotocol/graph-ts"
import { grt } from "../../modules"

export namespace genesisVesting {

	export const GENESIS_TX_LIST = [
		"0x0e88219fa121e7d3bc90d7478c12e222b54fe7e0f6656115c38db17446dd1f93",
		"0xd84234042703990c4d6afdc3e54d9d6b873dfacfa808b3d3a1acc020782ee209",
		"0x5bd1036a2a22ff49786bd0d7968fb5208248bbd51b871f5fed7906c27d370f46"
	]


	export namespace helpers {
		export function isGenesisTransaction(txHash: string): boolean {
			return !!GENESIS_TX_LIST.includes(txHash)
		}
	}

	export function lockGenesisTransaction(amount: BigInt): void {
		let entity = grt.createOrLoadGrt()
		entity = grt.mutations.increaseTransferredSupplyGenesis(entity, amount)
		entity = grt.mutations.increaseLockedSupply(entity, amount)
		entity = grt.mutations.increaseLockedSupplyGenesis(entity, amount)
		entity.save()
	}
}