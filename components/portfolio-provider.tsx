'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react'
import {
  loadPortfolioData,
  savePortfolioData,
  createPortfolio,
  getPortfolioTransactions,
  type PortfolioData,
  type Portfolio,
  type PortfolioTransaction,
} from '@/lib/portfolio'

type PortfolioContextType = {
  data: PortfolioData
  raw: string | null
  ready: boolean
  blocked: boolean
  error: string
  notice: string
  setError: (msg: string) => void
  setNotice: (msg: string) => void
  addPortfolio: (name: string) => Portfolio
  renamePortfolio: (id: string, name: string) => void
  deletePortfolio: (id: string) => void
  addTransaction: (portfolioId: string, tx: PortfolioTransaction) => void
  updateTransaction: (portfolioId: string, tx: PortfolioTransaction) => void
  removeTransaction: (portfolioId: string, txId: string) => void
  getTransactions: (portfolioId: string) => PortfolioTransaction[]
}

const PortfolioContext = createContext<PortfolioContextType | null>(null)

export function usePortfolio(): PortfolioContextType {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider')
  return ctx
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>({ version: 2, portfolios: [], transactions: {} })
  const [raw, setRaw] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const savedRaw = useRef<string | null>(null)

  useEffect(() => {
    try {
      const result = loadPortfolioData(localStorage)
      savedRaw.current = result.raw
      setData(result.data)
    } catch (e) {
      setBlocked(true)
      setError(e instanceof Error ? e.message : 'Local data could not be loaded.')
    }
    setReady(true)
    const changed = (event: StorageEvent) => {
      if (event.key === 'blockdetails_portfolio_v2' || event.key === 'blockdetails_portfolio_v1' || event.key === null) {
        setBlocked(true)
        setError('Local storage changed in another tab. Reload this page before editing to avoid losing changes.')
      }
    }
    window.addEventListener('storage', changed)
    return () => window.removeEventListener('storage', changed)
  }, [])

  const commit = useCallback((next: PortfolioData, success: string, recovery = false): boolean => {
    if (!ready || (blocked && !recovery)) return false
    try {
      const newRaw = savePortfolioData(localStorage, next, savedRaw.current)
      savedRaw.current = newRaw
      setRaw(newRaw)
      setData(next)
      setBlocked(false)
      setError('')
      setNotice(success)
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed.')
      setNotice('')
      return false
    }
  }, [ready, blocked])

  const addPortfolio = useCallback((name: string): Portfolio => {
    const p = createPortfolio(name, data.portfolios.length)
    const next: PortfolioData = {
      ...data,
      portfolios: [...data.portfolios, p],
      transactions: { ...data.transactions, [p.id]: [] },
    }
    commit(next, `Portfolio "${p.name}" created.`)
    return p
  }, [data, commit])

  const renamePortfolio = useCallback((id: string, name: string) => {
    const next: PortfolioData = {
      ...data,
      portfolios: data.portfolios.map(p => p.id === id ? { ...p, name } : p),
    }
    commit(next, 'Portfolio renamed.')
  }, [data, commit])

  const deletePortfolio = useCallback((id: string) => {
    const {[id]: _, ...remainingTxs} = data.transactions
    const next: PortfolioData = {
      version: 2,
      portfolios: data.portfolios.filter(p => p.id !== id),
      transactions: remainingTxs,
    }
    commit(next, 'Portfolio deleted.')
  }, [data, commit])

  const addTransaction = useCallback((portfolioId: string, tx: PortfolioTransaction) => {
    const existing = data.transactions[portfolioId] ?? []
    const next: PortfolioData = {
      ...data,
      transactions: { ...data.transactions, [portfolioId]: [...existing, tx] },
    }
    commit(next, 'Transaction added.')
  }, [data, commit])

  const updateTransaction = useCallback((portfolioId: string, tx: PortfolioTransaction) => {
    const existing = data.transactions[portfolioId] ?? []
    const next: PortfolioData = {
      ...data,
      transactions: {
        ...data.transactions,
        [portfolioId]: existing.map(t => t.id === tx.id ? tx : t),
      },
    }
    commit(next, 'Transaction updated.')
  }, [data, commit])

  const removeTransaction = useCallback((portfolioId: string, txId: string) => {
    const existing = data.transactions[portfolioId] ?? []
    const next: PortfolioData = {
      ...data,
      transactions: {
        ...data.transactions,
        [portfolioId]: existing.filter(t => t.id !== txId),
      },
    }
    commit(next, 'Transaction deleted.')
  }, [data, commit])

  const getTransactions = useCallback((portfolioId: string): PortfolioTransaction[] => {
    return data.transactions[portfolioId] ?? []
  }, [data])

  return (
    <PortfolioContext.Provider value={{
      data, raw, ready, blocked, error, notice, setError, setNotice,
      addPortfolio, renamePortfolio, deletePortfolio,
      addTransaction, updateTransaction, removeTransaction, getTransactions,
    }}>
      {children}
    </PortfolioContext.Provider>
  )
}
