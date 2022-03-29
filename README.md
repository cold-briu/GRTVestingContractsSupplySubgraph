# GRT Vesting Contracts Supply Subgraph

This subgraph aims to inform GRT circulating supply based on mint and burn, and vested addresses and it relase dates. To do that it uses vesting contracts addresses and once they are created a ReleasePeriod entities are being created containing the date where it'll be released and the ammount to be released on that specific timestamp. Then it's processing block by block to fetch current timestamp and once date is reached period not processed amount will be released and the ammount will be added to the circulating supply.

This subgraph rely's on 4 data sources:

### GraphToken: 
> 0xc944E90C64B2c07662A292be6244BDf05Cda44a7

	- event: Transfer(indexed address,indexed address,uint256)
    handler: handleTransfer

This data source maps to a single handler and it's intended to track the minting and burning of the erc20 GRT token.

### GraphTokenLockManager:
> 0xFCf78AC094288D7200cfdB367A8CD07108dFa128

	- event: TokenLockCreated(indexed address,indexed bytes32,indexed address,address,uint256,uint256,uint256,uint256,uint256,uint256,uint8)
	handler: handleTokenLockCreated

This data source maps to a single handler and takes care of the "Token Lock Wallet contract". These contracts store the vested GRT. This handler create an _LockWalletContract entity_ and creates a set of _ReleasePeriod entities_ those entities are related to a single _LockWalletContract entity_ and store information about the release of the vested GRT Tokens.

### GraphTokenLockSimple: Edge and Node
> 0x5785176048BEB00DcB6eC84A604d76E30E0666db

	- event: OwnershipTransferred(indexed address,indexed address)
	handler: handleOwnershipTransferred

This data source creates the _LockWalletContract entity_ for the Edge and Node lock wallet. This data source cannot be tracked with the "GraphTokenLockManager" datasource becouse wasn't deploy from that contract factory. However works the same way: creates the  _LockWalletContract entity_ and it's related _ReleasePeriod entities_.

To track the deployement of the contract this subgraph relay's on the "OwnershipTransferred" wich is called "form address zero" at the initialization of the contract.

### GraphTokenLockSimple: GRT
> 0x32Ec7A59549b9F114c9D7d8b21891d91Ae7F2ca1

	- event: OwnershipTransferred(indexed address,indexed address)
	handler: handleOwnershipTransferred

This data source works very similar to the GraphTokenLockSimple: Edge and Node: creates the  _LockWalletContract entity_ and it's related _ReleasePeriod entities_.

To track the deployement of the contract this subgraph relay's on the "OwnershipTransferred" wich is called "form address zero" at the initialization of the contract.