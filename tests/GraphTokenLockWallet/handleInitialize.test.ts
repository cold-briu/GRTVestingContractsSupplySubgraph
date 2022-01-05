import { Address, BigInt, TypedMap } from "@graphprotocol/graph-ts"
import { InitializeCall } from "../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet"
import { clearStore, assert } from "matchstick-as/assembly/index"

import { tests } from "../../src/modules"
import { helpers as testHelpers } from "../helpers"

export function testHandleInitialize(): void {

	// default contract address is 0xA16081F360e3847006dB660bae1c6d1b2e17eC2A
	// defined by matchstick

	let _manager = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")
	let _owner = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")
	let _beneficiary = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")
	let _token = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")

	let _managedAmount = BigInt.fromI32(25000)
	let _startTime = BigInt.fromI32(9000)
	let _endTime = BigInt.fromI32(90000)
	let _periods = BigInt.fromI32(10)

	let _releaseStartTime = BigInt.fromI32(0)
	let _vestingCliffTime = BigInt.fromI32(0)
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

	tests.mappingsWrapper.graphTokenLockWallet.handleInitialize(call)

	let contractDataId = Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2A").toHexString()
	let periods = _periods.toString()
	let managedAmount = _managedAmount.toString()
	let startTime = _startTime.toString()
	let endTime = _endTime.toString()

	let releaseDuration = _endTime.minus(_startTime)
	let periodsDuration = releaseDuration.div(_periods)

	testHelpers.contractDataCreation(
		contractDataId,
		periods,
		managedAmount,
		startTime,
		endTime
	)

	testHelpers.releasePeriodsCreation(
		contractDataId,
		_periods,
		_startTime,
		periodsDuration,
		_managedAmount.div(_periods).toString()
	)


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