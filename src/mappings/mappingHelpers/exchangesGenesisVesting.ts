import { Address, BigInt } from '@graphprotocol/graph-ts';
import { grt as grtModule, lockWalletContracts } from '../../modules';
import { common } from '../tokenLockWallets/common';

class ExchangeContract {
  id: Address
  periods: BigInt
  managedAmount: BigInt
  startTime: BigInt
  endTime: BigInt
}

const vestingListExchanges: ExchangeContract[] = [
  {
    id: Address.fromString('0x0000000000000000000000000000000000000001'),
    periods: BigInt.fromI32(48),
    managedAmount: BigInt.fromString('50000000000000000000000000'),
    startTime: BigInt.fromString('1522602000'),
    endTime: BigInt.fromString('1648832400'),
  },
  {
    id: Address.fromString('0x0000000000000000000000000000000000000002'),
    periods: BigInt.fromI32(1),
    managedAmount: BigInt.fromString('8000000000000000000000000'),
    startTime: BigInt.fromString('1608224400'),
    endTime: BigInt.fromString('1627146000'),
  },
  {
    id: Address.fromString('0x0000000000000000000000000000000000000003'),
    periods: BigInt.fromI32(48),
    managedAmount: BigInt.fromString('59000000000000000000000000'),
    startTime: BigInt.fromString('1543683600'),
    endTime: BigInt.fromString('1669914000'),
  },
  {
    id: Address.fromString('0x0000000000000000000000000000000000000004'),
    periods: BigInt.fromI32(1),
    managedAmount: BigInt.fromString('4000000000000000000000000'),
    startTime: BigInt.fromString('1608224400'),
    endTime: BigInt.fromString('1627146000'),
  },
  {
    id: Address.fromString('0x0000000000000000000000000000000000000005'),
    periods: BigInt.fromI32(48),
    managedAmount: BigInt.fromString('50000000000000000000000000'),
    startTime: BigInt.fromString('1527872400'),
    endTime: BigInt.fromString('1654102800'),
  },
  {
    id: Address.fromString('0x0000000000000000000000000000000000000006'),
    periods: BigInt.fromI32(1),
    managedAmount: BigInt.fromString('150000000000000000000000000'),
    startTime: BigInt.fromString('1527872400'),
    endTime: BigInt.fromString('1554102800'),
  },
  {
    id: Address.fromString('0x0000000000000000000000000000000000000007'),
    periods: BigInt.fromI32(1),
    managedAmount: BigInt.fromString('133333334000000000000000000'),
    startTime: BigInt.fromString('2535197937'),
    endTime: BigInt.fromString('2566733937'),
  },
]

export namespace exchangesGenesisVesting {
  // coinbase custody
  export function createVesting(): void {

    let grt = grtModule.createOrLoadGrt()

    for (let index = 0; index < vestingListExchanges.length; index++) {

      const params = vestingListExchanges[index];
      let contractAddress = params.id
      let periods = params.periods
      let managedAmount = params.managedAmount
      let startTime = params.startTime
      let endTime = params.endTime

      grt = grtModule.lockGenesisExchanges(grt, managedAmount)

      common.createTokenLockWallet(
        contractAddress,
        periods,
        managedAmount,
        startTime,
        endTime,
        lockWalletContracts.constants.EXCHANGE_CONTRACT_TYPENAME,
      )
    }

    grt.save()

  }
}