import { test } from "matchstick-as";
import { testHandleInitialize } from "./handleInitialize.test";
import { testHandleOwnershipTransferred } from "./handleOwnershipTransferred.test";
import { testHandleTransferMint } from "./handleTransferMint.test";


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
}
runTests()