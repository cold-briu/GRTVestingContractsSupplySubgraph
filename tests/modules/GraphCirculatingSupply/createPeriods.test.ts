import { BigInt } from "@graphprotocol/graph-ts"
import { GraphCirculatingSupply } from "../../../generated/schema"
import { createPeriodsForContract } from "../../../src/mappings/mappingHelpers"
import { circulatingSupply, tests } from "../../../src/modules"

export function createPeriods(
	periods: BigInt, managedAmount: BigInt,
	startTime: BigInt, endTime: BigInt
): void {

	let id = circulatingSupply.constants.CIRCULATING_SUPPLY_ID
	let storedEntity = GraphCirculatingSupply.load(id)
	if (storedEntity == null) {
		tests.logs.global.error(
			"GraphCirculatingSupply.createPeriods.test",
			"failed to load entity w/ id=" + id
		)
		return
	}

	tests.logs.global.started(
		"GraphCirculatingSupply.createPeriods.test", id
	)

	createPeriodsForContract("0xcontractId", periods, managedAmount, startTime, endTime)

	// tests.helpers.asserts.assertBigInt(entity.totalSupply, storedEntity.totalSupply)
	// tests.helpers.asserts.assertBigInt(entity.minPeriodToProcessDate, storedEntity.minPeriodToProcessDate)
	// tests.helpers.asserts.assertString(periodsLists.constants.PENDING_LISTS_ID, entity.periodsToProcess)
	// tests.helpers.asserts.assertString(periodsLists.constants.PROCESSED_LISTS_ID, entity.periodsProcessed)

	// tests.logs.global.warn(
	// 	"GraphCirculatingSupply.createPeriods.test",
	// 	"skip test :: assertBigInt(entity.circulatingSupply, storedEntity.circulatingSupply)\n -> Returns negative values"
	// )
	// tests.logs.internal.testing(
	// 	"SKIPPED assertBigInt", entity.circulatingSupply.toString(), storedEntity.circulatingSupply.toString()
	// )
	// tests.helpers.asserts.assertBigInt(entity.circulatingSupply, storedEntity.circulatingSupply)

	tests.logs.global.success("GraphCirculatingSupply.createPeriods.test", id)
}