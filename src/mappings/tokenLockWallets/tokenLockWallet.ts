import { BigInt, log, ethereum, Address } from '@graphprotocol/graph-ts'
import { InitializeCall, TokensReleased } from '../../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet'
import { createOrLoadGraphCirculatingSupply, createPeriodsForContract } from '../helpers'
import { ReleasePeriod } from '../../../generated/schema'

export function handleBlock(block: ethereum.Block): void {

  let circulatingSupply = createOrLoadGraphCirculatingSupply();

  if (circulatingSupply.minPeriodToProcessDate < block.timestamp) {
    let newMin = BigInt.fromI32(0);
    let periodsToProcess = circulatingSupply.periodsToProcess;
    let filteredPeriodsToProcess = new Array<string>();

    if (!periodsToProcess) {
      log.warning("PeriodsToProcess must be declared", [])
      return
    }

    for (let i = 0; i < periodsToProcess.length; i++) {

      let currentArray = periodsToProcess as Array<string>;

      let currentId = currentArray[i] as string;
      let currentPeriod = ReleasePeriod.load(currentId);

      if (!currentPeriod) {
        currentPeriod = new ReleasePeriod(currentId)
        return
      }

      if (currentPeriod && currentPeriod.releaseDate < block.timestamp) {
        let prevToProcessAmount = circulatingSupply.periodsToProcessTotalAmount;
        let prevProcessedAmount = circulatingSupply.periodsProcessedTotalAmount;

        circulatingSupply.periodsToProcessTotalAmount = prevToProcessAmount.minus(currentPeriod.amount);
        circulatingSupply.periodsProcessedTotalAmount = prevProcessedAmount.plus(currentPeriod.amount);
        circulatingSupply.circulatingSupply = circulatingSupply.circulatingSupply.plus(currentPeriod.amount);
        let pp = circulatingSupply.periodsProcessed

        if (pp && Array.isArray(pp)) {
          pp.push(currentPeriod.id)
        }
        circulatingSupply.periodsProcessed = pp

        currentPeriod.processed = true;
      } else {
        filteredPeriodsToProcess.push(currentPeriod.id);
        if (newMin.isZero()) {
          newMin = currentPeriod.releaseDate;
        } else {
          if (currentPeriod.releaseDate.lt(newMin)) {
            newMin = currentPeriod.releaseDate;
          }
        }
      }

      currentPeriod.save();
    }
    circulatingSupply.minPeriodToProcessDate = newMin;
    circulatingSupply.periodsToProcess = filteredPeriodsToProcess;
    circulatingSupply.save();
  }
}

export function handleInitialize(call: InitializeCall): void {

  let periods = call.inputs._periods
  let startTime = call.inputs._startTime
  let endTime = call.inputs._endTime
  let managedAmount = call.inputs._managedAmount

  let contract = call.to

  createPeriodsForContract(contract, endTime, startTime, periods, managedAmount)
}

export function handleTokensReleased(event: TokensReleased): void { }