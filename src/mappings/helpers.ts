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

  // Creating contract data for debugging purposes
  let contract = contracts.createContractData(
    contractId, periods, managedAmount, startTime, endTime
  )
  contract.save()

  log.warning('[RELEASE PERIODS] creating release periods for contract: {}', [contractId])
  for (let i = 0; i < periods.toI32(); i++) {
    periodReleaseDate = periodReleaseDate.plus(periodsDuration)

    let releasePeriod = releasePeriods.createReleasePeriod(contractId, i, periodReleaseDate, periodAmount)
    releasePeriod.save()

    let periodsToProcess = graphCirculatingSupply.periodsToProcess as string[]

    if (i == 0) {
      if (graphCirculatingSupply.minPeriodToProcessDate.isZero() ||
        graphCirculatingSupply.minPeriodToProcessDate > periodReleaseDate) { // FIXME: may use < instead?
        graphCirculatingSupply.minPeriodToProcessDate = periodReleaseDate
      }
    }

    periodsToProcess.push(releasePeriod.id)
    graphCirculatingSupply.periodsToProcess = periodsToProcess
  }

  /*
    for period in periods {
      let periodMount = managedAmount.div(periods)
      graphCirculatingSupply.periodsToProcessTotalAmount = graphCirculatingSupply.periodsToProcessTotalAmount.plus(periodAmount)
    }
  
    divide in same amounts and then sum up pieces
    is same as not divide at all
  
    for period in periods {
      // ...
    }
    graphCirculatingSupply.periodsToProcessTotalAmount.plus(managedAmount)
  }
  */

  graphCirculatingSupply.periodsToProcessTotalAmount = graphCirculatingSupply.periodsToProcessTotalAmount.plus(managedAmount)

  /*
  {
    let prevCirculatingSupply = graphCirculatingSupply.circulatingSupply
    graphCirculatingSupply.circulatingSupply = prevCirculatingSupply.minus(managedAmount)
  }
   is the same as
  {
    graphCirculatingSupply.circulatingSupply.minus(managedAmount)
  }
  */

  graphCirculatingSupply.circulatingSupply = graphCirculatingSupply.circulatingSupply.minus(managedAmount)

  graphCirculatingSupply.save()
  GraphTokenLockWallet.create(contractAddress)
}