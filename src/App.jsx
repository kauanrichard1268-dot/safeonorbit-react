import { useState, useEffect } from 'react'
import logo from './assets/logo.png';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Menu, X, Orbit,
  Radar, ShieldCheck, Satellite, Activity, Target, ChevronRight,
  Mail, Globe2, Users, CalendarDays, FileText, Linkedin, Instagram
} from 'lucide-react'

const EMAIL = 'safeonorbit@safeonorbit.space'
const navItems = [
  ['Home', '#inicio'], ['Challenge', '#solucao'], ['Tracked Events', '#objetos'], ['COSMOS & Technology', '#cosmos'],
  ['Impact', '#impacto'], ['Team', '#equipe'], ['Events & Papers', '#eventos'],
]
const languages = ['English', 'العربية', 'Español', 'Français', 'Português']

function Header() {
  const [open, setOpen] = useState(false)
  const [language, setLanguage] = useState('English')
  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="Safe on Orbit — home">
        <span className="brand-mark"><img src={logo} alt="Logo da empresa" width="30" /></span>
        <span className="brand-name">SAFE <span>ON</span> ORBIT</span>
      </a>
      <nav className={open ? 'nav nav-open' : 'nav'} aria-label="Main navigation">
        {navItems.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        <label className="language-picker" aria-label="Choose language"><Globe2 size={15} /><select value={language} onChange={event => setLanguage(event.target.value)} aria-label="Language">{languages.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
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

  useEffect(() => {
    const API_KEY = 'COLE_A_SUA_CHAVE_AQUI'; 
    
    fetch('https://api.safeonorbit.space/api/conjunctions/v1/events/?limit=5', {
      method: 'GET',
      headers: { 'X-Api-Key': API_KEY }
    })
      .then(resposta => resposta.json())
      .then(dados => {
        setEventos(dados.results || dados || []); 
        setCarregando(false);
      })
      .catch(erro => {
        console.error("Error fetching API:", erro);
        setCarregando(false);
      });
  }, []);

  return (
    <section className="tracked-section" id="objetos">
      <div className="container tracked-inner">
        <Eyebrow>Orbital monitoring</Eyebrow>
        <h2>Tracked Events</h2>
        <p>Monitoring orbital events and close approaches to support safer space operations.</p>
        
        <div style={{ marginTop: '2rem', textAlign: 'left', background: '#0a0a0a', padding: '1rem', borderRadius: '8px' }}>
          {carregando ? (
            <p>Loading COSMOS data...</p>
          ) : !Array.isArray(eventos) || eventos.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#0f172a', padding: '24px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
              <ShieldCheck size={40} color="#10b981" />
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#f8fafc' }}>Orbit Secure</h3>
                <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.5' }}>
                  No conjunction events are currently available in the forecast window. Check again soon for updated orbital information.
                </p>
              </div>
            </div>
          ) : (
            <ul>
              {eventos.map((evento, index) => (
                <li key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                  <strong>Risk Level:</strong> {evento.risk_level} <br/>
                  <strong>Approach Date:</strong> {evento.start_date} <br/>
                  <strong>Min POC:</strong> {evento.min_poc}
                </li>
              ))}
            </ul>
          )}
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
  return <section className="section updates-section" id="eventos"><div className="container"><div className="updates-heading"><div><Eyebrow>Events & research</Eyebrow><h2>Events & <em>technical papers.</em></h2></div><p>Follow Safe On Orbit's participation in the space community and explore technical contributions related to space safety and Space Situational Awareness.</p></div>
    <div className="updates-grid"><article className="update-placeholder"><span className="update-icon"><CalendarDays /></span><div><strong>Events coming soon</strong><p>Event dates, participation details and announcements will be published here.</p></div></article>
    <article className="update-placeholder"><span className="update-icon"><FileText /></span><div><strong>Technical papers coming soon</strong><p>Technical documents and scientific publications will be listed here as they become available.</p></div></article></div>
  </div></section>
}

function Contact() {
  return <section className="contact-section" id="contato"><div className="container contact-inner"><div><Eyebrow>Get in touch</Eyebrow><h2>The future of space is collective. <em>Let's make it safer.</em></h2><p>Contact our team to learn more about our solutions and explore opportunities for collaboration.</p></div><a className="button button-light" href={`mailto:${EMAIL}`}>Contact our team <ArrowUpRight size={18} /></a><div className="contact-orbit"><Orbit size={170} strokeWidth={0.6} /></div></div></section>
}

function Footer() {
  return <footer className="site-footer"><div className="container footer-main">
    <div className="footer-brand-col"><a className="brand footer-brand" href="#inicio"><span className="brand-mark"><img src={logo} alt="Safe On Orbit logo" width="28" /></span><span className="brand-name">SAFE <span>ON</span> ORBIT</span></a><p>Towards a safer and more sustainable cosmos.</p></div>
    <div className="footer-links"><strong>Explore</strong>{navItems.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div>
    <div className="footer-links"><strong>Contact</strong><a href={`mailto:${EMAIL}`}><Mail size={15} />{EMAIL}</a><a href="https://www.linkedin.com/company/safe-on-orbit/" target="_blank" rel="noopener noreferrer" aria-label="Safe On Orbit on LinkedIn"><Linkedin size={15} aria-hidden="true" />LinkedIn</a><a href="https://www.instagram.com/safeonorbit/" target="_blank" rel="noopener noreferrer" aria-label="Safe On Orbit on Instagram"><Instagram size={15} aria-hidden="true" />Instagram</a></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Safe on Orbit. All rights reserved.</span><a href="#inicio">Back to top ↑</a></div></footer>
}

export default function App() {
  return <><Header /><main><Hero /><Challenge /><TrackedObjects /><Cosmos /><Technology /><Impact /><Team /><Updates /><Contact /></main><Footer /></>
}
