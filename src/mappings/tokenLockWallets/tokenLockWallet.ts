import { address } from '@protofire/subgraph-toolkit';
import { BigInt, ethereum, log } from '@graphprotocol/graph-ts'
import { createPeriodsForContract } from '../helpers'
import { GraphTokenLockWallet } from '../../../generated/templates'
import {
  TokensReleased, InitializeCall, OwnershipTransferred
} from '../../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet'
import {
  circulatingSupply as circulatingSupplyModule,
  lockWalletContracts, periodsLists, releasePeriods
} from '../../modules'


export function handleBlock(block: ethereum.Block): void {
  let circulatingSupply = circulatingSupplyModule.createOrLoadGraphCirculatingSupply();

  // is there something to process?
  if (
    circulatingSupply.minPeriodToProcessDate < block.timestamp
  ) {

    let newMin = BigInt.fromI32(0);
    let pendingList = periodsLists.pending.getOrCreateList()
    let processedList = periodsLists.processed.getOrCreateList()
    let pendingPeriodsKeys = pendingList.keys as Array<string>
    let filteredPendingPeriodKeys = new Array<string>()

    for (let index = 0; index < pendingPeriodsKeys.length; index++) {

      let periodKey = pendingPeriodsKeys[index];
      let decodeResult = releasePeriods.keys.decode(periodKey)
      let periodId = decodeResult[0]
      let releaseDate = BigInt.fromString(decodeResult[1])

      // if is ready to process
      if (releaseDate < block.timestamp) {

        // updated processed: Boolean and list: string
        let period = releasePeriods.safeLoadPeriod(periodId)
        period = releasePeriods.mutations.setAsProcessed(period)

        circulatingSupply = circulatingSupplyModule.mutations.increaseCirculatingSupply(
          circulatingSupply, period.amount
        )

        pendingList = periodsLists.pending.mutations.decreaseAmount(
          pendingList, period.amount
        )

        processedList = periodsLists.processed.mutations.increaseAmount(
          processedList, period.amount
        )

      } else {
        newMin = circulatingSupplyModule.helpers.setNewMinProcessDate(
          newMin, releaseDate
        )
        // If this periodKey wasn't processed, save it into filteredPendingPeriods list
        filteredPendingPeriodKeys.push(periodKey)
      }
    }

    circulatingSupply.minPeriodToProcessDate = newMin;
    circulatingSupply.save();

    pendingList.keys = filteredPendingPeriodKeys;
    pendingList.save()

    processedList.save()
  }
}

export function handleInitialize(call: InitializeCall): void {

  let contractAddress = call.to
  let periods = call.inputs._periods
  let managedAmount = call.inputs._managedAmount
  let startTime = call.inputs._startTime
  let endTime = call.inputs._endTime

  log.warning("::: CALL HANDLER ::: handleInitialize : triggered", [])

  let lockWallet = lockWalletContracts.custom.createCustomLockWallet(
    contractAddress, periods, managedAmount, startTime, endTime
  )
  lockWallet.save()

  createPeriodsForContract(
    lockWallet.id, periods, managedAmount, startTime, endTime
  )
  GraphTokenLockWallet.create(contractAddress)
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {

  if (address.isZeroAddress(event.params.previousOwner)) {

    let contract = lockWalletContracts.custom.getInitializedLockWalletContract(event.address)
    if (contract) {

      let values = lockWalletContracts.custom.getValuesFromContract(contract)
      if (values) {

        let contractAddress = event.address
        let periods = values[0]
        let managedAmount = values[1]
        let startTime = values[2]
        let endTime = values[3]

        let lockWallet = lockWalletContracts.custom.createCustomLockWallet(
          contractAddress, periods, managedAmount, startTime, endTime
        )
        lockWallet.save()

        createPeriodsForContract(
          lockWallet.id, periods, managedAmount, startTime, endTime
        )
        GraphTokenLockWallet.create(contractAddress)
      }

    }
  }
}

export function handleTokensReleased(event: TokensReleased): void { }