import { Transfer } from '../../generated/GraphToken/GraphToken'
import { circulatingSupply } from '../modules'
import { address } from "@protofire/subgraph-toolkit";


export function handleTransfer(event: Transfer): void {
  let graphCirculatingSupply = circulatingSupply.createOrLoadGraphCirculatingSupply()
  graphCirculatingSupply.save()

  let to = event.params.to
  let from = event.params.from
  let value = event.params.value

  // Mint Transfer
  if (address.isZeroAddress(from)) {
    graphCirculatingSupply.totalSupply = graphCirculatingSupply.totalSupply.plus(value)
    graphCirculatingSupply.circulatingSupply = graphCirculatingSupply.circulatingSupply.plus(value)
    // Burn Transfer
  } else if (address.isZeroAddress(to)) {
    graphCirculatingSupply.totalSupply = graphCirculatingSupply.totalSupply.minus(value)
    graphCirculatingSupply.circulatingSupply = graphCirculatingSupply.circulatingSupply.minus(value)
  }
  graphCirculatingSupply.save()
}
