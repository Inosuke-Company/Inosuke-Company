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

**[Live demo](https://crm.lollahair.com/)** · **[Contact](mailto:gestao.quiroz@gmail.com)**

</div>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

<div align="center"><img src="./assets/inosuke/icon-strip.svg" width="100%" alt="Engineering capabilities" /></div>

## About me

I am **Inosuke**, a Full Stack Developer and Product Engineer. I build software end to end: frontend, backend, databases, authentication, authorization, business rules, security, cloud, CI/CD and multiplatform delivery.

My main engineering case started from a real operation and evolved into a robust management platform in production. The product already supports **Desktop Web, Mobile Web and Android**, has an **iOS** foundation and is being prepared for commercial evolution as **SaaS**.

> **I do not focus only on making screens work. I build systems where operations, data, security and business work as one product.**

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## Main product

The source code is **proprietary and private**. Public access is limited to the demonstration environment and direct contact.

**[▶ Open live demo](https://crm.lollahair.com/)** · **[✉ Contact me about the product](mailto:gestao.quiroz@gmail.com?subject=Product%20inquiry)**

<details>
<summary><b>Explore system modules</b></summary>
<br/>

Scheduling, CRM, payments, expenses, inventory, consumption, technical dosage, pricing, commissions, financial results, reports, planning, users, roles and permissions — all integrated into one operational ecosystem.

</details>

<details>
<summary><b>Explore technical architecture</b></summary>
<br/>

```mermaid
flowchart TB
    subgraph Experience[Experiences]
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

## Multiplatform engineering

| Platform | Status |
|---|---|
| **Desktop Web** | ✅ Production |
| **Mobile Web** | ✅ Production |
| **Android** | ✅ Installable build and device testing |
| **iOS** | 🛠️ Architectural foundation ready |
| **SaaS** | 🚧 Commercial evolution in progress |

<div align="center"><img src="./assets/inosuke/tech-orbit.svg" width="100%" alt="Inosuke technology orbit" /></div>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## GitHub Analytics — Beast Mode

These visuals are **generated inside this repository** using **D3 + Iconify + GitHub Actions**. No third-party stats service is required when the README is rendered.

<div align="center">
<img src="./assets/stats/beast-dashboard.svg" width="100%" alt="Inosuke GitHub dashboard" />
<br/>
<img src="./assets/stats/contribution-current.svg" width="100%" alt="Inosuke contribution current" />
<br/>
<img src="./assets/stats/breathing-heatmap.svg" width="100%" alt="Inosuke contribution heatmap" />
</div>

<details>
<summary><b>How the analytics engine works</b></summary>
<br/>

A GitHub Actions workflow fetches the activity GitHub allows to be exposed and generates animated SVG assets locally. The main product repository stays private. A verified minimum activity snapshot is preserved without exposing repository names, source code or private metadata. An optional `PROFILE_STATS_TOKEN` can enable more accurate authorized private metrics while remaining stored only in GitHub Actions Secrets.

</details>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## Core stack

`TypeScript` · `React` · `TanStack` · `Vite` · `Tailwind CSS`  
`Supabase` · `PostgreSQL` · `Edge Functions` · `Node.js` · `SQL`  
`Capacitor` · `Android` · `iOS`  
`Cloudflare Workers` · `GitHub Actions` · `CI/CD` · `Git`

<div align="center">

**Inosuke · Full Stack Developer · Product Engineer**

`Web` · `Android` · `iOS` · `SaaS` · `Cloud` · `Security` · `CI/CD`

</div>
