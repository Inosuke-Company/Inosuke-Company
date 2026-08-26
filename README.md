<div align="center">

<img src="./banner.gif" width="100%" alt="Quiroz — Full Stack Developer" />

<br/>

### 🌍 Idioma / Language

[🇧🇷 **Português**](./README.md) · [🇺🇸 **English**](./README.en.md) · [🇪🇸 **Español**](./README.es.md) · [🇫🇷 **Français**](./README.fr.md)

<br/>

# Quiroz

### Full Stack Developer · Product Engineer · Web · Android · iOS · SaaS

**Transformando operações reais em software robusto, seguro e escalável.**

[![Demo](https://img.shields.io/badge/DEMONSTRAÇÃO-crm.lollahair.com-0A66C2?style=for-the-badge&logo=googlechrome&logoColor=white)](https://crm.lollahair.com/)
[![Contato](https://img.shields.io/badge/CONTATO-E--MAIL-181717?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gestao.quiroz@gmail.com)
[![Perfil](https://img.shields.io/badge/GITHUB-QUIROZ-111827?style=for-the-badge&logo=github&logoColor=white)](https://github.com/gestao-quiroz)

</div>

---

<div align="center">
  <img src="./assets/terminal.svg" width="100%" alt="Quiroz animated developer terminal" />
</div>

---

## ⚡ Sobre mim

Sou **Desenvolvedor Full Stack** com foco em transformar processos complexos em produtos digitais completos, claros e sustentáveis.

Atuo de ponta a ponta: **frontend, backend, banco de dados, autenticação, autorização, segurança, regras de negócio, integrações, cloud, CI/CD e distribuição multiplataforma**.

Meu principal case nasceu de uma necessidade operacional real e evoluiu para uma plataforma robusta de gestão, utilizada em produção e arquitetada para **Desktop Web, Mobile Web, Android e iOS**, com evolução planejada para um modelo **SaaS comercial**.

> **Não construo apenas telas. Construo sistemas em que operação, dados, segurança e negócio funcionam como um único produto.**

---

<div align="center">
  <img src="./assets/platform.svg" width="100%" alt="Quiroz multiplatform product architecture" />
</div>

---

## 🚀 Principal case de engenharia

### Plataforma completa de gestão para negócios de beleza

O produto conecta diferentes áreas operacionais e gerenciais em um mesmo ecossistema.

<table>
<tr>
<td width="50%" valign="top">

### 🗓️ Operação
- Agenda diária e semanal
- Gestão por profissional
- Bloqueios e indisponibilidades
- Sinal via PIX
- Status de atendimento
- Detecção de conflitos
- WhatsApp operacional
- UX específica para desktop e mobile

</td>
<td width="50%" valign="top">

### 👥 CRM
- Cadastro e histórico de clientes
- Atendimentos e recorrência
- Retorno e repescagem
- Aniversários
- Receita histórica
- Ticket médio
- Cancelamentos e no-shows
- Relacionamento e observações

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 💰 Financeiro
- Comandas e cobranças
- Recebimentos
- Múltiplas formas de pagamento
- Despesas e custos
- Fluxo de caixa
- Resultado operacional
- Margem e rentabilidade
- Metas e ponto de equilíbrio

</td>
<td width="50%" valign="top">

### 📦 Gestão
- Produtos e estoque
- Entradas, saídas e consumo
- Dose técnica
- Custo por atendimento
- Serviços e pacotes
- Precificação
- Comissões
- Relatórios e indicadores

</td>
</tr>
</table>

### 🔒 Código privado. Produto demonstrável.

O código-fonte desse sistema é **proprietário e permanece privado**. A apresentação pública é feita somente pelo ambiente de demonstração.

<div align="center">

[![Ver sistema](https://img.shields.io/badge/ABRIR_SISTEMA_DE_DEMONSTRAÇÃO-22C55E?style=for-the-badge&logo=googlechrome&logoColor=white)](https://crm.lollahair.com/)
[![Falar comigo](https://img.shields.io/badge/INTERESSE_NO_PROJETO-FALE_COMIGO-F59E0B?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gestao.quiroz@gmail.com?subject=Interesse%20no%20projeto%20de%20gest%C3%A3o)

</div>

---

## 🧠 O diferencial: integração real entre módulos

Não é um CRUD com telas isoladas. As regras de negócio conectam os módulos para manter operação, financeiro, estoque e relacionamento consistentes.

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

---

## 📱 Multiplataforma

| Plataforma | Estado |
|---|---|
| 🖥️ **Desktop Web** | ✅ Em operação |
| 📱 **Mobile Web** | ✅ Em operação |
| 🤖 **Android** | ✅ Build instalável e testes em dispositivo |
| 🍎 **iOS** | 🛠️ Fundação arquitetural preparada |
| ☁️ **SaaS** | 🚧 Evolução para comercialização e planos pagos |

A experiência mobile não é uma miniatura do desktop: as duas interfaces compartilham domínio e dados, mas são pensadas para contextos diferentes de uso.

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
![TanStack](https://img.shields.io/badge/TanStack-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![iOS](https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=apple&logoColor=white)

![Cloudflare](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

</div>

---

## 🔐 Segurança como parte da arquitetura

```mermaid
flowchart LR
    A[Login] --> B[Session Validation]
    B --> C[Perfil]
    C --> D[Cargo / Permissões]
    D --> E[Autorização da aplicação]
    E --> F[Row Level Security]
    F --> G[(Somente dados autorizados)]
```

- autenticação centralizada;
- autorização por cargo e permissão;
- isolamento de dados no banco;
- políticas RLS;
- validação de sessão;
- operações administrativas restritas;
- proteção que não depende apenas do frontend.

---

## 🧩 Competências aplicadas na prática

| Área | Aplicação |
|---|---|
| **Frontend Engineering** | React, TypeScript, componentização, UX desktop/mobile |
| **Backend Engineering** | Edge Functions, autenticação, APIs e regras de negócio |
| **Database Engineering** | PostgreSQL, modelagem relacional, SQL e RLS |
| **Security Engineering** | Auth, RBAC, RLS e isolamento de acesso |
| **Mobile Engineering** | Capacitor, Android e base para iOS |
| **Cloud** | Cloudflare Workers e Supabase |
| **DevOps** | GitHub Actions, CI/CD, builds e artefatos |
| **Product Engineering** | Do problema real à arquitetura de produto |
| **Business Systems** | CRM, agenda, financeiro, estoque, custos, comissões e relatórios |

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

> **Software bom não é apenas o que funciona na apresentação. É o que continua funcionando quando entra na rotina de uma operação real.**

---

<div align="center">

## 🐍 Atividade no GitHub

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/gestao-quiroz/SobreMim/output/github-contribution-grid-snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/gestao-quiroz/SobreMim/output/github-contribution-grid-snake.svg">
  <img alt="Animação das contribuições no GitHub" src="https://raw.githubusercontent.com/gestao-quiroz/SobreMim/output/github-contribution-grid-snake.svg">
</picture>

<sub>Esta animação é gerada automaticamente por GitHub Actions e fica hospedada no próprio repositório.</sub>

</div>

---

## 🛣️ Roadmap

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

---

<details>
<summary><b>🧠 Princípios de engenharia que valorizo</b></summary>
<br/>

- Código modular e compreensível
- Regras de negócio centralizadas
- Segurança no backend e no banco
- Interfaces pensadas para uso diário
- Automação que reduz trabalho real
- Dados consistentes entre módulos
- Pipelines reproduzíveis
- Evolução sem quebrar funcionalidades existentes
- Produto orientado ao problema, não à moda tecnológica

</details>

---

<div align="center">

### Quer conhecer o produto ou conversar sobre um projeto?

[![Demonstração](https://img.shields.io/badge/VER_DEMONSTRAÇÃO-0A66C2?style=for-the-badge&logo=googlechrome&logoColor=white)](https://crm.lollahair.com/)
[![E-mail](https://img.shields.io/badge/ENTRAR_EM_CONTATO-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gestao.quiroz@gmail.com)

<br/><br/>

**Quiroz · Full Stack Developer · Product Engineer**

`Web` · `Android` · `iOS` · `SaaS` · `Cloud` · `Security` · `CI/CD`

</div>