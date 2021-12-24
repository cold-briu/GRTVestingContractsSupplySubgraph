import { log } from '@graphprotocol/graph-ts'
import { TokenLockCreated } from '../../../generated/GraphTokenLockManager/GraphTokenLockManager'
import { createPeriodsForContract } from '../helpers'

export function handleTokenLockCreated(event: TokenLockCreated): void {
  let contractAddress = event.params.contractAddress
  let endTime = event.params.endTime
  let startTime = event.params.startTime
  let periods = event.params.periods
  let managedAmount = event.params.managedAmount

  createPeriodsForContract(contractAddress, endTime, startTime, periods, managedAmount)
}