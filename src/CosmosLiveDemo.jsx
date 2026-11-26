import { useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play, ShieldCheck, TriangleAlert } from 'lucide-react'
import './cosmos-live.css'

const API_URL = 'https://api.safeonorbit.space/api/conjunctions/v1/events/?limit=5'

const RISK = {
  HIGH: { label: 'High risk', color: '#ff4d4d' },
  MEDIUM: { label: 'Medium risk', color: '#fe7b2b' },
  LOW: { label: 'Low risk', color: '#35b9e8' },
}
export const riskOf = level => RISK[String(level).toUpperCase()] || { label: level || 'Unknown risk', color: '#9eafc4' }

/* ---------------------------------------------------------------- dados */

export function useCosmosEvents() {
  const [state, setState] = useState({ status: 'loading', events: [] })

  useEffect(() => {
    const controller = new AbortController()
    fetch(API_URL, {
      headers: { 'X-Api-Key': import.meta.env.VITE_COSMOS_API_KEY },
      signal: controller.signal,
    })
      .then(async resposta => {
        if (!resposta.ok) throw new Error(`API respondeu ${resposta.status}: ${await resposta.text()}`)
        return resposta.json()
      })
      .then(dados => {
        // A API responde { status, count, data: [...] }
        const lista = Array.isArray(dados) ? dados : dados?.data
        if (!Array.isArray(lista)) {
          // Formato inesperado: nunca tratar como "órbita segura"
          throw new Error(`Formato de resposta inesperado: ${JSON.stringify(dados).slice(0, 200)}`)
        }
        const events = [...lista].sort(
          (a, b) => new Date(a.time_of_closest_approach) - new Date(b.time_of_closest_approach)
        )
        setState({ status: events.length ? 'ready' : 'empty', events })
      })
      .catch(falha => {
        if (falha.name === 'AbortError') return
        console.error('Error fetching API:', falha)
        setState({ status: 'error', events: [] })
      })
    return () => controller.abort()
  }, [])

  return state
}

/* ----------------------------------------------------------- formatação */

export function formatPoc(value) {
  const p = Number(value)
  if (!(p > 0)) return null
  const exp = Math.floor(Math.log10(p))
  return {
    mantissa: (p / 10 ** exp).toFixed(2),
    exp,
    odds: Number((1 / p).toPrecision(3)).toLocaleString('en-US'),
    // posição numa escala logarítmica de 10⁻⁷ a 10⁻²
    gauge: Math.min(1, Math.max(0, (Math.log10(p) + 7) / 5)),
  }
}

export function formatUtc(iso) {
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'UTC', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  }) + ' UTC'
}

export const shortName = name => String(name || 'Unknown').replace(/\s*\(.*\)\s*/, '').trim() || name

/* ------------------------------------------------------ geometria orbital */

const C = 200            // centro do SVG
const A = 150, B = 50    // semieixos da órbita (vista inclinada)
const EARTH_R = 56
const HALF = 6           // meia duração do replay, em segundos
const W1 = 0.5, W2 = 0.42
const MIN_PER_SEC = 8    // 1 s de animação ≈ 8 min de órbita

function ellipsePoint(phi, u, s = 1) {
  const x = A * s * Math.cos(u), y = B * s * Math.sin(u)
  const c = Math.cos(phi), n = Math.sin(phi)
  return [C + x * c - y * n, C + x * n + y * c]
}

function radiusAt(theta, phi) {
  const b = theta - phi
  return (A * B) / Math.hypot(B * Math.cos(b), A * Math.sin(b))
}

function paramOf(phi, px, py) {
  const c = Math.cos(phi), n = Math.sin(phi)
  return Math.atan2((-px * n + py * c) / B, (px * c + py * n) / A)
}

// Duas órbitas iguais, giradas, se cruzam nas bissetrizes. Escolhemos o
// cruzamento mais afastado da Terra e afastamos levemente a órbita
// secundária, proporcional (em escala log) à distância de passagem real.
function buildGeometry(event) {
  const seed = Number(event.id) || 0
  const phi1 = -0.32
  const phi2 = phi1 + 0.55 + (seed % 5) * 0.12
  const miss = Math.max(0, Number(event.miss_distance_km) || 0)
  const gapPx = 3 + 9 * Math.min(1, Math.log10(1 + miss) / 2)

  let best = null
  for (let k = 0; k < 4; k++) {
    const theta = (phi1 + phi2) / 2 + (k * Math.PI) / 2
    const r = radiusAt(theta, phi1)
    const px = r * Math.cos(theta), py = r * Math.sin(theta)
    const u1 = paramOf(phi1, px, py), u2 = paramOf(phi2, px, py)
    // longe da Terra e do lado direito da cena
    const score = r + (px > 0 ? 1000 : 0)
    if (!best || score > best.score) best = { score, px, py, r, u1, u2 }
  }

  return {
    phi1, phi2,
    s2: 1 + gapPx / best.r,
    u1c: best.u1, u2c: best.u2,
    point: [C + best.px, C + best.py],
  }
}

const deg = rad => (rad * 180) / Math.PI

// Órbita completa (desenhada atrás da Terra) e metade frontal (desenhada por cima).
function Orbit({ phi, s = 1, className, front = false }) {
  const rx = A * s, ry = B * s
  const t = `rotate(${deg(phi)} ${C} ${C})`
  return front
    ? <path className={`${className} cl-orbit-front`} d={`M ${C + rx} ${C} A ${rx} ${ry} 0 0 1 ${C - rx} ${C}`} transform={t} />
    : <ellipse className={`${className} cl-orbit-back`} cx={C} cy={C} rx={rx} ry={ry} transform={t} />
}

const STARS = Array.from({ length: 46 }, (_, i) => {
  const r = (n => n - Math.floor(n))(Math.sin(i * 91.7) * 43758.5)
  const q = (n => n - Math.floor(n))(Math.sin(i * 12.9) * 15731.7)
  return [r * 400, q * 400, 0.4 + ((i * 7) % 5) / 6]
})

/* --------------------------------------------------------------- cena */

function OrbitScene({ event, playing }) {
  const g = useMemo(() => buildGeometry(event), [event])
  const sat1 = useRef(null), sat2 = useRef(null)
  const trail1 = useRef(null), trail2 = useRef(null)
  const link = useRef(null), ring = useRef(null)
  const clock = useRef(null), phase = useRef(null)
  const svg = useRef(null)
  const playingRef = useRef(playing)
  playingRef.current = playing

  useEffect(() => {
    const place = (satEl, trailEl, phi, u, s) => {
      const [x, y] = ellipsePoint(phi, u, s)
      satEl.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`)
      const behindEarth = Math.sin(u) < 0 && Math.hypot(x - C, y - C) < EARTH_R
      satEl.style.opacity = behindEarth ? 0.12 : 1
      const pts = []
      for (let i = 0; i < 18; i++) {
        const [tx, ty] = ellipsePoint(phi, u - i * 0.045, s)
        pts.push(`${tx.toFixed(1)},${ty.toFixed(1)}`)
      }
      trailEl.setAttribute('points', pts.join(' '))
      return [x, y]
    }

    const draw = tau => {
      const [x1, y1] = place(sat1.current, trail1.current, g.phi1, g.u1c + W1 * tau, 1)
      const [x2, y2] = place(sat2.current, trail2.current, g.phi2, g.u2c + W2 * tau, g.s2)
      const near = Math.max(0, 1 - Math.abs(tau) / 1.4)

      link.current.setAttribute('x1', x1); link.current.setAttribute('y1', y1)
      link.current.setAttribute('x2', x2); link.current.setAttribute('y2', y2)
      link.current.style.opacity = near
      ring.current.setAttribute('r', (9 + 30 * (1 - near)).toFixed(1))
      ring.current.style.opacity = near * 0.9

      const minutes = Math.round(Math.abs(tau) * MIN_PER_SEC)
      clock.current.textContent = minutes === 0 ? 'TCA' : `${tau < 0 ? 'T−' : 'T+'}${minutes} min`
      phase.current.textContent = Math.abs(tau) <= 1.4 ? 'Closest approach' : tau < 0 ? 'Approaching' : 'Receding'
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { draw(0); return }

    let tau = -HALF * 0.7
    let visible = true
    let last = performance.now()
    let raf = 0
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    io.observe(svg.current)

    const frame = now => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (playingRef.current && visible) {
        // desacelera perto do TCA para dar tempo de ler o momento crítico
        tau += dt * (0.3 + 0.7 * Math.min(1, Math.abs(tau) / 1.6))
        if (tau > HALF) tau = -HALF
      }
      draw(tau)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [g])

  const risk = riskOf(event.risk_level)
  const [px, py] = g.point
  const labelLeft = px > C

  return (
    <svg
      ref={svg}
      className="cl-scene"
      viewBox="0 0 400 400"
      role="img"
      aria-label={`Simulated replay of ${event.primary_satellite_name} and ${event.secondary_satellite_name} passing ${event.miss_distance_km} km apart.`}
      style={{ '--risk': risk.color }}
    >
      <defs>
        <radialGradient id="cl-earth" cx="38%" cy="34%" r="75%">
          <stop offset="0%" stopColor="#1d6f99" />
          <stop offset="45%" stopColor="#0b3654" />
          <stop offset="100%" stopColor="#030b16" />
        </radialGradient>
        <radialGradient id="cl-atmo" r="50%">
          <stop offset="78%" stopColor="#35b9e8" stopOpacity="0" />
          <stop offset="92%" stopColor="#35b9e8" stopOpacity=".28" />
          <stop offset="100%" stopColor="#35b9e8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cl-sweep" x1="0" x2="1">
          <stop offset="0%" stopColor="#35b9e8" stopOpacity="0" />
          <stop offset="100%" stopColor="#35b9e8" stopOpacity=".22" />
        </linearGradient>
        <clipPath id="cl-earth-clip"><circle cx={C} cy={C} r={EARTH_R} /></clipPath>
      </defs>

      {STARS.map(([x, y, r], i) => <circle key={i} className="cl-star" cx={x} cy={y} r={r} />)}
      {[90, 130, 170].map(r => <circle key={r} className="cl-range" cx={C} cy={C} r={r} />)}
      <g className="cl-sweep"><path d={`M ${C} ${C} L ${C + 185} ${C} A 185 185 0 0 0 ${C + 160} ${C - 92} Z`} fill="url(#cl-sweep)" /></g>

      <Orbit phi={g.phi1} className="cl-orbit-primary" />
      <Orbit phi={g.phi2} s={g.s2} className="cl-orbit-secondary" />

      <circle cx={C} cy={C} r={EARTH_R + 10} fill="url(#cl-atmo)" />
      <circle cx={C} cy={C} r={EARTH_R} fill="url(#cl-earth)" />
      <g clipPath="url(#cl-earth-clip)" className="cl-graticule">
        {[-30, 0, 30].map(lat => <ellipse key={lat} cx={C} cy={C + lat} rx={EARTH_R} ry={9} />)}
        {[-28, 0, 28].map(x => <ellipse key={x} cx={C + x} cy={C} rx={Math.abs(x) ? 22 : 1} ry={EARTH_R} />)}
        <circle cx={C + 26} cy={C + 18} r={EARTH_R} className="cl-terminator" />
      </g>

      <Orbit phi={g.phi1} className="cl-orbit-primary" front />
      <Orbit phi={g.phi2} s={g.s2} className="cl-orbit-secondary" front />

      <g className="cl-target" transform={`translate(${px} ${py})`}>
        <circle className="cl-target-pulse" r="9" />
        <circle className="cl-target-core" r="3" />
        <line x1="-14" x2="-6" /><line x1="6" x2="14" />
        <line y1="-14" y2="-6" /><line y1="6" y2="14" />
      </g>
      <g className="cl-callout" transform={`translate(${px + (labelLeft ? 18 : -18)} ${py + 30})`} textAnchor={labelLeft ? 'start' : 'end'}>
        <text className="cl-callout-value">{Number(event.miss_distance_km).toFixed(1)} km</text>
        <text className="cl-callout-label" y="13">MISS DISTANCE</text>
      </g>

      <polyline ref={trail1} className="cl-trail cl-trail-primary" />
      <polyline ref={trail2} className="cl-trail cl-trail-secondary" />
      <line ref={link} className="cl-link" />
      <circle ref={ring} className="cl-ring" cx={px} cy={py} />
      <g ref={sat1} className="cl-sat cl-sat-primary"><circle r="9" className="cl-sat-halo" /><circle r="4" /></g>
      <g ref={sat2} className="cl-sat cl-sat-secondary"><circle r="9" className="cl-sat-halo" /><circle r="4" /></g>

      <text ref={clock} className="cl-clock" x="20" y="378" />
      <text ref={phase} className="cl-phase" x="20" y="362" />
      <text className="cl-sim" x="380" y="378" textAnchor="end">SIMULATED REPLAY · NOT TO SCALE</text>
    </svg>
  )
}

/* ------------------------------------------------------------- painel */

function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(id)
  }, [interval])
  return now
}

export function Countdown({ iso }) {
  const now = useNow()
  let ms = new Date(iso).getTime() - now
  const past = ms < 0
  ms = Math.abs(ms)
  const parts = [
    [Math.floor(ms / 864e5), 'days'],
    [Math.floor((ms % 864e5) / 36e5), 'hrs'],
    [Math.floor((ms % 36e5) / 6e4), 'min'],
    [Math.floor((ms % 6e4) / 1e3), 'sec'],
  ]
  return (
    <div className="cl-countdown" aria-label={past ? 'Time since closest approach' : 'Time until closest approach'}>
      <span className="cl-k">{past ? 'Since closest approach' : 'Time to closest approach'}</span>
      <div className="cl-countdown-row">
        {parts.map(([v, u]) => (
          <span key={u}><b>{String(v).padStart(2, '0')}</b><small>{u}</small></span>
        ))}
      </div>
      <span className="cl-sub">{formatUtc(iso)}</span>
    </div>
  )
}

export function PocGauge({ poc }) {
  if (!poc) return null
  return (
    <div className="cl-gauge">
      <div className="cl-gauge-head">
        <span className="cl-k">Probability of collision</span>
        <span className="cl-gauge-value">{poc.mantissa} × 10<sup>{poc.exp}</sup></span>
      </div>
      <div className="cl-gauge-track">
        <span className="cl-gauge-fill" style={{ width: `${poc.gauge * 100}%` }} />
        <span className="cl-gauge-threshold" style={{ left: '60%' }} title="10⁻⁴" />
      </div>
      <div className="cl-gauge-scale"><span>10<sup>−7</sup></span><span style={{ left: '60%' }}>10<sup>−4</sup> threshold</span><span>10<sup>−2</sup></span></div>
    </div>
  )
}

function EventDetails({ event }) {
  const risk = riskOf(event.risk_level)
  const poc = formatPoc(event.probability_of_collision)
  const a = shortName(event.primary_satellite_name)
  const b = shortName(event.secondary_satellite_name)

  return (
    <div className="cl-details" style={{ '--risk': risk.color }} aria-live="polite">
      <div className="cl-pair">
        <span className="cl-badge"><TriangleAlert size={13} aria-hidden="true" />{risk.label}</span>
        <h3>
          <span className="cl-dot cl-dot-primary" />{event.primary_satellite_name}
          <i>×</i>
          <span className="cl-dot cl-dot-secondary" />{event.secondary_satellite_name}
        </h3>
        <span className="cl-sub">NORAD {event.primary_satellite_norad} · NORAD {event.secondary_satellite_norad}</span>
      </div>

      <p className="cl-story">
        On <strong>{formatUtc(event.time_of_closest_approach)}</strong>, {b} is expected to pass{' '}
        <strong>{Number(event.miss_distance_km).toFixed(1)} km</strong> from {a}
        {poc && <> — a collision chance of about <strong>1 in {poc.odds}</strong></>}.
      </p>

      <Countdown iso={event.time_of_closest_approach} />

      <dl className="cl-metrics">
        <div><dt>Miss distance</dt><dd>{Number(event.miss_distance_km).toFixed(3)} <small>km</small></dd></div>
        <div><dt>Radial separation</dt><dd>{Math.round(Number(event.radial_distance_m))} <small>m</small></dd></div>
        <div><dt>Odds</dt><dd>{poc ? <>1 : {poc.odds}</> : '—'}</dd></div>
        <div><dt>Source</dt><dd className="cl-small">{event.data_source} · {event.status}</dd></div>
      </dl>

      <PocGauge poc={poc} />
    </div>
  )
}

/* ------------------------------------------------------------ principal */

export default function CosmosLiveDemo() {
  const { status, events } = useCosmosEvents()
  const [index, setIndex] = useState(0)
  const [autoCycle, setAutoCycle] = useState(true)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!autoCycle || events.length < 2) return
    const id = setInterval(() => setIndex(i => (i + 1) % events.length), 12000)
    return () => clearInterval(id)
  }, [autoCycle, events.length])

  if (status === 'loading') {
    return (
      <div className="cl-console cl-state">
        <div className="cl-radar" aria-hidden="true" />
        <p>Querying COSMOS for upcoming conjunctions…</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="cl-console cl-state cl-state-error" role="alert">
        <TriangleAlert size={28} aria-hidden="true" />
        <p>Unable to load COSMOS data right now. Please try again later.</p>
      </div>
    )
  }

  if (status === 'empty') {
    return (
      <div className="cl-console cl-state cl-state-safe">
        <ShieldCheck size={36} aria-hidden="true" />
        <div>
          <h3>Orbit Secure</h3>
          <p>No conjunction events are currently available in the forecast window. Check again soon for updated orbital information.</p>
        </div>
      </div>
    )
  }

  const event = events[Math.min(index, events.length - 1)]

  return (
    <div className="cl-console">
      <div className="cl-stage">
        <div className="cl-stage-bar">
          <span className="cl-live"><span className="status-dot" />LIVE · COSMOS API</span>
          <button
            type="button"
            className="cl-icon-btn"
            onClick={() => setPlaying(p => !p)}
            aria-label={playing ? 'Pause animation' : 'Play animation'}
          >
            {playing ? <Pause size={15} /> : <Play size={15} />}
          </button>
        </div>
        <OrbitScene key={event.id} event={event} playing={playing} />
        <div className="cl-legend">
          <span><span className="cl-dot cl-dot-primary" />{shortName(event.primary_satellite_name)}</span>
          <span><span className="cl-dot cl-dot-secondary" />{shortName(event.secondary_satellite_name)}</span>
          <span><span className="cl-dot cl-dot-target" />Closest approach</span>
        </div>
      </div>

      <div className="cl-panel">
        <EventDetails event={event} />

        <div className="cl-list" role="tablist" aria-label="Detected conjunctions">
          <span className="cl-k">{events.length} conjunction{events.length > 1 ? 's' : ''} detected</span>
          {events.map((ev, i) => {
            const r = riskOf(ev.risk_level)
            return (
              <button
                key={ev.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                className="cl-item"
                style={{ '--risk': r.color }}
                onClick={() => { setIndex(i); setAutoCycle(false) }}
              >
                <span className="cl-item-risk" />
                <span className="cl-item-names">{shortName(ev.primary_satellite_name)} × {shortName(ev.secondary_satellite_name)}</span>
                <span className="cl-item-meta">{formatUtc(ev.time_of_closest_approach)} · {Number(ev.miss_distance_km).toFixed(1)} km</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
