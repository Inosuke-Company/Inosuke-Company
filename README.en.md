<div align="center">

<img src="./banner.gif" width="100%" alt="Quiroz — Full Stack Developer" />

### 🌍 Language
[🇧🇷 **Português**](./README.md) · [🇺🇸 **English**](./README.en.md) · [🇪🇸 **Español**](./README.es.md) · [🇫🇷 **Français**](./README.fr.md)

# Quiroz
### Full Stack Developer · Product Engineer · Web · Android · iOS · SaaS

**Turning real operations into robust, secure and scalable software.**

[![Demo](https://img.shields.io/badge/LIVE_DEMO-crm.lollahair.com-0A66C2?style=for-the-badge&logo=googlechrome&logoColor=white)](https://crm.lollahair.com/)
[![Contact](https://img.shields.io/badge/CONTACT-E--MAIL-181717?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gestao.quiroz@gmail.com)

</div>

---

<div align="center"><img src="./assets/terminal.svg" width="100%" alt="Quiroz animated developer terminal" /></div>

## ⚡ About me

I am a **Full Stack Developer** focused on turning complex operational problems into complete, maintainable digital products.

I work across the entire stack: **frontend, backend, databases, authentication, authorization, security, business rules, integrations, cloud infrastructure, CI/CD and multiplatform delivery**.

My main engineering case started from a real business operation and evolved into a robust management platform running in production, architected for **Desktop Web, Mobile Web, Android and iOS**, with a roadmap toward a commercial **SaaS** model.

> **I do not build isolated screens. I build systems where operations, data, security and business logic work as one product.**

<div align="center"><img src="./assets/platform.svg" width="100%" alt="Quiroz multiplatform product architecture" /></div>

---

## 🚀 Main engineering case

### End-to-end management platform for beauty businesses

The platform combines multiple operational and management domains in one ecosystem:

- scheduling, staff calendars, blocks and availability;
- customer CRM, history, retention and recurring visits;
- orders, payments, expenses, cash flow and profitability;
- inventory, product movements, consumption and technical dosage;
- services, packages, pricing and commissions;
- reports, performance indicators and business planning;
- role-based access, permissions and secure data isolation;
- dedicated desktop and mobile experiences.

### 🔒 Private source code. Public demonstration.

The source code is **proprietary and private**. Public access is limited to the product demonstration environment.

<div align="center">

[![Open demo](https://img.shields.io/badge/OPEN_LIVE_DEMO-22C55E?style=for-the-badge&logo=googlechrome&logoColor=white)](https://crm.lollahair.com/)
[![Contact me](https://img.shields.io/badge/INTERESTED-CONTACT_ME-F59E0B?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gestao.quiroz@gmail.com?subject=Project%20inquiry)

</div>

---

## 🧠 Integrated business architecture

```mermaid
flowchart LR
    A[Schedule] --> B[Service]
    B --> C[Order]
    C --> D[Payment]
    D --> E[Finance]
    B --> F[Consumption]
    F --> G[Inventory]
    G --> H[Costs]
    B --> I[Commission]
    I --> E
    A --> J[Customer]
    J --> K[History]
    K --> L[Retention / CRM]
    H --> M[Pricing]
    M --> N[Margin]
    N --> O[Planning]
```

---

## 📱 Multiplatform

| Platform | Status |
|---|---|
| 🖥️ **Desktop Web** | ✅ In production |
| 📱 **Mobile Web** | ✅ In production |
| 🤖 **Android** | ✅ Installable build and device testing |
| 🍎 **iOS** | 🛠️ Architectural foundation ready |
| ☁️ **SaaS** | 🚧 Commercial evolution in progress |

---

## 🏗️ Technical architecture

```mermaid
flowchart TB
    subgraph Clients[Experiences]
        DESKTOP[Desktop Web]
        MOBILE[Mobile Web]
        ANDROID[Android]
        IOS[iOS]
    end
    subgraph App[Application Layer]
        REACT[React + TypeScript]
        ROUTER[TanStack]
        DOMAIN[Shared Domain & Business Rules]
        CAP[Capacitor]
    end
    subgraph Backend[Backend & Data]
        AUTH[Supabase Auth]
        EDGE[Edge Functions]
        RLS[Row Level Security]
        DB[(PostgreSQL)]
    end
    subgraph Infra[Cloud & Delivery]
        CF[Cloudflare Workers]
        ACTIONS[GitHub Actions]
        APK[Android Pipeline]
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
    ACTIONS --> CF
    ACTIONS --> APK
    ACTIONS --> IOSPIPE
```

---

<div align="center">

## 🧰 Stack

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![iOS](https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=apple&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

</div>

---

## 🔐 Security by design

Authentication → session validation → roles & permissions → application authorization → **Row Level Security** → authorized data only.

I treat security as part of the architecture rather than a frontend-only concern.

---

## 🧩 Practical engineering capabilities

| Area | Application |
|---|---|
| Frontend Engineering | React, TypeScript, component architecture, desktop/mobile UX |
| Backend Engineering | Edge Functions, APIs, authentication and business rules |
| Database Engineering | PostgreSQL, SQL, relational modeling and RLS |
| Security | Auth, RBAC, RLS and access isolation |
| Mobile | Capacitor, Android and iOS foundation |
| Cloud | Cloudflare Workers and Supabase |
| DevOps | GitHub Actions, CI/CD, builds and artifacts |
| Product Engineering | From real operational problem to scalable product architecture |

---

<div align="center">

## 🐍 GitHub activity

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/gestao-quiroz/SobreMim/output/github-contribution-grid-snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/gestao-quiroz/SobreMim/output/github-contribution-grid-snake.svg">
  <img alt="GitHub contribution animation" src="https://raw.githubusercontent.com/gestao-quiroz/SobreMim/output/github-contribution-grid-snake.svg">
</picture>

</div>

---

## 🛣️ Roadmap

```mermaid
flowchart LR
    A[Real operation] --> B[Solid architecture]
    B --> C[Web]
    C --> D[Android]
    D --> E[iOS]
    E --> F[Multi-tenant]
    F --> G[SaaS]
    G --> H[Paid plans]
    H --> I[Commercial scale]
```

<div align="center">

### Interested in the product or in working together?

[![Demo](https://img.shields.io/badge/VIEW_DEMO-0A66C2?style=for-the-badge&logo=googlechrome&logoColor=white)](https://crm.lollahair.com/)
[![Email](https://img.shields.io/badge/CONTACT_ME-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gestao.quiroz@gmail.com)

**Quiroz · Full Stack Developer · Product Engineer**

</div>