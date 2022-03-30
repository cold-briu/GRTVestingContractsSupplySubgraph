import { Address, BigInt } from "@graphprotocol/graph-ts"
import { ADDRESS_ZERO } from "@protofire/subgraph-toolkit"
import { clearStore } from "matchstick-as"
import { Transfer } from "../generated/GraphToken/GraphToken"
import { modules as testModules } from "./modules"
import { tests } from "../src/modules"

export function testHandleTransferMint(): void {
	let from = Address.fromString(ADDRESS_ZERO)
	let to = Address.fromString("0x7b7cc10852f215bcea3e684ef584eb2b7c24b8f7")
	let value = BigInt.fromI32(666999)

	let event = changetype<Transfer>(tests.helpers.events.getNewEvent(
		[
			tests.helpers.params.getAddress("from", from),
			tests.helpers.params.getAddress("to", to),
			tests.helpers.params.getBigInt("value", value),
		]
	))

	tests.mappingsWrapper.graphToken.handleTransfer(event)

	testModules.GraphCirculatingSupply.creation()
	testModules.GraphCirculatingSupply.mint(value)


	clearStore()
}
