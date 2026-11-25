import { useState, useEffect } from 'react'
import logo from './assets/logo.png';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Menu, X, Orbit,
  Radar, ShieldCheck, Satellite, Activity, Target, ChevronRight,
  Mail, Globe2, Users, CalendarDays, FileText, AlertTriangle
} from 'lucide-react'

const EMAIL = 'safeonorbit@safeonorbit.space'
const navItems = [
  ['Home', '#inicio'], ['Challenge', '#solucao'], ['Tracked Objects', '#objetos'], ['COSMOS', '#cosmos'],
  ['Technology', '#tecnologia'], ['Impact', '#impacto'], ['Team', '#equipe'],
  ['Events', '#eventos'], ['Technical Papers', '#publicacoes'],
]

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="Safe on Orbit — home">
        <span className="brand-mark"><img src={logo} alt="Logo da empresa" width="30" /></span>
        <span className="brand-name">safe<span>on</span>orbit</span>
      </a>
      <nav className={open ? 'nav nav-open' : 'nav'} aria-label="Main navigation">
        {navItems.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <a className="nav-cta" href={`mailto:${EMAIL}`} onClick={() => setOpen(false)}>Contact <ArrowUpRight size={16} /></a>
      </nav>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
        {open ? <X /> : <Menu />}
      </button>
    </header>
  )
}

function Eyebrow({ children }) { return <div className="eyebrow"><span />{children}</div> }

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-bg" /><div className="hero-grid" />
      <div className="hero-content container">
        <Eyebrow>Space Situational Awareness</Eyebrow>
        <h1>Towards a <em>Free-Collision</em> Cosmos</h1>
        <p className="hero-copy">Space is becoming increasingly crowded. Safe on Orbit develops solutions to improve Space Situational Awareness (SSA), support collision avoidance and contribute to a safer, more sustainable orbital environment.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#cosmos">Discover COSMOS <ArrowRight size={17} /></a>
          <a className="button button-ghost" href={`mailto:${EMAIL}`}>Contact Us <ArrowDownRight size={17} /></a>
        </div>
        <div className="hero-note"><span className="status-dot" />The first company exclusively dedicated to SSA</div>
      </div>
      <div className="orbit-annotation annotation-one"><span>01 / SPACE SAFETY</span><i /></div>
      <div className="orbit-annotation annotation-two"><i /><span>EARTH ORBIT</span></div>
      <div className="hero-bottom container"><span>SPACE SAFETY · INTELLIGENCE · SUSTAINABILITY</span><a href="#solucao" aria-label="Scroll to learn about the challenge"><ArrowDownRight size={20} /></a></div>
    </section>
  )
}

function Challenge() {
  return (
    <section className="section challenge-section" id="solucao">
      <div className="container challenge-layout">
        <div className="section-intro"><Eyebrow>The orbital challenge</Eyebrow><h2>Space is getting busier. <em>Safety must evolve with it.</em></h2></div>
        <div className="challenge-copy">
          <p>Satellites are essential to communication, navigation, Earth observation and countless services. As the number of objects in orbit grows, space operations become more complex and the risk of dangerous close approaches increases.</p>
          <p>Safe on Orbit develops solutions that help operators understand the orbital environment, assess risks in advance and make better-informed decisions.</p>
          <a className="text-link" href="#tecnologia">Turning data into decisions <ArrowRight size={16} /></a>
        </div>
      </div>
      <div className="container metrics-row">
        <div className="metric"><span className="metric-icon"><Radar /></span><div><strong>Monitor</strong><p>Track objects and trajectories in orbit.</p></div></div>
        <div className="metric"><span className="metric-icon"><Activity /></span><div><strong>Anticipate</strong><p>Identify close approaches that require attention.</p></div></div>
        <div className="metric"><span className="metric-icon"><ShieldCheck /></span><div><strong>Decide</strong><p>Support operational choices with reliable information.</p></div></div>
      </div>
    </section>
  )
}

function TrackedObjects() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState('');
  const [eventoAtivo, setEventoAtivo] = useState(null);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_COSMOS_API_KEY;

    fetch('https://api.safeonorbit.space/api/conjunctions/v1/events/?norad_id=25544&limit=5', {
      method: 'GET',
      headers: { 'X-Api-Key': API_KEY }
    })
      .then(async resposta => {
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        return resposta.json();
      })
      .then(dados => {
        const lista = dados.results || dados.data || dados.events || (Array.isArray(dados) ? dados : []);
        setEventos(lista);
        setCarregando(false);
      })
      .catch(erro => {
        setErroApi(erro.message || 'ERR_CONNECTION_LOST');
        setCarregando(false);
      });
  }, []);

  const keyframes = `
    @keyframes spinRadar {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes orbitISS {
      0% { transform: rotate(-25deg) translateX(-115px) scale(0.75); opacity: 0.4; z-index: 1; }
      25% { transform: rotate(-25deg) translateX(0px) scale(1.15); opacity: 1; z-index: 10; }
      50% { transform: rotate(-25deg) translateX(115px) scale(0.75); opacity: 0.4; z-index: 1; }
      75% { transform: rotate(-25deg) translateX(0px) scale(0.55); opacity: 0.15; z-index: 0; }
      100% { transform: rotate(-25deg) translateX(-115px) scale(0.75); opacity: 0.4; z-index: 1; }
    }
    @keyframes orbitDebris {
      0% { transform: rotate(35deg) translateX(125px) scale(0.8); opacity: 0.5; z-index: 1; }
      25% { transform: rotate(35deg) translateX(0px) scale(1.2); opacity: 1; z-index: 10; }
      50% { transform: rotate(35deg) translateX(-125px) scale(0.8); opacity: 0.5; z-index: 1; }
      75% { transform: rotate(35deg) translateX(0px) scale(0.5); opacity: 0.15; z-index: 0; }
      100% { transform: rotate(35deg) translateX(125px) scale(0.8); opacity: 0.5; z-index: 1; }
    }
    @keyframes pulseAlert {
      0%, 100% { box-shadow: 0 0 8px #ef4444, 0 0 16px rgba(239, 68, 68, 0.6); }
      50% { box-shadow: 0 0 14px #ef4444, 0 0 28px rgba(239, 68, 68, 0.9); }
    }
  `;

  return (
    <section className="tracked-section" id="objetos">
      <style>{keyframes}</style>
      <div className="container tracked-inner">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radar size={20} color="#38bdf8" />
            <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#38bdf8', letterSpacing: '2px', textTransform: 'uppercase' }}>
              COSMOS LIVE MONITORING
            </h2>
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
            ● LIVE TELEMETRY · NORAD 25544
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          background: 'radial-gradient(circle at 25% 50%, #0b192c 0%, #020617 75%)',
          padding: '2rem',
          borderRadius: '14px',
          border: '1px solid #1e293b',
          alignItems: 'center'
        }}>
          {/* COLUNA ESQUERDA: Simulação Orbital */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              position: 'relative',
              width: '310px',
              height: '310px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Anel externo */}
              <div style={{
                position: 'absolute',
                width: '290px',
                height: '290px',
                borderRadius: '50%',
                border: '1px dashed rgba(56, 189, 248, 0.22)'
              }} />

              {/* Anel médio com varredura de radar */}
              <div style={{
                position: 'absolute',
                width: '220px',
                height: '220px',
                borderRadius: '50%',
                border: '1px solid rgba(56, 189, 248, 0.15)',
                background: 'conic-gradient(from 0deg, rgba(56, 189, 248, 0.14) 0deg, transparent 70deg)',
                animation: 'spinRadar 9s linear infinite'
              }} />

              {/* Trajetória inclinada 1 (ISS) */}
              <div style={{
                position: 'absolute',
                width: '250px',
                height: '72px',
                borderRadius: '50%',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                transform: 'rotate(-25deg)',
                pointerEvents: 'none'
              }} />

              {/* Trajetória inclinada 2 (Conjunção) */}
              <div style={{
                position: 'absolute',
                width: '265px',
                height: '80px',
                borderRadius: '50%',
                border: '1px dashed rgba(239, 68, 68, 0.3)',
                transform: 'rotate(35deg)',
                pointerEvents: 'none'
              }} />

              {/* Planeta Terra */}
              <div style={{
                position: 'relative',
                width: '124px',
                height: '124px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 32% 28%, #38bdf8 0%, #0284c7 35%, #1e3a8a 70%, #020617 100%)',
                boxShadow: '0 0 35px rgba(56, 189, 248, 0.35), inset -16px -16px 28px rgba(2, 6, 23, 0.85)',
                zIndex: 5
              }} />

              {/* Satélite principal (ISS) sobrevoando */}
              <div style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#e0f2fe',
                animation: 'orbitISS 11s ease-in-out infinite'
              }}>
                <div style={{
                  background: '#0f172a',
                  border: '1px solid #38bdf8',
                  borderRadius: '50%',
                  padding: '4px',
                  display: 'flex',
                  boxShadow: '0 0 10px rgba(56, 189, 248, 0.8)'
                }}>
                  <Satellite size={13} color="#38bdf8" />
                </div>
                <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', background: 'rgba(2, 6, 23, 0.85)', padding: '1px 5px', borderRadius: '3px', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                  ISS
                </span>
              </div>

              {/* Objetos secundários vindos da API */}
              {!carregando && !erroApi && eventos.slice(0, 3).map((evento, i) => {
                const isHigh = evento.risk_level === 'HIGH';
                const cor = isHigh ? '#ef4444' : '#eab308';
                const selecionado = eventoAtivo === i;

                return (
                  <div
                    key={evento.id || i}
                    style={{
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      animation: `orbitDebris ${13 + i * 3}s ease-in-out infinite`,
                      animationDelay: `-${i * 4}s`
                    }}
                  >
                    <span style={{
                      width: selecionado ? '12px' : '9px',
                      height: selecionado ? '12px' : '9px',
                      borderRadius: '50%',
                      background: cor,
                      animation: isHigh ? 'pulseAlert 1.4s infinite' : 'none',
                      border: '1px solid #fff'
                    }} />
                    <span style={{
                      fontSize: '0.62rem',
                      fontFamily: 'monospace',
                      color: '#fecaca',
                      background: 'rgba(127, 29, 29, 0.85)',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      whiteSpace: 'nowrap'
                    }}>
                      {evento.secondary_satellite_name || `OBJ-${evento.secondary_satellite_norad || i + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legenda minimalista abaixo do radar */}
            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', display: 'inline-block' }} /> ISS (PRIMARY)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} /> HIGH RISK CONJUNCTION
              </span>
            </div>
          </div>

          {/* COLUNA DIREITA: Lista de Eventos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {carregando ? (
              <p style={{ color: '#38bdf8', fontFamily: 'monospace' }}>&gt; SCANNING ORBITAL DATA...</p>
            ) : erroApi ? (
              <div style={{ color: '#ef4444', border: '1px solid #ef4444', padding: '1rem', borderRadius: '6px', fontFamily: 'monospace' }}>
                {erroApi}
              </div>
            ) : eventos.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.08)', padding: '1.25rem', borderRadius: '8px', fontFamily: 'monospace' }}>
                <ShieldCheck size={24} />
                <div>
                  <strong>ORBIT SECURE</strong>
                  <div style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>No conjunction events in current window.</div>
                </div>
              </div>
            ) : (
              eventos.map((evento, index) => {
                const isHigh = evento.risk_level === 'HIGH';
                const corBorda = isHigh ? '#ef4444' : '#eab308';

                return (
                  <div
                    key={evento.id || index}
                    onMouseEnter={() => setEventoAtivo(index)}
                    onMouseLeave={() => setEventoAtivo(null)}
                    style={{
                      borderLeft: `4px solid ${corBorda}`,
                      background: eventoAtivo === index ? 'rgba(30, 41, 59, 0.85)' : 'rgba(15, 23, 42, 0.65)',
                      padding: '0.9rem 1rem',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      transition: 'background 0.2s ease',
                      cursor: 'default'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        {evento.secondary_satellite_name || 'UNKNOWN OBJECT'}
                      </span>
                      <span style={{ color: corBorda, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {isHigh && <AlertTriangle size={14} />} {evento.risk_level}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem' }}>
                      <span>TCA: <strong style={{ color: '#cbd5e1' }}>{new Date(evento.time_of_closest_approach).toLocaleTimeString()}</strong></span>
                      <span>Miss: <strong style={{ color: '#38bdf8' }}>{Number(evento.miss_distance_km).toFixed(2)} km</strong></span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Cosmos() {
  return (
    <section className="cosmos-section" id="cosmos">
      <div className="cosmos-image"><div className="image-caption"><span className="caption-line" />ORBITAL ENVIRONMENT — OPERATIONAL VIEW</div></div>
      <div className="cosmos-content">
        <Eyebrow>Our platform</Eyebrow>
        <div className="cosmos-wordmark"><span className="cosmos-symbol"><img src={logo} alt="Logo da empresa" width="30" /></span><span>COSMOS<small>Collision Safety Management Orbital System</small></span></div>
        <h2>More context to act. <em>More confidence to decide.</em></h2>
        <p>COSMOS is Safe on Orbit's platform for conjunction analysis and collision prevention support. It combines orbital data and predictive analysis to help teams understand close-approach events and assess possible courses of action.</p>
        <ul className="check-list">
          <li><span><ChevronRight size={16} /></span>Analysis of close approaches between space objects</li>
          <li><span><ChevronRight size={16} /></span>Risk assessment to support operational decisions</li>
          <li><span><ChevronRight size={16} /></span>Support for collision avoidance strategy analysis</li>
        </ul>
        <a className="button button-primary" href={`mailto:${EMAIL}`}>Talk to our team <ArrowRight size={17} /></a>
        <p className="fine-print">COSMOS supports decision-making. Maneuver assessment and execution remain the responsibility of satellite operators.</p>
      </div>
    </section>
  )
}

function Technology() {
  const items = [
    { number: '01', icon: <Satellite />, title: 'Orbital data', body: 'Integration of information about the positions and trajectories of space objects.' },
    { number: '02', icon: <Radar />, title: 'Conjunction analysis', body: 'Identification of close approaches and assessment of scenarios that require attention.' },
    { number: '03', icon: <Target />, title: 'Decision support', body: 'Organized information to support risk assessment and operational planning.' },
  ]
  return <section className="section technology-section" id="tecnologia"><div className="container">
    <div className="tech-heading"><div><Eyebrow>Our approach</Eyebrow><h2>Orbital complexity.<br /><em>Operational clarity.</em></h2></div><p>From raw information to situational awareness: a data-driven approach to supporting safer space operations.</p></div>
    <div className="process-grid">{items.map(item => <article className="process-card" key={item.number}><div className="process-top"><span>{item.number}</span><span className="process-icon">{item.icon}</span></div><h3>{item.title}</h3><p>{item.body}</p><div className="card-line" /></article>)}</div>
  </div></section>
}

function Impact() {
  return <section className="section impact-section" id="impacto"><div className="container impact-layout">
    <div><Eyebrow>Our impact</Eyebrow><h2>Protecting the orbital environment is a <em>shared global responsibility.</em></h2></div>
    <div className="impact-copy"><p>Space infrastructure supports essential services and connects people, businesses and societies around the world. As orbital activity expands, preserving the long-term usability of space becomes increasingly important.</p><p>By supporting Space Situational Awareness and more informed operational decisions, Safe on Orbit contributes to a safer and more sustainable space environment for current and future generations.</p><div className="impact-stat"><strong>10 days</strong><span>Updated planning horizon</span></div></div>
  </div></section>
}

const team = ['Luis Felipe Alves de Oliveira', 'Victoria Martins Costa', 'Marcos Vinícius Gomes de Matos', 'Thiago Galbiatti Vespa']
function Team() {
  return <section className="section team-section" id="equipe"><div className="container"><div className="team-heading"><div><Eyebrow>People behind the mission</Eyebrow><h2>Meet our <em>team.</em></h2></div><p>Different skills, one shared commitment to a safer orbital environment.</p></div>
    <div className="team-grid">{team.map((name, i) => <article className="team-card" key={name}><div className="team-avatar"><Users size={27} /></div><span>0{i + 1} / SAFE ON ORBIT</span><h3>{name}</h3></article>)}</div>
  </div></section>
}

function Updates() {
  return <section className="section updates-section" id="eventos"><div className="container"><div className="updates-heading"><div><Eyebrow>Stay connected</Eyebrow><h2>Events & <em>news.</em></h2></div><p>Follow Safe on Orbit's participation in the space community. This section will be updated with upcoming events and announcements.</p></div>
    <article className="update-placeholder"><span className="update-icon"><CalendarDays /></span><div><strong>Events coming soon</strong><p>Event dates, participation details and announcements will be published here.</p></div></article>
  </div></section>
}
function Publications() {
  return <section className="section publications-section" id="publicacoes"><div className="container"><div className="updates-heading"><div><Eyebrow>Knowledge & research</Eyebrow><h2>Technical & scientific <em>papers.</em></h2></div><p>Explore technical work and scientific contributions related to space safety and Space Situational Awareness.</p></div>
    <article className="update-placeholder"><span className="update-icon"><FileText /></span><div><strong>Publications coming soon</strong><p>Technical documents and scientific publications will be listed here as they become available.</p></div></article>
  </div></section>
}

function Contact() {
  return <section className="contact-section" id="contato"><div className="container contact-inner"><div><Eyebrow>Get in touch</Eyebrow><h2>The future of space is collective. <em>Let's make it safer.</em></h2><p>Contact our team to learn more about our solutions and explore opportunities for collaboration.</p></div><a className="button button-light" href={`mailto:${EMAIL}`}>Contact our team <ArrowUpRight size={18} /></a><div className="contact-orbit"><Orbit size={170} strokeWidth={0.6} /></div></div></section>
}

function Footer() {
  return <footer className="site-footer"><div className="container footer-main">
    <div className="footer-brand-col"><a className="brand footer-brand" href="#inicio"><span className="brand-mark"><Orbit size={23} /></span><span className="brand-name">safe<span>on</span>orbit</span></a><p>Towards a safer and more sustainable cosmos.</p></div>
    <div className="footer-links"><strong>Explore</strong>{navItems.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div>
    <div className="footer-links"><strong>Contact</strong><a href={`mailto:${EMAIL}`}><Mail size={15} />{EMAIL}</a><a href="https://www.linkedin.com/company/safe-on-orbit/" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://safeonorbit.space" target="_blank" rel="noreferrer"><Globe2 size={15} />safeonorbit.space</a></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Safe on Orbit. All rights reserved.</span><a href="#inicio">Back to top ↑</a></div></footer>
}

export default function App() {
  return <><Header /><main><Hero /><Challenge /><TrackedObjects /><Cosmos /><Technology /><Impact /><Team /><Updates /><Publications /><Contact /></main><Footer /></>
}
