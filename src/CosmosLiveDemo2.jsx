// LIVE2 — versão panorâmica: Terra realista, cena larga e informações na horizontal.
// Para voltar ao LIVE1, troque o import em App.jsx para './CosmosLiveDemo.jsx'.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play, ShieldCheck, TriangleAlert } from 'lucide-react'
import {
  useCosmosEvents, riskOf, formatPoc, shortName, Countdown, PocGauge,
} from './CosmosLiveDemo.jsx'
import { useI18n } from './i18n/LanguageContext.jsx'
import earthTexture from './assets/earth-texture.jpg'
import './cosmos-live2.css'

/* ------------------------------------------------------ geometria orbital */

const VH = 300            // altura fixa do viewBox; a largura acompanha a tela
const HALF = 8            // meia duração do replay, em segundos
const W1 = 0.32, W2 = 0.27
const MIN_PER_SEC = 5     // 1 s de animação ≈ 5 min de órbita
const EARTH_TURN_SEC = 80 // uma volta completa da Terra

function layoutFor(vw) {
  const cx = vw / 2, cy = VH / 2 + 4
  const R = Math.min(78, Math.max(52, vw * 0.13))
  const A = Math.min(vw / 2 - 34, 430)
  const B = Math.max(R + 16, A * 0.25)
  return { vw, cx, cy, R, A, B }
}

function ellipsePoint(L, phi, u, s = 1) {
  const x = L.A * s * Math.cos(u), y = L.B * s * Math.sin(u)
  const c = Math.cos(phi), n = Math.sin(phi)
  return [L.cx + x * c - y * n, L.cy + x * n + y * c]
}

function radiusAt(L, theta, phi) {
  const b = theta - phi
  return (L.A * L.B) / Math.hypot(L.B * Math.cos(b), L.A * Math.sin(b))
}

function paramOf(L, phi, px, py) {
  const c = Math.cos(phi), n = Math.sin(phi)
  return Math.atan2((-px * n + py * c) / L.B, (px * c + py * n) / L.A)
}

function buildGeometry(event, L) {
  const seed = Number(event.id) || 0
  const phi1 = -0.1
  const phi2 = 0.06 + (seed % 5) * 0.025
  const miss = Math.max(0, Number(event.miss_distance_km) || 0)
  const gapPx = 3 + 9 * Math.min(1, Math.log10(1 + miss) / 2)

  let best = null
  for (let k = 0; k < 4; k++) {
    const theta = (phi1 + phi2) / 2 + (k * Math.PI) / 2
    const r = radiusAt(L, theta, phi1)
    const px = r * Math.cos(theta), py = r * Math.sin(theta)
    // longe da Terra e do lado direito da cena
    const score = r + (px > 0 ? 1000 : 0)
    if (!best || score > best.score) {
      best = { score, px, py, r, u1: paramOf(L, phi1, px, py), u2: paramOf(L, phi2, px, py) }
    }
  }

  return {
    phi1, phi2,
    s2: 1 + gapPx / best.r,
    u1c: best.u1, u2c: best.u2,
    point: [L.cx + best.px, L.cy + best.py],
  }
}

const deg = rad => (rad * 180) / Math.PI

function Orbit({ L, phi, s = 1, className, front = false }) {
  const rx = L.A * s, ry = L.B * s
  const t = `rotate(${deg(phi)} ${L.cx} ${L.cy})`
  return front
    ? <path className={`${className} cl-orbit-front`} d={`M ${L.cx + rx} ${L.cy} A ${rx} ${ry} 0 0 1 ${L.cx - rx} ${L.cy}`} transform={t} />
    : <ellipse className={`${className} cl-orbit-back`} cx={L.cx} cy={L.cy} rx={rx} ry={ry} transform={t} />
}

function makeStars(vw) {
  const count = Math.round(vw / 9)
  return Array.from({ length: count }, (_, i) => {
    const r = (n => n - Math.floor(n))(Math.sin(i * 91.7) * 43758.5)
    const q = (n => n - Math.floor(n))(Math.sin(i * 12.9) * 15731.7)
    return [r * vw, q * VH, 0.35 + ((i * 7) % 5) / 6]
  })
}

/* ------------------------------------------------------------ Terra */

// Textura equiretangular (NASA Blue Marble) rolando dentro de um círculo.
// Metade da textura (180°) ocupa o diâmetro, então a largura total é 4R.
function Earth({ L, earthRef }) {
  const { cx, cy, R } = L
  return (
    <g className="cl2-earth">
      <circle cx={cx} cy={cy} r={R + 14} fill="url(#cl2-atmo)" />
      <g clipPath="url(#cl2-earth-clip)">
        <rect x={cx - R} y={cy - R} width={2 * R} height={2 * R} fill="#04142a" />
        <g ref={earthRef}>
          <image href={earthTexture} x={cx - R} y={cy - R} width={4 * R} height={2 * R} preserveAspectRatio="none" />
          <image href={earthTexture} x={cx + 3 * R} y={cy - R} width={4 * R} height={2 * R} preserveAspectRatio="none" />
        </g>
        <circle cx={cx} cy={cy} r={R} fill="url(#cl2-night)" />
        <circle cx={cx} cy={cy} r={R} fill="url(#cl2-limb)" />
        <circle cx={cx} cy={cy} r={R} fill="url(#cl2-spec)" />
      </g>
      <circle cx={cx} cy={cy} r={R} className="cl2-earth-rim" />
    </g>
  )
}

/* --------------------------------------------------------------- cena */

function OrbitScene({ event, playing }) {
  const { t } = useI18n()
  // Os rótulos da fase ficam num ref: trocar de idioma não reinicia a animação.
  const phaseLabels = useRef({})
  phaseLabels.current = { closest: t('demo.closest'), approaching: t('demo.approaching'), receding: t('demo.receding') }
  const wrap = useRef(null)
  const [vw, setVw] = useState(900)

  useEffect(() => {
    const el = wrap.current
    const measure = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width && height) setVw(Math.max(320, Math.round((VH * width) / height)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const L = useMemo(() => layoutFor(vw), [vw])
  const g = useMemo(() => buildGeometry(event, L), [event, L])
  const stars = useMemo(() => makeStars(vw), [vw])

  const sat1 = useRef(null), sat2 = useRef(null)
  const trail1 = useRef(null), trail2 = useRef(null)
  const link = useRef(null), ring = useRef(null)
  const clock = useRef(null), phase = useRef(null)
  const earthRef = useRef(null)
  const playingRef = useRef(playing)
  playingRef.current = playing
  const tauRef = useRef(-HALF * 0.7)   // sobrevive a redimensionamentos
  const spinRef = useRef(0)

  useEffect(() => {
    const place = (satEl, trailEl, phi, u, s) => {
      const [x, y] = ellipsePoint(L, phi, u, s)
      satEl.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`)
      const behindEarth = Math.sin(u) < 0 && Math.hypot(x - L.cx, y - L.cy) < L.R
      satEl.style.opacity = behindEarth ? 0.1 : 1
      const pts = []
      for (let i = 0; i < 20; i++) {
        const [tx, ty] = ellipsePoint(L, phi, u - i * 0.03, s)
        pts.push(`${tx.toFixed(1)},${ty.toFixed(1)}`)
      }
      trailEl.setAttribute('points', pts.join(' '))
      return [x, y]
    }

    const draw = () => {
      const tau = tauRef.current
      const [x1, y1] = place(sat1.current, trail1.current, g.phi1, g.u1c + W1 * tau, 1)
      const [x2, y2] = place(sat2.current, trail2.current, g.phi2, g.u2c + W2 * tau, g.s2)
      const near = Math.max(0, 1 - Math.abs(tau) / 1.6)

      link.current.setAttribute('x1', x1); link.current.setAttribute('y1', y1)
      link.current.setAttribute('x2', x2); link.current.setAttribute('y2', y2)
      link.current.style.opacity = near
      ring.current.setAttribute('r', (9 + 34 * (1 - near)).toFixed(1))
      ring.current.style.opacity = near * 0.9

      const off = -((spinRef.current % 1) * 4 * L.R)
      earthRef.current.setAttribute('transform', `translate(${off.toFixed(2)} 0)`)

      const minutes = Math.round(Math.abs(tau) * MIN_PER_SEC)
      clock.current.textContent = minutes === 0 ? 'TCA' : `${tau < 0 ? 'T−' : 'T+'}${minutes} min`
      const labels = phaseLabels.current
      phase.current.textContent = Math.abs(tau) <= 1.6 ? labels.closest : tau < 0 ? labels.approaching : labels.receding
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { tauRef.current = 0; draw(); return }

    let visible = true
    let last = performance.now()
    let raf = 0
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    io.observe(wrap.current)

    const frame = now => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (playingRef.current && visible) {
        const tau = tauRef.current
        // desacelera perto do TCA para dar tempo de ler o momento crítico
        let next = tau + dt * (0.3 + 0.7 * Math.min(1, Math.abs(tau) / 1.8))
        if (next > HALF) next = -HALF
        tauRef.current = next
        spinRef.current += dt / EARTH_TURN_SEC
      }
      draw()
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [g, L])

  const risk = riskOf(event.risk_level)
  const [px, py] = g.point
  const { cx, cy, R } = L

  return (
    <div ref={wrap} className="cl2-scene-wrap">
      <svg
        className="cl2-scene"
        viewBox={`0 0 ${vw} ${VH}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={t('demo.sceneAria', { a: event.primary_satellite_name, b: event.secondary_satellite_name, km: event.miss_distance_km })}
        style={{ '--risk': risk.color }}
      >
        <defs>
          <clipPath id="cl2-earth-clip"><circle cx={cx} cy={cy} r={R} /></clipPath>
          {/* lado noturno (direita/baixo) */}
          <radialGradient id="cl2-night" cx="18%" cy="22%" r="105%">
            <stop offset="45%" stopColor="#000" stopOpacity="0" />
            <stop offset="78%" stopColor="#01040b" stopOpacity=".72" />
            <stop offset="100%" stopColor="#01040b" stopOpacity=".95" />
          </radialGradient>
          {/* escurecimento da borda + brilho azul da atmosfera */}
          <radialGradient id="cl2-limb" r="50%">
            <stop offset="70%" stopColor="#000" stopOpacity="0" />
            <stop offset="93%" stopColor="#0a2a4a" stopOpacity=".55" />
            <stop offset="100%" stopColor="#5fc8f2" stopOpacity=".55" />
          </radialGradient>
          <radialGradient id="cl2-spec" cx="32%" cy="30%" r="38%">
            <stop offset="0%" stopColor="#fff" stopOpacity=".22" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cl2-atmo" r="50%">
            <stop offset="80%" stopColor="#35b9e8" stopOpacity="0" />
            <stop offset="88%" stopColor="#35b9e8" stopOpacity=".32" />
            <stop offset="100%" stopColor="#35b9e8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {stars.map(([x, y, r], i) => <circle key={i} className="cl-star" cx={x} cy={y} r={r} />)}

        <Orbit L={L} phi={g.phi1} className="cl-orbit-primary" />
        <Orbit L={L} phi={g.phi2} s={g.s2} className="cl-orbit-secondary" />

        <Earth L={L} earthRef={earthRef} />

        <Orbit L={L} phi={g.phi1} className="cl-orbit-primary" front />
        <Orbit L={L} phi={g.phi2} s={g.s2} className="cl-orbit-secondary" front />

        <g className="cl-target" transform={`translate(${px} ${py})`}>
          <circle className="cl-target-pulse" r="9" />
          <circle className="cl-target-core" r="3" />
          <line x1="-14" x2="-6" /><line x1="6" x2="14" />
          <line y1="-14" y2="-6" /><line y1="6" y2="14" />
        </g>
        <g className="cl-callout" transform={`translate(${px - 20} ${py - 30})`} textAnchor="end">
          <text className="cl-callout-value">{Number(event.miss_distance_km).toFixed(1)} km</text>
          <text className="cl-callout-label" y="13">{t('demo.missLabel')}</text>
        </g>

        <polyline ref={trail1} className="cl-trail cl-trail-primary" />
        <polyline ref={trail2} className="cl-trail cl-trail-secondary" />
        <line ref={link} className="cl-link" />
        <circle ref={ring} className="cl-ring" cx={px} cy={py} />
        <g ref={sat1} className="cl-sat cl-sat-primary"><circle r="9" className="cl-sat-halo" /><circle r="4" /></g>
        <g ref={sat2} className="cl-sat cl-sat-secondary"><circle r="9" className="cl-sat-halo" /><circle r="4" /></g>

        <text ref={phase} className="cl-phase" x="18" y={VH - 34} />
        <text ref={clock} className="cl-clock" x="18" y={VH - 16} />
        <text className="cl-sim" x={vw - 18} y={VH - 16} textAnchor="end">{t('demo.sim')}</text>
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------ principal */

export default function CosmosLiveDemo2() {
  const { t, locale } = useI18n()
  const { status, events } = useCosmosEvents()
  const [index, setIndex] = useState(0)
  const [autoCycle, setAutoCycle] = useState(true)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!autoCycle || events.length < 2) return
    const id = setInterval(() => setIndex(i => (i + 1) % events.length), 14000)
    return () => clearInterval(id)
  }, [autoCycle, events.length])

  if (status === 'loading') {
    return (
      <div className="cl-console cl2-console cl-state">
        <div className="cl-radar" aria-hidden="true" />
        <p>{t('demo.loading')}</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="cl-console cl2-console cl-state cl-state-error" role="alert">
        <TriangleAlert size={28} aria-hidden="true" />
        <p>{t('demo.error')}</p>
      </div>
    )
  }

  if (status === 'empty') {
    return (
      <div className="cl-console cl2-console cl-state cl-state-safe">
        <ShieldCheck size={36} aria-hidden="true" />
        <div>
          <h3>{t('demo.safeTitle')}</h3>
          <p>{t('demo.safeBody')}</p>
        </div>
      </div>
    )
  }

  const event = events[Math.min(index, events.length - 1)]
  const risk = riskOf(event.risk_level)
  const poc = formatPoc(event.probability_of_collision, locale)
  const a = shortName(event.primary_satellite_name)
  const b = shortName(event.secondary_satellite_name)
  const km = <strong>{Number(event.miss_distance_km).toFixed(1)} km</strong>

  return (
    <div className="cl-console cl2-console">
      <div className="cl2-bar">
        <span className="cl-live"><span className="status-dot" />{t('demo.live')}</span>
        <div className="cl2-tabs" role="tablist" aria-label={t('demo.tabsAria')}>
          {events.map((ev, i) => (
            <button
              key={ev.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              className="cl2-tab"
              style={{ '--risk': riskOf(ev.risk_level).color }}
              onClick={() => { setIndex(i); setAutoCycle(false) }}
            >
              <span className="cl-item-risk" />
              <span className="cl2-tab-names">{shortName(ev.primary_satellite_name)} × {shortName(ev.secondary_satellite_name)}</span>
              <span className="cl2-tab-meta">{Number(ev.miss_distance_km).toFixed(1)} km</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="cl-icon-btn"
          onClick={() => setPlaying(p => !p)}
          aria-label={playing ? t('demo.pause') : t('demo.play')}
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}
        </button>
      </div>

      <OrbitScene key={event.id} event={event} playing={playing} />

      <div className="cl2-strip" style={{ '--risk': risk.color }} aria-live="polite" key={`info-${event.id}`}>
        <div className="cl2-cell cl2-identity">
          <span className="cl-badge"><TriangleAlert size={13} aria-hidden="true" />{t(`demo.risk.${risk.key}`)}</span>
          <h3>
            <span><span className="cl-dot cl-dot-primary" />{event.primary_satellite_name}</span>
            <i>×</i>
            <span><span className="cl-dot cl-dot-secondary" />{event.secondary_satellite_name}</span>
          </h3>
          <p className="cl-story">
            {poc
              ? t('demo.storyOdds', { a, b, km, odds: <strong>{t('demo.oneIn', { n: poc.odds })}</strong> })
              : t('demo.story', { a, b, km })}
          </p>
        </div>

        <div className="cl2-cell">
          <Countdown iso={event.time_of_closest_approach} />
        </div>

        <dl className="cl2-cell cl-metrics">
          <div><dt>{t('demo.miss')}</dt><dd>{Number(event.miss_distance_km).toFixed(2)} <small>km</small></dd></div>
          <div><dt>{t('demo.radial')}</dt><dd>{Math.round(Number(event.radial_distance_m))} <small>m</small></dd></div>
          <div><dt>{t('demo.norad')}</dt><dd className="cl-small">{event.primary_satellite_norad} · {event.secondary_satellite_norad}</dd></div>
          <div><dt>{t('demo.source')}</dt><dd className="cl-small">{event.data_source} · {event.status}</dd></div>
        </dl>

        <div className="cl2-cell">
          <PocGauge poc={poc} />
        </div>
      </div>
    </div>
  )
}
