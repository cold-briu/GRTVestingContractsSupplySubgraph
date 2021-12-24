import { BigInt, Address, ethereum, Entity } from '@graphprotocol/graph-ts'
import { TokensReleased } from '../../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet'
import { GraphTokenLockWallet } from '../../../generated/templates/GraphTokenLockWallet/GraphTokenLockWallet'
import { createOrLoadGraphCirculatingSupply, createPeriodsForContract } from '../helpers'
import { ReleasePeriod } from '../../../generated/schema'


let GTLW = Address.fromString('0x5785176048BEB00DcB6eC84A604d76E30E0666db')
let GTLW2 = Address.fromString('0x32Ec7A59549b9F114c9D7d8b21891d91Ae7F2ca1')

export function handleBlock(block: ethereum.Block): void {

  let circulatingSupply = createOrLoadGraphCirculatingSupply();

  let blockHeight = block.number

  // Pushing manual contracts that not were added by the manager.
  if (!circulatingSupply.gtlwProcessed && blockHeight.gt(BigInt.fromI32(11481574))) {
    let gtlwContract = GraphTokenLockWallet.bind(GTLW)
    let startTimeTry = gtlwContract.try_startTime()
    let endTimeTry = gtlwContract.try_endTime()
    let periodsTry = gtlwContract.try_periods()
    let managedAmountTry = gtlwContract.try_managedAmount()

    if (!endTimeTry.reverted && !startTimeTry.reverted && !periodsTry.reverted && !managedAmountTry.reverted) {
      let endTime = endTimeTry.value
      let startTime = startTimeTry.value
      let periods = periodsTry.value
      let managedAmount = managedAmountTry.value

      createPeriodsForContract(GTLW, endTime, startTime, periods, managedAmount)

      circulatingSupply.gtlwProcessed = true
    }
  }

  if (!circulatingSupply.gtlw2Processed && blockHeight.gt(BigInt.fromI32(11481571))) {
    let gtlwContract = GraphTokenLockWallet.bind(GTLW)
    let startTimeTry = gtlwContract.try_startTime()
    let endTimeTry = gtlwContract.try_endTime()
    let periodsTry = gtlwContract.try_periods()
    let managedAmountTry = gtlwContract.try_managedAmount()

    if (!endTimeTry.reverted && !startTimeTry.reverted && !periodsTry.reverted && !managedAmountTry.reverted) {
      let endTime = endTimeTry.value
      let startTime = startTimeTry.value
      let periods = periodsTry.value
      let managedAmount = managedAmountTry.value

      createPeriodsForContract(GTLW2, endTime, startTime, periods, managedAmount)

      circulatingSupply.gtlw2Processed = true
    }

  }



  if (circulatingSupply.minPeriodToProcessDate < block.timestamp) {
    let newMin = BigInt.fromI32(0);
    let periodsToProcess = circulatingSupply.periodsToProcess;
    let filteredPeriodsToProcess = new Array<string>();

    for (let i = 0; i < periodsToProcess.length; i++) {

      let currentArray = periodsToProcess as Array<string>;

      let currentId = currentArray[i] as string;
      let currentPeriod = ReleasePeriod.load(currentId);

      if (currentPeriod.releaseDate < block.timestamp) {
        let prevToProcessAmount = circulatingSupply.periodsToProcessTotalAmount;
        let prevProcessedAmount = circulatingSupply.periodsProcessedTotalAmount;

        circulatingSupply.periodsToProcessTotalAmount = prevToProcessAmount.minus(currentPeriod.amount);
        circulatingSupply.periodsProcessedTotalAmount = prevProcessedAmount.plus(currentPeriod.amount);
        circulatingSupply.circulatingSupply = circulatingSupply.circulatingSupply.plus(currentPeriod.amount);
        circulatingSupply.periodsProcessed.push(currentPeriod.id);

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

export function handleTokensReleased(event: TokensReleased): void { }