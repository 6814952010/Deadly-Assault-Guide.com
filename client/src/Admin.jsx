import { useEffect, useState } from 'react'
import physicalIcon from './components/images/Icon_Physical.jpg'
import iceIcon from './components/images/Icon_Ice.jpg'
import fireIcon from './components/images/Icon_Fire.jpg'
import electricIcon from './components/images/Icon_Electric.jpg'
import etherIcon from './components/images/Icon_Ether.jpg'
import windIcon from './components/images/Icon_Wind.jpg'
import lumifluxIcon from './components/images/Icon_Lumiflux.jpg'
import supportSpecialtyIcon from './components/images/Icon_Support.jpg'
import attackSpecialtyIcon from './components/images/Icon_Attack.jpg'
import armorerSpecialtyIcon from './components/images/Icon_Armorer.jpg'
import ruptureSpecialtyIcon from './components/images/Icon_Rupture.jpg'
import defenseSpecialtyIcon from './components/images/Icon_Defense.jpg'
import anomalySpecialtyIcon from './components/images/Icon_Anomaly.jpg'
import stunSpecialtyIcon from './components/images/Icon_Stun.jpg'

const fields = [
  ['name', 'Boss name'], ['subtitle', 'Subtitle'],
  ['recommendedSpecialties', 'Recommended specialty'], ['weaknesses', 'Boss weaknesses (comma separated)'], ['resistances', 'Boss resistances (comma separated)'],
  ['mechanics', 'Boss mechanic']
]

const placeholder = 'placeholder for user input'
const attributes = [
  ['Physical', physicalIcon], ['Ice', iceIcon], ['Fire', fireIcon], ['Electric', electricIcon],
  ['Ether', etherIcon], ['Wind', windIcon], ['Lumiflux', lumifluxIcon]
]
const specialties = [
  ['Support', supportSpecialtyIcon], ['Attack', attackSpecialtyIcon], ['Armorer', armorerSpecialtyIcon],
  ['Rupture', ruptureSpecialtyIcon], ['Defense', defenseSpecialtyIcon], ['Anomaly', anomalySpecialtyIcon], ['Stun', stunSpecialtyIcon]
]
const toForm = boss => ({
  ...boss,
  weaknesses: (boss.weaknesses?.length ? boss.weaknesses : [placeholder]).join(', '),
  resistances: (boss.resistances?.length ? boss.resistances : [placeholder]).join(', '),
  recommendedSpecialties: (boss.recommendedSpecialties?.length ? boss.recommendedSpecialties : [placeholder]).join(', '),
  mechanics: boss.mechanics || placeholder
})

export default function Admin({ onNavigate, onLogout }) {
  const [bosses, setBosses] = useState([])
  const [form, setForm] = useState(null)
  const [status, setStatus] = useState('Loading records…')
  const [weeklySlugs, setWeeklySlugs] = useState([])
  const [weeklyStatus, setWeeklyStatus] = useState('')
  const token = localStorage.getItem('da_admin_token')

  useEffect(() => {
    if (!token) { onNavigate('/profile'); return }
    fetch('/api/bosses?includeInactive=true')
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => { setBosses(data); setForm(toForm(data[0])); setStatus('') })
      .catch(() => setStatus('Unable to load boss records. Is the server running?'))
    fetch('/api/weekly-bosses/current')
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => setWeeklySlugs(data.bossSlugs || []))
      .catch(() => setWeeklyStatus('Unable to load weekly selection.'))
  }, [onNavigate, token])

  const selectBoss = slug => setForm(toForm(bosses.find(boss => boss.slug === slug)))
  const selectedAttributes = key => (form[key] || '').split(',').map(value => value.trim()).filter(value => value && value !== placeholder)
  const toggleAttribute = (key, attribute) => {
    const selected = selectedAttributes(key)
    const next = selected.includes(attribute) ? selected.filter(value => value !== attribute) : [...selected, attribute]
    setForm(current => ({ ...current, [key]: next.length ? next.join(', ') : placeholder }))
  }
  const toggleWeeklyBoss = slug => setWeeklySlugs(current => current.includes(slug) ? current.filter(value => value !== slug) : current.length < 3 ? [...current, slug] : current)
  const beginWeeklyReplacement = () => {
    setWeeklySlugs([])
    setWeeklyStatus('Choose three bosses, then publish to replace the current weekly selection.')
  }
  const saveWeeklyBosses = async () => {
    if (weeklySlugs.length !== 3) { setWeeklyStatus('Select exactly three bosses.'); return }
    setWeeklyStatus('Saving weekly assignment...')
    try {
      const response = await fetch('/api/weekly-bosses/current', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ bossSlugs: weeklySlugs }) })
      if (!response.ok) throw new Error((await response.json()).message || 'Save failed')
      const updated = await response.json()
      setWeeklySlugs(updated.bossSlugs)
      setWeeklyStatus(`Weekly bosses set. Resets ${new Date(updated.resetsAt).toLocaleString()}.`)
    } catch (error) { setWeeklyStatus(error.message || 'Save failed') }
  }
  const save = async event => {
    event.preventDefault()
    setStatus('Saving…')
    const payload = {
      ...form,
      weaknesses: form.weaknesses.split(',').map(value => value.trim()).filter(Boolean),
      resistances: form.resistances.split(',').map(value => value.trim()).filter(Boolean),
      recommendedSpecialties: form.recommendedSpecialties.split(',').map(value => value.trim()).filter(Boolean)
    }
    delete payload._id; delete payload.createdAt; delete payload.updatedAt; delete payload.__v; delete payload.slug; delete payload.number
    try {
      const response = await fetch(`/api/bosses/${form.slug}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
      if (!response.ok) throw new Error((await response.json()).message || 'Save failed')
      const updated = await response.json()
      setBosses(current => current.map(boss => boss.slug === updated.slug ? updated : boss))
      setForm(toForm(updated)); setStatus('Saved to server.')
    } catch (error) { setStatus(error.message || 'Save failed') }
  }

  const logout = () => {
    if (onLogout) { onLogout(); return }
    localStorage.removeItem('da_admin_token')
    onNavigate('/')
  }
  if (!form) return <main className="min-h-screen bg-black p-8 text-white">{status}</main>
  return <main className="min-h-screen bg-black px-5 py-10 text-white sm:px-10">
    <div className="mx-auto max-w-5xl">
      <header className="mb-8 flex items-start justify-between gap-4 border-b border-white/20 pb-5"><div><p className="text-xs font-bold tracking-[.25em] text-[#e0ff38]">RESTRICTED ACCESS</p><h1 className="mt-2 font-display text-5xl uppercase">Boss editor</h1></div><button type="button" onClick={logout} className="border border-white/30 px-3 py-2 text-xs uppercase tracking-[.15em] hover:border-[#e0ff38]">Sign out</button></header>
      <div className="mb-6 flex flex-wrap gap-2">{bosses.map(boss => <button type="button" key={boss.slug} onClick={() => selectBoss(boss.slug)} className={`border px-3 py-2 text-xs font-bold tracking-[.12em] ${form.slug === boss.slug ? 'border-[#e0ff38] bg-[#e0ff38] text-black' : 'border-white/25 text-white/70'}`}>{boss.name}</button>)}</div>
      <section className="mb-8 border border-white/20 p-5"><p className="text-xs font-bold tracking-[.25em] text-[#e0ff38]">WEEKLY BOSS ASSIGNMENT</p><h2 className="mt-2 font-display text-3xl uppercase">Choose 3 bosses</h2><p className="mt-2 text-sm text-white/55">Publishing a new set replaces the current weekly bosses and restarts the two-week timer.</p><div className="mt-4 flex flex-wrap gap-2">{bosses.map(boss => <button type="button" key={`weekly-${boss.slug}`} onClick={() => toggleWeeklyBoss(boss.slug)} className={`border px-3 py-2 text-xs font-bold tracking-[.12em] ${weeklySlugs.includes(boss.slug) ? 'border-[#e0ff38] bg-[#e0ff38] text-black' : 'border-white/25 text-white/70'}`}>{boss.name}</button>)}</div><div className="mt-4 flex flex-wrap items-center gap-4"><button type="button" onClick={beginWeeklyReplacement} className="border border-white/30 px-5 py-3 text-xs font-bold uppercase tracking-[.16em] text-white hover:border-[#e0ff38]">Replace current set</button><button type="button" onClick={saveWeeklyBosses} disabled={weeklySlugs.length !== 3} className="bg-[#e0ff38] px-5 py-3 text-xs font-bold uppercase tracking-[.16em] text-black disabled:cursor-not-allowed disabled:opacity-40">Publish weekly bosses ({weeklySlugs.length}/3)</button><span className="text-sm text-white/60">{weeklyStatus}</span></div></section>
      <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">{fields.map(([key, label]) => <label key={key} className={`text-xs uppercase tracking-[.12em] text-white/60 ${['mechanics', 'recommendedSpecialties'].includes(key) ? 'sm:col-span-2' : ''}`}>{label}{['weaknesses', 'resistances', 'recommendedSpecialties'].includes(key) ? <div className="admin-attribute-picker mt-2">{(key === 'recommendedSpecialties' ? specialties : attributes).map(([option, icon]) => <button key={option} type="button" onClick={() => toggleAttribute(key, option)} className={selectedAttributes(key).includes(option) ? 'is-selected' : ''}><img src={icon} alt="" /><span>{option}</span></button>)}</div> : key === 'mechanics' ? <textarea value={form[key] || ''} onChange={event => setForm(current => ({ ...current, [key]: event.target.value }))} className="mt-2 min-h-28 w-full border border-white/20 bg-white/5 p-3 text-sm normal-case tracking-normal text-white outline-none focus:border-[#e0ff38]" /> : <input value={form[key] || ''} onChange={event => setForm(current => ({ ...current, [key]: event.target.value }))} className="mt-2 w-full border border-white/20 bg-white/5 p-3 text-sm normal-case tracking-normal text-white outline-none focus:border-[#e0ff38]" />}</label>)}</form>
      <div className="mt-6 flex items-center gap-4"><button type="button" onClick={save} className="bg-[#e0ff38] px-5 py-3 text-xs font-bold uppercase tracking-[.16em] text-black">Save changes</button><span className="text-sm text-white/60">{status}</span></div>
    </div>
  </main>
}
