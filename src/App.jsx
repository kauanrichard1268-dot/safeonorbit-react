import ogloboMedia from './assets/media/oglobo.png';
import tncMedia from './assets/media/tnc.png';
import nexoMedia from './assets/media/nexo.png';
import luisPhoto from './assets/team/luis.png'
import victoriaPhoto from './assets/team/victoria.png'
import marcosPhoto from './assets/team/marcos.png'
import { useState } from 'react'
import useScrollReveal from './useScrollReveal.js'
// LIVE1: './CosmosLiveDemo.jsx'  |  LIVE2: './CosmosLiveDemo2.jsx'
import CosmosLiveDemo from './CosmosLiveDemo2.jsx'
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
      <nav className={open ? 'nav nav-open' : 'nav'} id="main-navigation" aria-label="Main navigation">
        <div className="nav-links">
        {navItems.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label === 'COSMOS & Technology' ? 'COSMOS' : label}</a>)}
        </div>
        <div className="nav-controls">
        <label className="language-picker" aria-label="Choose language"><Globe2 size={15} /><select value={language} onChange={event => setLanguage(event.target.value)} aria-label="Language">{languages.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
        <a className="nav-cta" href={`mailto:${EMAIL}`} onClick={() => setOpen(false)}>Contact <ArrowUpRight size={16} /></a>
        </div>
      </nav>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="main-navigation">
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
        <p className="hero-copy">Advanced orbital intelligence for safer and more sustainable space operations.</p>
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
          <p>A crowded orbit demands smarter decisions. We help operators anticipate risks and prevent collisions.</p>
          <a className="text-link" href="#tecnologia">Turning data into decisions <ArrowRight size={16} /></a>
        </div>
      </div>
      <div className="container metrics-row">
        <div className="metric"><span className="metric-icon"><Radar /></span><div><strong>Monitor</strong><p>Track orbital objects.</p></div></div>
        <div className="metric"><span className="metric-icon"><Activity /></span><div><strong>Anticipate</strong><p>Identify collision risks.</p></div></div>
        <div className="metric"><span className="metric-icon"><ShieldCheck /></span><div><strong>Decide</strong><p>Support safer operations.</p></div></div>
      </div>
    </section>
  )
}

function TrackedObjects() {
  return (
    <section className="tracked-section" id="objetos">
      <div className="container tracked-inner">
        <Eyebrow>Orbital monitoring</Eyebrow>
        <h2>Tracked Events</h2>
        <p>Monitoring orbital events and close approaches to support safer space operations.</p>
        <CosmosLiveDemo />
      </div>
    </section>
  );
}

function Cosmos() {
  return (
    <section className="cosmos-section" id="cosmos">
      <div className="cosmos-image">
        <div className="image-caption">
          <span className="caption-line" />
          ORBITAL ENVIRONMENT — OPERATIONAL VIEW
        </div>
      </div>

      <div className="cosmos-content">
        <Eyebrow>Our platform</Eyebrow>

        <div className="cosmos-wordmark">
          <span className="cosmos-symbol">
            <img src={logo} alt="Safe on Orbit" width="36" />
          </span>

          <span>
            COSMOS
            <small>
              Collision Safety Management Orbital System
            </small>
          </span>
        </div>

        <h2>
          More insight.
          <em>Safer decisions.</em>
        </h2>

        <p>
          COSMOS combines orbital data and predictive analytics
          to assess risks and support collision avoidance.
        </p>

        <ul className="check-list">
          <li>
            <span><ChevronRight size={16} /></span>
            Conjunction analysis
          </li>

          <li>
            <span><ChevronRight size={16} /></span>
            Orbital risk assessment
          </li>

          <li>
            <span><ChevronRight size={16} /></span>
            Collision avoidance support
          </li>
        </ul>

        <a className="button button-primary" href={`mailto:${EMAIL}`}>
          Talk to our team <ArrowRight size={17} />
        </a>

        <p className="fine-print">
          COSMOS supports decision-making. Maneuver assessment
          and execution remain the responsibility of satellite
          operators.
        </p>
      </div>
    </section>
  )
}

function ProcessIllustration({ number }) {
  return <svg className="process-illustration" viewBox="0 0 240 120" aria-hidden="true" fill="none">
    {number === '01' ? <>
      <circle cx="120" cy="60" r="38" fill="#eaf4f8" stroke="#b8d5e2" />
      <g stroke="#b8d5e2"><ellipse cx="120" cy="60" rx="17" ry="38"/><ellipse cx="120" cy="60" rx="38" ry="17"/><path d="M82 60h76M120 22v76"/></g>
      <g stroke="#009bc5"><ellipse cx="120" cy="60" rx="83" ry="24" transform="rotate(-25 120 60)" strokeDasharray="5 4"/><ellipse cx="120" cy="60" rx="78" ry="26" transform="rotate(25 120 60)"/></g>
      <g className="process-orbit"><circle cx="194" cy="26" r="4" fill="#009bc5"/><circle cx="46" cy="94" r="3" fill="#009bc5"/></g>
    </> : number === '02' ? <>
      <g stroke="#c5dce6"><circle cx="120" cy="60" r="18"/><circle cx="120" cy="60" r="36"/><circle cx="120" cy="60" r="54"/><path d="M120 6v108M66 60h108"/></g>
      <path className="process-sweep" d="M120 60V6A54 54 0 0 1 174 60Z" fill="#009bc5" opacity=".15"/>
      <g stroke="#009bc5" strokeDasharray="5 4"><path d="M35 100Q120 0 205 55"/><path d="M35 20Q120 115 205 25"/></g><circle className="process-pulse" cx="120" cy="54" r="12" fill="#009bc5" opacity=".15"/><circle cx="120" cy="54" r="4" fill="#009bc5"/>
    </> : <>
      <rect x="42" y="12" width="156" height="96" rx="8" fill="#eaf4f8" stroke="#b8d5e2"/><path d="M56 36h128M56 60h128M56 84h128" stroke="#c5dce6"/>
      <path className="process-chart" d="M56 86L80 65L102 73L126 43L150 52L182 25" stroke="#009bc5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="182" cy="25" r="4" fill="#009bc5"/><circle cx="171" cy="85" r="12" fill="#009bc5"/><path d="M165 85l4 4 8-9" stroke="white" strokeWidth="2"/>
    </>}
  </svg>
}

function Technology() {
  const items = [
    { number: '01', icon: <Satellite />, title: 'Orbital data', body: 'Integration of information about the positions and trajectories of space objects.' },
    { number: '02', icon: <Radar />, title: 'Conjunction analysis', body: 'Identification of close approaches and assessment of scenarios that require attention.' },
    { number: '03', icon: <Target />, title: 'Decision support', body: 'Organized information to support risk assessment and operational planning.' },
  ]
  return <section className="section technology-section" id="tecnologia"><div className="container">
    <div className="tech-heading"><div><Eyebrow>Our approach</Eyebrow><h2>Orbital complexity.<br /><em>Operational clarity.</em></h2></div><p>From raw information to situational awareness: a data-driven approach to supporting safer space operations.</p></div>
    <div className="process-grid">{items.map(item => <article className="process-card" key={item.number}><div className="process-top"><span>{item.number}</span><span className="process-icon">{item.icon}</span></div><ProcessIllustration number={item.number} /><h3>{item.title}</h3><p>{item.body}</p><div className="card-line" /></article>)}</div>
  </div></section>
}

function Impact() {
  return (
    <section className="section impact-section" id="impacto">
      <div className="container impact-layout">
        <div className="impact-copy">
          <Eyebrow>Our impact</Eyebrow>
          <h2>A safer orbit. <em>A shared responsibility.</em></h2>
          <p>Space connects our world. Through orbital intelligence, we help protect it for generations to come.</p>
          <div className="impact-stat"><strong>10 days</strong><span>Updated planning horizon</span></div>
        </div>
        <div className="impact-visual">
          <div className="impact-earth" role="img" aria-label="Earth at night photographed from the International Space Station" />
        </div>
      </div>
    </section>
  )
}

const team = [
  { name: 'Luis Felipe Alves de Oliveira', photo: luisPhoto },
  { name: 'Victoria Martins Costa', photo: victoriaPhoto },
  { name: 'Marcos Vinícius Gomes de Matos', photo: marcosPhoto },
  { name: 'Thiago Galbiatti Vespa', photo: null },
]

function Team() {
  return (
    <section className="section team-section" id="equipe">
      <div className="container">
        <div className="team-heading">
          <div><Eyebrow>People behind the mission</Eyebrow><h2>Meet our <em>team.</em></h2></div>
          <p>Different skills, one shared commitment to a safer orbital environment.</p>
        </div>
        <div className="team-grid">
          {team.map(({ name, photo }, i) => (
            <article className="team-card" key={name}>
              <div className="team-photo">
                {photo ? <img src={photo} alt={name} loading="lazy" width="640" height="760" /> : <Users size={48} aria-hidden="true" />}
              </div>
              <div className="team-info">
                <span>0{i + 1} / SAFE ON ORBIT</span>
                <h3>{name}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const mediaStories = [
  { source: 'O Globo', title: 'Space debris turns Earth’s orbit into a geopolitical minefield.', date: 'Jan 26, 2026', image: ogloboMedia },
  { source: 'Rede TNC', title: 'Brazilian startup creates anti-collision system for satellites.', date: 'Jan 15, 2026', image: tncMedia },
  { source: 'Nexo Jornal', title: 'Brazilian startup develops technology to prevent collisions in space.', date: 'Jan 5, 2026', image: nexoMedia },
]

function Updates() {
  return <section className="section updates-section" id="eventos">
    <div className="container">
      <div className="updates-heading"><div><Eyebrow>Media & research</Eyebrow><h2>Beyond <em>the orbit.</em></h2></div><p>Our presence in the media and contributions to space safety.</p></div>
      <div className="media-grid">{mediaStories.map(story => <article className="media-story" key={story.source}>
        <div className="media-image"><img src={story.image} alt={`Article preview — ${story.source}`} loading="lazy" /></div>
        <span className="media-source">{story.source}</span><h3>{story.title}</h3><span className="media-date">{story.date}</span>
      </article>)}</div>
      <div className="media-footer"><a href="https://safeonorbit.space/" target="_blank" rel="noopener noreferrer">More news <ArrowUpRight size={15} /></a><div className="media-pending"><span>Events · Coming soon</span><span>Technical papers · Coming soon</span></div></div>
    </div>
  </section>
}

function Contact() {
  return <section className="contact-section" id="contato"><div className="container contact-inner"><div><Eyebrow>Get in touch</Eyebrow><h2>The future of space is collective.<em>Let's make it safer.</em></h2></div><a className="button button-light" href={`mailto:${EMAIL}`}>Contact our team <ArrowUpRight size={18} /></a></div></section>
}

function Footer() {
  return <footer className="site-footer"><div className="container footer-main">
    <div className="footer-brand-col"><a className="brand footer-brand" href="#inicio"><span className="brand-mark"><img src={logo} alt="Safe On Orbit logo" width="28" /></span><span className="brand-name">SAFE <span>ON</span> ORBIT</span></a><p>Towards a safer and more sustainable cosmos.</p></div>
    <div className="footer-links"><strong>Explore</strong>{navItems.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div>
    <div className="footer-links"><strong>Contact</strong><a href={`mailto:${EMAIL}`}><Mail size={15} />{EMAIL}</a><a href="https://www.linkedin.com/company/safe-on-orbit/" target="_blank" rel="noopener noreferrer" aria-label="Safe On Orbit on LinkedIn"><Linkedin size={15} aria-hidden="true" />LinkedIn</a><a href="https://www.instagram.com/safeonorbit/" target="_blank" rel="noopener noreferrer" aria-label="Safe On Orbit on Instagram"><Instagram size={15} aria-hidden="true" />Instagram</a></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Safe on Orbit. All rights reserved.</span><a href="#inicio">Back to top ↑</a></div></footer>
}

export default function App() {
  useScrollReveal()
  return <><Header /><main><Hero /><Challenge /><TrackedObjects /><Cosmos /><Technology /><Impact /><Team /><Updates /><Contact /></main><Footer /></>
}