InventoryPro 🍺 Frontend Cervecería
Aplicación web responsive para gestión de cervecerías con sistema de mesas y cuentas individuales.

[

✨ Características Principales
Sección	Funcionalidad	Responsive	Icono
📊 Dashboard	Métricas ventas/mesas	Mobile/Desktop	📈
📦 Productos	CRUD inventario	1105px breakpoint	🗃️
🪑 Mesas	Estados + totales	Hamburguesa móvil	🍻
🛒 Compras	Registro proveedores	Tailwind puro	📥
📋 Historial	Movimientos completos	Scroll suave	📜
💰 Cuentas	Deudas individuales	Gradientes modernos	💳
🛠️ Stack Técnico
bash
Frontend: React 18 + React Router v6
Estilos: Tailwind CSS 3.4 (breakpoint 1105px custom)
Navegación: Navbar responsive hamburguesa
Routing: SPA con 404 custom
Despliegue: Vercel
API: Express + Supabase PostgreSQL
🚀 Instalación Rápida
bash
# 1. Clonar
git clone https://github.com/tu-usuario/inventorypro-cerveceria-frontend.git
cd inventorypro-cerveceria-frontend

# 2. Instalar
npm install

# 3. Configurar API
cp .env.example .env.local
.env.local

text
VITE_API_URL=https://tu-api-cerveceria.vercel.app/api
VITE_SUPABASE_URL=https://paovlslbnelojrddlgyy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
bash
# 4. Ejecutar
npm run dev
📱 Responsive Design (Custom 1105px)
Tamaño	Menú	Breakpoint
Mobile	🍔 Hamburguesa	0px - 1104px
Tablet	Hamburguesa	768px - 1104px
Desktop	Barra horizontal	1105px+
Animaciones:

✅ Slide down menú móvil (max-h-[384px])

✅ Hover scale en NavLinks

✅ Gradientes dinámicos por sección

✅ 404 page animada

🗂️ Estructura de Archivos
text
src/
├── pages/
│   ├── Dashboard.jsx     📊
│   ├── Productos.jsx     📦
│   ├── Mesas.jsx         🪑
│   ├── Compras.jsx       🛒
│   ├── Historial.jsx     📋
│   └── Cuentas.jsx       💰
├── components/
│   └── Navbar.jsx        (App.jsx integrado)
├── App.jsx               🚀 Entry point
└── main.jsx
🎨 Diseño Visual
css
/* Tailwind Classes Destacadas */
Navbar: bg-gradient-to-br from-slate-50 via-gray-50 to-white
Active: bg-gradient-to-r from-blue-600 to-purple-700 scale-105
Mobile: max-h-[384px] transition-all duration-300
Hover: shadow-lg hover:shadow-xl transform hover:scale-105
🔌 Integración API
javascript
// Ejemplo consumo endpoints
const API_BASE = import.meta.env.VITE_API_URL;

const fetchMesas = async () => {
  const response = await fetch(`${API_BASE}/mesas`);
  return response.json();
};
Endpoints disponibles:

text
GET  /api/mesas      → Estado mesas
GET  /api/productos  → Inventario
POST /api/ventas     → Registrar consumo
GET  /api/cuentas    → Deudas clientes
🚀 Despliegue Vercel
bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod

# Variables automáticas:
# VITE_API_URL=https://tu-backend.vercel.app/api
📋 Scripts
bash
npm run dev      # localhost:5173
npm run build    # Build producción
npm run preview  # Preview build
npm run lint     # ESLint + Prettier
📈 Métricas UI/UX
text
⭐ 100% Responsive (0px - 4K)
⭐ 6 secciones completas
⭐ Breakpoint custom 1105px
⭐ 0 dependencias CSS externas
⭐ 100% Mobile-First
⭐ PWA Ready
🔧 Personalización
bash
# Cambiar breakpoint (línea App.jsx)
max-[1104px]:flex hidden  → Tu breakpoint

# Colores por sección
Dashboard:  from-emerald-600 to-blue-700
Productos: from-blue-600 to-purple-700
Mesas:     from-purple-500 to-indigo-600
🚧 Próximas Features
 PWA offline

 Dark mode toggle

 Impresión tickets

 Notificaciones mesas

 Gráficos Chart.js

 Filtros avanzados

🤝 Contribución
bash
git checkout -b feature/nueva-funcion
npm run dev
git commit -m "feat: nueva función"
git push origin feature/nueva-funcion
📄 Licencia
MIT - ¡Despliega tu cervecería ya! 🍺

👨‍💻 Desarrollador
Fullstack Developer
🇸🇻 San Salvador, El Salvador
Tech: React, Tailwind, Supabase, Vercel

<div align="center"> <img src="https://via.placeholder.com/600x150/1e293b/ffffff?text=🍺+InventoryPro+Frontend+-+Responsive+1105px" alt="Banner"> <br><br> <strong>¡Tu cervecería siempre ordenada, desde móvil hasta desktop! 🚀</strong> </div>
⭐ Dale Star | 📱 Prueba Demo | 🍺 ¡Salud por tu cervecería!