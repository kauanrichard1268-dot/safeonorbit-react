import ogloboMedia from './assets/media/oglobo.png';
import tncMedia from './assets/media/tnc.png';
import nexoMedia from './assets/media/nexo.png';
import luisPhoto from './assets/team/luis.png'
import victoriaPhoto from './assets/team/victoria.png'
import marcosPhoto from './assets/team/marcos.png'
import { useState } from 'react'
import useScrollReveal from './useScrollReveal.js'
import { LANGUAGES, useI18n } from './i18n/LanguageContext.jsx'
// LIVE1: './CosmosLiveDemo.jsx'  |  LIVE2: './CosmosLiveDemo2.jsx'
import CosmosLiveDemo from './CosmosLiveDemo2.jsx'
import logo from './assets/logo.png';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Menu, X,
  Radar, ShieldCheck, Satellite, Activity, Target, ChevronRight,
  Mail, Globe2, Users, Linkedin, Instagram
} from 'lucide-react'

const EMAIL = 'safeonorbit@safeonorbit.space'

// [chave da tradução, âncora da seção]
const navItems = [
  ['nav.home', '#inicio'], ['nav.challenge', '#solucao'], ['nav.tracked', '#objetos'], ['nav.cosmos', '#cosmos'],
  ['nav.impact', '#impacto'], ['nav.team', '#equipe'], ['nav.events', '#eventos'],
]

function Header() {
  const { t, lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label={t('header.homeAria')}>
        <span className="brand-mark"><img src={logo} alt={t('header.logoAlt')} width="30" /></span>
        <span className="brand-name">SAFE <span>ON</span> ORBIT</span>
      </a>
      <nav className={open ? 'nav nav-open' : 'nav'} id="main-navigation" aria-label={t('header.mainNav')}>
        <div className="nav-links">
        {navItems.map(([key, href]) => <a key={key} href={href} onClick={() => setOpen(false)}>{t(key === 'nav.cosmos' ? 'nav.cosmosShort' : key)}</a>)}
        </div>
        <div className="nav-controls">
        <label className="language-picker" aria-label={t('header.chooseLang')}><Globe2 size={15} /><select value={lang} onChange={event => setLang(event.target.value)} aria-label={t('header.chooseLang')}>{LANGUAGES.map(item => <option key={item.code} value={item.code}>{item.label}</option>)}</select></label>
        <a className="nav-cta" href={`mailto:${EMAIL}`} onClick={() => setOpen(false)}>{t('header.contact')} <ArrowUpRight size={16} /></a>
        </div>
      </nav>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? t('header.closeMenu') : t('header.openMenu')} aria-expanded={open} aria-controls="main-navigation">
        {open ? <X /> : <Menu />}
      </button>
    </header>
  )
}

function Eyebrow({ children }) { return <div className="eyebrow"><span />{children}</div> }

function Hero() {
  const { t } = useI18n()
  return (
    <section className="hero" id="inicio">
      <div className="hero-bg" /><div className="hero-grid" />
      <div className="hero-content container">
        <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
        <h1>{t('hero.titleBefore')}<em>{t('hero.titleEm')}</em>{t('hero.titleAfter')}</h1>
        <p className="hero-copy">{t('hero.copy')}</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#cosmos">{t('hero.discover')} <ArrowRight size={17} /></a>
          <a className="button button-ghost" href={`mailto:${EMAIL}`}>{t('hero.contactUs')} <ArrowDownRight size={17} /></a>
        </div>
        <div className="hero-note"><span className="status-dot" />{t('hero.note')}</div>
      </div>
      <div className="orbit-annotation annotation-one"><span>{t('hero.annotation1')}</span><i /></div>
      <div className="orbit-annotation annotation-two"><i /><span>{t('hero.annotation2')}</span></div>
      <div className="hero-bottom container"><span>{t('hero.bottom')}</span><a href="#solucao" aria-label={t('hero.scrollAria')}><ArrowDownRight size={20} /></a></div>
    </section>
  )
}

function Challenge() {
  const { t } = useI18n()
  return (
    <section className="section challenge-section" id="solucao">
      <div className="container challenge-layout">
        <div className="section-intro"><Eyebrow>{t('challenge.eyebrow')}</Eyebrow><h2>{t('challenge.titleA')} <em>{t('challenge.titleEm')}</em></h2></div>
        <div className="challenge-copy">
          <p>{t('challenge.copy')}</p>
          <a className="text-link" href="#tecnologia">{t('challenge.link')} <ArrowRight size={16} /></a>
        </div>
      </div>
      <div className="container metrics-row">
        <div className="metric"><span className="metric-icon"><Radar /></span><div><strong>{t('challenge.m1t')}</strong><p>{t('challenge.m1d')}</p></div></div>
        <div className="metric"><span className="metric-icon"><Activity /></span><div><strong>{t('challenge.m2t')}</strong><p>{t('challenge.m2d')}</p></div></div>
        <div className="metric"><span className="metric-icon"><ShieldCheck /></span><div><strong>{t('challenge.m3t')}</strong><p>{t('challenge.m3d')}</p></div></div>
      </div>
    </section>
  )
}

function TrackedObjects() {
  const { t } = useI18n()
  return (
    <section className="tracked-section" id="objetos">
      <div className="container tracked-inner">
        <Eyebrow>{t('tracked.eyebrow')}</Eyebrow>
        <h2>{t('tracked.title')}</h2>
        <p>{t('tracked.copy')}</p>
        <CosmosLiveDemo />
      </div>
    </section>
  );
}

function Cosmos() {
  const { t } = useI18n()
  return (
    <section className="cosmos-section" id="cosmos">
      <div className="cosmos-image">
        <div className="image-caption">
          <span className="caption-line" />
          {t('cosmos.caption')}
        </div>
      </div>

      <div className="cosmos-content">
        <Eyebrow>{t('cosmos.eyebrow')}</Eyebrow>

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
          {t('cosmos.titleA')}
          <em>{t('cosmos.titleEm')}</em>
        </h2>

        <p>{t('cosmos.copy')}</p>

        <ul className="check-list">
          {['cosmos.li1', 'cosmos.li2', 'cosmos.li3'].map(key => (
            <li key={key}>
              <span><ChevronRight size={16} /></span>
              {t(key)}
            </li>
          ))}
        </ul>

        <a className="button button-primary" href={`mailto:${EMAIL}`}>
          {t('cosmos.cta')} <ArrowRight size={17} />
        </a>

        <p className="fine-print">{t('cosmos.fine')}</p>
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
  const { t } = useI18n()
  const items = [
    { number: '01', icon: <Satellite />, title: t('tech.i1t'), body: t('tech.i1b') },
    { number: '02', icon: <Radar />, title: t('tech.i2t'), body: t('tech.i2b') },
    { number: '03', icon: <Target />, title: t('tech.i3t'), body: t('tech.i3b') },
  ]
  return <section className="section technology-section" id="tecnologia"><div className="container">
    <div className="tech-heading"><div><Eyebrow>{t('tech.eyebrow')}</Eyebrow><h2>{t('tech.titleA')}<br /><em>{t('tech.titleEm')}</em></h2></div><p>{t('tech.copy')}</p></div>
    <div className="process-grid">{items.map(item => <article className="process-card" key={item.number}><div className="process-top"><span>{item.number}</span><span className="process-icon">{item.icon}</span></div><ProcessIllustration number={item.number} /><h3>{item.title}</h3><p>{item.body}</p><div className="card-line" /></article>)}</div>
  </div></section>
}

function Impact() {
  const { t } = useI18n()
  return (
    <section className="section impact-section" id="impacto">
      <div className="container impact-layout">
        <div className="impact-copy">
          <Eyebrow>{t('impact.eyebrow')}</Eyebrow>
          <h2>{t('impact.titleA')} <em>{t('impact.titleEm')}</em></h2>
          <p>{t('impact.copy')}</p>
          <div className="impact-stat"><strong>{t('impact.stat')}</strong><span>{t('impact.statLabel')}</span></div>
        </div>
        <div className="impact-visual">
          <div className="impact-earth" role="img" aria-label={t('impact.earthAria')} />
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
  const { t } = useI18n()
  return (
    <section className="section team-section" id="equipe">
      <div className="container">
        <div className="team-heading">
          <div><Eyebrow>{t('team.eyebrow')}</Eyebrow><h2>{t('team.titleA')}<em>{t('team.titleEm')}</em></h2></div>
          <p>{t('team.copy')}</p>
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

// As datas ficam no formato ISO (ano-mês-dia) e são formatadas conforme o idioma escolhido.
const mediaStories = [
  { source: 'O Globo', titleKey: 'media.story1', date: '2026-01-26', image: ogloboMedia },
  { source: 'Rede TNC', titleKey: 'media.story2', date: '2026-01-15', image: tncMedia },
  { source: 'Nexo Jornal', titleKey: 'media.story3', date: '2026-01-05', image: nexoMedia },
]

function Updates() {
  const { t, locale } = useI18n()
  const formatDate = iso => new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale, { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' })
  return <section className="section updates-section" id="eventos">
    <div className="container">
      <div className="updates-heading"><div><Eyebrow>{t('media.eyebrow')}</Eyebrow><h2>{t('media.titleA')}<em>{t('media.titleEm')}</em></h2></div><p>{t('media.copy')}</p></div>
      <div className="media-grid">{mediaStories.map(story => <article className="media-story" key={story.source}>
        <div className="media-image"><img src={story.image} alt={t('media.previewAlt', { source: story.source })} loading="lazy" /></div>
        <span className="media-source">{story.source}</span><h3>{t(story.titleKey)}</h3><span className="media-date">{formatDate(story.date)}</span>
      </article>)}</div>
      <div className="media-footer"><a href="https://safeonorbit.space/" target="_blank" rel="noopener noreferrer">{t('media.more')} <ArrowUpRight size={15} /></a><div className="media-pending"><span>{t('media.events')}</span><span>{t('media.papers')}</span></div></div>
    </div>
  </section>
}

function Contact() {
  const { t } = useI18n()
  return <section className="contact-section" id="contato"><div className="container contact-inner"><div><Eyebrow>{t('contact.eyebrow')}</Eyebrow><h2>{t('contact.titleA')}<em>{t('contact.titleEm')}</em></h2></div><a className="button button-light" href={`mailto:${EMAIL}`}>{t('contact.cta')} <ArrowUpRight size={18} /></a></div></section>
}

function Footer() {
  const { t } = useI18n()
  return <footer className="site-footer"><div className="container footer-main">
    <div className="footer-brand-col"><a className="brand footer-brand" href="#inicio"><span className="brand-mark"><img src={logo} alt={t('header.logoAlt')} width="28" /></span><span className="brand-name">SAFE <span>ON</span> ORBIT</span></a><p>{t('footer.tagline')}</p></div>
    <div className="footer-links"><strong>{t('footer.explore')}</strong>{navItems.map(([key, href]) => <a key={key} href={href}>{t(key)}</a>)}</div>
    <div className="footer-links"><strong>{t('footer.contact')}</strong><a href={`mailto:${EMAIL}`}><Mail size={15} />{EMAIL}</a><a href="https://www.linkedin.com/company/safe-on-orbit/" target="_blank" rel="noopener noreferrer" aria-label={t('footer.linkedinAria')}><Linkedin size={15} aria-hidden="true" />LinkedIn</a><a href="https://www.instagram.com/safeonorbit/" target="_blank" rel="noopener noreferrer" aria-label={t('footer.instagramAria')}><Instagram size={15} aria-hidden="true" />Instagram</a></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Safe on Orbit. {t('footer.rights')}</span><a href="#inicio">{t('footer.top')}</a></div></footer>
}

export default function App() {
  useScrollReveal()
  return <><Header /><main><Hero /><Challenge /><TrackedObjects /><Cosmos /><Technology /><Impact /><Team /><Updates /><Contact /></main><Footer /></>
}
