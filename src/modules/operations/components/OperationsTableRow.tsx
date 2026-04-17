import { Badge } from '@/components/ui'

import type { Operation } from '../types'
import {
  formatAssetType,
  formatCurrency,
  formatDate,
  formatOperationType,
  formatQuantity,
} from '../utils/formatters'

interface OperationsTableRowProps {
  operation: Operation
  locale: string
  currencyCode: string
  onEdit: (operation: Operation) => void
  onDelete: (operation: Operation) => void
}

/**
 * Pure presentational row. Receives a fully typed Operation — performs zero arithmetic.
 * Columns are progressively revealed as viewport grows.
 */
export function OperationsTableRow({
  operation: op,
  locale,
  currencyCode,
  onEdit,
  onDelete,
}: OperationsTableRowProps) {
  const fmt = (v: number) => formatCurrency(v, locale, currencyCode)
  const isBuy = op.operationType === 'buy'

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
      {/* Data — hidden on mobile */}
      <td className="hidden sm:table-cell px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
        {formatDate(op.operationDate, locale)}
      </td>

      {/* Ativo — always visible */}
      <td className="px-4 py-3">
        <p className="font-semibold text-foreground text-sm">{op.symbol}</p>
        <p className="text-xs text-muted-foreground">{op.assetName}</p>
      </td>

      {/* Tipo — always visible */}
      <td className="px-4 py-3">
        <Badge variant={isBuy ? 'success' : 'error'}>{formatOperationType(op.operationType)}</Badge>
      </td>

      {/* Tipo de Ativo — hidden on mobile */}
      <td className="hidden md:table-cell px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
        {formatAssetType(op.assetType)}
      </td>

      {/* Quantidade — hidden on mobile */}
      <td className="hidden sm:table-cell px-4 py-3 text-sm text-right tabular-nums text-foreground">
        {formatQuantity(op.quantity)}
      </td>

      {/* Preço Unit. — hidden on mobile + tablet */}
      <td className="hidden lg:table-cell px-4 py-3 text-sm text-right tabular-nums text-muted-foreground">
        {fmt(op.unitPrice)}
      </td>

      {/* Taxas — hidden on mobile + tablet */}
      <td className="hidden lg:table-cell px-4 py-3 text-sm text-right tabular-nums text-muted-foreground">
        {fmt(op.fees)}
      </td>

      {/* Total — always visible */}
      <td className="px-4 py-3 text-sm text-right tabular-nums font-medium text-foreground">
        {fmt(op.totalAmount)}
      </td>

      {/* Ações — always visible */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(op)}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={`Editar ${op.symbol}`}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(op)}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-error/10 hover:text-error"
            aria-label={`Excluir ${op.symbol}`}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}
