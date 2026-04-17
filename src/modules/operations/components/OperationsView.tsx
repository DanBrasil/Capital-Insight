import { useState } from 'react'

import { useTenant } from '@/tenants'

import { useDeleteOperation } from '../hooks/useDeleteOperation'
import { useOperationFilters } from '../hooks/useOperationFilters'
import type { Operation } from '../types'
import { DeleteOperationDialog } from './DeleteOperationDialog'
import { OperationModal } from './OperationModal'
import { OperationsFilters } from './OperationsFilters'
import { OperationsHeader } from './OperationsHeader'
import { OperationsTable } from './OperationsTable'

/**
 * Operations module orchestrator.
 *
 * Owns:
 * - filter state (via useOperationFilters)
 * - modal open/close state
 * - which operation is being edited
 * - which operation id is pending deletion
 *
 * Does NOT: fetch data directly, format values, or render form fields.
 * OperationsTable owns its own data fetching.
 */
export function OperationsView() {
  const { tenant } = useTenant()
  const locale = tenant.appConfig.locale
  const currencyCode = tenant.appConfig.currencyCode

  // ── Filters ──────────────────────────────────────────────────────────────
  const { filters, setFilter, resetFilters, hasActiveFilters } = useOperationFilters()

  // ── Modal state ───────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOperation, setEditingOperation] = useState<Operation | null>(null)

  function openCreateModal() {
    setEditingOperation(null)
    setIsModalOpen(true)
  }

  function openEditModal(operation: Operation) {
    setEditingOperation(operation)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingOperation(null)
  }

  // ── Delete state ──────────────────────────────────────────────────────────
  const [deletingOperation, setDeletingOperation] = useState<Operation | null>(null)
  const deleteMutation = useDeleteOperation()

  function confirmDelete() {
    if (!deletingOperation) return
    deleteMutation.mutate(deletingOperation.id, {
      onSuccess: () => setDeletingOperation(null),
    })
  }

  function cancelDelete() {
    if (!deleteMutation.isPending) setDeletingOperation(null)
  }

  const deleteLabel = deletingOperation
    ? `${deletingOperation.symbol} — ${deletingOperation.operationType === 'buy' ? 'Compra' : 'Venda'}`
    : ''

  return (
    <div className="space-y-6">
      <OperationsHeader totalCount={0} onNew={openCreateModal} />

      <OperationsFilters
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onFilterChange={setFilter}
        onReset={resetFilters}
      />

      <OperationsTable
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        locale={locale}
        currencyCode={currencyCode}
        onEdit={openEditModal}
        onDelete={setDeletingOperation}
        onClearFilters={resetFilters}
        onAddNew={openCreateModal}
      />

      <OperationModal
        isOpen={isModalOpen}
        editingOperation={editingOperation}
        onClose={closeModal}
      />

      <DeleteOperationDialog
        isOpen={Boolean(deletingOperation)}
        operationLabel={deleteLabel}
        isDeleting={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}

export { type Operation }
