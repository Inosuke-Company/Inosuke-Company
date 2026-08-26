<div align="center">

<img src="./banner.gif" width="100%" alt="Quiroz — Full Stack Developer" />

<br/>

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=27&duration=2600&pause=800&color=22D3EE&center=true&vCenter=true&width=950&lines=Full+Stack+Developer+%E2%80%A2+Product+Builder;Web+%E2%80%A2+Android+%E2%80%A2+iOS+%E2%80%A2+SaaS;React+%E2%80%A2+TypeScript+%E2%80%A2+PostgreSQL+%E2%80%A2+Supabase;Cloudflare+%E2%80%A2+CI%2FCD+%E2%80%A2+GitHub+Actions;Construindo+software+real+para+opera%C3%A7%C3%B5es+reais" alt="Typing SVG" />
</a>

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-gestao--quiroz-181717?style=for-the-badge&logo=github)](https://github.com/gestao-quiroz)
[![Live System](https://img.shields.io/badge/SISTEMA_EM_PRODU%C3%87%C3%83O-crm.lollahair.com-0A66C2?style=for-the-badge&logo=googlechrome&logoColor=white)](https://crm.lollahair.com/)
![Visitors](https://komarev.com/ghpvc/?username=gestao-quiroz&style=for-the-badge&label=VISITAS+AO+PERFIL&color=0A66C2)

</div>

---

<div align="center">

## ⚡ Sobre mim

</div>

Sou **Desenvolvedor Full Stack** focado em construir produtos digitais completos, robustos e preparados para uso real.

Meu trabalho envolve muito mais do que interface: atuo na construção e evolução de sistemas de ponta a ponta — **frontend, backend, banco de dados, autenticação, autorização, segurança, regras de negócio, integrações, cloud, CI/CD e distribuição multiplataforma**.

Hoje, meu principal case é uma plataforma de gestão criada para uma operação real do setor de beleza e evoluída como produto de software, com arquitetura para **Desktop Web, Mobile Web, Android e iOS**, além de preparação para um futuro modelo **SaaS comercial com planos pagos**.

> **Eu gosto de transformar problemas operacionais complexos em software claro, integrado e sustentável.**

<br/>

<div align="center">
  <img src="./assets/terminal.svg" width="100%" alt="Animated developer terminal" />
</div>

---

## 🚀 Meu principal case de engenharia

### Plataforma completa de gestão para salões e negócios de beleza

O projeto nasceu para resolver uma operação real e hoje concentra diversos domínios de negócio em um único ecossistema.

<table>
<tr>
<td width="50%" valign="top">

### 🗓️ Operação

- Agenda diária e semanal
- Gestão por profissional
- Bloqueios e indisponibilidades
- Sinal via PIX
- Status de atendimento
- Conflitos de agenda
- WhatsApp operacional
- Experiência específica para desktop e mobile

</td>
<td width="50%" valign="top">

### 👥 CRM

- Cadastro completo de clientes
- Histórico de atendimentos
- Retorno e repescagem
- Aniversários
- Receita histórica
- Ticket médio
- Cancelamentos e no-shows
- Anotações e relacionamento

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 💰 Financeiro

- Comandas
- Cobranças
- Recebimentos
- Múltiplas formas de pagamento
- Despesas
- Custos fixos e variáveis
- Fluxo de caixa
- Resultado operacional
- Margem e rentabilidade
- Metas e ponto de equilíbrio

</td>
<td width="50%" valign="top">

### 📦 Gestão

- Produtos e estoque
- Entradas e saídas
- Consumo interno
- Dose técnica
- Custo por atendimento
- Serviços e pacotes
- Precificação
- Comissões
- Relatórios e indicadores

</td>
</tr>
</table>

<div align="center">

### 🌐 Sistema em funcionamento

[![Abrir demonstração](https://img.shields.io/badge/ABRIR_DEMONSTRA%C3%87%C3%83O-crm.lollahair.com-22C55E?style=for-the-badge&logo=googlechrome&logoColor=white)](https://crm.lollahair.com/)

</div>

---

## 🧠 O diferencial: integração entre módulos

Não é um conjunto de telas isoladas.

A arquitetura foi pensada para que os módulos conversem entre si e reflitam automaticamente as regras da operação.

```mermaid
flowchart LR
    A[Agenda] --> B[Atendimento]
    B --> C[Comanda]
    C --> D[Recebimento]
    D --> E[Financeiro]

    B --> F[Consumo]
    F --> G[Estoque]
    G --> H[Custos]

    B --> I[Comissão]
    I --> E

    A --> J[Cliente]
    J --> K[Histórico]
    K --> L[Retorno / CRM]

    H --> M[Precificação]
    M --> N[Margem]
    N --> O[Planejamento]
```

Essa integração permite transformar uma operação diária em **dados financeiros, históricos e gerenciais consistentes**.

---

## 📱 Engenharia multiplataforma

<div align="center">

| Plataforma | Situação |
|---|---|
| 🖥️ **Desktop Web** | ✅ Em funcionamento |
| 📱 **Mobile Web** | ✅ Em funcionamento |
| 🤖 **Android** | ✅ Build nativo híbrido e testes em dispositivo |
| 🍎 **iOS** | 🛠️ Estrutura preparada para evolução e distribuição |
| ☁️ **SaaS** | 🚧 Evolução para comercialização e planos pagos |

</div>

A mesma camada de domínio e dados pode alimentar experiências diferentes sem reduzir o mobile a uma simples cópia comprimida do desktop.

---

## 🏗️ Arquitetura técnica

```mermaid
flowchart TB
    subgraph Clients[Experiências]
        DESKTOP[Desktop Web]
        MOBILE[Mobile Web]
        ANDROID[Android]
        IOS[iOS]
    end

    subgraph Front[Frontend / Application]
        REACT[React 19]
        ROUTER[TanStack Router / Start]
        DOMAIN[Shared Domain & Business Rules]
        CAP[Capacitor]
    end

    subgraph Backend[Backend / Data]
        AUTH[Supabase Auth]
        EDGE[Edge Functions]
        RLS[Row Level Security]
        DB[(PostgreSQL)]
    end

    subgraph Delivery[Cloud & Delivery]
        CF[Cloudflare Workers]
        GH[GitHub Actions]
        APK[Android Build Pipeline]
        IOSPIPE[iOS Foundation]
    end

    DESKTOP --> REACT
    MOBILE --> REACT
    ANDROID --> CAP
    IOS --> CAP
    CAP --> REACT

    REACT --> ROUTER
    ROUTER --> DOMAIN

    DOMAIN --> AUTH
    DOMAIN --> EDGE
    DOMAIN --> DB
    AUTH --> RLS
    RLS --> DB
    EDGE --> DB

    GH --> CF
    GH --> APK
    GH --> IOSPIPE
```

---

<div align="center">

## 🧰 Tech Stack

### Frontend

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TanStack](https://img.shields.io/badge/TanStack-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### Backend & Data

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

### Mobile

![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![iOS](https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=apple&logoColor=white)

### Cloud & DevOps

![Cloudflare](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

</div>

---

## 🔐 Segurança não é detalhe

A aplicação trabalha com proteção em múltiplas camadas:

```mermaid
flowchart LR
    A[Login] --> B[Session Validation]
    B --> C[User Profile]
    C --> D[Role / Permissions]
    D --> E[Application Authorization]
    E --> F[Row Level Security]
    F --> G[(Authorized Data Only)]
```

### Princípios aplicados

- autenticação centralizada;
- autorização por cargo e permissão;
- isolamento de dados na camada do banco;
- políticas RLS;
- validação de sessão;
- operações administrativas restritas;
- separação entre interface e regra de autorização;
- proteção contra acesso indevido mesmo fora do frontend.

---

## 🧩 Competências que aplico na prática

<table>
<tr>
<td><b>Frontend Engineering</b></td>
<td>React, TypeScript, componentização, UX operacional, desktop e mobile dedicados</td>
</tr>
<tr>
<td><b>Backend Engineering</b></td>
<td>Edge Functions, autenticação, autorização, APIs e regras de negócio</td>
</tr>
<tr>
<td><b>Database Engineering</b></td>
<td>PostgreSQL, modelagem relacional, SQL, RLS e consistência de dados</td>
</tr>
<tr>
<td><b>Mobile</b></td>
<td>Capacitor, Android e base arquitetural para iOS</td>
</tr>
<tr>
<td><b>Cloud</b></td>
<td>Cloudflare Workers, Supabase e ambientes de produção</td>
</tr>
<tr>
<td><b>DevOps</b></td>
<td>GitHub Actions, CI/CD, build, validação e geração de artefatos</td>
</tr>
<tr>
<td><b>Product Engineering</b></td>
<td>Transformação de necessidade real em sistema integrado e evolutivo</td>
</tr>
<tr>
<td><b>Business Systems</b></td>
<td>CRM, agenda, estoque, financeiro, custos, comissões e relatórios</td>
</tr>
</table>

---

## 🎯 Como penso produto

```mermaid
mindmap
  root((Produto Real))
    Usuário
      Velocidade
      Clareza
      Menos retrabalho
    Engenharia
      Modularidade
      Segurança
      Consistência
      Manutenção
    Negócio
      Custos
      Margem
      Indicadores
      Escala
    Plataforma
      Web
      Android
      iOS
      SaaS
```

> Software bom não é apenas o que funciona em uma apresentação. É o que continua funcionando quando entra na rotina de uma operação real.

---

<div align="center">

## 📊 GitHub Analytics

<img height="180" src="https://github-readme-stats.vercel.app/api?username=gestao-quiroz&show_icons=true&include_all_commits=true&rank_icon=github&hide_border=true&theme=tokyonight" alt="GitHub Stats" />
<img height="180" src="https://streak-stats.demolab.com?user=gestao-quiroz&hide_border=true&theme=tokyonight" alt="GitHub Streak" />

<br/>

<img width="95%" src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=gestao-quiroz&theme=tokyonight" alt="Profile Details" />

<br/>

<img width="95%" src="https://github-readme-activity-graph.vercel.app/graph?username=gestao-quiroz&bg_color=0d1117&color=22d3ee&line=7c3aed&point=f59e0b&area=true&hide_border=true" alt="Contribution Activity Graph" />

</div>

> ℹ️ Alguns projetos e ambientes podem ser privados; métricas públicas não necessariamente representam toda a atividade de desenvolvimento.

---

<div align="center">

## 🐍 Contribution Snake

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/gestao-quiroz/SobreMim/output/github-contribution-grid-snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/gestao-quiroz/SobreMim/output/github-contribution-grid-snake.svg">
  <img alt="GitHub contribution snake" src="https://raw.githubusercontent.com/gestao-quiroz/SobreMim/output/github-contribution-grid-snake.svg">
</picture>

</div>

---

## 🛣️ Roadmap profissional / produto

```mermaid
flowchart LR
    A[Operação real] --> B[Arquitetura sólida]
    B --> C[Web]
    C --> D[Android]
    D --> E[iOS]
    E --> F[Multi-tenant]
    F --> G[SaaS]
    G --> H[Planos pagos]
    H --> I[Escala comercial]
```

Meu foco atual está na evolução de um produto real para uma plataforma cada vez mais independente, distribuível e preparada para comercialização.

---

<details>
<summary><b>🧠 O que mais valorizo em engenharia</b></summary>
<br/>

- Código modular e compreensível
- Regras de negócio centralizadas
- Segurança no backend e no banco
- Interfaces pensadas para uso diário
- Automação que realmente reduz trabalho
- Dados consistentes entre módulos
- Pipelines reproduzíveis
- Deploy confiável
- Arquitetura preparada para a próxima etapa do produto

</details>

<details>
<summary><b>⚙️ Áreas que mais gosto de resolver</b></summary>
<br/>

- sistemas internos complexos;
- CRMs e ERPs verticais;
- automações operacionais;
- dashboards gerenciais;
- integrações entre financeiro e operação;
- permissões e segurança;
- migração de processos manuais para software;
- aplicações multiplataforma;
- evolução de ferramenta interna para SaaS.

</details>

---

<div align="center">

## 🌎 Construindo software para uso real

<a href="https://crm.lollahair.com/">
  <img src="https://img.shields.io/badge/VER_SISTEMA_EM_FUNCIONAMENTO-0A66C2?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Sistema em funcionamento" />
</a>

<br/><br/>

**Full Stack Development · Product Engineering · SaaS · Web · Android · iOS · Cloud**

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&height=120&section=footer&color=gradient&customColorList=12,20,24,30&animation=twinkling" width="100%" alt="Footer" />

</div>
