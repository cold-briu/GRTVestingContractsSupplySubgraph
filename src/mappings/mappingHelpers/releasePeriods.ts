import { Grt, PendingPeriods, ProcessedPeriods } from '../../../generated/schema'
import { BigInt } from '@graphprotocol/graph-ts'
import {
	grt as grtModule,
	periodsLists,
	releasePeriods as releasePeriodsModule,
	lockWalletContracts
} from '../../modules'

export namespace releasePeriods {

	// TODO: HOW TO pendingPeriodsKeys TO BE SORTED?

	export function releasePeriod(periodId: string, _grt: Grt, pendingList: PendingPeriods, processedList: ProcessedPeriods): void {
		// updated processed: Boolean and list: string
		let period = releasePeriodsModule.safeLoadPeriod(periodId)
		period = releasePeriodsModule.mutations.setAsProcessed(period)

		let contractId = period.id.split("-")[0]
		let contract = lockWalletContracts.safeLoadLockWalletContract(contractId)

		contract = lockWalletContracts.mutators.increaseReleaseAmount(contract, period.amount)
		contract = lockWalletContracts.mutators.increasePassedPeriods(contract)
		contract = lockWalletContracts.mutators.updateavAilableAmount(contract)
		contract = lockWalletContracts.mutators.updateavTotalLocked(contract)
		contract.save()

		_grt = grtModule.mutations.increaseLiquidSupply(
			_grt, period.amount
		)

		pendingList = periodsLists.pending.mutations.decreaseAmount(
			pendingList, period.amount
		)

		processedList = periodsLists.processed.mutations.increaseAmount(
			processedList, period.amount
		)
		// TODO set as processed
	}


	export function createPeriodsForContract(
		contractId: string, periods: BigInt, managedAmount: BigInt,
		startTime: BigInt, endTime: BigInt
	): void {

		let grt = grtModule.createOrLoadGrt()
		let pendingPeriodsList = periodsLists.pending.getOrCreateList()

		// [periodAmount, periodsAmount, managedAmount] naming may introduce confusion: some of them talk about GRT but others don't
		let contractReleaseDuration = releasePeriodsModule.calculate.walletReleaseDuration(startTime, endTime)
		// tests.logs.global.warn("calculate.walletReleaseDuration", `start: ${startTime} - end: ${endTime} - duration: ${contractReleaseDuration}`)

		let periodReleaseDuration = releasePeriodsModule.calculate.periodReleaseDuration(contractReleaseDuration, periods)
		// tests.logs.global.warn("calculate.periodReleaseDuration", `duration: ${contractReleaseDuration} - periods: ${periods}`)

		let periodAmount = releasePeriodsModule.calculate.periodAmount(managedAmount, periods)


		// tests.logs.global.warn("startTime.plus", `periodDuration: ${periodReleaseDuration} - startTime: ${startTime}`)

		let periodsCount = periods.toI32()
		for (let i = 0; i < periodsCount; i++) {
			let periodReleaseStart = startTime.plus(periodReleaseDuration.times(BigInt.fromI32(i + 1)))

			// tests.logs.global.warn("calculate.increasePeriodReleaseDate", `post.periodReleaseDate: ${periodReleaseStart}`)


			// periodsToProcess is a derived list, periods are created w/ this relationship
			let releasePeriod = releasePeriodsModule.createReleasePeriod(
				contractId, i, periodReleaseStart, periodAmount
			)
			releasePeriod.save()
			// tests.logs.global.warn("releasePeriods.createReleasePeriod", `contactId: ${releasePeriod.id} - i: ${i} - periodReleaseDate: ${releasePeriod.releaseDate}`)


			pendingPeriodsList = periodsLists.pending.mutations.addPeriodKey(
				pendingPeriodsList, releasePeriodsModule.keys.encode(
					releasePeriod.id,
					releasePeriod.releaseDate
				)
			)

			if (i == 0) {
				pendingPeriodsList = periodsLists.pending.mutations.updateNextToProcess(
					pendingPeriodsList, releasePeriod.releaseDate, releasePeriod.id
				)
			}
		}

		grt = grtModule.mutations.decreaseLiquidSupply(
			grt,
			managedAmount
		)
		grt = grtModule.mutations.increaseLockedSupply(
			grt,
			managedAmount
		)
		grt.save()

		// grt amount
		pendingPeriodsList = periodsLists.pending.mutations.increaseAmount(
			pendingPeriodsList, managedAmount
		)
		pendingPeriodsList.save()
	}
}