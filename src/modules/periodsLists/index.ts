import { PendingPeriods, ProcessedPeriods } from "../../../generated/schema";

export namespace periodsLists {

	export namespace constants {
		export let PENDING_LISTS_ID = "0x0"
		export let PROCESSED_LISTS_ID = "0x1"
	}

	export namespace pending {
		export function getOrCreatePendingPeriodsList(): PendingPeriods {
			let entity = PendingPeriods.load(constants.PENDING_LISTS_ID)
			if (entity == null) {
				entity = new PendingPeriods(constants.PENDING_LISTS_ID)
			}
			return entity as PendingPeriods
		}
	}

	export namespace processed {
		export function getOrCreateProcessedPeriodsList(): ProcessedPeriods {
			let entity = PendingPeriods.load(constants.PROCESSED_LISTS_ID)
			if (entity == null) {
				entity = new PendingPeriods(constants.PROCESSED_LISTS_ID)
			}
			return entity as ProcessedPeriods
		}
	}

}