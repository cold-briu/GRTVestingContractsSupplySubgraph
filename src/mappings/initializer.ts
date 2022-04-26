import { Address, BigInt } from '@graphprotocol/graph-ts';
import { createTokenLock } from './tokenLockWallets/manager';

interface ExchangeContract {
  id: Address
  periods: BigInt
  managedAmount: BigInt
  startTime: BigInt
  endTime: BigInt
}

const vestingListExchanges: ExchangeContract[] = [
  {
    id: Address.fromHexString('0x0000000000000000000000000000000000000000'),
    periods: BigInt.fromI32(48),
    managedAmount: BigInt.fromString('50000000'),
    startTime: BigInt.fromString('1522602000'),
    endTime: BigInt.fromString('1648832400'),
  },
  {
    id: Address.fromHexString('0x0000000000000000000000000000000000000000'),
    periods: BigInt.fromI32(1),
    managedAmount: BigInt.fromString('8000000'),
    startTime: BigInt.fromString('1608224400'),
    endTime: BigInt.fromString('1627146000'),
  },
  {
    id: Address.fromHexString('0x0000000000000000000000000000000000000000'),
    periods: BigInt.fromI32(48),
    managedAmount: BigInt.fromString('59000000'),
    startTime: BigInt.fromString('1543683600'),
    endTime: BigInt.fromString('1669914000'),
  },
  {
    id: Address.fromHexString('0x0000000000000000000000000000000000000000'),
    periods: BigInt.fromI32(1),
    managedAmount: BigInt.fromString('4000000'),
    startTime: BigInt.fromString('1608224400'),
    endTime: BigInt.fromString('1627146000'),
  },
  {
    id: Address.fromHexString('0x0000000000000000000000000000000000000000'),
    periods: BigInt.fromI32(48),
    managedAmount: BigInt.fromString('50000000'),
    startTime: BigInt.fromString('1527872400'),
    endTime: BigInt.fromString('1654102800'),
  },
]

export namespace onstart {
  export function loadDefautlExchanges(): void {
    vestingListExchanges.forEach((params: ExchangeContract): void => {
      let contractAddress = params.id
      let periods = params.periods
      let managedAmount = params.managedAmount
      let startTime = params.startTime
      let endTime = params.endTime
  
      createTokenLock(contractAddress, periods, managedAmount, startTime, endTime)
    })
  }
}