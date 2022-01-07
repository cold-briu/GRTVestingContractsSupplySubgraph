import { Address, Bytes, BigInt, ethereum, TypedMap } from "@graphprotocol/graph-ts"
import { newMockEvent, newMockCall, assert, log } from "matchstick-as"
import {
	handleInitialize as _handleInitialize,
	handleBlock as _handleBlock
} from "../../mappings/tokenLockWallets/tokenLockWallet"

export namespace tests {

	export namespace mappingsWrapper {
		export namespace graphTokenLockWallet {
			export let handleInitialize = _handleInitialize
			export let handleBlock = _handleBlock
		}
	}

	export namespace logs {
		export namespace global {
			export function started(funcName: string, id: string): void {
				log.info(
					"\n_____\n\nfunc={} :: testing entity w/ id={}\n_____\n",
					[funcName, id]
				)
			}

			export function success(funcName: string, id: string): void {
				log.success(
					"\nfunc={} :: succesfully tested w/ id={}\n",
					[funcName, id]
				)
			}

			export function error(funcName: string, detail: string): void {
				log.error(
					"\nfunc={} :: ={}\n",
					[funcName, detail]
				)
			}
		}

		export namespace internal {
			export function testing(
				funcName: string, expected: string, actual: string
			): void {
				log.debug(
					"\n · func={} :: testing expected={} actual={}\n",
					[funcName, expected, actual]
				)
			}
		}
	}

	export namespace helpers {

		export namespace asserts {

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

			export function assertEqual<T>(
				expected: T, actual: T, pipe: (e: T) => ethereum.Value
			): void {
				assert.equals(
					pipe(expected),
					pipe(actual)
				)
			}

			export function assertBytes(
				expected: Bytes, actual: Bytes
			): void {
				logs.internal.testing(
					"assertBytes", expected.toHexString(), actual.toHexString()
				)
				assertEqual<Bytes>(
					expected,
					actual,
					ethereum.Value.fromBytes
				)
			}

			export function assertAddress(
				expected: Address, actual: Address
			): void {
				logs.internal.testing(
					"assertAddress", expected.toHexString(), actual.toHexString()
				)
				assertEqual<Address>(
					expected,
					actual,
					ethereum.Value.fromAddress
				)
			}

			export function assertBigInt(
				expected: BigInt, actual: BigInt
			): void {
				logs.internal.testing(
					"assertBigInt", expected.toString(), actual.toString()
				)
				assertEqual(
					expected,
					actual,
					ethereum.Value.fromUnsignedBigInt
				)
			}

		}
		export namespace runtime {

			export function testBlock(
				blockId: string, timestamp: string, blockNumber: string
			): void {
				let params = new TypedMap<string, string>()
				params.set("timestamp", timestamp)
				params.set("number", blockNumber)

				asserts.assertMany(
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

				asserts.assertMany(
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

				asserts.assertMany(
					"Erc721Transaction", erc721TxId, erc721TxParams
				)
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