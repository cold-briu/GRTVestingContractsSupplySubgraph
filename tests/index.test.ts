import { test } from "matchstick-as";
import { testHandleInitialize } from "./handleInitialize.test";
import { testHandleOwnershipTransferred } from "./handleOwnershipTransferred.test";


function runTests(): void {
	test("GraphTokenLockWallet - testHandleInitialize",
		testHandleInitialize
	)
	test("GraphTokenLockWallet - testHandleOwnershipTransferred",
		testHandleOwnershipTransferred
	)
}
runTests()