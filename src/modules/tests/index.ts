import { Address, Bytes, BigInt, ethereum, TypedMap } from "@graphprotocol/graph-ts"
import { newMockEvent, newMockCall, assert } from "matchstick-as"
import {
	handleInitialize as _handleInitialize,
} from "../../mappings/tokenLockWallets/tokenLockWallet"

export namespace tests {

	export namespace mappingsWrapper {
		export namespace graphTokenLockWallet {
			export let handleInitialize = _handleInitialize
		}
	}
	export namespace helpers {
		export namespace runtime {

			export function testBlock(
				blockId: string, timestamp: string, blockNumber: string
			): void {
				let params = new TypedMap<string, string>()
				params.set("timestamp", timestamp)
				params.set("number", blockNumber)

				assertMany(
					"Block", blockId, params
				)
			}

			export function testTransaction(
				txId: string, blockId: string, txHash: string,
				from: string, gasLimit: string, gasPrice: string
			): void {
				let params = new TypedMap<string, string>()
				params.set("block", blockId)
				params.set("hash", txHash)
				params.set("from", from)
				params.set("gasLimit", gasLimit)
				params.set("gasPrice", gasPrice)

				assertMany(
					"Transaction", txId, params
				)
			}

			export function testErc721Tx(
				erc721TxId: string, from: string, to: string,
				token: string, block: string, txId: string, type: string
			): void {

				let erc721TxParams = new TypedMap<string, string>()
				erc721TxParams.set("from", from)
				erc721TxParams.set("to", to)
				erc721TxParams.set("token", token)
				erc721TxParams.set("block", block)
				erc721TxParams.set("transaction", txId)
				erc721TxParams.set("type", type)

				assertMany(
					"Erc721Transaction", erc721TxId, erc721TxParams
				)
			}

			export function assertMany(
				entityName: string,
				entityId: string,
				fields: TypedMap<string, string>
			): void {
				for (let index = 0; index < fields.entries.length; index++) {
					let entry = fields.entries[index];
					assert.fieldEquals(entityName, entityId, entry.key, entry.value)
				}
			}
		}

		export namespace events {
			export function getNewEvent(params: ethereum.EventParam[]): ethereum.Event {
				let event = newMockEvent()
				event.parameters = new Array()
				for (let index = 0; index < params.length; index++) {
					event.parameters.push(params[index])
				}
				return event
			}
		}

		export namespace calls {
			export function getNewCall(inputs: ethereum.EventParam[]): ethereum.Call {
				let call = newMockCall()
				call.inputValues = new Array()
				for (let index = 0; index < inputs.length; index++) {
					call.inputValues.push(inputs[index])
				}
				return call
			}
		}



		export namespace params {

			function getNewParam(name: string, value: ethereum.Value): ethereum.EventParam {
				return new ethereum.EventParam(name, value)
			}

			export function getI32(name: string, value: i32): ethereum.EventParam {
				return getNewParam(name, ethereum.Value.fromI32(value))
			}

			export function getString(name: string, value: string): ethereum.EventParam {
				return getNewParam(name, ethereum.Value.fromString(value))
			}

			export function getBytes(name: string, value: Bytes): ethereum.EventParam {
				return getNewParam(name, ethereum.Value.fromBytes(value))
			}

			export function getBoolean(name: string, value: boolean): ethereum.EventParam {
				return getNewParam(name, ethereum.Value.fromBoolean(value))
			}

			export function getBigInt(name: string, value: BigInt): ethereum.EventParam {
				return getNewParam(name, ethereum.Value.fromUnsignedBigInt(value))
			}

			export function getAddress(name: string, value: Address): ethereum.EventParam {
				return getNewParam(name, ethereum.Value.fromAddress(value))
			}

		}
	}
}