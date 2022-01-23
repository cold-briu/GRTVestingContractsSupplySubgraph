import { test } from "matchstick-as";
import { testHandleInitialize } from "./handleInitialize.test";


function runTests(): void {
	test("GraphTokenLockWallet - testHandleInitialize",
		testHandleInitialize
	)
}
runTests()