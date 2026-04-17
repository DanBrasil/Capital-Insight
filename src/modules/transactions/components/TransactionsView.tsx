import { useState } from 'react'

import { useTenant } from '@/tenants'

import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { TransactionModal } from './TransactionModal'
import { TransactionsFilters } from './TransactionsFilters'
import { TransactionsHeader } from './TransactionsHeader'
import { TransactionsTable } from './TransactionsTable'
import { useDeleteTransaction } from '../hooks/useDeleteTransaction'
import { useTransactionFilters } from '../hooks/useTransactionFilters'
import { useTransactions } from '../hooks/useTransactions'
import type { Transaction } from '../types'

/**
 * Main transactions orchestrator.
 *
 * Owns:
 * - filter state (via useTransactionFilters)
 * - modal open/close state
 * - which transaction is being edited
 * - which transaction id is pending deletion
 *
 * Does NOT: fetch data directly, format values, or render form fields.
 */
export function TransactionsView() {
  const { tenant } = useTenant()
  const locale = tenant.appConfig.locale
  const currencyCode = tenant.appConfig.currencyCode

  // ── Filters ──────────────────────────────────────────────────────────────
  const { filters, setFilter, resetFilters, hasActiveFilters } = useTransactionFilters()

  // ── Data — used only for the header count, table manages its own query ──
  const { data } = useTransactions(filters)

  // ── Modal state ───────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  function openCreateModal() {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  function openEditModal(transaction: Transaction) {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingTransaction(null)
  }

  // ── Delete state ──────────────────────────────────────────────────────────
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const deleteMutation = useDeleteTransaction()

  function handleDeleteRequest(id: string) {
    setDeletingId(id)
  }

  function handleDeleteConfirm() {
    if (!deletingId) return
    deleteMutation.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
    })
  }

  function handleDeleteCancel() {
    setDeletingId(null)
  }

  return (
    <div className="space-y-5">
      <TransactionsHeader totalCount={data?.length} onAddNew={openCreateModal} />

      <TransactionsFilters
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onFilterChange={setFilter}
        onReset={resetFilters}
      />

      <TransactionsTable
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        locale={locale}
        currencyCode={currencyCode}
        onEdit={openEditModal}
        onDelete={handleDeleteRequest}
        onClearFilters={resetFilters}
        onAddNew={openCreateModal}
      />

      <TransactionModal
        isOpen={isModalOpen}
        editingTransaction={editingTransaction}
        onClose={closeModal}
      />

      <DeleteConfirmDialog
        isOpen={deletingId !== null}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  )
}
