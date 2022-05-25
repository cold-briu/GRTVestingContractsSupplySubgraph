import { BigInt, ethereum } from '@graphprotocol/graph-ts'
import { TokenLockCreated } from '../../../generated/GraphTokenLockManagerV1/GraphTokenLockManager'
import { Grt, PendingPeriods, ProcessedPeriods } from '../../../generated/schema'
import { grt as grtModule, lockWalletContracts, periodsLists, releasePeriods } from '../../modules'
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
    lockWalletContracts.constants.FACTORY_CONTRACT_TYPENAME)
}


/*
1. load pending list
2. check is sometihing to process
3. load and process period
4. load and update contract
 todo: define and optimize flow
*/

// TODO: HOW TO pendingPeriodsKeys TO BE SORTED?

export function releasePeriod(periodId: string, _grt: Grt, pendingList: PendingPeriods, processedList: ProcessedPeriods): void {
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

  _grt = grtModule.mutations.increaseLiquidSupply(
    _grt, period.amount
  )

  pendingList = periodsLists.pending.mutations.decreaseAmount(
    pendingList, period.amount
  )

  processedList = periodsLists.processed.mutations.increaseAmount(
    processedList, period.amount
  )
  // TODO set as processed
}

export function handleBlock(block: ethereum.Block): void {
  let pendingList = periodsLists.pending.getOrCreateList()

  // is there something to process?
  if (
    pendingList.nextDateToProcess < block.timestamp
  ) {
    let grt = grtModule.createOrLoadGrt();
    let processedList = periodsLists.processed.getOrCreateList()

    releasePeriod(pendingList.nextPeriodToProcess, grt, pendingList, processedList)

    let pendingPeriodsKeys = pendingList.keys as Array<string>
    let filteredPendingPeriodKeys = new Array<string>()
    pendingList.nextDateToProcess = BigInt.fromI32(0)

    for (let index = 0; index < pendingPeriodsKeys.length; index++) {
      let periodKey = releasePeriods.keys.decode(pendingPeriodsKeys[index])

      // is this period ready to process
      if (periodKey.date < block.timestamp) {
        releasePeriod(periodKey.id, grt, pendingList, processedList)
      } else {
        pendingList = periodsLists.pending.mutations.updateNextToProcess(
          pendingList, periodKey.date, periodKey.id
        )
        // If this periodKey wasn't processed, save it into filteredPendingPeriods list
        filteredPendingPeriodKeys.push(pendingPeriodsKeys[index])
      }
    }

    pendingList.keys = filteredPendingPeriodKeys;
    pendingList.save()
    processedList.save()
  }
}