import { Button } from '@/components/ui'
import { Modal } from '@/components/feedback'

interface DeleteOperationDialogProps {
  isOpen: boolean
  operationLabel: string
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Confirmation dialog for deleting a single operation.
 * Receives the operation label (symbol + type) so the user can confirm
 * exactly which record will be deleted.
 */
export function DeleteOperationDialog({
  isOpen,
  operationLabel,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteOperationDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Confirmar exclusão">
      <div className="space-y-4">
        <p className="text-sm text-foreground">
          Tem certeza que deseja excluir a operação{' '}
          <span className="font-semibold">{operationLabel}</span>?
        </p>
        <p className="text-sm text-muted-foreground">
          Esta ação não pode ser desfeita. A carteira será recalculada automaticamente.
        </p>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" size="md" onClick={onCancel} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            isLoading={isDeleting}
            onClick={onConfirm}
          >
            Excluir
          </Button>
        </div>
      </div>
    </Modal>
  )
}
