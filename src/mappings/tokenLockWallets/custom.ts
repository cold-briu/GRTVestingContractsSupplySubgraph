import {
  lockWalletContracts,
} from '../../modules'
import {
  TokensReleased,
  InitializeCall,
  OwnershipTransferred
} from '../../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet'
import { address } from '@protofire/subgraph-toolkit';
import { log } from '@graphprotocol/graph-ts'
import { common } from './common';

export function handleInitialize(call: InitializeCall): void {
  let contractAddress = call.to
  let periods = call.inputs._periods
  let managedAmount = call.inputs._managedAmount
  let startTime = call.inputs._startTime
  let endTime = call.inputs._endTime

  log.warning("::: CALL HANDLER ::: handleInitialize : triggered", [])

  common.createTokenLockWallet(
    contractAddress,
    periods,
    managedAmount,
    startTime,
    endTime,
    lockWalletContracts.constants.CUSTOM_CONTRACT_TYPENAME,
  )
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  log.warning("::: EVENT HANDLER ::: handleOwnershipTransferred : triggered", [])

  if (address.isZeroAddress(event.params.previousOwner)) {
    let contract = lockWalletContracts.contract.getInitializedLockWalletContract(event.address)
    if (contract) {
      log.warning("::: EVENT HANDLER ::: handleOwnershipTransferred : initialized contract", [])

      let values = lockWalletContracts.contract.getValuesFromContract(contract)
      if (values) {
        log.warning("::: EVENT HANDLER ::: handleOwnershipTransferred : values fetched", [])

        let contractAddress = event.address
        let periods = values.periods
        let managedAmount = values.managedAmount
        let startTime = values.startTime
        let endTime = values.endTime

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

export function handleTokensReleased(event: TokensReleased): void {
  log.warning("::: EVENT HANDLER ::: handleTokensReleased : triggered", [])
}
