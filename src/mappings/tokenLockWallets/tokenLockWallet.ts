import { BigInt, ethereum, log } from '@graphprotocol/graph-ts'
import { InitializeCall, TokensReleased } from '../../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet'
import { createPeriodsForContract } from '../helpers'
import { GraphTokenLockWallet } from '../../../generated/templates'
import {
  circulatingSupply as circulatingSupplyModule,
  lockWalletContracts, periodsLists, releasePeriods
} from '../../modules'

export function handleBlock(block: ethereum.Block): void {
  let circulatingSupply = circulatingSupplyModule.createOrLoadGraphCirculatingSupply();

  // is there something to process?
  if (circulatingSupply.minPeriodToProcessDate < block.timestamp) {

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

  let lockWallet = lockWalletContracts.custom.createCustomLockWallet(
    contractAddress, periods, managedAmount, startTime, endTime
  )
  lockWallet.save()

  createPeriodsForContract(
    lockWallet.id, periods, managedAmount, startTime, endTime
  )
  GraphTokenLockWallet.create(contractAddress)
}

export function handleTokensReleased(event: TokensReleased): void { }