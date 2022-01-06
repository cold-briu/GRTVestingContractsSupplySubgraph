import { test } from "matchstick-as/assembly/index"
import { testHandleInitialize } from "./handleInitialize.test";
import { testHandleBlock } from "./handleBlock.test";

export namespace GraphTokenLockWallet {
	export function runtTests(): void {
		test("GraphTokenLockWallet - testHandleInitialize",
			testHandleInitialize
		)
		test("GraphTokenLockWallet - testHandleBlock",
			testHandleBlock
		)
	}
}