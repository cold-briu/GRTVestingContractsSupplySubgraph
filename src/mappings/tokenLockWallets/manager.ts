import { BigInt, ethereum } from '@graphprotocol/graph-ts'
import { TokenLockCreated } from '../../../generated/GraphTokenLockManager/GraphTokenLockManager'
import { circulatingSupply as circulatingSupplyModule, lockWalletContracts, periodsLists, releasePeriods } from '../../modules'
import { common } from './common'

export function handleTokenLockCreated(event: TokenLockCreated): void {
  let contractAddress = event.params.contractAddress
  let periods = event.params.periods
  let managedAmount = event.params.managedAmount
  let startTime = event.params.startTime
  let endTime = event.params.endTime

  common.createTokenLockWallet(
    contractAddress, 
    periods, 
    managedAmount, 
    startTime, 
    endTime,
    false)
}

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

        let contractId = period.id.split("-")[0]
        let contract = lockWalletContracts.safeLoadLockWalletContract(contractId)

        contract = lockWalletContracts.mutators.increaseReleaseAmount(contract, period.amount)
        contract = lockWalletContracts.mutators.increasePassedPeriods(contract)
        contract = lockWalletContracts.mutators.updateavAilableAmount(contract)
        contract = lockWalletContracts.mutators.updateavTotalLocked(contract)
        contract.save()

        circulatingSupply = circulatingSupplyModule.mutations.increaseCirculatingSupply(
          circulatingSupply, period.amount
        )

        pendingList = periodsLists.pending.mutations.decreaseAmount(
          pendingList, period.amount
        )

        processedList = periodsLists.processed.mutations.increaseAmount(
          processedList, period.amount
        )

        // TODO set as processed

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