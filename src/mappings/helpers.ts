import { BigInt } from '@graphprotocol/graph-ts'
import { GraphCirculatingSupply } from '../../generated/schema'

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