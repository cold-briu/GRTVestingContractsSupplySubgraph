import { Transfer } from '../../generated/GraphToken/GraphToken'
import { circulatingSupply } from '../modules'
import { address } from "@protofire/subgraph-toolkit";


export function handleTransfer(event: Transfer): void {

  let graphCirculatingSupply = circulatingSupply.createOrLoadGraphCirculatingSupply()

  let to = event.params.to
  let from = event.params.from
  let value = event.params.value

  // if adress from y deployer, mint but not circulate
  if (address.isZeroAddress(from)) {

    graphCirculatingSupply = circulatingSupply.mintTokens(
      graphCirculatingSupply, value
    )

  } else if (address.isZeroAddress(to)) {

    graphCirculatingSupply = circulatingSupply.burnTokens(
      graphCirculatingSupply, value
    )
  }
  graphCirculatingSupply.save()
}
