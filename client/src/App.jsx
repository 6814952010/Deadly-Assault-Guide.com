import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import logoBackGround1 from './components/images/logo.jpg'
import logoBackGround2 from './components/images/logo2.jpg'
import logoBackGround3 from './components/images/logo3.jpg'
import logoBackGround4 from './components/images/logo4.jpg'
import logoBackGround5 from './components/images/logo5.jpg'
import logoBackGround6 from './components/images/logo6.jpg'
import logoBackGround7 from './components/images/logo7.jpg'
import logoBackGround8 from './components/images/logo8.jpg'
import logoBackGround9 from './components/images/logo9.jpg'
import pompeyArtwork from './components/images/Pompey.jpg'
import butcherArtwork from './components/images/Butcher.jpg'
import girtablulluArtwork from './components/images/Girtablullu.jpg'
import accountIcon from './components/images/Account.jpg'
import horizonArtwork from './components/images/Horizon.jpg'
import hunterArtwork from './components/images/Hunter.jpg'
import complexArtwork from './components/images/Complex.jpg'
import marionetteArtwork from './components/images/Marionette.jpg'
import unfathomableArtwork from './components/images/Unfathomable.jpg'
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
import PixelSwap from './components/PixelSwap'
import MorphSlider from './components/MorphSlider'
import StaggeredMenu from './components/StaggeredMenu'
import TiltedCard from './components/TiltedCard'
import ShapeGrid from './components/ShapeGrid'
import Admin from './Admin'
import Profile from './Profile'
import { GroupAnimation } from 'motion/react'

const guides = [
  { slug: 'pompey', number: '01', title: 'POMPEY', subtitle: 'Corrupted Overlord', image: pompeyArtwork, intro: 'Pompey is a relentless close-range threat. Keep your distance, force it to reposition, and punish every overcommitment.' },
  { slug: 'marionette', number: '02', title: 'MARIONETTE', subtitle: '', image: marionetteArtwork, intro: 'Priest controls the fight through support and recovery. Interrupt its rhythm before the arena becomes a war of attrition.' },
  { slug: 'unfathomable', number: '03', title: 'UNFATHOMABLE', subtitle: '', image: unfathomableArtwork, intro: 'Nightmare turns visibility into a weapon. Stay calm, read movement cues, and never chase blindly into darkness.' },
  { slug: 'butcher', number: '04', title: 'BUTCHER', subtitle: '', image: butcherArtwork, intro: 'Butcher is a relentless close-range threat. Keep your distance, force it to reposition, and punish every overcommitment.' },
  { slug: 'complex', number: '05', title: 'COMPLEX', subtitle: '', image: complexArtwork, intro: 'Complex changes the rules mid-fight. Adapt to each phase quickly and the arena becomes an advantage.' },
  { slug: 'hunter', number: '06', title: 'HUNTER', subtitle: '', image: hunterArtwork, intro: 'Bringer arrives with overwhelming force and little warning. The only safe response is disciplined movement.' },
  { slug: 'girtallu', number: '07', title: 'GIRTALLU', subtitle: '', image: girtablulluArtwork, intro: 'Girtallu is the final test: quick, precise, and unforgiving. Every mistake compounds, so make each action deliberate.' },
]
const heroSliderItems = [
  { image: logoBackGround1 },
  { image: logoBackGround2 },
  { image: logoBackGround3 },
  { image: logoBackGround4 },
  { image: logoBackGround5 },
  { image: logoBackGround6 },
  { image: logoBackGround7 },
  { image: logoBackGround8 },
  { image: logoBackGround9 }
]
const bossImages = {
  pompeyW: pompeyArtwork,
  marionetteW: marionetteArtwork,
  unfathomW: unfathomableArtwork,
  butcherW: butcherArtwork,
  complexW: complexArtwork,
  hunterW: hunterArtwork,
  girtablilluW: girtablulluArtwork
}
const bossInfoPlaceholder = 'placeholder for user input'
const noCombatInfo = '-None-'
const attributeIcons = {
  physical: physicalIcon,
  ice: iceIcon,
  fire: fireIcon,
  electric: electricIcon,
  ether: etherIcon,
  wind: windIcon,
  lumiflux: lumifluxIcon
}
const specialtyIcons = {
  support: supportSpecialtyIcon,
  attack: attackSpecialtyIcon,
  armorer: armorerSpecialtyIcon,
  armourer: armorerSpecialtyIcon,
  rupture: ruptureSpecialtyIcon,
  defense: defenseSpecialtyIcon,
  defenser: defenseSpecialtyIcon,
  anomaly: anomalySpecialtyIcon,
  stun: stunSpecialtyIcon
}
const attributeIconFor = attribute => attributeIcons[attribute.toLowerCase().trim()]
const specialtyIconFor = specialty => specialtyIcons[specialty.toLowerCase().trim()]
const displayCombatValues = values => {
  const selected = (values || []).filter(value => value && value !== bossInfoPlaceholder)
  return selected.length ? selected : [noCombatInfo]
}
const archiveMarquees = Array(3).fill('DEADLY ASSAULT')
const Mark = () => <span className="inline-flex h-8 w-8 items-center justify-center border border-white/50 text-sm font-bold tracking-tighter">DA</span>

function AuthModal({ mode, onClose, onSwitch, onAuthenticated, onNavigate }) {
  const isRegister = mode === 'register'
  const [form, setForm] = useState({ name: '', identifier: '', email: '', password: '' })
  const [status, setStatus] = useState('')
  useEffect(() => {
    const onKeyDown = event => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])
  const submit = async event => {
    event.preventDefault()
    setStatus(isRegister ? 'Creating account...' : 'Signing in...')
    try {
      const response = await fetch(isRegister ? '/api/auth/register' : '/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isRegister ? { name: form.name, email: form.email, password: form.password } : { identifier: form.identifier, password: form.password })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Authentication failed')
      if (!isRegister && data.user.role === 'admin') localStorage.setItem('da_admin_token', data.token)
      onAuthenticated(data.user || data)
      setStatus(isRegister ? 'Account created.' : 'Signed in.')
      if (!isRegister && data.user.role === 'admin') onNavigate('/admin')
      onClose()
    } catch (error) { setStatus(error.message || 'Authentication failed') }
  }
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className="w-full max-w-md border border-white/25 bg-[#111] p-6 shadow-2xl sm:p-8">
      <div className="mb-7 flex items-start justify-between gap-4"><div><p className="text-xs font-bold tracking-[.25em] text-[#e0ff38]">DEADLY ASSAULT GUIDE</p><h2 id="auth-modal-title" className="mt-2 font-display text-4xl uppercase">{isRegister ? 'Create account' : 'Sign in'}</h2></div><button type="button" onClick={onClose} aria-label="Close" className="text-2xl leading-none text-white/60 transition hover:text-[#e0ff38]">×</button></div>
      <form onSubmit={submit} className="space-y-4">
        {isRegister && <label className="block text-xs uppercase tracking-[.14em] text-white/65">Username<input required value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} autoComplete="username" className="mt-2 w-full border border-white/20 bg-black/40 p-3 text-sm normal-case tracking-normal text-white outline-none focus:border-[#e0ff38]" /></label>}
        {isRegister ? <label className="block text-xs uppercase tracking-[.14em] text-white/65">Email<input required value={form.email} onChange={event => setForm(current => ({ ...current, email: event.target.value }))} type="email" autoComplete="email" className="mt-2 w-full border border-white/20 bg-black/40 p-3 text-sm normal-case tracking-normal text-white outline-none focus:border-[#e0ff38]" /></label> : <label className="block text-xs uppercase tracking-[.14em] text-white/65">Username or email<input required value={form.identifier} onChange={event => setForm(current => ({ ...current, identifier: event.target.value }))} autoComplete="username" className="mt-2 w-full border border-white/20 bg-black/40 p-3 text-sm normal-case tracking-normal text-white outline-none focus:border-[#e0ff38]" /></label>}
        <label className="block text-xs uppercase tracking-[.14em] text-white/65">Password<input required value={form.password} onChange={event => setForm(current => ({ ...current, password: event.target.value }))} type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} className="mt-2 w-full border border-white/20 bg-black/40 p-3 text-sm normal-case tracking-normal text-white outline-none focus:border-[#e0ff38]" /></label>
        <button type="submit" className="w-full bg-[#e0ff38] px-5 py-3 text-xs font-bold uppercase tracking-[.16em] text-black">{isRegister ? 'Create account' : 'Sign in'}</button>
      </form>
      <div className="mt-5 flex items-center justify-between gap-4 text-xs text-white/60"><button type="button" onClick={() => { setStatus(''); setForm({ name: '', identifier: '', email: '', password: '' }); onSwitch(isRegister ? 'sign-in' : 'register') }} className="text-[#e0ff38] hover:underline">{isRegister ? 'Already have an account? Sign in' : 'Need an account? Register'}</button>{status && <span className="text-right">{status}</span>}</div>
    </section>
  </div>
}

function Home({ onNavigate, user, onLogout, onOpenAuth }) {
  const guideScrollRef = useRef(null)
  const guideCardHoverRef = useRef(false)
  const guideScrollPositionRef = useRef(0)
  const [guideSearch, setGuideSearch] = useState('')
  const [weeklyBosses, setWeeklyBosses] = useState([])
  const [weeklyResetsAt, setWeeklyResetsAt] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState('')
  const visibleGuides = guides.filter(guide => `${guide.title} ${guide.subtitle} ${guide.slug}`.toLowerCase().includes(guideSearch.trim().toLowerCase()))
  useEffect(() => {
    const rail = guideScrollRef.current
    if (!rail) return undefined
    let frame
    let previousTime
    const loop = time => {
      const [firstSet, secondSet] = rail.querySelectorAll('.guide-set')
      const loopWidth = secondSet && firstSet ? secondSet.getBoundingClientRect().left - firstSet.getBoundingClientRect().left : 0
      if (loopWidth && !guideCardHoverRef.current) {
        const elapsed = previousTime ? time - previousTime : 0
        guideScrollPositionRef.current += elapsed * 0.025
        if (guideScrollPositionRef.current >= loopWidth) guideScrollPositionRef.current -= loopWidth
        rail.scrollLeft = guideScrollPositionRef.current
      }
      previousTime = time
      frame = window.requestAnimationFrame(loop)
    }
    frame = window.requestAnimationFrame(loop)
    return () => window.cancelAnimationFrame(frame)
  }, [])
  useEffect(() => {
    fetch('/api/weekly-bosses/current')
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => { setWeeklyBosses(data.bosses || []); setWeeklyResetsAt(data.resetsAt) })
      .catch(() => { setWeeklyBosses([]); setWeeklyResetsAt(null) })
  }, [])
  useEffect(() => {
    if (!weeklyResetsAt) { setTimeRemaining(''); return undefined }
    const updateCountdown = () => {
      const remaining = new Date(weeklyResetsAt).getTime() - Date.now()
      if (remaining <= 0) { setWeeklyBosses([]); setWeeklyResetsAt(null); return }
      const days = Math.floor(remaining / 86400000)
      const hours = Math.floor(remaining / 3600000) % 24
      const minutes = Math.floor(remaining / 60000) % 60
      const seconds = Math.floor(remaining / 1000) % 60
      setTimeRemaining(`${days}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M ${String(seconds).padStart(2, '0')}S`)
    }
    updateCountdown()
    const interval = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(interval)
  }, [weeklyResetsAt])
  const scrollBosses = event => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
    event.preventDefault()
    event.stopPropagation()
    const rail = event.currentTarget
    const [firstSet, secondSet] = rail.querySelectorAll('.guide-set')
    const loopWidth = secondSet && firstSet ? secondSet.getBoundingClientRect().left - firstSet.getBoundingClientRect().left : 0
    if (!loopWidth) return
    guideScrollPositionRef.current += event.deltaY
    if (guideScrollPositionRef.current >= loopWidth) guideScrollPositionRef.current -= loopWidth
    if (guideScrollPositionRef.current < 0) guideScrollPositionRef.current += loopWidth
    rail.scrollLeft = guideScrollPositionRef.current
  }
  return <main className="landing min-h-screen overflow-hidden bg-[#080808] text-white">
    <section className="hero-top relative flex h-[53vh] min-h-[390px] items-end border-b border-white/15 px-6 pb-10 sm:px-10 sm:pb-14">
      <div className="absolute inset-0 z-0">
        <MorphSlider items={heroSliderItems} transition="melt" intensity={0.35} aberration={0} drift={0} autoplay overlayColor="#000000" duration={1.2} scale={3} radius={0} showCaptions={false} showControls={false} showIndicators={false} />
      </div>
      <div className="absolute inset-0 bg-black/45 z-10" />
      <div className="absolute right-6 top-6 z-20 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] sm:right-10 sm:top-8">
        {user ? <><span className="text-[#e0ff38]">{user.name}</span><span className="h-3 w-px bg-white/30" aria-hidden="true" /><button type="button" onClick={onLogout} className="text-white/60 transition hover:text-[#e0ff38]">Log out</button></> : <><button type="button" onClick={() => onOpenAuth('sign-in')} className="text-white/75 transition hover:text-[#e0ff38]">Sign in</button><span className="h-3 w-px bg-white/30" aria-hidden="true" /><button type="button" onClick={() => onOpenAuth('register')} className="text-white/75 transition hover:text-[#e0ff38]">Register</button><button type="button" onClick={() => onOpenAuth('sign-in')} aria-label="Open account sign in" className="ml-1 h-9 w-9 overflow-hidden border border-white/45 transition hover:border-[#e0ff38] hover:scale-105"><img src={accountIcon} alt="" className="h-full w-full object-cover" /></button></>}
      </div>
      <div className="relative z-20 max-w-5xl"><p className="mb-4 text-xs font-bold tracking-[0.35em] text-[#e0ff38]">ZENLESSZONEZERO BOSS GUIDE</p><h1 className="font-display text-[clamp(3.3rem,10.5vw,10rem)] font-black uppercase leading-[0.78] tracking-[-0.075em]">Deadly<br />Assault <em className="font-display font-normal text-white/35">Guide</em></h1></div>
    </section>
    <section className="guide-archive border-b border-white/15 py-8 sm:py-10" aria-label="Boss guide archive">
      <div className="guide-marquees" aria-hidden="true">{archiveMarquees.map((label, row) => <div className="guide-marquee" key={row}><div>{Array.from({ length: 4 }, (_, index) => <span key={index}>{label}</span>)}</div><div>{Array.from({ length: 4 }, (_, index) => <span key={index}>{label}</span>)}</div></div>)}</div>
      <div className="mb-5 flex items-end justify-between px-6 sm:px-10">
        <div><p className="text-xs font-bold tracking-[0.3em] text-[#e0ff38]">SCROLL AROUND</p><h2 className="mt-2 font-display text-3xl font-bold uppercase sm:text-4xl">Deadly Assault Guides</h2></div>
        <label className="hidden w-60 items-center gap-2 border border-white/20 bg-black/30 px-3 py-2 text-white/60 sm:flex">
          <svg aria-hidden="true" className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
          <input type="search" value={guideSearch} onChange={event => setGuideSearch(event.target.value)} placeholder="SEARCH BOSS" aria-label="Search boss guides" className="min-w-0 flex-1 bg-transparent text-xs tracking-[0.14em] text-white outline-none placeholder:text-white/40" />
        </label>
      </div>
      <div ref={guideScrollRef} className="guide-scroll overflow-x-auto" onWheelCapture={scrollBosses}>
        <div className="guide-track">
          <div className="guide-set">
            {visibleGuides.map(guide => <button key={guide.slug} type="button" onMouseEnter={() => { guideCardHoverRef.current = true }} onMouseLeave={() => { guideCardHoverRef.current = false }} onClick={() => onNavigate(`/guide/${guide.slug}`)} className="guide-card group relative shrink-0 overflow-hidden border border-white/20 bg-[#111] text-left">
              <img src={guide.image} alt={`${guide.title} boss artwork`} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
              <span className="block border-t border-white/15 px-4 py-4"><strong className="font-display text-2xl tracking-wide">{guide.title}</strong><small className="mt-1 block text-xs uppercase tracking-[0.16em] text-white/45">{guide.subtitle || 'Deadly Assault file'}</small></span>
            </button>)}
            {visibleGuides.length === 0 && <p className="px-6 py-16 text-xs tracking-[0.2em] text-white/50">NO BOSS FILES FOUND</p>}
          </div>
          {visibleGuides.length > 0 && !guideSearch.trim() && <div className="guide-set" aria-hidden="true">
            {visibleGuides.map(guide => <button key={`loop-${guide.slug}`} type="button" onMouseEnter={() => { guideCardHoverRef.current = true }} onMouseLeave={() => { guideCardHoverRef.current = false }} onClick={() => onNavigate(`/guide/${guide.slug}`)} className="guide-card group relative shrink-0 overflow-hidden border border-white/20 bg-[#111] text-left">
              <img src={guide.image} alt="" className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
              <span className="block border-t border-white/15 px-4 py-4"><strong className="font-display text-2xl tracking-wide">{guide.title}</strong><small className="mt-1 block text-xs uppercase tracking-[0.16em] text-white/45">{guide.subtitle || 'Deadly Assault file'}</small></span>
            </button>)}
          </div>}
        </div>
      </div>
    </section>
    <section className="border-b border-white/15 bg-[#101010] px-6 py-10 sm:px-10 sm:py-14" aria-label="Weekly boss selection">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.3em] text-[#e0ff38]">DEADLY CYCLE</p><h2 className="mt-2 font-display text-3xl font-bold uppercase sm:text-4xl">Weekly Bosses</h2></div>{timeRemaining && <p className="border border-[#e0ff38]/60 px-3 py-2 font-mono text-xs tracking-[.14em] text-[#e0ff38]">RESET IN {timeRemaining}</p>}</div>
        {weeklyBosses.length === 3 ? <div className="grid gap-4 sm:grid-cols-3">{weeklyBosses.map(boss => {
          const fallback = guides.find(guide => guide.slug === boss.slug)
          const image = boss.imageUrl || bossImages[boss.imageKey] || fallback?.image
          return <button type="button" key={boss.slug} onClick={() => onNavigate(`/guide/${boss.slug}`)} className="group overflow-hidden border border-white/20 bg-black text-left transition hover:border-[#e0ff38]"><img src={image} alt={`${boss.name} boss artwork`} className="h-120 w-full object-cover transition duration-500 group-hover:scale-105" /><span className="block border-t border-white/15 px-4 py-4"><small className="text-xs uppercase tracking-[.16em] text-[#e0ff38]">HIGH RISK</small><strong className="mt-1 block font-display text-2xl tracking-wide">{boss.name}</strong><small className="mt-1 block text-xs uppercase tracking-[.16em] text-white/45">{boss.subtitle || 'Deadly Assault file'}</small></span></button>
        })}</div> : <div className="border border-dashed border-white/25 px-5 py-10 text-center text-xs uppercase tracking-[.2em] text-white/45">No weekly bosses selected. Check back after the next assignment.</div>}
      </div>
    </section>
  </main>
}

function GuidePage({ onNavigate }) {
  const { slug } = useParams(); const [guide, setGuide] = useState(null)
  useEffect(() => {
    const fallback = guides.find(item => item.slug === slug) || guides[0]
    setGuide(null)
    fetch(`/api/bosses/${slug}`)
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => setGuide({
        ...fallback,
        ...data,
        image: data.imageUrl || bossImages[data.imageKey] || fallback.image,
        title: data.name || fallback.title,
        subtitle: data.subtitle || fallback.subtitle,
        intro: data.intro || fallback.intro,
      }))
      .catch(() => setGuide(fallback))
  }, [slug])
  if (!guide) return <div className="min-h-screen bg-black" />
  const weaknesses = displayCombatValues(guide.weaknesses)
  const resistances = displayCombatValues(guide.resistances)
  const recommendedSpecialties = displayCombatValues(guide.recommendedSpecialties)
  const mechanics = guide.mechanics || bossInfoPlaceholder
  return <main className="boss-page">
    <header className="boss-page-header">
      <button type="button" onClick={() => onNavigate('/')} className="boss-back"><span aria-hidden="true">←</span> BACK TO MAIN PAGE</button>
      
    </header>
    <section className="boss-hero" aria-labelledby="boss-title">
      <div className="boss-hero-grid" aria-hidden="true" />
      
      <div className="boss-hero-orbit" aria-hidden="true" />
      <TiltedCard imageSrc={guide.image} altText={`${guide.title} boss artwork`} containerWidth="min(50svh, 31.875rem)" containerHeight="min(69svh, 44rem)" imageWidth="100%" imageHeight="100%" rotateAmplitude={6} scaleOnHover={1.15} backgroundContent={<ShapeGrid speed={.3} squareSize={64} direction="diagonal" borderColor="rgba(155,83,255,.34)" hoverFillColor="rgba(224,255,56,.24)" hoverTrailAmount={0} />} />
      <div className="boss-hero-title"><span>BOSS ENCOUNTER</span><strong>{guide.title}</strong></div>
      <p className="boss-hero-scroll">SCROLL FOR INTEL <span>↓</span></p>
    </section>
    <section className="boss-data-shell">
      <div className="boss-alert boss-alert-left" aria-hidden="true">{Array.from({ length: 4 }, (_, row) => <div className="boss-alert-track" style={{ top: `${10 + row * 25}%`, animationDelay: `${row * -12}s` }} key={row}><div className="boss-alert-run">{Array.from({ length: 6 }, (_, index) => <span key={index}>ALERT</span>)}</div><div className="boss-alert-run">{Array.from({ length: 6 }, (_, index) => <span key={index}>ALERT</span>)}</div></div>)}</div>
      <div className="boss-alert boss-alert-right" aria-hidden="true">{Array.from({ length: 4 }, (_, row) => <div className="boss-alert-track" style={{ top: `${10 + row * 25}%`, animationDelay: `${row * -12}s` }} key={row}><div className="boss-alert-run">{Array.from({ length: 6 }, (_, index) => <span key={index}>ALERT</span>)}</div><div className="boss-alert-run">{Array.from({ length: 6 }, (_, index) => <span key={index}>ALERT</span>)}</div></div>)}</div>
      <article className="boss-data">
        <div className="boss-data-content">
          <div className="boss-data-heading"><div><p className="boss-kicker">-WARNING- HIGH RISK ETHEREAL</p><h1 id="boss-title">{guide.title}</h1><p className="boss-subtitle">{guide.subtitle || 'Unknown designation'}</p></div></div>
          <section className="boss-combat-info" aria-label="Boss combat information">
            <section className="boss-specialties"><h2>RECOMMENDED SPECIALTY</h2><div>{recommendedSpecialties.map(specialty => <p key={specialty}>{specialty !== noCombatInfo && (specialtyIconFor(specialty) ? <img src={specialtyIconFor(specialty)} alt="" /> : <span aria-hidden="true">✦</span>)}{specialty}</p>)}</div></section>
            <div className="boss-attributes">
              <section><h2>WEAKNESSES</h2><div>{weaknesses.map(attribute => <p key={attribute}>{attribute !== noCombatInfo && (attributeIconFor(attribute) ? <img src={attributeIconFor(attribute)} alt="" /> : <span aria-hidden="true">✦</span>)}{attribute}</p>)}</div></section>
              <section><h2>RESISTANCE</h2><div>{resistances.map(attribute => <p key={attribute}>{attribute !== noCombatInfo && (attributeIconFor(attribute) ? <img src={attributeIconFor(attribute)} alt="" /> : <span aria-hidden="true">✦</span>)}{attribute}</p>)}</div></section>
            </div>
            <section className="boss-mechanics"><h2>BOSS MECHANIC</h2><p>{mechanics}</p></section>
          </section>
        </div>
      </article>
    </section>
  </main>
}

function AppRoutes({ onNavigate, location, user, onLogout, onOpenAuth }) { return <Routes location={location}><Route path="/" element={<Home onNavigate={onNavigate} user={user} onLogout={onLogout} onOpenAuth={onOpenAuth} />} /><Route path="/guide/:slug" element={<GuidePage onNavigate={onNavigate} />} /><Route path="/profile" element={user ? <Profile user={user} onNavigate={onNavigate} /> : <Navigate to="/" replace />} /><Route path="/register" element={<Navigate to="/" replace />} /><Route path="/admin" element={<Admin onNavigate={onNavigate} onLogout={onLogout} />} /><Route path="*" element={<Home onNavigate={onNavigate} user={user} onLogout={onLogout} onOpenAuth={onOpenAuth} />} /></Routes> }

export default function App() {
  const location = useLocation(); const navigate = useNavigate(); const [displayLocation, setDisplayLocation] = useState(location); const [nextPath, setNextPath] = useState(null); const [authMode, setAuthMode] = useState(null); const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('da_user')) } catch { return null } })
  useEffect(() => {
    if (location.pathname === '/register' || (location.pathname === '/profile' && !user)) {
      setAuthMode(location.pathname === '/register' ? 'register' : 'sign-in')
      navigate('/', { replace: true })
      return
    }
    if (!nextPath && location.pathname !== displayLocation.pathname) setDisplayLocation(location)
  }, [displayLocation.pathname, location, navigate, nextPath])
  const authenticated = account => { localStorage.setItem('da_user', JSON.stringify(account)); setUser(account) }
  const logout = () => {
    localStorage.removeItem('da_user')
    localStorage.removeItem('da_admin_token')
    setUser(null)
    setAuthMode(null)
    setNextPath(null)
    navigate('/', { replace: true })
    setDisplayLocation(current => ({ ...current, pathname: '/' }))
  }
  const requestNavigation = path => { if (path !== displayLocation.pathname && !nextPath) setNextPath(path) }
  const finishTransition = () => { navigate(nextPath); setDisplayLocation(current => ({ ...current, pathname: nextPath })); setNextPath(null) }
  const menuItems = [
    { label: 'Main page', ariaLabel: 'Go to main page', link: '/', onClick: () => requestNavigation('/') },
    { label: 'Profile', ariaLabel: user ? 'Open profile' : 'Open sign in', link: user ? '/profile' : '/', onClick: () => user ? requestNavigation('/profile') : setAuthMode('sign-in') },
    ...(user?.role === 'admin' ? [{ label: 'Management', ariaLabel: 'Open admin editor', link: '/admin', onClick: () => requestNavigation('/admin') }] : [])
  ]
  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'Discord', link: 'https://discord.com' }
  ]

  return <>
    <StaggeredMenu
      position="left"
      isFixed
      items={menuItems}
      socialItems={socialItems}
      displaySocials={false}
      displayItemNumbering={false}
      menuButtonColor="#fff"
      openMenuButtonColor="#fff"
      changeMenuColorOnOpen={true}
      colors={["#B497CF", "#5227FF"]}
      logoUrl={logoBackGround1}
      accentColor="#e0ff38"
      hideToggle={displayLocation.pathname.startsWith('/guide/')}
    />
    <PixelSwap pattern="center-out" active={Boolean(nextPath)} onComplete={finishTransition} firstContent={<AppRoutes onNavigate={requestNavigation} location={displayLocation} user={user} onLogout={logout} onOpenAuth={setAuthMode} />} secondContent={<AppRoutes onNavigate={requestNavigation} location={{ ...displayLocation, pathname: nextPath || displayLocation.pathname }} user={user} onLogout={logout} onOpenAuth={setAuthMode} />} />
    {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onSwitch={setAuthMode} onAuthenticated={authenticated} onNavigate={requestNavigation} />}
  </>
}
