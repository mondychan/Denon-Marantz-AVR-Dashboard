import { useEffect, useState } from 'react'
import { DEMO_MODE, DEMO_DEVICE_INFO } from '../demoData'

export function useDeviceInfo() {
  const [info, setInfo] = useState(DEMO_MODE ? DEMO_DEVICE_INFO : null)
  const [loading, setLoading] = useState(!DEMO_MODE)

  useEffect(() => {
    if (DEMO_MODE) return
    fetch('/api/v1/device')
      .then(r => r.json())
      .then(data => { setInfo(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const refresh = () => {
    if (DEMO_MODE) return
    fetch('/api/v1/refresh', { method: 'POST' })
      .then(() => fetch('/api/v1/device'))
      .then(r => r.json())
      .then(data => setInfo(data))
      .catch(() => {})
  }

  return { info, loading, refresh }
}
