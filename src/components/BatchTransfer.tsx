'use client'

import React, { useMemo, useState } from 'react'
import { useAccount, useConnect, useSendCalls } from 'wagmi'
import { isAddress, parseEther, formatEther } from 'viem'

function parseRecipients(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

  return lines.map((line, idx) => {
    const [addr, amt] = line.split(',').map(s => s?.trim())
    if (!addr || !amt) throw new Error(`Baris ${idx + 1}: format harus address,amount`)
    if (!isAddress(addr)) throw new Error(`Baris ${idx + 1}: address tidak valid`)
    const value = parseEther(amt)
    return { to: addr as `0x${string}`, value }
  })
}

export function BatchTransfer() {
  const [input, setInput] = useState('')
  const [parseError, setParseError] = useState<string | null>(null)

  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { sendCalls, isPending, data, error } = useSendCalls()

  const recipients = useMemo(() => {
    try {
      const r = parseRecipients(input)
      setParseError(null)
      return r
    } catch (e: any) {
      setParseError(e.message)
      return []
    }
  }, [input])

  const total = useMemo(() => {
    try {
      return recipients.reduce((acc, r) => acc + r.value, 0n)
    } catch {
      return 0n
    }
  }, [recipients])

  const calls = recipients.map(r => ({ to: r.to, value: r.value }))

  return (
    <main style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
      <h1>Farcasend</h1>
      <p>Batch transfer ETH ke banyak wallet (format: <b>address,amount</b> per baris)</p>

      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })}>
          Connect Farcaster Wallet
        </button>
      ) : (
        <>
          <textarea
            rows={10}
            style={{ width: '100%', marginTop: 12 }}
            placeholder={`0xabc...,0.01\n0xdef...,0.02`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {parseError ? (
            <p style={{ color: 'red' }}>{parseError}</p>
          ) : (
            <p>
              Penerima: <b>{recipients.length}</b> • Total: <b>{formatEther(total)} ETH</b>
            </p>
          )}

          <button
            disabled={isPending || recipients.length === 0 || !!parseError}
            onClick={() => sendCalls({ calls })}
          >
            {isPending ? 'Sending…' : `Send to ${recipients.length} wallets`}
          </button>

          {data && <p>Batch id: {String(data)}</p>}
          {error && <p style={{ color: 'red' }}>{error.message}</p>}
        </>
      )}
    </main>
  )
}
