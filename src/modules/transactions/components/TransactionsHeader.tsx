import { Button } from '@/components/ui'

interface TransactionsHeaderProps {
  totalCount?: number
  onAddNew: () => void
}

export function TransactionsHeader({ totalCount, onAddNew }: TransactionsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-foreground">Transações</h1>
        {totalCount !== undefined && (
          <p className="text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? 'registro' : 'registros'}
          </p>
        )}
      </div>

      <Button variant="primary" size="md" onClick={onAddNew}>
        + Nova transação
      </Button>
    </div>
  )
}
