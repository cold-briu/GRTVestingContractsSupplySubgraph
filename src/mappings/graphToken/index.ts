import { Transfer } from '../../../generated/GraphToken/GraphToken'
import { circulatingSupply } from '../../modules'
import { address } from "@protofire/subgraph-toolkit";
import { onstart } from '../initializer'
import { common } from '../tokenLockWallets/common';

export function handleTransfer(event: Transfer): void {
  if (common.isFirstBlock(event.block.number)) {
    onstart.loadDefautlExchanges()
  }
  
	let isFromZero = address.isZeroAddress(event.params.from)
	let isToZero = address.isZeroAddress(event.params.to)

	// Check this condition to avoid load entity in regular transfers
	if (isFromZero || isToZero) {
		let graphCirculatingSupply = circulatingSupply.createOrLoadGraphCirculatingSupply()

		if (isFromZero) {
			graphCirculatingSupply = circulatingSupply.mintTokens(
				graphCirculatingSupply, event.params.value
			)

		} else if (isToZero) {
			graphCirculatingSupply = circulatingSupply.burnTokens(
				graphCirculatingSupply, event.params.value
			)
		}

		graphCirculatingSupply.save()
	}

}
