import { Address, BigInt } from "@graphprotocol/graph-ts"
import { GraphTokenLockWallet } from "../../../generated/templates"
import { lockWalletContracts } from "../../modules"
import { createPeriodsForContract } from "../mappingHelpers"
import { log } from '@graphprotocol/graph-ts'

export namespace common {
  const firstBLock: BigInt = BigInt.fromI32(11446769)

  export function isFirstBlock(blockNumber: BigInt): bool {
    log.warning(": FIRST BLOCK : {}", [firstBLock.toString()])
    log.warning(": ASKED BLOCK : {} - RESULT {}", [blockNumber.toString(), firstBLock == blockNumber ? 'true' : 'false'])

    return firstBLock == blockNumber
  }

  export function createTokenLockWallet(
    contractAddress: Address,
    periods: BigInt,
    managedAmount: BigInt,
    startTime: BigInt,
    endTime: BigInt,
    isFactory: boolean): void 
  {
    let lockWallet = isFactory 
      ? lockWalletContracts.createFactoryLockWallet(
        contractAddress, periods, managedAmount, startTime, endTime
      ) :
      lockWalletContracts.createCustomLockWallet(
        contractAddress, periods, managedAmount, startTime, endTime
      )
    lockWallet.save()
  
    createPeriodsForContract(
      lockWallet.id, periods, managedAmount, endTime, startTime
    )
  
    GraphTokenLockWallet.create(contractAddress)
  }
}