import { Entity } from '../Entity.js'
import { Centrifuge } from '../Centrifuge.js'
import { PoolSnapshotFilter, poolSnapshotsPostProcess, poolSnapshotsQuery } from '../queries/poolSnapshots.js'
import {
  TrancheSnapshotFilter,
  trancheSnapshotsPostProcess,
  trancheSnapshotsQuery,
} from '../queries/trancheSnapshots.js'
import {
  poolFeeTransactionQuery,
  poolFeeTransactionPostProcess,
  PoolFeeTransactionFilter,
} from '../queries/poolFeeTransactions.js'
import { combineLatest } from 'rxjs'
import { processor } from './Processor.js'

import { map } from 'rxjs'
import {
  BalanceSheetReport,
  CashflowReport,
  InvestorTransactionsReport,
  ProfitAndLossReport,
  ReportFilter,
  Report,
  DataReport,
  DataReportFilter,
  InvestorTransactionsReportFilter,
  AssetTransactionReport,
  AssetTransactionReportFilter,
  TokenPriceReport,
  TokenPriceReportFilter,
  FeeTransactionReport,
  FeeTransactionReportFilter,
} from '../types/reports.js'
import { Query } from '../types/query.js'
import {
  PoolFeeSnapshotFilter,
  poolFeeSnapshotQuery,
  poolFeeSnapshotsPostProcess,
} from '../queries/poolFeeSnapshots.js'
import { Pool } from '../Pool.js'
import { investorTransactionsPostProcess } from '../queries/investorTransactions.js'
import { InvestorTransactionFilter, investorTransactionsQuery } from '../queries/investorTransactions.js'
import {
  AssetTransactionFilter,
  assetTransactionsPostProcess,
  assetTransactionsQuery,
} from '../queries/assetTransactions.js'

export class Reports extends Entity {
  constructor(
    centrifuge: Centrifuge,
    public pool: Pool
  ) {
    super(centrifuge, ['reports', pool.id])
  }

  balanceSheet(filter?: ReportFilter) {
    return this._generateReport<BalanceSheetReport>('balanceSheet', filter)
  }

  cashflow(filter?: ReportFilter) {
    return this._generateReport<CashflowReport>('cashflow', filter)
  }

  profitAndLoss(filter?: ReportFilter) {
    return this._generateReport<ProfitAndLossReport>('profitAndLoss', filter)
  }

  investorTransactions(filter?: InvestorTransactionsReportFilter) {
    return this._generateReport<InvestorTransactionsReport>('investorTransactions', filter)
  }

  assetTransactions(filter?: AssetTransactionReportFilter) {
    return this._generateReport<AssetTransactionReport>('assetTransactions', filter)
  }

  tokenPrice(filter?: TokenPriceReportFilter) {
    return this._generateReport<TokenPriceReport>('tokenPrice', filter)
  }

  feeTransactions(filter?: FeeTransactionReportFilter) {
    return this._generateReport<FeeTransactionReport>('feeTransactions', filter)
  }

  /**
   * Reports are split into two types:
   * - A `Report` is a standard report: balanceSheet, cashflow, profitAndLoss
   * - A `DataReport` is a custom report: investorTransactions, assetTransactions, feeTransactions, tokenPrice
   */
  _generateReport<T>(type: Report, filter?: ReportFilter): Query<T[]>
  _generateReport<T>(type: DataReport, filter?: DataReportFilter): Query<T[]>
  _generateReport<T>(type: string, filter?: Record<string, any>) {
    return this._query(
      [
        type,
        filter?.from,
        filter?.to,
        filter?.groupBy,
        filter?.address,
        filter?.network,
        filter?.tokenId,
        filter?.transactionType,
        filter?.assetId,
      ],
      () => {
        const { from, to, ...restFilter } = filter ?? {}
        const dateFilter = {
          timestamp: {
            greaterThan: from,
            lessThanOrEqualTo: to && `${to.split('T')[0]}T23:59:59.999Z`,
          },
        }

        const metadata$ = this.pool.metadata()

        const poolSnapshots$ = this.poolSnapshotsQuery({
          ...dateFilter,
          poolId: { equalTo: this.pool.id },
        })
        const trancheSnapshots$ = this.trancheSnapshotsQuery({
          ...dateFilter,
          tranche: { poolId: { equalTo: this.pool.id } },
        })
        const poolFeeSnapshots$ = this.poolFeeSnapshotsQuery({
          ...dateFilter,
          poolFeeId: { includes: this.pool.id },
        })
        const investorTransactions$ = this.investorTransactionsQuery({
          ...dateFilter,
          poolId: { equalTo: this.pool.id },
        })
        const assetTransactions$ = this.assetTransactionsQuery({
          ...dateFilter,
          poolId: { equalTo: this.pool.id },
        })
        const poolFeeTransactions$ = this.poolFeeTransactionsQuery({
          ...dateFilter,
          poolFee: { poolId: { equalTo: this.pool.id } },
        })

        switch (type) {
          case 'balanceSheet':
            return combineLatest([poolSnapshots$, trancheSnapshots$]).pipe(
              map(
                ([poolSnapshots, trancheSnapshots]) =>
                  processor.balanceSheet({ poolSnapshots, trancheSnapshots }, restFilter) as T[]
              )
            )
          case 'cashflow':
            return combineLatest([poolSnapshots$, poolFeeSnapshots$, metadata$]).pipe(
              map(
                ([poolSnapshots, poolFeeSnapshots, metadata]) =>
                  processor.cashflow({ poolSnapshots, poolFeeSnapshots, metadata }, restFilter) as T[]
              )
            )
          case 'profitAndLoss':
            return combineLatest([poolSnapshots$, poolFeeSnapshots$, metadata$]).pipe(
              map(
                ([poolSnapshots, poolFeeSnapshots, metadata]) =>
                  processor.profitAndLoss({ poolSnapshots, poolFeeSnapshots, metadata }, restFilter) as T[]
              )
            )
          case 'investorTransactions':
            return combineLatest([investorTransactions$, metadata$]).pipe(
              map(
                ([investorTransactions]) => processor.investorTransactions({ investorTransactions }, restFilter) as T[]
              )
            )
          case 'assetTransactions':
            return combineLatest([assetTransactions$, metadata$]).pipe(
              map(([assetTransactions]) => processor.assetTransactions({ assetTransactions }, restFilter) as T[])
            )
          case 'feeTransactions':
            return combineLatest([poolFeeTransactions$]).pipe(
              map(([poolFeeTransactions]) => processor.feeTransactions({ poolFeeTransactions }, restFilter) as T[])
            )
          case 'tokenPrice':
            return combineLatest([trancheSnapshots$]).pipe(
              map(([trancheSnapshots]) => processor.tokenPrice({ trancheSnapshots }, restFilter) as T[])
            )
          default:
            throw new Error(`Unsupported report type: ${type}`)
        }
      },
      {
        valueCacheTime: 120,
      }
    )
  }

  poolFeeSnapshotsQuery(filter?: PoolFeeSnapshotFilter) {
    return this._root._queryIndexer(poolFeeSnapshotQuery, { filter }, poolFeeSnapshotsPostProcess)
  }

  poolSnapshotsQuery(filter?: PoolSnapshotFilter) {
    return this._root._queryIndexer(poolSnapshotsQuery, { filter }, poolSnapshotsPostProcess)
  }

  trancheSnapshotsQuery(filter?: TrancheSnapshotFilter) {
    return this._root._queryIndexer(trancheSnapshotsQuery, { filter }, trancheSnapshotsPostProcess)
  }

  investorTransactionsQuery(filter?: InvestorTransactionFilter) {
    return this._root._queryIndexer(investorTransactionsQuery, { filter }, investorTransactionsPostProcess)
  }

  assetTransactionsQuery(filter?: AssetTransactionFilter) {
    return this._root._queryIndexer(assetTransactionsQuery, { filter }, assetTransactionsPostProcess)
  }

  poolFeeTransactionsQuery(filter?: PoolFeeTransactionFilter) {
    return this._root._queryIndexer(poolFeeTransactionQuery, { filter }, poolFeeTransactionPostProcess)
  }
}
