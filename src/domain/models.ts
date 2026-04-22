/**
 * Domain Model — Single source of truth for business entities.
 *
 * This layer defines the canonical shape of every domain entity.
 * Module-specific types MUST derive from these (re-export or extend),
 * never redefine the same concept.
 *
 * Rules:
 * - No React, no IO, no side effects
 * - Only pure type definitions and domain constants
 * - If two modules share a concept, it lives here
 */

// ─── Asset Domain ─────────────────────────────────────────────────────────────

/** Classification of tradable assets. */
export type AssetType = 'stock' | 'fii' | 'bdr' | 'etf' | 'fixed-income' | 'crypto'

/** Monetary direction. */
export type MoneyDirection = 'income' | 'expense'

/** Buy/sell direction for investment operations. */
export type OperationDirection = 'buy' | 'sell'

// ─── Cross-module entity relationships ────────────────────────────────────────
//
// This map documents which domain entities feed into which modules.
// It is the conceptual basis for the cache invalidation rules in
// src/services/api/invalidationRules.ts.
//
//   Operations ──► Portfolio (positions are derived from operations)
//   Operations ──► Reports   (analytics aggregate operation data)
//   Portfolio  ──► Reports   (summary, distribution, time series)
//   Transactions ──► Dashboard (recent transactions + summary metrics)
//
// Any mutation on a "source" entity MUST invalidate all "derived" caches.
// ──────────────────────────────────────────────────────────────────────────────

// ─── Domain constants ─────────────────────────────────────────────────────────

/** Default stale times (ms) by data volatility. */
export const STALE_TIMES = {
  /** Data that changes on every page load (transactions list). */
  realtime: 1 * 60 * 1000, // 1 min
  /** Data derived from user actions (portfolio, dashboard summary). */
  derived: 2 * 60 * 1000, // 2 min
  /** Analytical/aggregate data (reports, chart). */
  analytical: 5 * 60 * 1000, // 5 min
  /** Config-like data (settings, tenant). */
  config: 5 * 60 * 1000, // 5 min
} as const
