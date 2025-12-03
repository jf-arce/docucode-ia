# DocuCode AI 🚀

> Plataforma web para generar documentación técnica de código automáticamente utilizando Inteligencia Artificial.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green?logo=supabase)
![Gemini AI](https://img.shields.io/badge/Gemini-2.5%20Flash-purple?logo=google)

---

## 📋 Descripción del Proyecto

**DocuCode AI** es una aplicación web desarrollada como proyecto de la materia **Desarrollo de Software Cloud** que permite a los desarrolladores generar documentación técnica profesional de manera automática a partir de fragmentos de código.

La plataforma utiliza **Google Gemini 2.5 Flash** como modelo de IA para analizar el código ingresado y generar documentación estructurada en formato Markdown, siguiendo estándares profesionales de documentación de software.

---

## 🎯 Objetivos del Proyecto

### Objetivo General

Desarrollar una plataforma SaaS en la nube que automatice la generación de documentación técnica de código utilizando inteligencia artificial generativa.

### Objetivos Específicos

1. **Implementar autenticación segura** mediante Supabase Auth con soporte para múltiples proveedores (Email/Password, Google, GitHub).

2. **Crear un editor de código funcional** que soporte múltiples lenguajes de programación con resaltado de sintaxis.

3. **Integrar IA generativa** (Google Gemini) para producir documentación técnica estructurada y profesional.

4. **Desarrollar un sistema de gestión de proyectos** que permita organizar documentos por proyecto.

5. **Implementar exportación de documentación** en múltiples formatos (Markdown, PDF, HTML).

6. **Desplegar la aplicación en la nube** utilizando servicios de infraestructura cloud.

---

## ✅ Funcionalidades Implementadas

### 🔐 Sistema de Autenticación

- [x] Login y registro con email/contraseña
- [x] Autenticación con Google OAuth
- [x] Autenticación con GitHub OAuth
- [x] Confirmación de email para nuevos usuarios
- [x] Protección de rutas con middleware

### 📁 Gestión de Proyectos

- [x] Crear nuevos proyectos
- [x] Listar proyectos del usuario
- [x] Eliminar proyectos
- [x] Sidebar colapsible con navegación

### 📄 Gestión de Documentos

- [x] Crear nuevos documentos dentro de proyectos
- [x] Editar documentos existentes
- [x] Eliminar documentos
- [x] Guardar snippets de código asociados

### ✨ Generación de Documentación con IA

- [x] Editor de código con soporte para **25+ lenguajes**:
  - TypeScript, JavaScript, Python, Java, C/C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, Lua, SQL, Shell, YAML, JSON, XML, HTML, CSS, y más
- [x] Selección de temas del editor (One Dark, Dracula, Monokai, GitHub, etc.)
- [x] Carga de archivos desde el sistema local
- [x] Carga de archivos desde repositorio de GitHub personales
- [x] Permite seleccionar idioma particular de cada documentación
- [x] Generación de documentación estructurada con:
  - Título y overview
  - Explicación de cómo funciona
  - Características principales
  - Tabla de parámetros de entrada
  - Descripción de outputs
  - Ejemplos de uso
  - Notas y limitaciones
  - Mejores prácticas

### 📥 Exportación de Documentación

- [x] Exportar a **Markdown** (.md)
- [x] Exportar a **PDF**
- [x] Exportar a **HTML**

### 🎨 Interfaz de Usuario

- [x] Diseño responsive (mobile y desktop)
- [x] Soporte para tema claro y oscuro
- [x] Componentes UI con Radix UI y Tailwind CSS
- [x] Notificaciones toast con Sonner
- [x] Renderizado de Markdown con syntax highlighting

---

## 🛠️ Tecnologías Utilizadas

### Frontend

| Tecnología                   | Uso                            |
| ---------------------------- | ------------------------------ |
| **Next.js 15**               | Framework React con App Router |
| **TypeScript**               | Tipado estático                |
| **Tailwind CSS 4**           | Estilos utilitarios            |
| **Radix UI**                 | Componentes accesibles         |
| **React Ace**                | Editor de código               |
| **React Markdown**           | Renderizado de Markdown        |
| **React Syntax Highlighter** | Resaltado de sintaxis          |

### Backend & Cloud

| Tecnología                  | Uso                             |
| --------------------------- | ------------------------------- |
| **Supabase**                | Base de datos PostgreSQL + Auth |
| **Google Gemini 2.5 Flash** | Modelo de IA generativa         |
| **Vercel AI SDK**           | Integración con modelos de IA   |
| **Next.js API Routes**      | Endpoints del servidor          |

### Herramientas de Desarrollo

| Tecnología            | Uso                          |
| --------------------- | ---------------------------- |
| **ESLint + Prettier** | Linting y formateo de código |
| **Git + GitHub**      | Control de versiones         |

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── actions/           # Server Actions (CRUD de documentos/proyectos)
├── app/
│   ├── api/          # API Routes (generación con IA)
│   ├── auth/         # Páginas de autenticación
│   └── workspace/    # Área de trabajo del usuario
├── components/       # Componentes React reutilizables
├── context/          # Context API (WorkspaceContext)
├── data/             # Funciones de acceso a datos
├── hooks/            # Custom hooks
├── lib/              # Utilidades
├── screens/          # Pantallas principales
├── services/         # Servicios (llamadas a API)
├── types/            # Definiciones TypeScript
└── utils/
    ├── file-exports/ # Exportación de archivos
    └── supabase/     # Cliente de Supabase
```

---

## ❌ Funcionalidades Pendientes (Trabajo Futuro)

### 🔄 Mejoras de IA

- [ ] Soporte para streaming de respuestas (mostrar generación en tiempo real)
- [ ] Selección de idioma de la documentación generada
- [ ] Opciones de personalización del estilo de documentación
- [ ] Historial de versiones de documentación

### 📊 Analytics y Métricas

- [ ] Dashboard con estadísticas de uso
- [ ] Contador de documentos generados
- [ ] Métricas de uso de la API de IA

### 👥 Colaboración

- [ ] Compartir proyectos con otros usuarios
- [ ] Permisos de lectura/escritura
- [ ] Comentarios en documentos

### 🔧 Funcionalidades Adicionales

- [ ] Templates de documentación personalizables
- [ ] Integración con CI/CD para documentación automática
- [ ] API pública para integrar en otros proyectos
- [ ] Modo offline con sincronización

### 💰 Monetización

- [ ] Sistema de planes (Free, Pro, Enterprise)
- [ ] Límites de uso según plan
- [ ] Integración con Stripe para pagos

---

## 🚀 Cómo Ejecutar el Proyecto

### Prerrequisitos

- Node.js 18+
- npm, yarn, pnpm o bun
- Cuenta en Supabase
- API Key de Google Gemini

### Variables de Entorno

Crear un archivo `.env.local` con:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Google Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key_de_gemini
```

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/jf-arce/docucode-ai.git
cd docucode-ai

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar ESLint
```

---

## 📊 Modelo de Base de Datos

```sql
-- Tabla de proyectos
projects (
  id: uuid PRIMARY KEY,
  name: varchar,
  slug: varchar UNIQUE,
  user_id: uuid REFERENCES auth.users,
  created_at: timestamp
)

-- Tabla de snippets de código
snippets (
  id: uuid PRIMARY KEY,
  code: text,
  lenguage: varchar,
  created_at: timestamp
)

-- Tabla de documentos
documents (
  id: uuid PRIMARY KEY,
  title: varchar,
  content: text,
  project_id: uuid REFERENCES projects,
  snippet_id: uuid REFERENCES snippets,
  created_at: timestamp
)
```

---

## 👥 Equipo de Desarrollo

Este proyecto fue desarrollado como parte de la materia **Desarrollo de Software Cloud**.

| Integrantes             |
| ----------------------- |
| **Joaquín Botteri**     |
| **Hilario Carreón**     |
| **José Francisco Arce** |

---

## 📄 Licencia

Este proyecto es de uso académico y educativo.

---

## 🔗 Links

- **Repositorio**: [github.com/jf-arce/docucode-ai](https://github.com/jf-arce/docucode-ai)
- **Demo**: [Próximamente]

---

> Desarrollado usando Next.js, Supabase y Google Gemini AI
