import { TokenLockCreated } from '../../../generated/GraphTokenLockManager/GraphTokenLockManager'
import { lockWalletContracts } from '../../modules'
import { createPeriodsForContract } from '../helpers'

export function handleTokenLockCreated(event: TokenLockCreated): void {
  let contractAddress = event.params.contractAddress
  let periods = event.params.periods
  let managedAmount = event.params.managedAmount
  let startTime = event.params.startTime
  let endTime = event.params.endTime

  let lockWallet = lockWalletContracts.createFactoryLockWallet(
    contractAddress, periods, managedAmount, startTime, endTime
  )
  lockWallet.save()

  createPeriodsForContract(
    lockWallet.id, periods, managedAmount, endTime, startTime
  )
}