import { Address, BigInt } from "@graphprotocol/graph-ts"
import { ADDRESS_ZERO } from "@protofire/subgraph-toolkit"
import { clearStore } from "matchstick-as"
import { Transfer } from "../generated/GraphToken/GraphToken"
import { modules as testModules } from "./modules"
import { circulatingSupply, tests } from "../src/modules"

export function testHandleTransferBurn(): void {
	let from = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")
	let to = Address.fromString(ADDRESS_ZERO)
	let value = BigInt.fromI32(666999)

	let event = changetype<Transfer>(tests.helpers.events.getNewEvent(
		[
			tests.helpers.params.getAddress("from", from),
			tests.helpers.params.getAddress("to", to),
			tests.helpers.params.getBigInt("value", value),
		]
	))

	let _populatedVal = value.times(BigInt.fromI32(2))

	tests.mappingsWrapper.graphToken.handleTransfer(event)
	prePopulateTest(_populatedVal)
	testModules.GraphCirculatingSupply.creation()
	testModules.GraphCirculatingSupply.burn(_populatedVal, value)


	clearStore()
}

function prePopulateTest(amount: BigInt): void {
	let entity = circulatingSupply.createOrLoadGraphCirculatingSupply()
	entity = circulatingSupply.mintTokens(entity, amount)
	entity.save()
}