<div align="center">

<picture>
  <source srcset="./banner.webp" type="image/webp">
  <img src="./banner-fallback.gif" width="100%" alt="Inosuke — Full Stack Developer" />
</picture>

<br/>

[<img src="./assets/lang-pt.svg" alt="Português" height="28">](./README.md)
[<img src="./assets/lang-en.svg" alt="English" height="28">](./README.en.md)
[<img src="./assets/lang-es.svg" alt="Español" height="28">](./README.es.md)
[<img src="./assets/lang-fr.svg" alt="Français" height="28">](./README.fr.md)

<br/>

<img src="./assets/inosuke/title.svg" width="100%" alt="Inosuke Full Stack Engineering" />

**[Abrir demonstração](https://crm.lollahair.com/)** · **[Contato](mailto:gestao.quiroz@gmail.com)**

</div>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

<div align="center">
  <img src="./assets/inosuke/icon-strip.svg" width="100%" alt="Frontend, Data, Security, Mobile, Cloud and CI/CD" />
</div>

## Sobre mim

Sou **Inosuke**, Desenvolvedor Full Stack e Product Engineer. Construo software de ponta a ponta: interface, backend, banco de dados, autenticação, autorização, regras de negócio, segurança, cloud, CI/CD e distribuição multiplataforma.

Meu principal case nasceu de uma operação real e evoluiu para uma plataforma robusta de gestão em produção. O produto já atende **Web Desktop, Web Mobile e Android**, possui fundação para **iOS** e está sendo preparado para evolução comercial como **SaaS**.

> **Meu foco não é apenas fazer a tela funcionar. É fazer operação, dados, segurança e negócio funcionarem como um único sistema.**

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## Projeto principal

### Plataforma de gestão para negócios de beleza

O código-fonte é **proprietário e privado**. Publicamente, mantenho apenas a demonstração do produto e o canal de contato para interessados.

<div align="center">

**[▶ Ver produto em funcionamento](https://crm.lollahair.com/)** · **[✉ Falar comigo sobre o projeto](mailto:gestao.quiroz@gmail.com?subject=Interesse%20no%20produto%20de%20gest%C3%A3o)**

</div>

<details>
<summary><b>Explorar módulos do sistema</b></summary>
<br/>

- **Agenda & operação:** agenda diária/semanal, profissionais, bloqueios, status, conflitos e sinal via PIX.
- **CRM:** clientes, histórico, recorrência, retorno, aniversários, ticket médio, cancelamentos e relacionamento.
- **Financeiro:** comandas, cobranças, recebimentos, despesas, custos, fluxo de caixa, margens, metas e ponto de equilíbrio.
- **Produtos & estoque:** entradas, saídas, consumo interno, dose técnica, custo por atendimento e inventário.
- **Equipe:** profissionais, comissões, desempenho, cargos e permissões.
- **Gestão:** precificação, relatórios, indicadores, planejamento e visão operacional integrada.

</details>

<details>
<summary><b>Explorar arquitetura técnica</b></summary>
<br/>

```mermaid
flowchart TB
    subgraph Experience[Experiências]
        WEB[Desktop Web]
        MOBILE[Mobile Web]
        ANDROID[Android]
        IOS[iOS]
    end

    subgraph Application[Application Layer]
        REACT[React + TypeScript]
        ROUTER[TanStack]
        DOMAIN[Shared Domain & Business Rules]
        CAP[Capacitor]
    end

    subgraph Data[Backend & Data]
        AUTH[Supabase Auth]
        EDGE[Edge Functions]
        RLS[Row Level Security]
        DB[(PostgreSQL)]
    end

    subgraph Delivery[Cloud & Delivery]
        CF[Cloudflare Workers]
        GH[GitHub Actions]
        APK[Android Pipeline]
        IOSPIPE[iOS Foundation]
    end

    WEB --> REACT
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

</details>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## Engenharia multiplataforma

| Plataforma | Estado |
|---|---|
| **Desktop Web** | ✅ Em produção |
| **Mobile Web** | ✅ Em produção |
| **Android** | ✅ Build instalável e testes em dispositivo |
| **iOS** | 🛠️ Fundação arquitetural preparada |
| **SaaS** | 🚧 Evolução comercial em andamento |

A experiência mobile não é uma miniatura do desktop: as interfaces compartilham domínio e dados, mas são projetadas para contextos diferentes de uso.

<div align="center">
  <img src="./assets/inosuke/tech-orbit.svg" width="100%" alt="Inosuke technology orbit" />
</div>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## GitHub Analytics — Beast Mode

Os gráficos abaixo são **gerados dentro deste próprio repositório**, usando **D3 + Iconify + GitHub Actions**. Não dependem de GitHub Readme Stats, Streak Stats ou outro servidor externo no momento da visualização.

<div align="center">

<img src="./assets/stats/beast-dashboard.svg" width="100%" alt="Inosuke GitHub activity dashboard" />

<br/>

<img src="./assets/stats/contribution-current.svg" width="100%" alt="Inosuke contribution activity chart" />

<br/>

<img src="./assets/stats/breathing-heatmap.svg" width="100%" alt="Inosuke contribution heatmap" />

</div>

<details>
<summary><b>Como os gráficos funcionam</b></summary>
<br/>

O motor visual roda automaticamente pelo GitHub Actions, consulta os dados de atividade permitidos pelo GitHub e gera SVGs animados diretamente em `assets/`.

O repositório principal do produto permanece **privado**. O perfil preserva um snapshot mínimo já verificado de atividade do projeto sem revelar nome, código, branches ou dados internos. Quando o secret opcional `PROFILE_STATS_TOKEN` estiver configurado, o mesmo motor pode atualizar métricas privadas autorizadas com maior precisão sem expor o token ou o código do projeto.

</details>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## Stack principal

`TypeScript` · `React` · `TanStack` · `Vite` · `Tailwind CSS`  
`Supabase` · `PostgreSQL` · `Edge Functions` · `Node.js` · `SQL`  
`Capacitor` · `Android` · `iOS`  
`Cloudflare Workers` · `GitHub Actions` · `CI/CD` · `Git`

<details>
<summary><b>Segurança & arquitetura</b></summary>
<br/>

**Autenticação → sessão → cargo/permissões → autorização da aplicação → Row Level Security → somente dados autorizados.**

- autenticação centralizada;
- RBAC e permissões granulares;
- RLS no PostgreSQL;
- isolamento de acesso no banco;
- operações administrativas restritas;
- pipelines de validação e build;
- regras de negócio compartilhadas entre experiências Web e Mobile.

</details>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## Roadmap do produto

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

<div align="center">

### Software real para operações reais.

**[Demonstração](https://crm.lollahair.com/)** · **[E-mail](mailto:gestao.quiroz@gmail.com)**

<br/>

**Inosuke · Full Stack Developer · Product Engineer**

`Web` · `Android` · `iOS` · `SaaS` · `Cloud` · `Security` · `CI/CD`

</div>
