import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { ReleasePeriod } from '../../generated/schema'
import { GraphTokenLockWallet } from '../../generated/templates'
import { contracts, circulatingSupply, releasePeriods } from '../modules'

export function createPeriodsForContract(contractAddress: Address, endTime: BigInt, startTime: BigInt, periods: BigInt, managedAmount: BigInt): void {
  let graphCirculatingSupply = circulatingSupply.createOrLoadGraphCirculatingSupply()
  graphCirculatingSupply.save()

  let contractId = contractAddress.toHexString()
  let releaseDuration = endTime.minus(startTime)
  let periodsDuration = releaseDuration.div(periods)
  let periodReleaseDate = startTime
  let periodAmount = managedAmount.div(periods)
  let periodsI32 = periods.toI32()

  // Creating contract data for debugging purposes
  let contract = contracts.createContractData(
    contractId, periods, managedAmount, startTime, endTime
  )
  contract.save()

  log.warning('[RELEASE PERIODS] creating release periods for contract: {}', [contractId])
  for (let i = 0; i < periodsI32; i++) {

    let periodsToProcess = graphCirculatingSupply.periodsToProcess
    periodReleaseDate = periodReleaseDate.plus(periodsDuration)

    let releasePeriod = releasePeriods.createReleasePeriod(
      contractId, i, periodReleaseDate, periodAmount
    )
    releasePeriod.save()

    if (i == 0) {
      if (graphCirculatingSupply.minPeriodToProcessDate.isZero() ||
        graphCirculatingSupply.minPeriodToProcessDate > periodReleaseDate) {
        graphCirculatingSupply.minPeriodToProcessDate = periodReleaseDate
      }
    }

    if (periodsToProcess && Array.isArray(periodsToProcess)) {
      periodsToProcess.push(releasePeriod.id)
    }
    graphCirculatingSupply.periodsToProcess = periodsToProcess
    graphCirculatingSupply.periodsToProcessTotalAmount = graphCirculatingSupply.periodsToProcessTotalAmount.plus(periodAmount)
  }

  let prevCirculatingSupply = graphCirculatingSupply.circulatingSupply

  graphCirculatingSupply.circulatingSupply = prevCirculatingSupply.minus(managedAmount)
  graphCirculatingSupply.save()

  GraphTokenLockWallet.create(contractAddress)

}