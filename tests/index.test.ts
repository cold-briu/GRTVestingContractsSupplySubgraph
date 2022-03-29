import { test } from "matchstick-as";
import { testHandleInitialize } from "./handleInitialize.test";
import { testHandleOwnershipTransferred } from "./handleOwnershipTransferred.test";
import { testHandleTransferMint } from "./handleTransferMint.test";
import { testHandleTransferBurn } from "./handleTransferBurn.test";
import { testHandleBlock } from "./handleBlock.test";

// TODO: test periods entities creation
function runTests(): void {
	test("TokenLockWallet - testHandleInitialize",
		testHandleInitialize
	)
	test("TokenLockWallet - testHandleOwnershipTransferred",
		testHandleOwnershipTransferred
	)

	test("GraphToken - testHandleTransferMint",
		testHandleTransferMint
	)
	test("GraphToken - testHandleTransferBurn",
		testHandleTransferBurn
	)

	test("TokenLockWallet - testHandleBlock",
		testHandleBlock
	)
}
runTests()