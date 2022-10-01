import { BigInt } from '@graphprotocol/graph-ts';
import { Contract, Subscription, Transfer, Close } from '../generated/Contract/Contract';
import { subscriptionList as subscription, transferList as transfer } from '../generated/schema';

export function handleClose(event: Close): void {

	let id = event.params.sub.toHex();

	let entity = subscription.load(id);

	if (!entity) {
		entity = new subscription(id);
	}

	entity.active = false;

	entity.txn = event.transaction.hash;

	entity.save();
}

export function handleSub(event: Subscription): void {
	let contract = Contract.bind(event.address);

	let id = event.params.sub.toHex();

	let entity = subscription.load(id);

	if (!entity) {
		entity = new subscription(id);
	}

	entity.active = true;

	entity.txn = event.transaction.hash;

	entity.timestamp = event.block.timestamp;

	entity.sub = event.params.sub;

	entity.plan = event.params.plan;

	entity.boss = event.params.boss;

	entity.user = event.params.user;

	entity.cost = event.params.cost;

	entity.token = event.params.token;

	entity.token_name = contract.getTokenName(event.params.token);

	entity.token_symbol = contract.getTokenSymbol(event.params.token);

	entity.token_decimal = BigInt.fromI32(contract.getTokenDecimal(event.params.token));

	entity.save();
}

export function handleTransfer(event: Transfer): void {
	let contract = Contract.bind(event.address);

	let id = event.transaction.hash.toHex();

	let entity = transfer.load(id);

	if (!entity) {
		entity = new transfer(id);
	}

	entity.txn = event.transaction.hash;

	entity.timestamp = event.block.timestamp;

	entity.sub = event.params.sub;

	entity.plan = contract.subscriptions(event.params.sub).getPlan();

	entity.boss = event.params.boss;

	entity.user = event.params.user;

	entity.amount = event.params.amount;

	entity.token = event.params.token;

	entity.token_name = contract.getTokenName(event.params.token);

	entity.token_symbol = contract.getTokenSymbol(event.params.token);

	entity.token_decimal = BigInt.fromI32(contract.getTokenDecimal(event.params.token))

	entity.token_balance = contract.userBalance(event.params.user, event.params.token);

	entity.token_allowance = contract.userAllowance(event.params.user, event.params.token);

	entity.save();
}
