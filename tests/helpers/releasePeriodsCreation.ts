import { BigInt, log, TypedMap } from "@graphprotocol/graph-ts"
import { tests, releasePeriods } from "../../src/modules"

export function releasePeriodsCreation(
	contractId: string, periods: BigInt,
	startTime: BigInt, periodsDuration: BigInt,
	managedAmount: string
): void {
	let periodsI32 = periods.toI32()

	log.info(
		"😎 releasePeriodsCreation: creating ={} periods \n· · contract ={}",
		[periods.toString(), contractId]
	)

	let periodReleaseDate = startTime
	for (let index = 0; index < periodsI32; index++) {
		periodReleaseDate = periodReleaseDate.plus(periodsDuration)

		let indexStr = index.toString()
		let periodId = releasePeriods.getPeriodId(contractId, indexStr)
		let releaseDateStr = periodReleaseDate.toString()

		log.info("\n· · · testing period ={}\n· · · date ={}\n",
			[indexStr, releaseDateStr])

		let params = new TypedMap<string, string>()

		params.set("releaseDate", releaseDateStr)
		params.set("amount", managedAmount)
		params.set("contract", contractId)
		params.set("processed", "false")

		tests.helpers.runtime.assertMany(
			"ReleasePeriod", periodId, params
		)
	}

}
