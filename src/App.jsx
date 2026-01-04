// App.jsx - BREAKPOINT PERSONALIZADO 1105px
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Productos from './pages/Productos';
import Compras from "./pages/Compras";
import Cuentas from "./pages/Cuentas";
import Dashboard from "./pages/Dashboard";
import Mesas from "./pages/Mesas";
import Historial from "./pages/Historial";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-white">
        {/* Navbar RESPONSIVA 1105px */}
        <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo */}
              <div className="flex items-center">
                <NavLink 
                  to="/" 
                  className="flex items-center space-x-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent hover:scale-105 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>🛒</span>
                  <span className="hidden sm:inline">InventoryPro</span>
                  <span className="sm:hidden">InvPro</span>
                </NavLink>
              </div>
              
              {/* Botón hamburguesa - HASTA 1104px */}
              <div className="max-[1104px]:flex hidden">
                <button 
                  onClick={toggleMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Toggle menu"
                >
                  <svg className={`w-6 h-6 text-gray-700 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              
              {/* Menu Desktop - DESDE 1105px */}
              <div className="max-[1104px]:hidden flex items-center space-x-1">
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `px-4 py-3 [1105px]:px-6 [1105px]:py-3 rounded-2xl font-semibold transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-600 to-blue-700 text-white shadow-lg border-emerald-500' 
                        : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 border-transparent hover:border-emerald-300'
                    }`}
                >
                  📊 Dashboard
                </NavLink>
                
                <NavLink 
                  to="/productos" 
                  className={({ isActive }) => 
                    `px-4 py-3 [1105px]:px-6 [1105px]:py-3 rounded-2xl font-semibold transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg shadow-blue-500/25 scale-105' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                >
                  📦 Productos
                </NavLink>
                
                <NavLink 
                  to="/mesas"
                  className={({ isActive }) => 
                    `px-4 py-3 [1105px]:px-6 [1105px]:py-3 rounded-2xl font-semibold transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25 scale-105' 
                        : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                >
                  🪑 Mesas
                </NavLink>
                
                <NavLink 
                  to="/compras" 
                  className={({ isActive }) => 
                    `px-4 py-3 [1105px]:px-6 [1105px]:py-3 rounded-2xl font-semibold transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25 scale-105' 
                        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                >
                  🛒 Compras
                </NavLink>

                <NavLink 
                  to="/historial"
                  className={({ isActive }) => 
                    `px-4 py-3 [1105px]:px-6 [1105px]:py-3 rounded-2xl font-semibold transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 scale-105' 
                        : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
                    }`}
                >
                  📋 Historial
                </NavLink>
                
                <NavLink 
                  to="/cuentas" 
                  className={({ isActive }) => 
                    `px-4 py-3 [1105px]:px-6 [1105px]:py-3 rounded-2xl font-semibold transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-105' 
                        : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                >
                  💰 Cuentas
                </NavLink>
              </div>
            </div>
          </div>
          
          {/* Menu Móvil*/}
          <div className={`max-[1104px]:flex hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-auto opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-white border-t border-gray-200 px-4 py-4 space-y-2 w-full">
              {/* 6 NavLinks - cada uno py-4 = 64px + space-y-2 = 8px = 384px total */}
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `block w-full text-left px-4 py-4 rounded-xl font-semibold transition-all duration-300 border-l-4 ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-600 to-blue-700 text-white shadow-lg border-emerald-500' 
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 border-transparent hover:border-emerald-300'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                📊 Dashboard
              </NavLink>

              <NavLink 
                to="/productos" 
                className={({ isActive }) => 
                  `block w-full text-left px-4 py-4 rounded-xl font-semibold transition-all duration-300 border-l-4 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg border-blue-500' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-300'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                📦 Productos
              </NavLink>
              
              <NavLink 
                to="/mesas"
                className={({ isActive }) => 
                  `block w-full text-left px-4 py-4 rounded-xl font-semibold transition-all duration-300 border-l-4 ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg border-purple-500' 
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50 border-transparent hover:border-purple-300'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                🪑 Mesas
              </NavLink>
              
              <NavLink 
                to="/compras" 
                className={({ isActive }) => 
                  `block w-full text-left px-4 py-4 rounded-xl font-semibold transition-all duration-300 border-l-4 ${
                    isActive 
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg border-orange-500' 
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50 border-transparent hover:border-orange-300'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                🛒 Compras
              </NavLink>

              <NavLink 
                to="/historial"
                className={({ isActive }) => 
                  `block w-full text-left px-4 py-4 rounded-xl font-semibold transition-all duration-300 border-l-4 ${
                    isActive 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg border-amber-500' 
                      : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50 border-transparent hover:border-amber-300'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                📋 Historial
              </NavLink>

              <NavLink 
                to="/cuentas" 
                className={({ isActive }) => 
                  `block w-full text-left px-4 py-4 rounded-xl font-semibold transition-all duration-300 border-l-4 ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg border-emerald-500' 
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 border-transparent hover:border-emerald-300'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                💰 Cuentas
              </NavLink>
            </div>
          </div>

        </nav>

        {/* Contenido - SIN CAMBIOS */}
        <main className="pt-4 pb-12 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Cuentas/>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/mesas" element={<Mesas />} />
            <Route path="/compras" element={<Compras />} />
            <Route path="/cuentas" element={<Cuentas />} />
            <Route path="/historial" element={<Historial />} />

            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center py-12 px-4">
                <div className="text-center max-w-md mx-auto">
                  <div className="text-5xl sm:text-6xl mb-8 mx-auto w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-gradient-to-r from-red-100 to-pink-100 rounded-3xl">
                    404
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                    Página no encontrada
                  </h1>
                  <NavLink 
                    to="/"
                    className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold rounded-2xl sm:rounded-3xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ir a Cuentas →
                  </NavLink>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;