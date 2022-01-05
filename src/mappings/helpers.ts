import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { ContractData, GraphCirculatingSupply, ReleasePeriod } from '../../generated/schema'
import { GraphTokenLockWallet } from '../../generated/templates'
import { contracts } from '../modules'

export function createOrLoadGraphCirculatingSupply(): GraphCirculatingSupply {
  let graphCirculatingSupply = GraphCirculatingSupply.load('1')
  if (graphCirculatingSupply == null) {
    graphCirculatingSupply = new GraphCirculatingSupply('1')
    graphCirculatingSupply.totalSupply = BigInt.fromI32(0)
    graphCirculatingSupply.circulatingSupply = BigInt.fromI32(0)
    graphCirculatingSupply.periodsToProcess = []
    graphCirculatingSupply.periodsToProcessTotalAmount = BigInt.fromI32(0)
    graphCirculatingSupply.periodsProcessed = []
    graphCirculatingSupply.periodsProcessedTotalAmount = BigInt.fromI32(0)
    graphCirculatingSupply.minPeriodToProcessDate = BigInt.fromI32(0)

    graphCirculatingSupply.save()
  }
  return graphCirculatingSupply as GraphCirculatingSupply
}

export function createPeriodsForContract(contractAddress: Address, endTime: BigInt, startTime: BigInt, periods: BigInt, managedAmount: BigInt): void {
  let graphCirculatingSupply = createOrLoadGraphCirculatingSupply()
  let id = contractAddress.toHexString()
  let releaseDuration = endTime.minus(startTime)
  let periodsDuration = releaseDuration.div(periods)
  let periodReleaseDate = startTime
  let periodAmount = managedAmount.div(periods)
  let periodsI32 = periods.toI32()

  // Creating contract data for debugging purposes
  let contract = contracts.createContractData(
    id, periods, managedAmount, startTime, endTime
  )
  contract.save()

  log.warning('[RELEASE PERIODS] creating release periods for contract: {}', [id])
  for (let i = 0; i < periodsI32; i++) {
    let periodId = id + "-" + i.toString();
    let releasePeriod = new ReleasePeriod(periodId);
    let periodsToProcess = graphCirculatingSupply.periodsToProcess
    periodReleaseDate = periodReleaseDate.plus(periodsDuration)
    releasePeriod.releaseDate = periodReleaseDate
    releasePeriod.amount = periodAmount
    releasePeriod.contract = id
    releasePeriod.processed = false
    releasePeriod.save()

    if (i == 0) {
      if (graphCirculatingSupply.minPeriodToProcessDate.isZero() ||
        graphCirculatingSupply.minPeriodToProcessDate > periodReleaseDate) {
        graphCirculatingSupply.minPeriodToProcessDate = periodReleaseDate
      }
    }

    if (periodsToProcess && Array.isArray(periodsToProcess)) {
      periodsToProcess.push(periodId)
    }
    graphCirculatingSupply.periodsToProcess = periodsToProcess
    graphCirculatingSupply.periodsToProcessTotalAmount = graphCirculatingSupply.periodsToProcessTotalAmount.plus(periodAmount)
  }

  let prevCirculatingSupply = graphCirculatingSupply.circulatingSupply

  graphCirculatingSupply.circulatingSupply = prevCirculatingSupply.minus(managedAmount)
  graphCirculatingSupply.save()

  GraphTokenLockWallet.create(contractAddress)

}