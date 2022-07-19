import { Address, BigInt } from "@graphprotocol/graph-ts"
import { GraphTokenLockWallet } from "../../../generated/templates"
import { lockWalletContracts } from "../../modules"
import { releasePeriods } from "../mappingHelpers"

export namespace common {
  const firstBLock: BigInt = BigInt.fromI32(11446769)

  export function isFirstBlock(blockNumber: BigInt): bool {
    return firstBLock == blockNumber
  }

  export function createTokenLockWallet(
    contractAddress: Address,
    periods: BigInt,
    managedAmount: BigInt,
    startTime: BigInt,
    endTime: BigInt,
    walletType: string): void {
    let lockWallet = lockWalletContracts.createLockWallet(
      contractAddress, periods, managedAmount, startTime, endTime, walletType
    )
    lockWallet.save()

    releasePeriods.createPeriodsForContract(
      lockWallet.id, periods, managedAmount, startTime, endTime
    )

    GraphTokenLockWallet.create(contractAddress)
  }
}