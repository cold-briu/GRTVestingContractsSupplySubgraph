import { test } from "matchstick-as/assembly/index"
import { testHandleInitialize } from "./handleInitialize.test";

export namespace joyToys {
	export function runtTests(): void {
		test("GraphTokenLockWallet - testHandleInitialize",
			testHandleInitialize
		)
	}
}