/**
 * Domain-level validators for the operations module.
 *
 * These are NOT form field validators (required, positive number, etc.).
 * These validate business rules that require knowledge of existing operations.
 *
 * Pure functions — no React, no side effects, testable in isolation.
 */

import type { Operation } from '../types'

/**
 * Calculates the net quantity held for a given symbol
 * based on all registered operations.
 */
export function computeHeldQuantity(symbol: string, operations: Operation[]): number {
  return operations
    .filter(op => op.symbol === symbol)
    .reduce((sum, op) => {
      return op.operationType === 'buy' ? sum + op.quantity : sum - op.quantity
    }, 0)
}

/**
 * Returns true if a sell operation would result in a negative position.
 *
 * This is a warning-level validation in the MVP — the position history may be
 * incomplete (e.g. partially imported), so the UI shows a warning instead of
 * blocking the submission entirely.
 */
export function wouldResultInNegativePosition(
  symbol: string,
  sellQuantity: number,
  existingOperations: Operation[],
): boolean {
  const held = computeHeldQuantity(symbol, existingOperations)
  return held - sellQuantity < 0
}
