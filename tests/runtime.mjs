import { spawn } from 'node:child_process'
import { once } from 'node:events'
const port = Number(process.env.BLOCKDETAILS_PORT || 3100)
const env = { ...process.env, BLOCKDETAILS_URL: `http://localhost:${port}` }
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', process.env.RUNTIME_DEV ? 'dev' : 'start', '-p', String(port)], { stdio: 'inherit', env })
try {
  let ready = false
  for (let attempt = 0; attempt < 40; attempt++) {
    if (server.exitCode !== null) throw new Error('Production server exited')
    try { if ((await fetch(`${env.BLOCKDETAILS_URL}/portfolio`)).ok) { ready = true; break } } catch { /* bounded readiness polling */ }
    await new Promise(resolve => setTimeout(resolve, 250))
  }
  if (!ready) throw new Error('Server readiness timed out')
  for (const file of (process.env.SKIP_LIVE ? ['tests/browser.mjs'] : ['tests/live.mjs', 'tests/browser.mjs'])) {
    const child = spawn(process.execPath, [file], { stdio: 'inherit', env })
    const [code] = await once(child, 'exit')
    if (code !== 0) process.exitCode = 1
  }
} finally { server.kill() }
