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

**[Voir la démonstration](https://crm.lollahair.com/)** · **[Contact](mailto:gestao.quiroz@gmail.com)**

</div>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

<div align="center"><img src="./assets/inosuke/icon-strip.svg" width="100%" alt="Compétences d’ingénierie" /></div>

## À propos de moi

Je suis **Inosuke**, Développeur Full Stack et Product Engineer. Je construis des logiciels de bout en bout : frontend, backend, bases de données, authentification, autorisation, règles métier, sécurité, cloud, CI/CD et distribution multiplateforme.

Mon principal cas d’ingénierie est né d’une opération réelle et a évolué vers une plateforme de gestion robuste en production. Le produit fonctionne déjà sur **Desktop Web, Mobile Web et Android**, possède une fondation **iOS** et est préparé pour une évolution commerciale en **SaaS**.

> **Je ne cherche pas seulement à faire fonctionner un écran. Je construis des systèmes où opérations, données, sécurité et métier fonctionnent comme un seul produit.**

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## Produit principal

Le code source est **propriétaire et privé**. Seuls l’environnement de démonstration et le canal de contact sont publics.

**[▶ Ouvrir la démonstration](https://crm.lollahair.com/)** · **[✉ Me contacter](mailto:gestao.quiroz@gmail.com?subject=Int%C3%A9r%C3%AAt%20pour%20le%20produit)**

<details>
<summary><b>Explorer les modules du système</b></summary>
<br/>

Agenda, CRM, paiements, dépenses, stock, consommation, dosage technique, tarification, commissions, résultats financiers, rapports, planification, utilisateurs, rôles et permissions — intégrés dans un même écosystème opérationnel.

</details>

<details>
<summary><b>Explorer l’architecture technique</b></summary>
<br/>

```mermaid
flowchart TB
    subgraph Experience[Expériences]
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

## Ingénierie multiplateforme

| Plateforme | État |
|---|---|
| **Desktop Web** | ✅ En production |
| **Mobile Web** | ✅ En production |
| **Android** | ✅ Build installable et tests sur appareil |
| **iOS** | 🛠️ Fondation architecturale prête |
| **SaaS** | 🚧 Évolution commerciale en cours |

<div align="center"><img src="./assets/inosuke/tech-orbit.svg" width="100%" alt="Orbite technologique d’Inosuke" /></div>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## GitHub Analytics — Beast Mode

Les graphiques sont **générés dans ce dépôt** avec **D3 + Iconify + GitHub Actions**. Aucun service externe de statistiques n’est nécessaire au moment de l’affichage du README.

<div align="center">
<img src="./assets/stats/beast-dashboard.svg" width="100%" alt="Dashboard GitHub d’Inosuke" />
<br/>
<img src="./assets/stats/contribution-current.svg" width="100%" alt="Activité de contributions d’Inosuke" />
<br/>
<img src="./assets/stats/breathing-heatmap.svg" width="100%" alt="Carte des contributions d’Inosuke" />
</div>

<details>
<summary><b>Fonctionnement du moteur de métriques</b></summary>
<br/>

Un workflow GitHub Actions récupère l’activité que GitHub autorise à exposer et génère localement les SVG animés. Le dépôt principal du produit reste privé. Le profil conserve un minimum d’activité déjà vérifié sans révéler les noms des dépôts, le code source ni les métadonnées privées. Le secret optionnel `PROFILE_STATS_TOKEN` peut permettre des métriques privées autorisées plus précises.

</details>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## Stack principale

`TypeScript` · `React` · `TanStack` · `Vite` · `Tailwind CSS`  
`Supabase` · `PostgreSQL` · `Edge Functions` · `Node.js` · `SQL`  
`Capacitor` · `Android` · `iOS`  
`Cloudflare Workers` · `GitHub Actions` · `CI/CD` · `Git`

<div align="center">

**Inosuke · Full Stack Developer · Product Engineer**

`Web` · `Android` · `iOS` · `SaaS` · `Cloud` · `Security` · `CI/CD`

</div>
