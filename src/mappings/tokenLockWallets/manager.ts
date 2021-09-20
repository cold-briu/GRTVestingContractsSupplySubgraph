import { log } from '@graphprotocol/graph-ts'
import { TokenLockCreated } from '../../../generated/GraphTokenLockManager/GraphTokenLockManager'
import { ReleasePeriod } from '../../../generated/schema'
import { createOrLoadGraphCirculatingSupply } from '../helpers'
import { GraphTokenLockWallet } from '../../../generated/templates'

export function handleTokenLockCreated(event: TokenLockCreated): void {
  let graphCirculatingSupply = createOrLoadGraphCirculatingSupply()
  let id = event.params.contractAddress.toHexString()
  let releaseDuration = event.params.endTime.minus(event.params.startTime)
  let periodsDuration = releaseDuration.div(event.params.periods)
  let periodReleaseDate = event.params.startTime
  let periodAmount = event.params.managedAmount.div(event.params.periods)
  let periods = event.params.periods.toI32()

  log.warning('[RELEASE PERIODS] creating release periods for contract: {}', [id])
  for(let i = 0; i < periods; i++) {
    let periodId = id + "-" + i.toString();
    let releasePeriod = new ReleasePeriod(periodId);
    let periodsToProcess = graphCirculatingSupply.periodsToProcess
    periodReleaseDate = periodReleaseDate.plus(periodsDuration)
    releasePeriod.releaseDate = periodReleaseDate;
    releasePeriod.amount = periodAmount;
    releasePeriod.processed = false;
    releasePeriod.save();

    if (i == 0){
      if(graphCirculatingSupply.minPeriodToProcessDate.isZero() || 
      graphCirculatingSupply.minPeriodToProcessDate > periodReleaseDate) {
        graphCirculatingSupply.minPeriodToProcessDate = periodReleaseDate;
      }
    }

    periodsToProcess.push(periodId)
    graphCirculatingSupply.periodsToProcess = periodsToProcess
    graphCirculatingSupply.periodsToProcessTotalAmount = graphCirculatingSupply.periodsToProcessTotalAmount.plus(periodAmount)
  }

  let prevCirculatingSupply = graphCirculatingSupply.circulatingSupply

  graphCirculatingSupply.circulatingSupply = prevCirculatingSupply.minus(event.params.managedAmount)
  graphCirculatingSupply.save()

  GraphTokenLockWallet.create(event.params.contractAddress)

}