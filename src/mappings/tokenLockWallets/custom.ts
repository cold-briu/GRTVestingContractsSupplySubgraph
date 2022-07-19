import {
  grt as grtModule,
  lockWalletContracts,
} from '../../modules'
import {
  TokensReleased,
  OwnershipTransferred
} from '../../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet'
import { address } from '@protofire/subgraph-toolkit';
import { log } from '@graphprotocol/graph-ts'
import { common } from './common';

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  // EAN & FoundationGenesisVesting

  if (address.isZeroAddress(event.params.previousOwner)) {
    let contract = lockWalletContracts.contract.getInitializedLockWalletContract(event.address)
    if (contract) {

      let values = lockWalletContracts.contract.getValuesFromContract(contract)
      if (values) {

        let contractAddress = event.address
        let periods = values.periods
        let managedAmount = values.managedAmount
        let startTime = values.startTime
        let endTime = values.endTime

        let grt = grtModule.createOrLoadGrt()
        grt = grtModule.lockGenesisExchanges(grt, managedAmount)
        /*
        * FIXME: performance issue
        * The grt entity is loaded at this scope, 
        * also, the grt entity is loaded and saved inside of createTokenWallet -> createPeriods for contract 
        */

        common.createTokenLockWallet(
          contractAddress,
          periods,
          managedAmount,
          startTime,
          endTime,
          lockWalletContracts.constants.CUSTOM_CONTRACT_TYPENAME,
        )
      }
    }
  }
}
