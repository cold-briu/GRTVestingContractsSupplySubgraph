import { Transfer } from '../../../generated/GraphToken/GraphToken'
import { grt as grtModule } from '../../modules'
import { address } from "@protofire/subgraph-toolkit";
import { transferGenesisVesting } from '../mappingHelpers'
import { exchangesGenesisVesting } from '../mappingHelpers'
import { common } from '../tokenLockWallets/common';

export function handleTransfer(event: Transfer): void {
	if (common.isFirstBlock(event.block.number)) {
		exchangesGenesisVesting.createVesting()
	}
	if (transferGenesisVesting.helpers.isGenesisTransaction(
		event.transaction.hash.toHexString()
	)) {
		transferGenesisVesting.lockGenesisTransaction(event.params.value)
	}

	let isFromZero = address.isZeroAddress(event.params.from)
	let isToZero = address.isZeroAddress(event.params.to)

	// Check this condition to avoid load entity in regular transfers
	if (isFromZero || isToZero) {
		let grt = grtModule.createOrLoadGrt()

		if (isFromZero) {
			grt = grtModule.mintTokens(
				grt, event.params.value
			)

		} else if (isToZero) {
			grt = grtModule.burnTokens(
				grt, event.params.value
			)
		}

		grt.save()
	}

}
