import { Address, BigInt, TypedMap } from "@graphprotocol/graph-ts"
import { ADDRESS_ZERO } from "@protofire/subgraph-toolkit";
import { OwnershipTransferred } from "../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet";

import { clearStore } from "matchstick-as";
import { circulatingSupply, lockWalletContracts, tests } from "../src/modules";
import { modules as testModules } from "./modules"

export function testPeriodsReleaseProcessIssue(): void {
	let previousOwner = Address.fromString(ADDRESS_ZERO)
	let newOwner = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")

	let ExpectedPeriods = BigInt.fromI32(12)
	let ExpectedManagedAmount = BigInt.fromI64(1042919000000000000000000)
	let ExpectedStartTime = BigInt.fromI32(1639760400)
	let ExpectedEndTime = BigInt.fromI32(1671296400)

	let event = changetype<OwnershipTransferred>(tests.helpers.events.getNewEvent(
		[
			tests.helpers.params.getAddress("previousOwner", previousOwner),
			tests.helpers.params.getAddress("newOwner", newOwner),
		]
	))

	mockContractCalls(
		event.address,
		ExpectedPeriods,
		ExpectedManagedAmount,
		ExpectedStartTime,
		ExpectedEndTime
	)

	// event.address = Address.fromHexString("0x00df1a072e66eae444af0756abd65f667b9aeb39") as Address
	// tests.mappingsWrapper.graphTokenLockWallet.handleOwnershipTransferred(event)


	// let testValues = new TypedMap<string, string>()
	// testValues.set("startTime", ExpectedStartTime.toString())
	// testValues.set("endTime", ExpectedEndTime.toString())
	// testValues.set("periodsAmount", ExpectedPeriods.toString())
	// testValues.set("managedAmount", ExpectedManagedAmount.toString())

	// tests.helpers.asserts.assertMany(
	// 	"LockWalletContract",
	// 	event.address.toHexString(),
	// 	testValues
	// )

}

/*
{
		"address": "0x00df1a072e66eae444af0756abd65f667b9aeb39",
		"startTime": "1639760400",
		"endTime": "1671296400",
		"periodsAmount": "12",
		"passedPeriods": "4",
		"managedAmount": "1042919000000000000000000",
		
		"amountPerPeriod": "86909916666666666666666",
		"releasedAmount": "347639666666666666666664",
		"totalLocked": "695279333333333333333336",
		"availableAmount": "347639666666666666666664",
		"periods": [
		  {
			"id": "0x00df1a072e66eae444af0756abd65f667b9aeb39-11",
			"releaseDate": "1639760400",
			"processed": false
		  },
		  {
			"id": "0x00df1a072e66eae444af0756abd65f667b9aeb39-10",
			"releaseDate": "1642388400",
			"processed": false
		  },
		  {
			"id": "0x00df1a072e66eae444af0756abd65f667b9aeb39-9",
			"releaseDate": "1645016400",
			"processed": false
		  },
		  {
			"id": "0x00df1a072e66eae444af0756abd65f667b9aeb39-8",
			"releaseDate": "1647644400",
			"processed": false
		  },
		  {
			"id": "0x00df1a072e66eae444af0756abd65f667b9aeb39-7",
			"releaseDate": "1650272400",
			"processed": false
		  },
		  {
			"id": "0x00df1a072e66eae444af0756abd65f667b9aeb39-6",
			"releaseDate": "1652900400",
			"processed": false
		  },
		  {
			"id": "0x00df1a072e66eae444af0756abd65f667b9aeb39-5",
			"releaseDate": "1655528400",
			"processed": false
		  },
		  {
			"id": "0x00df1a072e66eae444af0756abd65f667b9aeb39-4",
			"releaseDate": "1658156400",
			"processed": false
		  },
		  {
			"id": "0x00df1a072e66eae444af0756abd65f667b9aeb39-3",
			"releaseDate": "1660784400",
			"processed": false
		  },
		  {
			"id": "0x00df1a072e66eae444af0756abd65f667b9aeb39-2",
			"releaseDate": "1663412400",
			"processed": false
		  },
		  {
			"id": "0x00df1a072e66eae444af0756abd65f667b9aeb39-1",
			"releaseDate": "1666040400",
			"processed": false
		  },
		  {
			"id": "0x00df1a072e66eae444af0756abd65f667b9aeb39-0",
			"releaseDate": "1668668400",
			"processed": false
		  }
		]
	  },


TODO: handle setAsProcessed
*/


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