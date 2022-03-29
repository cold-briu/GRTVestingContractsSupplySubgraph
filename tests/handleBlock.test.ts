import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { ADDRESS_ZERO } from "@protofire/subgraph-toolkit";
import { clearStore } from "matchstick-as";
import { modules as testModules } from "./modules"
import { circulatingSupply, lockWalletContracts, tests } from "../src/modules";
import { OwnershipTransferred } from "../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet";

export function testHandleBlock(): void {

	let _periods = BigInt.fromI32(10)
	let _managedAmount = BigInt.fromI32(25000)
	let _startTime = BigInt.fromI32(9000)
	let _endTime = BigInt.fromI32(9900)

	// Create and test periods, return event for context
	let event = prePopulateTest(
		_periods,
		_managedAmount,
		_startTime,
		_endTime
	)

	// default block timestamp is 1, add _endTime to release all periods
	let block = getBlock(event, _endTime)
	tests.mappingsWrapper.graphTokenLockWallet.handleBlock(block)

	testModules.PeriodsList.pending.releasePeriods()
	testModules.PeriodsList.processed.releasePeriods(_managedAmount)
	testModules.GraphCirculatingSupply.releasePeriods(_managedAmount)

	// TODO test partial released periods


	clearStore()

}

function getBlock(event: OwnershipTransferred, startTime: BigInt): ethereum.Block {
	let _block = event.block
	//increase block timestamp to trigger BlockHandler
	_block.timestamp = event.block.timestamp.plus(startTime)
	return _block
}

/*
*	Creates and returns the "event"
*	mockContractCalls
*	triggers handleOwnershipTransferred
*	create and test GraphCirculatingSupply
*	create and test PeriodsList
*/
function prePopulateTest(
	_periods: BigInt,
	_managedAmount: BigInt,
	_startTime: BigInt,
	_endTime: BigInt,
): OwnershipTransferred {

	let previousOwner = Address.fromString(ADDRESS_ZERO)
	let newOwner = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")

	let event = changetype<OwnershipTransferred>(tests.helpers.events.getNewEvent(
		[
			tests.helpers.params.getAddress("previousOwner", previousOwner),
			tests.helpers.params.getAddress("newOwner", newOwner),
		]
	))

	mockContractCalls(
		event.address,
		_periods,
		_managedAmount,
		_startTime,
		_endTime
	)

	tests.mappingsWrapper.graphTokenLockWallet.handleOwnershipTransferred(event)

	testModules.LockWalletContract.creation(
		event.address,
		_periods,
		_managedAmount,
		_startTime,
		_endTime,
		lockWalletContracts.constants.CUSTOM_CONTRACT_TYPENAME
	)

	testModules.GraphCirculatingSupply.creation()

	let entity = circulatingSupply.createOrLoadGraphCirculatingSupply()
	entity = circulatingSupply.mutations.increaseCirculatingSupply(entity, _managedAmount)
	entity.save()

	testModules.GraphCirculatingSupply.createPeriods(
		_periods,
		_managedAmount,
		_startTime,
		_endTime
	)

	testModules.PeriodsList.pending.creation()

	testModules.PeriodsList.pending.createPeriods(
		event.address.toHexString(),
		_periods,
		_managedAmount,
		_startTime,
		_endTime
	)

	return event
}

function mockContractCalls(
	address: Address,
	_periods: BigInt,
	_managedAmount: BigInt,
	_startTime: BigInt,
	_endTime: BigInt,
): void {

	tests.helpers.contractCalls.mockFunction(
		address,
		"isInitialized",
		"isInitialized():(bool)",
		[],
		[tests.helpers.ethereumValue.getFromBoolean(true)]
	)

	tests.helpers.contractCalls.mockFunction(
		address,
		"periods",
		"periods():(uint256)",
		[],
		[tests.helpers.ethereumValue.getFromBigInt(_periods)]
	)

	tests.helpers.contractCalls.mockFunction(
		address,
		"managedAmount",
		"managedAmount():(uint256)",
		[],
		[tests.helpers.ethereumValue.getFromBigInt(_managedAmount)]
	)

	tests.helpers.contractCalls.mockFunction(
		address,
		"startTime",
		"startTime():(uint256)",
		[],
		[tests.helpers.ethereumValue.getFromBigInt(_startTime)]
	)

	tests.helpers.contractCalls.mockFunction(
		address,
		"endTime",
		"endTime():(uint256)",
		[],
		[tests.helpers.ethereumValue.getFromBigInt(_endTime)]
	)

}