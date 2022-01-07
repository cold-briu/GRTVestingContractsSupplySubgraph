import { creation as lockWalletContratCustomCreation } from "./LockWalletContract/custom/creation.test";
import { creation as GraphCirculatingSupplyCreation } from "./GraphCirculatingSupply/creation.test";

import { circulatingSupplyPreBlock as _circulatingSupplyPreBlock } from "./circulatingSupplyPreBlock"
import { contractDataCreation as _contractDataCreation } from "./contractDataCreation"
import { releasePeriodsCreation as _releasePeriodsCreation } from "./releasePeriodsCreation"
import {
	circulatingSupplyPeriodsCreation as _circulatingSupplyPeriodsCreation
} from "./circulatingSupplyPeriodsCreation"

export namespace modules {
	export namespace LockWalletContract {
		export namespace custom {
			export let creation = lockWalletContratCustomCreation
		}
	}

	export namespace GraphCirculatingSupply {
		export let creation = GraphCirculatingSupplyCreation
	}

	export let contractDataCreation = _contractDataCreation
	export let releasePeriodsCreation = _releasePeriodsCreation
	export let circulatingSupplyPeriodsCreation = _circulatingSupplyPeriodsCreation
	export let circulatingSupplyPreBlock = _circulatingSupplyPreBlock
}