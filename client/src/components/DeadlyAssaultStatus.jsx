import { useEffect, useState } from 'react';
import { getCurrentDeadlyAssault } from '../api/deadlyAssault';
import deadlyAssaultArtwork from './images/Event_Deadly_Assault.jpg';

const formatDate = value => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(value));

const EmptyAssaultCard = ({ message }) => <section className="border border-white/20 bg-black/45 p-6 backdrop-blur-sm sm:p-8" aria-label="Deadly Assault status">
  <img src={deadlyAssaultArtwork} alt="Deadly Assault boss" className="mb-6 h-48 w-full object-cover object-center sm:h-64" />
  <p className="text-sm text-white/45">{message}</p>
</section>;

export default function DeadlyAssaultStatus() {
  const [state, setState] = useState({ loading: true, data: null, error: false });

  useEffect(() => {
    const controller = new AbortController();
    getCurrentDeadlyAssault(controller.signal)
      .then(data => setState({ loading: false, data, error: false }))
      .catch(error => {
        if (error.name !== 'AbortError') setState({ loading: false, data: null, error: true });
      });
    return () => controller.abort();
  }, []);

  if (state.loading) return <EmptyAssaultCard message="LOADING CURRENT ASSAULT…" />;
  if (state.error) return <EmptyAssaultCard message="Live assault data is temporarily unavailable." />;
  if (!state.data) return <EmptyAssaultCard message="The next Deadly Assault cycle has not been published yet." />;

  const { cycle, patchVersion, title, startsAt, endsAt, stages = [] } = state.data;
  return <section className="border border-white/20 bg-black/45 p-6 backdrop-blur-sm sm:p-8" aria-label="Current Deadly Assault">
    <img src={deadlyAssaultArtwork} alt="Deadly Assault boss" className="mb-6 h-48 w-full object-cover object-center sm:h-64" />
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div>
        <p className="text-xs font-bold tracking-[0.25em] text-[#e0ff38]">CURRENT DEADLY ASSAULT / CYCLE {cycle}</p>
        <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-none sm:text-4xl">{title}</h2>
        <p className="mt-3 text-sm text-white/60">Version {patchVersion} · {formatDate(startsAt)} — {formatDate(endsAt)}</p>
      </div>
      <span className="border border-[#e0ff38]/60 px-3 py-1 text-xs font-bold tracking-[0.16em] text-[#e0ff38]">LIVE</span>
    </div>
    {stages.length > 0 && <ul className="mt-7 grid gap-3 sm:grid-cols-3" role="list">
      {stages.map(stage => <li key={stage.slot} className="border-t border-white/15 pt-3 text-sm text-white/75"><span className="mr-2 text-[#e0ff38]">0{stage.slot}</span>{stage.title}</li>)}
    </ul>}
  </section>;
}
