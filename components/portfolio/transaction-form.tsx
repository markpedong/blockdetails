'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { TRANSACTION_TYPES, type PortfolioTransaction, type TransactionType } from '@/lib/portfolio'
import { cn } from '@/lib/cn'

const label = (type: string) => type.replaceAll('_', ' ')
const localDate = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 23)

type TransactionFormProps = {
  open: boolean
  onClose: () => void
  onSave: (tx: PortfolioTransaction) => void
  initialTx?: PortfolioTransaction | null
  defaultAssetId?: string
}

export function TransactionForm({ open, onClose, onSave, initialTx, defaultAssetId }: TransactionFormProps) {
  const [assetId, setAssetId] = useState(initialTx?.assetId ?? defaultAssetId ?? 'bitcoin')
  const [type, setType] = useState<TransactionType>(initialTx?.type ?? 'BUY')
  const [quantity, setQuantity] = useState(initialTx?.quantity ?? '')
  const [price, setPrice] = useState(initialTx?.price ?? '')
  const [fees, setFees] = useState(initialTx?.fees ?? '0')
  const [date, setDate] = useState(initialTx?.date ? localDate(new Date(initialTx.date)) : localDate(new Date()))
  const [notes, setNotes] = useState(initialTx?.notes ?? '')
  const [error, setError] = useState('')

  const needsPrice = ['BUY', 'SELL', 'TRANSFER_IN'].includes(type)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!assetId.trim()) { setError('Asset ID is required.'); return }
    if (!quantity || parseFloat(quantity) <= 0) { setError('Quantity must be greater than zero.'); return }
    if (needsPrice && (!price || parseFloat(price) < 0)) { setError('Price is required for this transaction type.'); return }

    const tx: PortfolioTransaction = {
      id: initialTx?.id ?? crypto.randomUUID(),
      assetId: assetId.trim().toLowerCase(),
      type,
      quantity,
      price: needsPrice ? price : '0',
      fees,
      date: new Date(date).toISOString(),
      notes,
    }

    try {
      onSave(tx)
      onClose()
      // Reset form
      if (!initialTx) {
        setAssetId('bitcoin'); setType('BUY'); setQuantity(''); setPrice(''); setFees('0')
        setDate(localDate(new Date())); setNotes('')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save transaction.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={open ? onClose : () => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{initialTx ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-xs sm:col-span-2">
              Asset ID
              <Input required value={assetId} maxLength={100} placeholder="bitcoin" onChange={e => setAssetId(e.target.value)} />
              <span className="block text-muted-foreground">Use the ID from the coin URL (bitcoin, not BTC).</span>
            </label>
            <label className="space-y-1 text-xs">
              Type
              <select
                className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                value={type}
                onChange={e => {
                  const t = e.target.value as TransactionType
                  setType(t)
                  if (!['BUY', 'SELL', 'TRANSFER_IN'].includes(t)) setPrice('0')
                }}
              >
                {TRANSACTION_TYPES.map(t => <option key={t} value={t}>{label(t)}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-xs">
              Quantity
              <Input required inputMode="decimal" value={quantity} placeholder="0.00" onChange={e => setQuantity(e.target.value)} />
            </label>
            <label className="space-y-1 text-xs">
              {type === 'TRANSFER_IN' ? 'Acquisition cost per unit (USD)' : 'Price per unit (USD)'}
              <Input required={needsPrice} disabled={!needsPrice} inputMode="decimal" value={needsPrice ? price : '0'} placeholder="0.00" onChange={e => setPrice(e.target.value)} />
            </label>
            <label className="space-y-1 text-xs">
              Total fee (USD)
              <Input inputMode="decimal" value={fees} onChange={e => setFees(e.target.value)} />
            </label>
            <label className="space-y-1 text-xs">
              Date and time (local)
              <Input type="datetime-local" step="0.001" value={date} onChange={e => setDate(e.target.value)} />
            </label>
            <label className="space-y-1 text-xs sm:col-span-2">
              Notes (optional)
              <Input value={notes} maxLength={1000} onChange={e => setNotes(e.target.value)} />
            </label>
          </div>
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialTx ? 'Save Changes' : 'Add Transaction'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
