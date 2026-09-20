'use client'

import { useState } from 'react'
import { usePortfolio } from '@/components/portfolio-provider'
import { formatUnits, MONEY_SCALE, calculatePortfolio, getPortfolioTransactions } from '@/lib/portfolio'
import { cn } from '@/lib/cn'
import { Plus, Pencil, Trash2, Check, X, FolderPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const money = (v: bigint | null) => v === null ? '—' : `$${formatUnits(v, MONEY_SCALE, 2)}`

type SidebarProps = {
  selectedId: string | null  // null = Overview
  onSelect: (id: string | null) => void
  isMobileMenuOpen?: boolean
  onMobileMenuClose?: () => void
}

export function PortfolioSidebar({ selectedId, onSelect, isMobileMenuOpen, onMobileMenuClose }: SidebarProps) {
  const { data, addPortfolio, renamePortfolio, deletePortfolio } = usePortfolio()
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleCreate = () => {
    if (!newName.trim()) return
    const p = addPortfolio(newName.trim())
    setNewName('')
    setShowCreate(false)
    onSelect(p.id)
  }

  const handleRename = () => {
    if (!editingId || !editName.trim()) return
    renamePortfolio(editingId, editName.trim())
    setEditingId(null)
    setEditName('')
  }

  const handleDelete = () => {
    if (!confirmDeleteId) return
    deletePortfolio(confirmDeleteId)
    if (selectedId === confirmDeleteId) onSelect(null)
    setConfirmDeleteId(null)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Overview button */}
      <div className="p-3">
        <button
          onClick={() => { onSelect(null); onMobileMenuClose?.() }}
          className={cn(
            'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            selectedId === null
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          )}
          aria-current={selectedId === null ? 'page' : undefined}
        >
          <div className="flex items-center justify-between">
            <span>Overview</span>
          </div>
        </button>
      </div>

      {/* My Portfolios */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            My Portfolios ({data.portfolios.length})
          </span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowCreate(true)} aria-label="Create portfolio">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        {data.portfolios.length === 0 && (
          <p className="text-xs text-muted-foreground px-3 py-4 text-center">
            No portfolios yet. Create one to start tracking.
          </p>
        )}

        <div className="space-y-1">
          {data.portfolios.map(p => {
            const txs = getPortfolioTransactions(data, p.id)
            // We'll compute value later via quotes; for now show tx count
            const isSelected = selectedId === p.id
            const isEditing = editingId === p.id

            return (
              <div key={p.id}>
                {isEditing ? (
                  <div className="flex items-center gap-1 px-2 py-1.5">
                    <Input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="h-7 text-xs flex-1"
                      autoFocus
                      onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditingId(null) }}
                    />
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleRename} aria-label="Save rename">
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setEditingId(null)} aria-label="Cancel rename">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => { onSelect(p.id); onMobileMenuClose?.() }}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors group',
                      isSelected
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    )}
                    aria-current={isSelected ? 'page' : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="truncate flex-1">{p.name}</span>
                      <div className="hidden group-hover:flex items-center gap-0.5">
                        <Button
                          variant="ghost" size="icon" className="h-5 w-5"
                          onClick={e => { e.stopPropagation(); setEditingId(p.id); setEditName(p.name) }}
                          aria-label={`Rename ${p.name}`}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        {data.portfolios.length > 1 && (
                          <Button
                            variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-destructive"
                            onClick={e => { e.stopPropagation(); setConfirmDeleteId(p.id) }}
                            aria-label={`Delete ${p.name}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Create portfolio dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Portfolio</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <label className="space-y-1 text-sm">
              Portfolio name
              <Input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Long-Term Holdings"
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') handleCreate() }}
              />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newName.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={confirmDeleteId !== null} onOpenChange={v => !v && setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Portfolio</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            This will permanently delete "{data.portfolios.find(p => p.id === confirmDeleteId)?.name}" and all its transactions. This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )

  // If mobile menu wrapper is needed
  if (isMobileMenuOpen !== undefined) {
    return (
      <>
        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onMobileMenuClose} />
        )}
        {/* Mobile sidebar */}
        <div className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-200 lg:hidden',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="flex items-center justify-between p-3 border-b border-border">
            <span className="text-sm font-semibold">Portfolios</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onMobileMenuClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {sidebarContent}
        </div>
      </>
    )
  }

  return sidebarContent
}
