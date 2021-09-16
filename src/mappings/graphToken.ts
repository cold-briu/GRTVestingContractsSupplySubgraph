import { Transfer } from '../../generated/GraphToken/GraphToken'
import { createOrLoadGraphCirculatingSupply } from './helpers'

/**
 * @dev handleTransfer
 * - updates graphNetwork, creates if needed
 * - updates accounts, creates if needed
 */
export function handleTransfer(event: Transfer): void {
  // The first transaction ever emitted in the network is the minting of GRT
  // And with this, we instantiate GraphNetwork // TODO - can probably LOAD here now
  let graphCirculatingSupply = createOrLoadGraphCirculatingSupply()

  let to = event.params.to
  let from = event.params.from
  let value = event.params.value

  // Mint Transfer
  if (from.toHexString() == '0x0000000000000000000000000000000000000000') {
    graphCirculatingSupply.totalSupply = graphCirculatingSupply.totalSupply.plus(value)
    graphCirculatingSupply.circulatingSupply = graphCirculatingSupply.circulatingSupply.plus(value)
    graphCirculatingSupply.save()

  // Burn Transfer
  } else if (to.toHexString() == '0x0000000000000000000000000000000000000000') {
    graphCirculatingSupply.totalSupply = graphCirculatingSupply.totalSupply.minus(value)
    graphCirculatingSupply.circulatingSupply = graphCirculatingSupply.circulatingSupply.minus(value)
    graphCirculatingSupply.save()
    
  } 
}
