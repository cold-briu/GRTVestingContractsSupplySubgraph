import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { integer } from "@protofire/subgraph-toolkit"
import { log } from "matchstick-as"
import { CustomTokenLockWallet } from "../../../../generated/schema"
import { tests } from "../../../../src/modules"

export function creation(
	address: Bytes, periods: BigInt,
	managedAmount: BigInt, startTime: BigInt, endTime: BigInt
): void {

	let id = address.toHexString()
	let entity = CustomTokenLockWallet.load(id)
	if (entity == null) {
		tests.logs.global.error(
			"LockWalletContract.custom.creation.test",
			"failed to load entity w/ id=" + id
		)
		return
	}

	tests.logs.global.started(
		"LockWalletContract.custom.creation.test", id
	)

	tests.helpers.asserts.assertBytes(address, entity.address)
	tests.helpers.asserts.assertBigInt(periods, entity.periodsAmount)
	tests.helpers.asserts.assertBigInt(managedAmount, entity.managedAmount)
	tests.helpers.asserts.assertBigInt(integer.ZERO, entity.pendingAmount)
	tests.helpers.asserts.assertBigInt(integer.ZERO, entity.releasedAmount)
	tests.helpers.asserts.assertBigInt(startTime, entity.startTime)
	tests.helpers.asserts.assertBigInt(endTime, entity.endTime)

	tests.logs.global.success("LockWalletContract.custom.creation.test", id)
}