import { Button } from '@/components/ui'
import { Modal } from '@/components/feedback'

interface DeleteConfirmDialogProps {
  isOpen: boolean
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Generic destructive action confirmation dialog.
 * Has no knowledge of what entity is being deleted — pure UI.
 */
export function DeleteConfirmDialog({
  isOpen,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Confirmar exclusão">
      <div className="space-y-4">
        <p className="text-sm text-foreground">
          Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
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
