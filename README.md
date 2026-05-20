# CMS ITA — CMS Headless Visual Multi-Tenant
CMS headless con constructor visual drag & drop para sitios web.


## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Variables de entorno](#variables-de-entorno)
- [Roles y permisos](#roles-y-permisos)
- [Módulo ITA](#módulo-ita)
- [Puertos y servicios](#puertos-y-servicios)
- [Comandos útiles](#comandos-útiles)

## Descripción general

CMS multi-tenant (multi-cliente) que permite construir sitios web institucionales mediante bloques visuales configurables. Cada cliente (tenant) tiene sus datos completamente aislados. 


## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| CMS | Payload CMS | 3.x |
| Frontend | Next.js + Tailwind CSS | 16.x |
| Base de datos | PostgreSQL | 16 |
| Autenticación | JWT + refresh token | — |
| Almacenamiento | MinIO (S3 compatible) | latest |
| Constructor visual | Craft.js | — |
| Gestor de paquetes | pnpm | 10.x |
| Monorepo | Turborepo | 2.x |
| Lenguaje | TypeScript | 5.x |
| Contenedores | Docker + Docker Compose | — |

## Arquitectura

- **Multi-tenant**: cada cliente tiene `tenant_id`; los datos están completamente aislados mediante Row Level Security (RLS) en PostgreSQL.
- **Bloques dinámicos**: las páginas se construyen combinando bloques configurables (Header, Footer, Hero, Cards, Galería, Formulario, API externa, etc.). Los layouts se serializan como JSONB en PostgreSQL.
- **Roles y permisos**: aplicados tanto en la UI como en la API.
- **Módulo ITA**: checklist de auditoría vinculado a las páginas del CMS donde se cumple cada requisito.


## Estructura del proyecto

cms-ita/
├── apps/
│   ├── cms/                        # Payload CMS (panel admin + API)
│   │   ├── src/
│   │   │   ├── collections/        # Definición de colecciones (Tenants, Users, Pages, Media, ITA...)
│   │   │   ├── blocks/             # Bloques dinámicos (Hero, Cards, Footer, etc.)
│   │   │   ├── hooks/              # Hooks de Payload (beforeChange, afterRead, etc.)
│   │   │   └── payload.config.ts   # Configuración principal de Payload
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   └── .env                    # Variables de entorno (NO commitear)
│   │
│   └── web/                        # Next.js frontend público
│       ├── src/
│       │   ├── app/                # App Router de Next.js
│       │   ├── components/         # Componentes React + Tailwind
│       │   └── lib/                # Utilidades, cliente API, etc.
│       ├── next.config.ts
│       ├── package.json
│       └── .env                    # Variables de entorno (NO commitear)
│
├── packages/
│   ├── types/                      # Tipos TypeScript compartidos entre apps
│   └── ui/                         # Componentes Tailwind reutilizables
│
├── scripts/
│   └── init.sql                    # SQL inicial (extensiones, RLS base)
│
├── docker-compose.yml              # PostgreSQL 16 + MinIO
├── turbo.json                      # Configuración Turborepo
├── pnpm-workspace.yaml             # Workspace pnpm
├── package.json                    # Raíz del monorepo
└── README.md

## Requisitos previos

Instalar las siguientes herramientas antes de clonar el proyecto:

| Herramienta | Versión mínima | Descarga |
|-------------|---------------|----------|
| Node.js | 20.9.0 o superior | https://nodejs.org |
| pnpm | 10.x | `npm i -g pnpm@10.11.0` |
| Docker Desktop | Última estable | https://www.docker.com/products/docker-desktop |
| Git | Última estable | https://git-scm.com |

> **Windows**: usar PowerShell o Windows Terminal. No usar CMD.

## Instalación y ejecución

### 1. Clonar el repositorio

### 2. Instalar dependencias

    pnpm install

### 3. Configurar variables de entorno

Copiar los archivos de ejemplo y editarlos:

# CMS (Payload)
    copy apps\cms\.env.example apps\cms\.env

# Frontend (Next.js)

    copy apps\web\.env.example apps\web\.env

    Ver la sección [Variables de entorno](#variables-de-entorno) para los valores requeridos.

### 4. Levantar los servicios de infraestructura

    docker compose up -d

    Esto levanta:
    - **PostgreSQL 16** en el puerto `5433`
    - **MinIO** (almacenamiento S3) en los puertos `9000` y `9001`

    Verificar que los contenedores estén corriendo:
    docker ps

    Deben aparecer `cms-ita-postgres-1` y `cms-ita-minio-1`.

### 5. Iniciar el CMS en desarrollo

    cd apps/cms
    pnpm dev

    El panel administrativo estará disponible en: **http://localhost:3000/admin**
    La primera vez pedirá crear el usuario administrador inicial.

### 6. Iniciar el frontend (cuando esté disponible)

    cd apps/web
    pnpm dev
    El sitio público estará en: **http://localhost:3001**

### 7. Desde la raíz (ambas apps simultáneo)

    pnpm dev

## Variables de entorno

### `apps/cms/.env`

# Base de datos PostgreSQL

    DATABASE_URI=postgresql://cms_user:cms_secret_local@127.0.0.1:5433/cms_ita

# Secreto de Payload (mínimo 32 caracteres, cambiar en producción)
    PAYLOAD_SECRET=cambia_esto_en_produccion_minimo_32_chars

# URL pública del servidor

    NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Almacenamiento S3 / MinIO

    S3_BUCKET=cms-media
    S3_ENDPOINT=http://localhost:9000
    S3_ACCESS_KEY=minio_admin
    S3_SECRET_KEY=minio_secret123
    S3_REGION=us-east-1

    NODE_ENV=development

### `apps/web/.env`

# URL del CMS

    NEXT_PUBLIC_CMS_URL=http://localhost:3000¿
    NODE_ENV=development

**Importante**: nunca commitear archivos `.env` con credenciales reales. Están incluidos en `.gitignore`.

## Roles y permisos

| Rol | Descripción | Capacidades |
|-----|-------------|-------------|
| `superadmin` | Administrador global | Acceso total a todos los tenants |
| `admin_cliente` | Administrador de tenant | Gestiona su propio tenant, usuarios y contenido |
| `editor` | Editor de contenido | Crea y edita contenido, no puede publicar ni gestionar usuarios |
| `visualizador` | Solo lectura | Consulta contenido sin modificarlo |

Los permisos se aplican tanto en la UI del panel como en la API REST mediante Row Level Security en PostgreSQL.

## Puertos y servicios

| Servicio | Puerto | URL |
|----------|--------|-----|
| Payload CMS (admin + API) | 3000 | http://localhost:3000/admin |
| Next.js frontend | 3001 | http://localhost:3001 |
| PostgreSQL | 5433 | `postgresql://localhost:5433/cms_ita` |
| MinIO (API S3) | 9000 | http://localhost:9000 |
| MinIO (consola web) | 9001 | http://localhost:9001 |

 El puerto de PostgreSQL es `5433` (no el estándar `5432`) para evitar conflictos con otras instancias locales.


## Comandos útiles

# Instalar dependencias (todas las apps)
pnpm install

# Desarrollo (todas las apps)
pnpm dev

# Build (todas las apps)
pnpm build

# Levantar infraestructura Docker
docker compose up -d

# Bajar infraestructura Docker
docker compose down

# Bajar y borrar volúmenes (reset total de BD)
docker compose down -v

# Generar tipos TypeScript de Payload
cd apps/cms && pnpm generate:types

# Generar import map de Payload
cd apps/cms && pnpm generate:importmap

# Ver logs de PostgreSQL
docker logs cms-ita-postgres-1

# Acceder a PostgreSQL por consola
docker exec -it cms-ita-postgres-1 psql -U cms_user -d cms_ita

# Ver logs de MinIO
docker logs cms-ita-minio-1


## Notas de desarrollo

- Todo el panel administrativo está configurado en **español**.
- El frontend público cumple **WCAG 2.1 AA** de accesibilidad.
- Las páginas usan **SSR o SSG** según el tipo de contenido.
- La autenticación usa **JWT con refresh token**; los tokens expiran en 2 horas.
- Todos los cambios críticos quedan registrados en **logs de auditoría**.

## Licencia

MIT © 2025