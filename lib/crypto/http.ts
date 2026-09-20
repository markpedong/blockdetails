import 'server-only'
import { NextResponse } from 'next/server'
import { CryptoError } from './core'

export async function respond<T>(load: () => Promise<T>) {
  try { return NextResponse.json({ data: await load() }) }
  catch (error) {
    const status = error instanceof CryptoError && [400, 404].includes(error.status) ? error.status : 503
    return NextResponse.json({ error: {
      code: status === 400 ? 'INVALID_INPUT' : status === 404 ? 'NOT_FOUND' : 'UNAVAILABLE',
      message: status === 400 ? 'Invalid request parameters.' : status === 404 ? 'Asset or exchange not found.' : 'Market data is temporarily unavailable. Please retry.',
    } }, { status, headers: { 'Cache-Control': 'no-store', ...(status === 503 ? { 'Retry-After': '30' } : {}) } })
  }
}
