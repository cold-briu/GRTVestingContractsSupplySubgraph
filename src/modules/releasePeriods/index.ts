import { BigInt } from "@graphprotocol/graph-ts";
import { ReleasePeriod } from "../../../generated/schema";

export namespace releasePeriods {

	export function createReleasePeriod(
		contractId: string, index: i32,
		releaseDate: BigInt, periodAmount: BigInt
	): ReleasePeriod {
		let releasePeriod = new ReleasePeriod(getPeriodId(contractId, index.toString()));
		releasePeriod.releaseDate = releaseDate
		releasePeriod.amount = periodAmount // FIXME: why to save here the periodAmount since its already stored in contractData related entity?
		releasePeriod.contract = contractId
		releasePeriod.processed = false
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
}