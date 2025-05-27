import { useEffect, useState } from 'react'

export function HealthCheck() {
  const [healthCheck, setHealthCheck] = useState('')

  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${apiUrl}/estudiantes/`)
      if (response) {
        setHealthCheck('ok')
      }
    }
    fetchData()
  }, [apiUrl, setHealthCheck])

  return (
    <div>
      <h1>{healthCheck}</h1>
    </div>
  )
}
