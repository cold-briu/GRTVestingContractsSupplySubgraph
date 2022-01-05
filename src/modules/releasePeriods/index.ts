import { BigInt } from "@graphprotocol/graph-ts";
import { ReleasePeriod } from "../../../generated/schema";

export namespace releasePeriods {
	export function createReleasePeriod(
		contractId: string, index: i32,
		periodReleaseDate: BigInt, periodAmount: BigInt
	): ReleasePeriod {
		let releasePeriod = new ReleasePeriod(contractId + "-" + index.toString());
		releasePeriod.releaseDate = periodReleaseDate
		releasePeriod.amount = periodAmount
		releasePeriod.contract = contractId
		releasePeriod.processed = false
		return releasePeriod as ReleasePeriod
	}

}