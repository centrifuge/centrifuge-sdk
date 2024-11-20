import { Price, Currency, Perquintill } from '../../utils/BigInt.js'

import { TrancheSnapshot } from '../../queries/trancheSnapshots.js'

export const mockTrancheSnapshots: TrancheSnapshot[] = [
  {
    id: 'tranche-1',
    price: Price.fromFloat('1.00'),
    timestamp: '2024-01-01T00:00:00Z',
    trancheId: 'senior',
    poolId: 'pool-1',
    tokenSupply: new Currency(0n, 6),
    pool: {
      currency: {
        decimals: 6,
        symbol: 'USDC',
      },
    },
    outstandingInvestOrders: new Currency(0n, 6),
    outstandingRedeemOrders: new Currency(0n, 6),
    fulfilledInvestOrders: new Currency(0n, 6),
    fulfilledRedeemOrders: new Currency(0n, 6),
    yield7DaysAnnualized: null,
    yield30DaysAnnualized: null,
    yield90DaysAnnualized: null,
    yieldSinceInception: new Perquintill(0n),
    yieldMTD: null,
    yieldQTD: null,
    yieldYTD: null,
    yieldSinceLastPeriod: null,
  },
  {
    id: 'tranche-2',
    price: Price.fromFloat('1.12'),
    timestamp: '2024-01-01T00:00:00Z',
    trancheId: 'junior',
    poolId: 'pool-1',
    tokenSupply: new Currency(0n, 6),
    pool: {
      currency: {
        decimals: 6,
        symbol: 'USDC',
      },
    },
    outstandingInvestOrders: new Currency(0n, 6),
    outstandingRedeemOrders: new Currency(0n, 6),
    fulfilledInvestOrders: new Currency(0n, 6),
    fulfilledRedeemOrders: new Currency(0n, 6),
    yield7DaysAnnualized: null,
    yield30DaysAnnualized: null,
    yield90DaysAnnualized: null,
    yieldSinceInception: new Perquintill(0n),
    yieldMTD: null,
    yieldQTD: null,
    yieldYTD: null,
    yieldSinceLastPeriod: null,
  },
  {
    id: 'tranche-1',
    price: Price.fromFloat('1.00'),
    timestamp: '2024-01-02T00:00:00Z',
    trancheId: 'senior',
    poolId: 'pool-1',
    tokenSupply: new Currency(0n, 6),
    pool: {
      currency: {
        decimals: 6,
        symbol: 'USDC',
      },
    },
    outstandingInvestOrders: new Currency(0n, 6),
    outstandingRedeemOrders: new Currency(0n, 6),
    fulfilledInvestOrders: new Currency(0n, 6),
    fulfilledRedeemOrders: new Currency(0n, 6),
    yield7DaysAnnualized: null,
    yield30DaysAnnualized: null,
    yield90DaysAnnualized: null,
    yieldSinceInception: new Perquintill(0n),
    yieldMTD: null,
    yieldQTD: null,
    yieldYTD: null,
    yieldSinceLastPeriod: null,
  },
  {
    id: 'tranche-2',
    price: Price.fromFloat('1.12'),
    timestamp: '2024-01-02T00:00:00Z',
    trancheId: 'junior',
    poolId: 'pool-1',
    tokenSupply: new Currency(0n, 6),
    pool: {
      currency: {
        decimals: 6,
        symbol: 'USDC',
      },
    },
    outstandingInvestOrders: new Currency(0n, 6),
    outstandingRedeemOrders: new Currency(0n, 6),
    fulfilledInvestOrders: new Currency(0n, 6),
    fulfilledRedeemOrders: new Currency(0n, 6),
    yield7DaysAnnualized: null,
    yield30DaysAnnualized: null,
    yield90DaysAnnualized: null,
    yieldSinceInception: new Perquintill(0n),
    yieldMTD: null,
    yieldQTD: null,
    yieldYTD: null,
    yieldSinceLastPeriod: null,
  },
]
