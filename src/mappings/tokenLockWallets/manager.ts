import { common } from './common'
import { releasePeriods } from '../mappingHelpers'
import { BigInt, ethereum, log } from '@graphprotocol/graph-ts'
import { TokenLockCreated } from '../../../generated/GraphTokenLockManagerV1/GraphTokenLockManager'
import {
  grt as grtModule, lockWalletContracts, periodsLists, releasePeriods as releasePeriodsModule
} from '../../modules'

function isCuratorVesting(
  periods: BigInt,
  startTime: BigInt,
  endTime: BigInt,
  revocable: i32,
): boolean {
  return periods == BigInt.fromI32(16) &&
    startTime == BigInt.fromI32(1608224400) &&
    endTime == BigInt.fromI32(1734454800) &&
    revocable == 0
}

export function handleTokenLockCreated(event: TokenLockCreated): void {
  let contractAddress = event.params.contractAddress
  let periods = event.params.periods
  let managedAmount = event.params.managedAmount
  let startTime = event.params.startTime
  let endTime = event.params.endTime
  let revocable = event.params.revocable
  log.warning("!·!·!·!·!·[ revocable is {} ]", [revocable.toString()])

  /*
    * FIXME: performance issue
    * The grt entity is loaded at this scope, 
    * also, the grt entity is loaded and saved inside of createTokenWallet -> createPeriods for contract 
  */
  if (
    event.block.number < BigInt.fromI32(11705024
      || isCuratorVesting(periods, startTime, endTime, revocable))
  ) {
    let grt = grtModule.createOrLoadGrt()
    grt = grtModule.lockGenesisExchanges(grt, managedAmount)
  }



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

export function handleBlock(block: ethereum.Block): void {
  let pendingList = periodsLists.pending.getOrCreateList()

  // is there something to process?
  if (
    pendingList.nextDateToProcess < block.timestamp
  ) {
    let grt = grtModule.createOrLoadGrt();
    let processedList = periodsLists.processed.getOrCreateList()

    releasePeriods.releasePeriod(pendingList.nextPeriodToProcess, grt, pendingList, processedList)

    let pendingPeriodsKeys = pendingList.keys as Array<string>
    let filteredPendingPeriodKeys = new Array<string>()
    pendingList.nextDateToProcess = BigInt.fromI32(0)

    for (let index = 0; index < pendingPeriodsKeys.length; index++) {
      let periodKey = releasePeriodsModule.keys.decode(pendingPeriodsKeys[index])

      // is this period ready to process
      if (periodKey.date < block.timestamp) {
        releasePeriods.releasePeriod(periodKey.id, grt, pendingList, processedList)
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