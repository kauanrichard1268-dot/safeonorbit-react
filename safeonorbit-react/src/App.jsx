import React from "react";
import {
  Globe2, Send, UserRound, Orbit, Satellite, RadioTower,
  Menu, ChevronDown
} from "lucide-react";

const navItems = [
  ["SOBRE NÓS", "#sobre"],
  ["PRODUTO", "#produto"],
  ["IMPACTO", "#impacto"],
  ["MÍDIA", "#midia"],
  ["CONTATO", "#contato"],
];

const facts = [
  { label: "SEDE", value: "Brasília, DF, Brasil" },
  { label: "INCUBAÇÃO", value: "Hub Teia Caixa" },
  { label: "DOMÍNIO", value: "Consciência Situacional Espacial (SSA)" },
];

function StatusBar() {
  return (
    <div className="status-bar">
      <div className="status-left"><span className="status-dot" /> SISTEMA <span className="status-separator">·</span> <span className="online">ON-LINE</span></div>
      <div className="status-right">
        <span>LAT -15.79°</span><span>LON -47.88°</span><span>UTC <b>11:38:41</b></span>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <header className="navbar">
      <a className="brand" href="#sobre" aria-label="SafeOnOrbit início">
        <span className="brand-mark"><Orbit size={25} strokeWidth={1.35} /></span>
        <span>Safe<span>OnOrbit</span></span>
      </a>
      <nav className="nav-links" aria-label="Navegação principal">
        {navItems.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
      </nav>
      <div className="nav-actions">
        <button className="language" aria-label="Selecionar idioma"><Globe2 size={14} /> PT <ChevronDown size={12} /></button>
        <a className="contact-button" href="mailto:contato@safeonorbit.space">Enviar mensagem <Send size={14} /></a>
      </div>
      <button className="mobile-menu" aria-label="Abrir menu"><Menu /></button>
    </header>
  );
}

function SpaceBackdrop() {
  return (
    <div className="space-art" aria-hidden="true">
      <div className="star-field" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="orbit orbit-three" />
      <div className="earth">
        <div className="earth-lights" />
      </div>
      <span className="satellite satellite-one"><Satellite size={26} /></span>
      <span className="satellite satellite-two"><Satellite size={20} /></span>
      <span className="satellite satellite-three"><Satellite size={18} /></span>
      <span className="orbit-node node-one" /><span className="orbit-node node-two" />
      <span className="orbit-node node-three" /><span className="orbit-node node-four" />
    </div>
  );
}

function FactCards() {
  return (
    <aside className="facts" aria-label="Informações da empresa">
      {facts.map((fact, i) => (
        <article className="fact-card" key={fact.label} id={i === 1 ? "impacto" : undefined}>
          <p>{fact.label}</p>
          <h2>{fact.value}</h2>
        </article>
      ))}
    </aside>
  );
}

function Founders() {
  return (
    <section className="founders" aria-labelledby="founders-title">
      <p className="eyebrow" id="founders-title">FUNDADORES</p>
      <div className="founder">
        <span className="founder-icon"><UserRound size={16} /></span>
        <div><h3>Luis Fellipe Alves de Oliveira</h3><p>CEO <span>·</span> Engenheiro Aeroespacial</p></div>
      </div>
      <div className="founder">
        <span className="founder-icon"><UserRound size={16} /></span>
        <div><h3>Guilherme Marcos Neves</h3><p>CTO <span>·</span> Engenheiro Aeroespacial</p></div>
      </div>
    </section>
  );
}

function App() {
  return (
    <main>
      <StatusBar />
      <Navbar />
      <SpaceBackdrop />
      <section className="about-layout" id="sobre">
        <div className="intro">
          <p className="eyebrow">SOBRE NÓS</p>
          <h1>A primeira empresa da América do Sul totalmente dedicada à SSA.</h1>
          <p className="description">
            A Safe on Orbit é uma startup brasileira de deep tech espacial, incubada no Hub Teia Caixa em Brasília (DF). Nosso produto principal, o COSMOS, transforma dados orbitais brutos em inteligência de risco de colisão acionável — com acurácia de até 96% em ambiente simulado e previsão com até 5 dias de antecedência.
          </p>
          <div className="mission" id="produto">
            <p className="eyebrow">MISSÃO</p>
            <p>Tornar o espaço mais seguro e sustentável, dando a cada operador de satélite as ferramentas para identificar, avaliar e agir sobre riscos de conjunção orbital.</p>
          </div>
          <Founders />
        </div>
        <FactCards />
      </section>
      <footer className="page-footer" id="contato">
        <span><RadioTower size={13} /> SAFEONORBIT / SISTEMA DE MONITORAMENTO</span>
        <span id="midia">BRASÍLIA, BRASIL <span className="footer-dot">●</span> SSA</span>
      </footer>
    </main>
  );
}

export default App;
