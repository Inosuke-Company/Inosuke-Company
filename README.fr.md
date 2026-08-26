<div align="center">

<img src="./banner.gif" width="100%" alt="Quiroz — Full Stack Developer" />

### 🌍 Langue
[🇧🇷 **Português**](./README.md) · [🇺🇸 **English**](./README.en.md) · [🇪🇸 **Español**](./README.es.md) · [🇫🇷 **Français**](./README.fr.md)

# Quiroz
### Full Stack Developer · Product Engineer · Web · Android · iOS · SaaS

**Transformer des opérations réelles en logiciels robustes, sécurisés et évolutifs.**

[![Démo](https://img.shields.io/badge/DÉMO-crm.lollahair.com-0A66C2?style=for-the-badge&logo=googlechrome&logoColor=white)](https://crm.lollahair.com/)
[![Contact](https://img.shields.io/badge/CONTACT-E--MAIL-181717?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gestao.quiroz@gmail.com)

</div>

---

<div align="center"><img src="./assets/terminal.svg" width="100%" alt="Terminal animé de Quiroz" /></div>

## ⚡ À propos de moi

Je suis **Développeur Full Stack**, spécialisé dans la transformation de problèmes opérationnels complexes en produits numériques complets et maintenables.

J’interviens sur l’ensemble de la chaîne : **frontend, backend, bases de données, authentification, autorisation, sécurité, règles métier, intégrations, cloud, CI/CD et distribution multiplateforme**.

Mon principal cas d’ingénierie est né d’une opération réelle et a évolué vers une plateforme de gestion robuste en production, conçue pour **Desktop Web, Mobile Web, Android et iOS**, avec une évolution prévue vers un modèle **SaaS commercial**.

> **Je ne construis pas seulement des écrans. Je construis des systèmes où opérations, données, sécurité et logique métier fonctionnent comme un seul produit.**

<div align="center"><img src="./assets/platform.svg" width="100%" alt="Architecture multiplateforme de Quiroz" /></div>

---

## 🚀 Principal cas d’ingénierie

### Plateforme complète de gestion pour les entreprises de beauté

La plateforme regroupe agenda, CRM, finance, stock, consommation, tarification, commissions, indicateurs et contrôle d’accès dans un même écosystème.

### 🔒 Code privé. Produit démontrable.

Le code source est **propriétaire et privé**. L’accès public est limité à l’environnement de démonstration.

<div align="center">

[![Ouvrir la démo](https://img.shields.io/badge/OUVRIR_LA_DÉMO-22C55E?style=for-the-badge&logo=googlechrome&logoColor=white)](https://crm.lollahair.com/)
[![Me contacter](https://img.shields.io/badge/INTÉRESSÉ-ME_CONTACTER-F59E0B?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gestao.quiroz@gmail.com?subject=Int%C3%A9r%C3%AAt%20pour%20le%20projet)

</div>

---

## 🧠 Architecture métier intégrée

```mermaid
flowchart LR
    A[Agenda] --> B[Prestation]
    B --> C[Commande]
    C --> D[Paiement]
    D --> E[Finance]
    B --> F[Consommation]
    F --> G[Stock]
    G --> H[Coûts]
    B --> I[Commission]
    I --> E
    A --> J[Client]
    J --> K[Historique]
    K --> L[Fidélisation / CRM]
    H --> M[Tarification]
    M --> N[Marge]
    N --> O[Planification]
```

---

## 📱 Multiplateforme

| Plateforme | État |
|---|---|
| 🖥️ Desktop Web | ✅ En production |
| 📱 Mobile Web | ✅ En production |
| 🤖 Android | ✅ Build installable et tests sur appareil |
| 🍎 iOS | 🛠️ Fondation architecturale prête |
| ☁️ SaaS | 🚧 Évolution commerciale en cours |

---

## 🏗️ Architecture technique

```mermaid
flowchart TB
    subgraph Clients[Expériences]
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

## 🔐 Sécurité dès la conception

Authentification → validation de session → rôles et permissions → autorisation applicative → **Row Level Security** → données autorisées uniquement.

---

## 🧩 Compétences appliquées en pratique

| Domaine | Application |
|---|---|
| Frontend Engineering | React, TypeScript, architecture de composants, UX desktop/mobile |
| Backend Engineering | Edge Functions, APIs, authentification et règles métier |
| Database Engineering | PostgreSQL, SQL, modélisation relationnelle et RLS |
| Sécurité | Auth, RBAC, RLS et isolation des accès |
| Mobile | Capacitor, Android et base iOS |
| Cloud | Cloudflare Workers et Supabase |
| DevOps | GitHub Actions, CI/CD, builds et artefacts |
| Product Engineering | Du problème opérationnel réel à l’architecture produit |

---

<div align="center">

## 🐍 Activité GitHub

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/gestao-quiroz/SobreMim/output/github-contribution-grid-snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/gestao-quiroz/SobreMim/output/github-contribution-grid-snake.svg">
  <img alt="Animation des contributions GitHub" src="https://raw.githubusercontent.com/gestao-quiroz/SobreMim/output/github-contribution-grid-snake.svg">
</picture>

</div>

---

<div align="center">

### Vous souhaitez découvrir le produit ou discuter d’un projet ?

[![Démo](https://img.shields.io/badge/VOIR_LA_DÉMO-0A66C2?style=for-the-badge&logo=googlechrome&logoColor=white)](https://crm.lollahair.com/)
[![Email](https://img.shields.io/badge/ME_CONTACTER-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gestao.quiroz@gmail.com)

**Quiroz · Full Stack Developer · Product Engineer**

</div>