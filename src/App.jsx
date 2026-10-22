import React from "react";
import {
  Globe2, Send, UserRound, Orbit, Satellite, RadioTower,
  Menu, ChevronDown, Timer, CircleDot, Workflow
} from "lucide-react";

const navItems = [
  ["SOBRE NÓS", "#sobre"],
  ["COSMOS", "#cosmos"],
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


function CosmosSection() {
  const features = [
    {
      icon: <Timer size={25} strokeWidth={1.35} />,
      status: "NOMINAL",
      title: "Consciência Temporal",
      description: "Processamento contínuo de dados orbitais para calcular probabilidade de colisão (Pc) em todos os regimes — LEO, MEO, GEO.",
      detail: "Previsão com até 10 dias de antecedência",
    },
    {
      icon: <CircleDot size={27} strokeWidth={1.35} />,
      status: "ATIVO",
      title: "Clareza no Caos",
      description: "Painel operacional que prioriza automaticamente as conjunções mais críticas, filtrável por satélite, regime orbital ou janela de tempo. Apenas o sinal que importa, sem ruído.",
      detail: "Interface para decisores técnicos",
    },
    {
      icon: <Workflow size={25} strokeWidth={1.35} />,
      status: "ON-LINE",
      title: "Conectividade Integrada",
      description: "API REST e webhooks conectam o COSMOS ao seu segmento terrestre, sistema LEOP ou ferramenta de dinâmica de voo existentes — sem substituir sua infraestrutura atual.",
      detail: "Integração com stacks existentes",
    },
  ];

  return (
    <section className="cosmos-section" id="cosmos" aria-labelledby="cosmos-title">
      <div className="cosmos-inner">
        <div className="cosmos-heading">
          <p className="eyebrow">PLATAFORMA COSMOS</p>
          <h2 id="cosmos-title">Inteligência orbital em tempo<br className="desktop-break" /> real.</h2>
          <p className="cosmos-description">
            O COSMOS integra catálogos TLE, mensagens de dados de conjunção (CDM) e rastreamento proprietário para entregar inteligência de risco acionável — em qualquer altitude, em qualquer tipo de órbita.
          </p>
        </div>
        <div className="cosmos-cards">
          {features.map((feature) => (
            <article className="cosmos-card" key={feature.title}>
              <div className="cosmos-card-top">
                <span className="cosmos-icon">{feature.icon}</span>
                <span className="cosmos-status"><i />{feature.status}</span>
              </div>
              <h3>{feature.title}</h3>
              <p className="cosmos-card-description">{feature.description}</p>
              <div className="cosmos-card-detail"><span>•</span>{feature.detail}</div>
            </article>
          ))}
        </div>
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
      <CosmosSection />
      <footer className="page-footer" id="contato">
        <span><RadioTower size={13} /> SAFEONORBIT / SISTEMA DE MONITORAMENTO</span>
        <span id="midia">BRASÍLIA, BRASIL <span className="footer-dot">●</span> SSA</span>
      </footer>
    </main>
  );
}

export default App;
