import { BigInt, ethereum } from '@graphprotocol/graph-ts'

import { InitializeCall, TokensReleased } from '../../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet'
import { createPeriodsForContract } from '../helpers'
import { ReleasePeriod } from '../../../generated/schema'
import { circulatingSupply as circulatingSupplyModule } from '../../modules'
import { GraphTokenLockWallet } from '../../../generated/templates'

export function handleBlock(block: ethereum.Block): void {
  let circulatingSupply = circulatingSupplyModule.createOrLoadGraphCirculatingSupply();

  if (circulatingSupply.minPeriodToProcessDate < block.timestamp) { // something to process
    let newMin = BigInt.fromI32(0);
    let periodsToProcess = circulatingSupply.periodsToProcess as Array<string>
    // periodsToProcess Array<Tuples<periodId: string, releaseDate:BigInt>>
    let filteredPeriodsToProcess = new Array<string>();

    for (let i = 0; i < periodsToProcess.length; i++) {

      let currentId = periodsToProcess[i]

      let currentPeriod = ReleasePeriod.load(currentId); // time cost
      if (!currentPeriod) {
        currentPeriod = new ReleasePeriod(currentId)
        return
      }

      // TODO: analyze following logic

      if (currentPeriod && currentPeriod.releaseDate < block.timestamp) { // find which one to process
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

  // After researching noticed couldn't get contract addresses that's why using transaction's hash
  let contractAddress = call.to

  createPeriodsForContract(contractAddress, endTime, startTime, periods, managedAmount)
  GraphTokenLockWallet.create(contractAddress)
}

export function handleTokensReleased(event: TokensReleased): void { }