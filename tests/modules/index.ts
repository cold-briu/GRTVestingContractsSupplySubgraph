import { creation as LockWalletContratCreation } from "./LockWalletContract/creation.test";

import { creation as GraphCirculatingSupplyCreation } from "./GraphCirculatingSupply/creation.test";
import { createPeriods as GraphCirculatingSupplyCreatePeriods } from "./GraphCirculatingSupply/createPeriods.test";
import { releasePeriods as GraphCirculatingSupplyReleasePeriods } from "./GraphCirculatingSupply/releasePeriods.test";
import { mint as GraphCirculatingSupplyMint } from "./GraphCirculatingSupply/mint.test";
import { burn as GraphCirculatingSupplyBurn } from "./GraphCirculatingSupply/burn.test";

import { creation as PendingPeriodsListCreation } from "./PeriodsList/pending/creation.test";
import { createPeriods as PendingPeriodsListCreatePeriods } from "./PeriodsList/pending/createPeriods.test";
import { releasePeriods as PendingPeriodsListReleasePeriods } from "./PeriodsList/pending/releasePeriods.test";

import { releasePeriods as ProcessedListReleasePeriods } from "./PeriodsList/processed/releasePeriods.test";
export namespace modules {
	export namespace LockWalletContract {
		export let creation = LockWalletContratCreation
	}

	export namespace GraphCirculatingSupply {
		export let creation = GraphCirculatingSupplyCreation
		export let createPeriods = GraphCirculatingSupplyCreatePeriods
		export let releasePeriods = GraphCirculatingSupplyReleasePeriods
		export let mint = GraphCirculatingSupplyMint
		export let burn = GraphCirculatingSupplyBurn
	}

	export namespace PeriodsList {
		export namespace pending {
			export let creation = PendingPeriodsListCreation
			export let createPeriods = PendingPeriodsListCreatePeriods
			export let releasePeriods = PendingPeriodsListReleasePeriods
		}

		export namespace processed {
			export let releasePeriods = ProcessedListReleasePeriods
		}
	}
}