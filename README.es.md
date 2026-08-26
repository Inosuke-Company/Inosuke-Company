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

**[Ver demostración](https://crm.lollahair.com/)** · **[Contacto](mailto:gestao.quiroz@gmail.com)**

</div>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

<div align="center"><img src="./assets/inosuke/icon-strip.svg" width="100%" alt="Capacidades de ingeniería" /></div>

## Sobre mí

Soy **Inosuke**, Desarrollador Full Stack y Product Engineer. Construyo software de extremo a extremo: frontend, backend, bases de datos, autenticación, autorización, reglas de negocio, seguridad, cloud, CI/CD y distribución multiplataforma.

Mi principal caso de ingeniería nació de una operación real y evolucionó hasta convertirse en una plataforma robusta de gestión en producción. El producto ya funciona en **Desktop Web, Mobile Web y Android**, tiene base para **iOS** y está siendo preparado para evolucionar comercialmente como **SaaS**.

> **No me concentro solamente en hacer que una pantalla funcione. Construyo sistemas donde operación, datos, seguridad y negocio funcionan como un solo producto.**

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## Producto principal

El código fuente es **propietario y privado**. Públicamente mantengo únicamente el entorno de demostración y el canal de contacto.

**[▶ Abrir demostración](https://crm.lollahair.com/)** · **[✉ Hablar conmigo](mailto:gestao.quiroz@gmail.com?subject=Inter%C3%A9s%20en%20el%20producto)**

<details>
<summary><b>Explorar módulos del sistema</b></summary>
<br/>

Agenda, CRM, pagos, gastos, inventario, consumo, dosificación técnica, precios, comisiones, resultados financieros, informes, planificación, usuarios, cargos y permisos — todo integrado en un mismo ecosistema operativo.

</details>

<details>
<summary><b>Explorar arquitectura técnica</b></summary>
<br/>

```mermaid
flowchart TB
    subgraph Experience[Experiencias]
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

## Ingeniería multiplataforma

| Plataforma | Estado |
|---|---|
| **Desktop Web** | ✅ En producción |
| **Mobile Web** | ✅ En producción |
| **Android** | ✅ Build instalable y pruebas en dispositivo |
| **iOS** | 🛠️ Base arquitectónica preparada |
| **SaaS** | 🚧 Evolución comercial en curso |

<div align="center"><img src="./assets/inosuke/tech-orbit.svg" width="100%" alt="Órbita tecnológica de Inosuke" /></div>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## GitHub Analytics — Beast Mode

Los gráficos se **generan dentro de este repositorio** usando **D3 + Iconify + GitHub Actions**. No dependen de un servicio externo de estadísticas cuando se renderiza el README.

<div align="center">
<img src="./assets/stats/beast-dashboard.svg" width="100%" alt="Dashboard de actividad de Inosuke" />
<br/>
<img src="./assets/stats/contribution-current.svg" width="100%" alt="Actividad de contribuciones de Inosuke" />
<br/>
<img src="./assets/stats/breathing-heatmap.svg" width="100%" alt="Mapa de contribuciones de Inosuke" />
</div>

<details>
<summary><b>Cómo funciona el motor de métricas</b></summary>
<br/>

Un workflow de GitHub Actions consulta la actividad que GitHub permite exponer y genera los SVG animados localmente. El repositorio principal del producto permanece privado. El perfil conserva un mínimo verificado de actividad sin revelar nombres de repositorios, código fuente ni metadatos privados. El secret opcional `PROFILE_STATS_TOKEN` puede habilitar métricas privadas autorizadas con mayor precisión.

</details>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## Stack principal

`TypeScript` · `React` · `TanStack` · `Vite` · `Tailwind CSS`  
`Supabase` · `PostgreSQL` · `Edge Functions` · `Node.js` · `SQL`  
`Capacitor` · `Android` · `iOS`  
`Cloudflare Workers` · `GitHub Actions` · `CI/CD` · `Git`

<div align="center">

**Inosuke · Full Stack Developer · Product Engineer**

`Web` · `Android` · `iOS` · `SaaS` · `Cloud` · `Security` · `CI/CD`

</div>
