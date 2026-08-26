<div align="center">

<img src="./banner.gif" width="100%" alt="Quiroz — Full Stack Developer" />

### 🌍 Idioma
[🇧🇷 **Português**](./README.md) · [🇺🇸 **English**](./README.en.md) · [🇪🇸 **Español**](./README.es.md) · [🇫🇷 **Français**](./README.fr.md)

# Quiroz
### Full Stack Developer · Product Engineer · Web · Android · iOS · SaaS

**Transformando operaciones reales en software robusto, seguro y escalable.**

[![Demo](https://img.shields.io/badge/DEMO-crm.lollahair.com-0A66C2?style=for-the-badge&logo=googlechrome&logoColor=white)](https://crm.lollahair.com/)
[![Contacto](https://img.shields.io/badge/CONTACTO-E--MAIL-181717?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gestao.quiroz@gmail.com)

</div>

---

<div align="center"><img src="./assets/terminal.svg" width="100%" alt="Terminal animado de Quiroz" /></div>

## ⚡ Sobre mí

Soy **Desarrollador Full Stack** enfocado en convertir problemas operativos complejos en productos digitales completos, mantenibles y preparados para crecer.

Trabajo de extremo a extremo: **frontend, backend, bases de datos, autenticación, autorización, seguridad, reglas de negocio, integraciones, cloud, CI/CD y distribución multiplataforma**.

Mi principal caso de ingeniería nació de una operación real y evolucionó hasta convertirse en una plataforma de gestión robusta en producción, diseñada para **Desktop Web, Mobile Web, Android e iOS**, con una evolución prevista hacia un modelo **SaaS comercial**.

> **No construyo pantallas aisladas. Construyo sistemas donde operación, datos, seguridad y negocio funcionan como un solo producto.**

<div align="center"><img src="./assets/platform.svg" width="100%" alt="Arquitectura multiplataforma de Quiroz" /></div>

---

## 🚀 Principal caso de ingeniería

### Plataforma integral de gestión para negocios de belleza

La plataforma integra agenda, CRM, finanzas, inventario, consumo, precios, comisiones, indicadores y control de acceso en un mismo ecosistema.

### 🔒 Código privado. Producto demostrable.

El código fuente es **propietario y privado**. El acceso público está limitado al entorno de demostración.

<div align="center">

[![Abrir demo](https://img.shields.io/badge/ABRIR_DEMO-22C55E?style=for-the-badge&logo=googlechrome&logoColor=white)](https://crm.lollahair.com/)
[![Contacto](https://img.shields.io/badge/INTERESADO-CONTÁCTAME-F59E0B?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gestao.quiroz@gmail.com?subject=Inter%C3%A9s%20en%20el%20proyecto)

</div>

---

## 🧠 Arquitectura integrada

```mermaid
flowchart LR
    A[Agenda] --> B[Atención]
    B --> C[Comanda]
    C --> D[Pago]
    D --> E[Finanzas]
    B --> F[Consumo]
    F --> G[Inventario]
    G --> H[Costos]
    B --> I[Comisión]
    I --> E
    A --> J[Cliente]
    J --> K[Historial]
    K --> L[Retención / CRM]
    H --> M[Precios]
    M --> N[Margen]
    N --> O[Planificación]
```

---

## 📱 Multiplataforma

| Plataforma | Estado |
|---|---|
| 🖥️ Desktop Web | ✅ En producción |
| 📱 Mobile Web | ✅ En producción |
| 🤖 Android | ✅ Build instalable y pruebas en dispositivo |
| 🍎 iOS | 🛠️ Base arquitectónica preparada |
| ☁️ SaaS | 🚧 Evolución comercial en curso |

---

## 🏗️ Arquitectura técnica

```mermaid
flowchart TB
    subgraph Clients[Experiencias]
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

## 🔐 Seguridad por diseño

Autenticación → validación de sesión → roles y permisos → autorización de aplicación → **Row Level Security** → solo datos autorizados.

---

## 🧩 Capacidades prácticas

| Área | Aplicación |
|---|---|
| Frontend Engineering | React, TypeScript, arquitectura de componentes y UX desktop/mobile |
| Backend Engineering | Edge Functions, APIs, autenticación y reglas de negocio |
| Database Engineering | PostgreSQL, SQL, modelado relacional y RLS |
| Seguridad | Auth, RBAC, RLS y aislamiento de acceso |
| Mobile | Capacitor, Android y base para iOS |
| Cloud | Cloudflare Workers y Supabase |
| DevOps | GitHub Actions, CI/CD, builds y artefactos |
| Product Engineering | Del problema operativo real a la arquitectura de producto |

---

<div align="center">

## 🐍 Actividad en GitHub

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/gestao-quiroz/SobreMim/output/github-contribution-grid-snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/gestao-quiroz/SobreMim/output/github-contribution-grid-snake.svg">
  <img alt="Animación de contribuciones" src="https://raw.githubusercontent.com/gestao-quiroz/SobreMim/output/github-contribution-grid-snake.svg">
</picture>

</div>

---

<div align="center">

### ¿Quieres conocer el producto o hablar de un proyecto?

[![Demo](https://img.shields.io/badge/VER_DEMO-0A66C2?style=for-the-badge&logo=googlechrome&logoColor=white)](https://crm.lollahair.com/)
[![Email](https://img.shields.io/badge/CONTACTO-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gestao.quiroz@gmail.com)

**Quiroz · Full Stack Developer · Product Engineer**

</div>