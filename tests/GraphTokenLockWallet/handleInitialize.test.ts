import { Address, BigInt, TypedMap } from "@graphprotocol/graph-ts"
import { InitializeCall } from "../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet"
import { clearStore, assert } from "matchstick-as/assembly/index"

import { tests } from "../../src/modules"

export function testHandleInitialize(): void {

	let _manager = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")
	let _owner = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")
	let _beneficiary = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")
	let _token = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")

	let _managedAmount = BigInt.fromI32(666)
	let _startTime = BigInt.fromI32(666)
	let _endTime = BigInt.fromI32(666)
	let _periods = BigInt.fromI32(666)
	let _releaseStartTime = BigInt.fromI32(666)
	let _vestingCliffTime = BigInt.fromI32(666)
	let _revocable = 10

	let call = changetype<InitializeCall>(tests.helpers.calls.getNewCall(
		[
			tests.helpers.params.getAddress("_manager", _manager),
			tests.helpers.params.getAddress("_owner", _owner),
			tests.helpers.params.getAddress("_beneficiary", _beneficiary),
			tests.helpers.params.getAddress("_token", _token),
			tests.helpers.params.getBigInt("_managedAmount", _managedAmount),
			tests.helpers.params.getBigInt("_startTime", _startTime),
			tests.helpers.params.getBigInt("_endTime", _endTime),
			tests.helpers.params.getBigInt("_periods", _periods),
			tests.helpers.params.getBigInt("_releaseStartTime", _releaseStartTime),
			tests.helpers.params.getBigInt("_vestingCliffTime", _vestingCliffTime),
			tests.helpers.params.getI32("_revocable", _revocable),
		]
	))

	// tests.mappingsWrapper.joyToys.handleApproval(event)

	// let contractAddress = event.address.toHex()
	// let ownerAsHex = owner.toHex()
	// let approvedAsHex = approved.toHex()

	// // check block
	// let blockId = metadata.helpers.getNewMetadataId(contractAddress, event.block.number.toString())

	// tests.helpers.runtime.testBlock(
	// 	blockId, event.block.timestamp.toString(), event.block.number.toString()
	// )

	// // check evm transaction
	// let txHash = event.transaction.hash.toHexString()
	// let txId = metadata.helpers.getNewMetadataId(contractAddress, txHash)

	// tests.helpers.runtime.testTransaction(
	// 	txId, blockId, txHash, event.transaction.from.toHexString(),
	// 	event.transaction.gasLimit.toString(), event.transaction.gasPrice.toString()
	// )

	// // check approval event
	// let entityTokenId = tokens.helpers.getTokenId(contractAddress, tokenId.toHex())

	// let approvalEventParams = new TypedMap<string, string>()
	// approvalEventParams.set("token", entityTokenId)
	// approvalEventParams.set("transaction", txId)
	// approvalEventParams.set("block", blockId)

	// tests.helpers.runtime.assertMany(
	// 	"Approval",
	// 	events.helpers.getNewEventId(
	// 		contractAddress, approvedAsHex, ownerAsHex,
	// 		event.block.timestamp.toString()
	// 	),
	// 	approvalEventParams
	// )

	// // check token
	// assert.fieldEquals("JoyToy", entityTokenId, "owner", ownerAsHex)
	// assert.fieldEquals("JoyToy", entityTokenId, "approval", approvedAsHex)


	// // check owner
	// assert.fieldEquals("Account", ownerAsHex, "address", ownerAsHex)

	// // check approved
	// assert.fieldEquals("Account", approvedAsHex, "address", approvedAsHex)

	clearStore()
}