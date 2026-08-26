<div align="center">

<picture>
  <source srcset="./banner.webp" type="image/webp">
  <img src="./banner-fallback.gif" width="100%" alt="Inosuke — Full Stack Developer" />
</picture>

<br/>

[<img src="./assets/lang-pt.svg" alt="Português" height="30">](./README.md)
[<img src="./assets/lang-en.svg" alt="English" height="30">](./README.en.md)
[<img src="./assets/lang-es.svg" alt="Español" height="30">](./README.es.md)
[<img src="./assets/lang-fr.svg" alt="Français" height="30">](./README.fr.md)

<br/>

<img src="./assets/inosuke/title.svg" width="100%" alt="Inosuke — Beast Breathing Full Stack Engineering" />

### Full Stack Developer · Product Engineer · Web · Android · iOS · SaaS

**Transformo operaciones reales en productos digitales robustos, seguros y escalables.**

**[🔥 Conocer Meu Salão](https://crm.lollahair.com/)** · **[✉️ Contactarme](mailto:gestao.quiroz@gmail.com)**

</div>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## 🐗 Sobre Inosuke

Soy **Desarrollador Full Stack y Product Engineer**. Trabajo de extremo a extremo: frontend, backend, bases de datos, autenticación, autorización, reglas de negocio, seguridad, cloud, CI/CD y distribución multiplataforma.

Mi principal caso de ingeniería nació de una **operación real**, entró en producción y continúa evolucionando según el uso diario.

<div align="center"><img src="./assets/inosuke/icon-strip.svg" width="100%" alt="Stack de ingeniería de Inosuke" /></div>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## 🔥 Meu Salão — producto principal

**Meu Salão** es una plataforma completa de gestión para salones y negocios de belleza. Centraliza agenda, CRM, cobros, gastos, inventario, consumo, precios, comisiones, resultados financieros, informes, usuarios y permisos.

El código fuente es **propietario y privado**. El acceso público se limita al entorno de demostración y al contacto directo.

<div align="center">

### [▶ Abrir demo de Meu Salão](https://crm.lollahair.com/)

</div>

| Plataforma | Estado |
|---|---|
| 🖥️ **Desktop Web** | ✅ En producción |
| 📱 **Mobile Web** | ✅ En producción |
| 🤖 **Android** | ✅ Build instalable y pruebas en dispositivo |
| 🍎 **iOS** | 🛠️ Base arquitectónica preparada |
| ☁️ **SaaS** | 🚧 Preparación comercial y planes de pago |

Meu Salão ya supera **704 commits** en su repositorio principal privado.

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## ⚔️ Beast Stack

<div align="center"><img src="./assets/inosuke/tech-orbit.svg" width="100%" alt="Stack tecnológica de Meu Salão" /></div>

<details>
<summary><b>🗡️ Abrir arquitectura técnica</b></summary>
<br/>

```mermaid
flowchart TB
    subgraph Experience
        WEB[Desktop Web]
        MOBILE[Mobile Web]
        ANDROID[Android]
        IOS[iOS]
    end
    subgraph Application
        REACT[React + TypeScript]
        TANSTACK[TanStack]
        DOMAIN[Shared Domain & Business Rules]
        CAP[Capacitor]
    end
    subgraph Backend
        AUTH[Supabase Auth]
        EDGE[Edge Functions]
        RLS[Row Level Security]
        DB[(PostgreSQL)]
    end
    subgraph Delivery
        CF[Cloudflare Workers]
        GH[GitHub Actions]
    end
    WEB --> REACT
    MOBILE --> REACT
    ANDROID --> CAP
    IOS --> CAP
    CAP --> REACT
    REACT --> TANSTACK --> DOMAIN
    DOMAIN --> AUTH
    DOMAIN --> EDGE
    DOMAIN --> DB
    AUTH --> RLS --> DB
    GH --> CF
```

</details>

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## 📜 Beast Activity Ledger — GitHub Analytics

Los gráficos se **generan dentro de este repositorio mediante GitHub Actions**. El código privado permanece oculto y la actividad verificada se presenta de forma agregada.

<div align="center">

<img src="./assets/stats/beast-dashboard.svg" width="100%" alt="Actividad GitHub de Inosuke" />
<br/>
<img src="./assets/stats/contribution-current.svg" width="100%" alt="Distribución de commits entre Meu Salão y el perfil" />
<br/>
<img src="./assets/stats/breathing-heatmap.svg" width="100%" alt="Calendario público de contribuciones" />

</div>

La actividad rastreada incluye **704+ commits de Meu Salão** más los commits contabilizados automáticamente en este repositorio público del perfil.

<img src="./assets/inosuke/divider.svg" width="100%" alt="" />

## 🐾 Dirección del producto

**Operación real → arquitectura sólida → Web → Android → iOS → multi-tenant → SaaS → planes pagos → escala comercial.**

<div align="center">

### **[🔥 Abrir demo](https://crm.lollahair.com/)** · **[✉️ Contactarme](mailto:gestao.quiroz@gmail.com)**

**Inosuke · Full Stack Developer · Product Engineer**

`Web` · `Android` · `iOS` · `SaaS` · `Cloud` · `Security` · `CI/CD`

</div>
