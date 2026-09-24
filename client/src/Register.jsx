import React from 'react'

export default function Register({ onNavigate, onAuthenticated }) {
  const [form, setForm] = React.useState({ name: '', email: '', password: '' })
  const [status, setStatus] = React.useState(null)
  const submit = async e => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) {
        let payload = null
        try {
          payload = await res.json()
        } catch (parseError) {
          console.warn('Non-JSON error response', parseError)
        }
        const message = (payload && (payload.message || payload.error)) || res.statusText || `HTTP ${res.status}`
        throw new Error(message)
      }
      const account = await res.json()
      onAuthenticated?.(account)
      setStatus('success')
      // navigate back to main after success
      setTimeout(() => onNavigate?.('/'), 800)
    } catch (err) {
      setStatus(err?.message || 'error')
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-lg w-full p-8">
        <h1 className="text-3xl font-bold mb-6">Register (Temp)</h1>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="flex flex-col text-sm">
            Name
            <input value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} type="text" className="mt-2 p-2 rounded bg-white/5" />
          </label>
          <label className="flex flex-col text-sm">
            Email
            <input value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))} type="email" className="mt-2 p-2 rounded bg-white/5" />
          </label>
          <label className="flex flex-col text-sm">
            Password
            <input value={form.password} onChange={e => setForm(s => ({ ...s, password: e.target.value }))} type="password" className="mt-2 p-2 rounded bg-white/5" />
          </label>
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={() => onNavigate?.('/')} className="px-4 py-2 bg-[#e0ff38] text-black font-bold rounded">Back</button>
            <button type="submit" className="px-4 py-2 bg-white/10 rounded">Create account</button>
          </div>
        </form>
        {status === 'loading' && <p className="mt-4">Registering...</p>}
        {status === 'success' && <p className="mt-4 text-green-400">Registered — redirecting...</p>}
        {status && status !== 'loading' && status !== 'success' && <p className="mt-4 text-red-400">{String(status)}</p>}
      </div>
    </main>
  )
}
