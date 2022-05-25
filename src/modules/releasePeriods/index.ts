import { BigInt } from "@graphprotocol/graph-ts";
import { periodsLists } from "..";
import { ReleasePeriod } from "../../../generated/schema";

export namespace releasePeriods {

	export function createReleasePeriod(
		contractId: string, index: i32,
		releaseDate: BigInt, periodGrtAmount: BigInt
	): ReleasePeriod {
		let id = getPeriodId(contractId, index.toString())
		let releasePeriod = new ReleasePeriod(id);

		releasePeriod.contract = contractId
		releasePeriod.releaseDate = releaseDate
		releasePeriod.amount = periodGrtAmount
		releasePeriod.processed = false
		releasePeriod.list = periodsLists.constants.PENDING_LISTS_ID
		releasePeriod.key = keys.encode(id, releaseDate)

		return releasePeriod as ReleasePeriod
	}

	export function safeLoadPeriod(id: string): ReleasePeriod {
		let releasePeriod = ReleasePeriod.load(id);
		if (!releasePeriod) {
			releasePeriod = new ReleasePeriod(id)
		}
		return releasePeriod as ReleasePeriod
	}

	export function getPeriodId(contractId: string, index: string): string {
		return contractId + "-" + index
	}

	export function createPeriodsIdList(contractId: string, amount: i32): Array<string> {
		let list: string[] = []
		for (let index = 0; index < amount; index++) {
			let id = getPeriodId(contractId, index.toString())
			list.push(id)
		}
		return list
	}

	export namespace mutations {

		export function setAsProcessed(p: ReleasePeriod): ReleasePeriod {
			let period = p
			let list = period.list
			list = periodsLists.constants.PROCESSED_LISTS_ID
			period.list = list
			period.processed = true

			return period
		}
	}

	export namespace keys {


		export function encode(id: string, releaseDate: BigInt): string {
			return id + "@" + releaseDate.toString()
		}

		export function decode(periodKey: string): PeriodKeyDecodeResult {
			let decodeResult = periodKey.split("@")
			return new PeriodKeyDecodeResult(decodeResult[0], BigInt.fromString(decodeResult[1]))
		}

		export class PeriodKeyDecodeResult {
			id: string;
			date: BigInt;
			constructor(_id: string, _date: BigInt) {
				this.id = _id
				this.date = _date
			}
		}

	}

	export namespace calculate {

		export function walletReleaseDuration(
			startTime: BigInt, endTime: BigInt
		): BigInt {
			return endTime.minus(startTime)
		}

		export function periodReleaseDuration(
			releaseDuration: BigInt, periodsAmount: BigInt
		): BigInt {
			return releaseDuration.div(periodsAmount)
		}

		export function periodAmount(
			walletManagedAmount: BigInt, periodsAmount: BigInt
		): BigInt {
			return walletManagedAmount.div(periodsAmount)
		}

		export function increasePeriodReleaseDate(
			prevDate: BigInt, duration: BigInt
		): BigInt {
			return prevDate.plus(duration)
		}
	}
}