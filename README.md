# CRM Congresista Boyacá

Aplicación web completa (React SPA) para la gestión de contactos políticos de un congresista de Boyacá, Colombia.

## 🚀 Características

- ✅ **Autenticación**: Login con credenciales hardcodeadas (usuario: `congresista`, contraseña: `boyaca2025`)
- 📊 **Dashboard**: Estadísticas y gráficos de contactos
- 👥 **Gestión de Contactos**: CRUD completo de contactos políticos
- 🏛️ **Categorías**: Organización por tipo de cargo (Alcaldes, Diputados, Concejales, JAC, etc.)
- 📈 **Reportes**: Análisis avanzado con exportación a Excel y PDF
- 🎨 **Diseño Responsivo**: Optimizado para desktop, tablet y móvil
- 🔐 **Autenticación**: Rutas protegidas con validación de sesión
- 💾 **Caché**: Almacenamiento en caché de datos para mejor performance

## 📋 Stack Técnico

- **Frontend**: React 18 + React Router 6
- **Estilos**: Tailwind CSS
- **Gráficos**: Recharts
- **API**: Axios + Fetch API
- **Exportación**: XLSX (Excel) + jsPDF (PDF)
- **Build**: Vite

## 🔧 Instalación

### 1. Clonar/Descargar el proyecto
```bash
cd CRM
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar la API (opcional)
Si necesitas cambiar la URL de la API, edita `src/api/apiClient.js`:
```javascript
export const API_BASE = "https://backend-crm-l5dw.onrender.com/";
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## 🔑 Credenciales de Acceso

- **Usuario**: `congresista`
- **Contraseña**: `boyaca2025`

## 📖 Guía de Uso

### 1. **Login**
- Ingresa con las credenciales proporcionadas
- Tu sesión se guardará en `sessionStorage`

### 2. **Dashboard**
- Visualiza estadísticas generales de tus contactos
- Consulta gráficos de distribución por tipo y afinidad
- Accede rápidamente a otras secciones

### 3. **Todos los Contactos**
- Crea nuevos contactos con el botón "➕ Nuevo Contacto"
- Filtra por nombre, municipio, cargo, partido, afinidad y prioridad
- Edita o elimina contactos existentes
- Exporta la lista a Excel

### 4. **Por Categoría**
- Accede desde el menú lateral
- Consulta contactos agrupados por tipo de cargo
- Submenu expandible con categorías disponibles

### 5. **Reportes**
- Genera reportes con filtros avanzados
- Visualiza estadísticas del reporte
- Exporta a Excel o PDF
- Imprime directamente

## 🛠️ Construcción para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 📁 Estructura de Carpetas

```
src/
├── api/
│   └── apiClient.js          # Cliente HTTP y servicios de API
├── components/
│   ├── auth/
│   │   └── Login.jsx         # Pantalla de login
│   ├── common/
│   │   ├── UIComponents.jsx  # Componentes reutilizables
│   │   ├── DataTable.jsx     # Tabla genérica
│   │   ├── FilterBar.jsx     # Barra de filtros
│   │   └── Layout.jsx        # Sidebar, Header, Footer
│   ├── contactos/
│   │   ├── ContactList.jsx   # Lista de contactos
│   │   ├── ContactForm.jsx   # Formulario crear/editar
│   │   └── CategoryView.jsx  # Vista por categoría
│   ├── dashboard/
│   │   └── Dashboard.jsx     # Panel principal
│   └── reportes/
│       └── Reports.jsx       # Sección de reportes
├── context/
│   └── AuthContext.jsx       # Contexto de autenticación
├── hooks/
│   ├── useAuth.js            # Hook para usar auth
│   └── useApi.js             # Hook para llamadas API
├── App.jsx                   # Componente principal
├── main.jsx                  # Punto de entrada
└── index.css                 # Estilos globales
```

## 🎨 Paleta de Colores

- **Primario**: `#1a3a6e` (Azul oscuro institucional)
- **Secundario**: `#c9a84c` (Dorado Boyacá)
- **Éxito/Aliado**: `#16a34a` (Verde)
- **Peligro/Opositor**: `#dc2626` (Rojo)
- **Neutro**: `#6b7280` (Gris)
- **Fondo**: `#f1f5f9` (Blanco grisáceo)

## 📊 API Endpoints

La aplicación consume los siguientes endpoints:

### Contactos
- `GET /contactos` - Listar contactos
- `GET /contactos/filtrar` - Filtrar contactos
- `GET /contactos/{id}` - Detalle
- `POST /contactos` - Crear
- `PUT /contactos/{id}` - Editar
- `DELETE /contactos/{id}` - Eliminar

### Catálogos
- `GET /provincias` - Provincias
- `GET /municipios` - Municipios
- `GET /cargos` - Cargos
- `GET /partidos` - Partidos
- `GET /tipos` - Tipos de contacto
- `GET /relaciones` - Tipos de relación

## ⚙️ Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto (opcional):

```
VITE_API_BASE=https://backend-crm-l5dw.onrender.com/
```

## 🐛 Solución de Problemas

### La aplicación no se conecta a la API
1. Verifica que la URL en `src/api/apiClient.js` sea correcta
2. Comprueba que el backend esté disponible
3. La app funcionará con datos en caché si la API no está disponible

### Los filtros no funcionan
1. Asegúrate que los datos se hayan cargado correctamente
2. Recarga la página con F5
3. Abre la consola (F12) y busca mensajes de error

### No puedo eliminar contactos
1. Verifica que tengas conexión a internet
2. Asegúrate que el API soporte DELETE requests
3. Revisa que tengas permiso para eliminar

## 📝 Notas Importantes

- ⚠️ **Los datos se cargan en memoria**: Si recarga la página, los cambios no editados se perderán (esto es normal en un SPA sin backend propio)
- 💾 **Caché local**: Los datos se cachean por 5 minutos para mejorar performance
- 🔐 **Sesión**: La autenticación se almacena en `sessionStorage`, cerrará al cerrar el navegador
- 📱 **Responsive**: La aplicación se adapta a pantallas pequeñas, pero funciona mejor en desktop

## 📞 Soporte

Para reportar bugs o sugerencias, contacta al administrador del sistema.

## 📄 Licencia

© 2025 CRM Congresista Boyacá - Todos los derechos reservados

---

**Última actualización**: Enero 2025
**Versión**: 1.0.0
