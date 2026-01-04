// ✅ DASHBOARD COMPLETO React - Con Filtro Fecha SV
import React, { useState, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Dashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [productosStock, setProductosStock] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [periodo, setPeriodo] = useState('mes'); // ✅ Filtro activo

    // ✅ Cargar dashboard con filtro
    const cargarDashboard = async (periodoFiltro = 'hoy') => {
        try {
            setLoading(true);
            
            // 📊 Dashboard con periodo
            const dashboardRes = await fetch(`${apiURL}/dashboard?periodo=${periodoFiltro}`);
            const dashboardData = await dashboardRes.json();
            
            // 📦 Productos stock
            const productosRes = await fetch('${apiURL}/dashboard/productos');
            const productosData = await productosRes.json();
            
            // 💸 Ventas recientes (7 días)
            const ventasRes = await fetch(`${apiURL}/dashboard/ventas?page=1&limit=10`);
            const ventasData = await ventasRes.json();

            if (dashboardData.success && productosData.success && ventasData.success) {
                setDashboard(dashboardData.data);
                setProductosStock(productosData.data);
                setVentas(ventasData.data);
                setPeriodo(periodoFiltro);
            }
        } catch (error) {
            console.error('Error cargando dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDashboard('hoy'); // Inicial: hoy
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-gray-700">Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
                        📊 Cervecería
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Métricas en tiempo real de tu negocio
                    </p>
                </div>

                {/* ✅ FILTRO PERIODO */}
                <div className="flex flex-col sm:flex-row justify-center items-center mb-12 gap-4">
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-white/50 flex flex-wrap gap-2">
                        {['ayer', 'hoy', 'semana', 'mes', 'año'].map(p => (
                            <button
                                key={p}
                                onClick={() => cargarDashboard(p)}
                                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 hover:scale-105 shadow-md ${
                                    periodo === p 
                                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-400/50' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 hover:shadow-emerald-200'
                                }`}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                    <span className="text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-xl">
                        Período: <strong className="text-emerald-600">{periodo}</strong>
                    </span>
                </div>

                {/* MÉTRICAS PRINCIPALES */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {/* Gasto */}
                    <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2 border border-white/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-100 rounded-2xl group-hover:bg-red-200 transition-all">
                                <span className="text-2xl">💸</span>
                            </div>
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">GASTO</span>
                        </div>
                        <p className="text-3xl md:text-4xl font-black text-gray-900 mb-1">
                            ${dashboard?.ganancias?.costos?.toLocaleString('es-SV', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}
                        </p>
                        <p className="text-sm text-gray-600">Inversión en productos ({periodo})</p>
                    </div>

                    {/* Ventas */}
                    <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2 border border-white/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-2xl group-hover:bg-green-200 transition-all">
                                <span className="text-2xl">💰</span>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">VENTAS</span>
                        </div>
                        <p className="text-3xl md:text-4xl font-black text-gray-900 mb-1">
                            ${dashboard?.ventasPeriodo?.ingresos_periodo?.toLocaleString('es-SV', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}
                        </p>
                        <p className="text-sm text-gray-600">{dashboard?.ventasPeriodo?.ventas_periodo || 0} ventas ({periodo})</p>
                    </div>

                    {/* Utilidad */}
                    <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2 border border-white/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-100 rounded-2xl group-hover:bg-emerald-200 transition-all">
                                <span className="text-2xl">📈</span>
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">UTILIDAD</span>
                        </div>
                        <p className={`text-3xl md:text-4xl font-black mb-1 ${
                            dashboard?.ganancias?.ganancia >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                            ${dashboard?.ganancias?.ganancia?.toLocaleString('es-SV', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}
                        </p>
                        <p className="text-sm text-gray-600">
                            {dashboard?.ganancias?.ganancia >= 0 ? '💰 Ganancia' : '📉 Pérdida'} ({periodo})
                        </p>
                    </div>
                </div>

                {/* STOCK CRÍTICO + TOP PRODUCTOS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Stock Crítico */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            📦 Stock Crítico
                            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-bold rounded-full">
                                {dashboard?.stockCritico || 0}
                            </span>
                        </h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {productosStock.slice(0, 4).map(producto => (
                                <div key={producto.id} className={`p-4 rounded-2xl border-l-4 shadow-sm flex items-center justify-between ${
                                    producto.status === 'danger' ? 'bg-red-50 border-red-400' :
                                    producto.status === 'warning' ? 'bg-orange-50 border-orange-400' : 
                                    'bg-emerald-50 border-emerald-400'
                                }`}>
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="text-2xl">🍺</span>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-900 truncate max-w-[200px]">{producto.descripcion}</p>
                                            <p className="text-sm text-gray-600">{producto.presentacion}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-2xl font-bold ${
                                            producto.status === 'danger' ? 'text-red-600' :
                                            producto.status === 'warning' ? 'text-orange-600' : 'text-emerald-600'
                                        }`}>
                                            {producto.cantidad_disponible}
                                        </p>
                                        <p className="text-xs text-gray-500">mín: {producto.cantidad_minima}</p>
                                    </div>
                                </div>
                            ))}
                            {productosStock.length === 0 && (
                                <p className="text-gray-500 text-center py-12">Sin productos críticos</p>
                            )}
                        </div>
                    </div>

                    {/* Top Productos */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            🏆 Top Productos <span className="text-sm text-gray-500">({periodo})</span>
                        </h3>
                        <div className="space-y-3">
                            {dashboard?.topProductos?.map((prod, i) => (
                                <div key={prod.descripcion} className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl flex items-center justify-between hover:shadow-md transition-all">
                                    <div className="flex items-center gap-3">
                                        <span className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                                            {i + 1}
                                        </span>
                                        <span className="text-2xl">🍺</span>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-gray-900 truncate">{prod.descripcion}</p>
                                            <p className="text-xs text-gray-600">{prod.presentacion}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-emerald-600">
                                            ${parseFloat(prod.ingresos || 0).toLocaleString('es-SV')}
                                        </p>
                                        <p className="text-sm text-gray-600">{prod.total_vendido || 0} unid.</p>
                                    </div>
                                </div>
                            )) || <p className="text-gray-500 text-center py-12">Sin datos de ventas</p>}
                        </div>
                    </div>
                </div>

                {/* Últimas Ventas */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 overflow-hidden">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">💸 Últimas Ventas (7 días)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="border-b-2 border-gray-200 bg-gray-50">
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900 text-sm">Cliente</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900 text-sm">Total</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900 text-sm">Estado</th>
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900 text-sm">Items</th>
                                    <th className="text-right py-4 px-4 font-semibold text-gray-900 text-sm">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventas.map(venta => (
                                    <tr key={venta.id} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                                        <td className="py-4 px-4 font-medium text-gray-900 max-w-[200px] truncate">{venta.cliente || 'Cliente walk-in'}</td>
                                        <td className="py-4 px-4 font-bold text-emerald-600 text-lg">
                                            ${parseFloat(venta.total || 0).toLocaleString('es-SV', {minimumFractionDigits: 2})}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                venta.estado === 'pagado' 
                                                    ? 'bg-emerald-100 text-emerald-800 shadow-emerald-200/50' 
                                                    : 'bg-orange-100 text-orange-800 shadow-orange-200/50'
                                            }`}>
                                                {venta.estado === 'pagado' ? '✅ Pagado' : '⏳ Pendiente'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 font-semibold text-gray-900">{venta.items || 0}</td>
                                        <td className="py-4 px-4 text-sm text-gray-500 text-right">
                                            {new Date(venta.fecha_creado).toLocaleDateString('es-SV')}
                                        </td>
                                    </tr>
                                ))}
                                {ventas.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-gray-500">
                                            Sin ventas recientes
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="text-center mt-12 text-sm text-gray-500">
                    <p>🕐 Actualizado: {new Date().toLocaleString('es-SV')}</p>
                    <p>📍 Zona horaria: America/El_Salvador</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;