import { useEffect, useRef, useState, useCallback } from 'react'
import type { ReceiverState, SendCommandFn } from '../types'

const RECONNECT_DELAY = 3000

export function useWebSocket(): {
  state: ReceiverState | null
  wsConnected: boolean
  sendCommand: SendCommandFn
} {
  const [state, setState] = useState<ReceiverState | null>(null)
  const [wsConnected, setWsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastJsonRef = useRef<string | null>(null)

  const connect = useCallback(() => {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const url = `${proto}//${window.location.host}/api/v1/ws`

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      setWsConnected(true)
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current)
        reconnectTimer.current = null
      }
    }

    ws.onmessage = (e: MessageEvent<string>) => {
      try {
        if (e.data !== lastJsonRef.current) {
          lastJsonRef.current = e.data
          setState(JSON.parse(e.data) as ReceiverState)
        }
      } catch { /* ignore malformed frames */ }
    }

    ws.onclose = () => {
      setWsConnected(false)
      wsRef.current = null
      reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY)
    }

    ws.onerror = () => {
      ws.close()
    }
  }, [])

  useEffect(() => {
    connect()
    return () => {
      wsRef.current?.close()
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
    }
  }, [connect])

  const sendCommand = useCallback<SendCommandFn>((command) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ command }))
    }
  }, [])

  return { state, wsConnected, sendCommand }
}
