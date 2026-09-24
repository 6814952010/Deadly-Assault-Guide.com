import accountLogo from './components/images/accountlogo.jpg'

export default function Profile({ user, onNavigate }) {
  return <main className="min-h-screen bg-[#080808] px-6 py-24 text-white sm:px-10">
    <section className="mx-auto max-w-5xl">
      <button type="button" onClick={() => onNavigate?.('/')} className="mb-10 text-xs font-bold uppercase tracking-[.2em] text-white/60 transition hover:text-[#e0ff38]">← Back to main page</button>
      <div className="border border-white/20 bg-[#111] p-6 sm:p-10">
        <div className="flex flex-col items-start gap-5">
          <img src={accountLogo} alt="Account profile" className="h-24 w-24 border border-[#e0ff38]/70 object-cover" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-[#e0ff38]">Account profile</p>
            <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-none sm:text-7xl">{user?.name || 'Username'}</h1>
          </div>
        </div>
        <section className="mt-12 border-t border-white/20 pt-7" aria-labelledby="agents-heading">
          <p className="text-xs font-bold uppercase tracking-[.3em] text-[#e0ff38]">PROXY</p>
          <h2 id="agents-heading" className="mt-2 font-display text-3xl font-bold uppercase">Agents</h2>
          <div className="mt-5 border border-dashed border-white/25 bg-black/20 p-6 text-sm text-white/55">Agent details will appear here.</div>
        </section>
      </div>
    </section>
  </main>
}