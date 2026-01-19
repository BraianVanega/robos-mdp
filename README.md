# Sistema de Denuncias de Robos

Plataforma web para reportar y visualizar robos en la ciudad, construida con Next.js 15, Google Maps y preparada para integración con CMS (Prismic o Contentstack).

## Características

- 🗺️ Mapa interactivo con Google Maps
- 📍 Click en el mapa para reportar robos
- 🔥 Modo heatmap para visualizar zonas peligrosas
- 📊 Página de reportes con estadísticas
- 📝 Formulario de denuncia con validación
- 🎨 UI moderna con Tailwind CSS

## Requisitos Previos

- Node.js 18+ 
- npm, yarn o pnpm
- Google Maps API Key

## Instalación

1. Clonar o navegar al directorio del proyecto:
```bash
cd /Applications/Projects/otros/denuncias-robos
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. Configurar variables de entorno:
```bash
cp env.example .env.local
```

4. Editar `.env.local` y agregar tu Google Maps API Key:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

## Configuración de Google Maps

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - Maps JavaScript API
   - Geocoding API (opcional, para direcciones)
4. Crea una API Key en "Credenciales"
5. Configura restricciones de la API Key:
   - Restringir por dominio en producción
   - Habilitar solo las APIs necesarias
   - Configurar cuotas para evitar costos inesperados

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
denuncias-robos/
├── app/
│   ├── api/              # API Routes
│   ├── reportes/         # Página de estadísticas
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página principal con mapa
├── components/
│   ├── map/              # Componentes del mapa
│   └── reports/          # Componentes de reportes
├── lib/
│   ├── types.ts          # Tipos TypeScript
│   ├── utils.ts          # Utilidades
│   ├── google-maps.ts    # Configuración Google Maps
│   └── store.ts          # Store temporal (reemplazar con CMS)
└── env.example           # Template de variables de entorno
```

## Integración con CMS

El proyecto está preparado para integrarse con Prismic o Contentstack. Los TODOs están marcados en:

- `app/api/denuncias/route.ts` - Crear y obtener denuncias
- `app/api/denuncias/stats/route.ts` - Estadísticas
- `lib/store.ts` - Reemplazar con cliente CMS

### Prismic

1. Instalar dependencias:
```bash
npm install @prismicio/client @prismicio/next
```

2. Configurar variables de entorno:
```env
PRISMIC_REPOSITORY_NAME=tu_repo
PRISMIC_ACCESS_TOKEN=tu_token
```

3. Crear Custom Type "Denuncia" en Prismic con campos:
   - Tipo (Select)
   - Fecha (Date)
   - Ubicación (GeoPoint)
   - Descripción (Rich Text)
   - Estado (Select)

### Contentstack

1. Instalar dependencias:
```bash
npm install contentstack
```

2. Configurar variables de entorno:
```env
CONTENTSTACK_API_KEY=tu_api_key
CONTENTSTACK_DELIVERY_TOKEN=tu_token
CONTENTSTACK_ENVIRONMENT=tu_environment
CONTENTSTACK_REGION=tu_region
```

3. Crear Content Type "Denuncia" similar en Contentstack

## Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run start` - Inicia servidor de producción
- `npm run lint` - Ejecuta ESLint
- `npm run type-check` - Verifica tipos TypeScript

## Tecnologías Utilizadas

- **Next.js 15** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos
- **@vis.gl/react-google-maps** - Integración Google Maps
- **react-hook-form** - Manejo de formularios
- **zod** - Validación de esquemas
- **recharts** - Gráficos y visualizaciones

## Próximos Pasos

1. ✅ Configurar Google Maps API key
2. ⏳ Integrar CMS (Prismic o Contentstack)
3. ⏳ Definir campos exactos del formulario
4. ⏳ Implementar autenticación (opcional)
5. ⏳ Configurar notificaciones (opcional)
6. ⏳ Agregar tests (opcional)

## Notas

- El almacenamiento actual es en memoria (se pierde al reiniciar)
- Las coordenadas por defecto están configuradas para Buenos Aires, Argentina
- El proyecto está listo para producción después de integrar el CMS
