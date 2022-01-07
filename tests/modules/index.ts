import { creation as LockWalletContratCustomCreation } from "./LockWalletContract/custom/creation.test";

import { creation as GraphCirculatingSupplyCreation } from "./GraphCirculatingSupply/creation.test";
import { createPeriods as GraphCirculatingSupplyCreatePeriods } from "./GraphCirculatingSupply/createPeriods.test";

import { creation as PeriodsListCreation } from "./PeriodsList/pending/creation.test";
// import { createPeriods as PeriodsListCreatePeriods } from "./PeriodsList/pending/createPeriods.test";


import { circulatingSupplyPreBlock as _circulatingSupplyPreBlock } from "./circulatingSupplyPreBlock"
import { contractDataCreation as _contractDataCreation } from "./contractDataCreation"
import { releasePeriodsCreation as _releasePeriodsCreation } from "./releasePeriodsCreation"
import {
	circulatingSupplyPeriodsCreation as _circulatingSupplyPeriodsCreation
} from "./circulatingSupplyPeriodsCreation"

export namespace modules {
	export namespace LockWalletContract {
		export namespace custom {
			export let creation = LockWalletContratCustomCreation
		}
	}

	export namespace GraphCirculatingSupply {
		export let creation = GraphCirculatingSupplyCreation
		export let createPeriods = GraphCirculatingSupplyCreatePeriods
	}

	export namespace PeriodsList {
		export namespace pending {
			export let creation = PeriodsListCreation
			// export let createPeriods = PeriodsListcreatePeriods

		}

	}

	export let contractDataCreation = _contractDataCreation
	export let releasePeriodsCreation = _releasePeriodsCreation
	export let circulatingSupplyPeriodsCreation = _circulatingSupplyPeriodsCreation
	export let circulatingSupplyPreBlock = _circulatingSupplyPreBlock
}