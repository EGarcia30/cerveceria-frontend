// pages/Promociones.jsx - COMPLETO Y FUNCIONAL ✅
import React, { useState, useEffect, useCallback } from 'react';
const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Promociones = () => {
    const [promociones, setPromociones] = useState([]);
    const [productos, setProductos] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPromocion, setSelectedPromocion] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        nombre_promocion: '',
        producto_id: '',
        nuevo_precio_venta: '',
        fecha_inicio: '',
        fecha_fin: '',
    });
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);

    // ✅ FIXED: Usa /all que NO requiere parámetros
    const fetchPromociones = useCallback(async (searchTerm = '') => {
        setLoading(true);
        try {
            // ✅ ENDPOINT CORRECTO: /api/promociones/all
            const response = await fetch(`${apiURL}/promociones/all`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Filtrar solo ACTIVAS y buscar
                let filtered = data.data.filter(p => p.activo === true);
                
                if (searchTerm) {
                    filtered = filtered.filter(p => 
                        p.nombre_promocion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.producto_id?.toString().includes(searchTerm)
                    );
                }
                
                // Paginación frontend (12 por página)
                const itemsPerPage = 12;
                const totalPgs = Math.ceil(filtered.length / itemsPerPage);
                setTotalPages(totalPgs);
                setPromociones(filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage));
            }
        } catch (error) {
            console.error('❌ Error cargando promociones:', error);
            setPromociones([]);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    // ✅ FIXED: Usa endpoint correcto de productos
    const fetchProductos = useCallback(async () => {
        try {
            // ✅ ENDPOINT CORRECTO: /api/productos
            const response = await fetch(`${apiURL}/productos/all`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            if (data.success) {
                setProductos(data.data);
            }
        } catch (error) {
            console.error('❌ Error cargando productos:', error);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchProductos();
        fetchPromociones('');
    }, []);

    // Search + pagination
    useEffect(() => {
        setPage(1);
        fetchPromociones(search);
    }, [search]);

    useEffect(() => {
        fetchPromociones(search);
    }, [page]);

    // CRUD Handlers
    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const response = await fetch(`${apiURL}/promociones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                setShowCreateModal(false);
                setFormData({ 
                    nombre_promocion: '', 
                    producto_id: '', 
                    nuevo_precio_venta: '', 
                    fecha_inicio: '', 
                    fecha_fin: '' 
                });
                fetchPromociones(search);
            } else {
                console.error('Error en creación:', response.status);
            }
        } catch (error) {
            console.error('Error creando:', error);
        } finally {
            setCreating(false);
        }
    };

    //Enviar datos para actualizar modal
    const handleEdit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const response = await fetch(`${apiURL}/promociones/${selectedPromocion.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                setShowEditModal(false);
                setSelectedPromocion(null);
                fetchPromociones(search);
                setFormData({ 
                    nombre_promocion: '', 
                    producto_id: '', 
                    nuevo_precio_venta: '', 
                    fecha_inicio: '', 
                    fecha_fin: '' 
                });
            }
        } catch (error) {
            console.error('Error editando:', error);
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${apiURL}/promociones/${selectedPromocion.id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                setShowDeleteModal(false);
                setSelectedPromocion(null);
                fetchPromociones(search);
                setFormData({ 
                    nombre_promocion: '', 
                    producto_id: '', 
                    nuevo_precio_venta: '', 
                    fecha_inicio: '', 
                    fecha_fin: '' 
                });
            }
        } catch (error) {
            console.error('Error desactivando:', error);
        }
    };

    const handleCloseModal = async () => {
        setFormData({
            nombre_promocion: '',
            producto_id: '',
            nuevo_precio_venta: '',
            fecha_inicio: '',
            fecha_fin: ''
        })
        if(showCreateModal) setShowCreateModal(false)

        if(showEditModal) setShowEditModal(false)
    }

    const openEditModal = (promocion) => {
        setSelectedPromocion(promocion);
        setFormData({
            nombre_promocion: promocion.nombre_promocion || '',
            producto_id: promocion.producto_id || '',
            nuevo_precio_venta: promocion.nuevo_precio_venta || '',
            fecha_inicio: promocion.fecha_inicio?.split('T')[0] || '',
            fecha_fin: promocion.fecha_fin?.split('T')[0] || ''
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (promocion) => {
        setSelectedPromocion(promocion);
        setShowDeleteModal(true);
    };

    const formatDinero = (numero) => {
        return Number(numero ?? 0).toLocaleString('es-SV', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    };

    const formatFechaUTC = (fechaUTC) => {
        const date = new Date(fechaUTC);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        
        return `${day}/${month}/${year}`;
    };

    const getProductoNombre = (productoId) => {
        const producto = productos.find(p => p.id == productoId);
        return producto ? producto.descripcion : `#${productoId}`;
    };

    const getProductoPresentacion = (productoId) => {
        const producto = productos.find(p => p.id == productoId);
        return producto ? producto.presentacion : `#${productoId}`;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                        🎉 Promociones
                    </h1>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 w-full lg:w-auto flex items-center justify-center gap-2"
                    disabled={loading}
                >
                    ➕ Nueva Promoción
                </button>
            </div>

            {/* SEARCH & PAGINADO */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                {/*<input
                    type="text"
                    placeholder="Buscar promociones..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 max-w-md p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    disabled={loading}
                />*/}
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                            className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center"
                        >
                            ‹
                        </button>
                        <span className="text-lg font-semibold px-4">
                            Pg. {page} de {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || loading}
                            className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center"
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>

            {/* GRID PROMOCIONES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    </div>
                ) : promociones.length === 0 ? (
                    <div className="col-span-full text-center py-20">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No hay promociones activas</h3>
                        <p className="text-gray-600 mb-6">Crea la primera promoción para empezar</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                            disabled={loading}
                        >
                            ➕ Crear Promoción
                        </button>
                    </div>
                ) : (
                    promociones.map((promocion) => (
                        <div 
                            key={promocion.id}
                            className="group bg-white border border-gray-200 rounded-xl p-3 sm:p-4 lg:p-6 xl:p-8 hover:shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-sm relative overflow-hidden h-full"
                        >                   
                            <div className="h-full flex flex-col">    
                                {/* HEADER - SIMPLIFICADO */}
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 lg:mb-6 gap-3 lg:gap-0">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">             
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 line-clamp-2 lg:line-clamp-1 group-hover:text-pink-700 leading-tight">
                                                {promocion.nombre_promocion}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">
                                                {getProductoNombre(promocion.producto_id)} {getProductoPresentacion(promocion.producto_id)}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* STATUS - MÁS COMPACTO */}
                                    <span className={`px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-bold self-start lg:self-end whitespace-nowrap ${
                                        promocion.activo 
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                            : 'bg-red-100 text-red-800 border border-red-200'
                                    }`}>
                                        {promocion.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                                
                                {/* PRECIO PRINCIPAL - TOMÁ TODO EL ESPACIO DISPONIBLE */}
                                <div className="flex-1 flex flex-col justify-center mb-4 lg:mb-6">
                                    <div className="text-center p-3 sm:p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300">
                                        <span className="block text-xs sm:text-sm lg:text-base text-emerald-600 font-bold uppercase tracking-wide">PRECIO PROMOCIÓN</span>
                                        <span className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-emerald-700 block mt-2 leading-none">
                                            ${formatDinero(promocion.nuevo_precio_venta)}
                                        </span>
                                        <div className="flex items-center justify-center gap-1 mt-2">
                                            <span className="text-emerald-500 text-sm">⭐</span>
                                            <span className="text-xs sm:text-sm text-emerald-600 font-semibold">Precio Especial</span>
                                        </div>
                                    </div>
                                </div>

                                {/* INFO SECUNDARIA - MÁS COMPACTA */}
                                <div className="space-y-2 mb-4 lg:mb-6 flex-1">
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-gray-600 font-medium">📅 Inicio</span>
                                        <span className="text-gray-900 font-medium text-right">
                                            {promocion.fecha_inicio ? formatFechaUTC(promocion.fecha_inicio) : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-gray-600 font-medium">⏰ Fin</span>
                                        <span className={`font-bold text-sm sm:text-base text-right ${
                                            new Date(promocion.fecha_fin) < new Date() 
                                                ? 'text-red-600' 
                                                : 'text-purple-600'
                                        }`}>
                                            {promocion.fecha_fin ? formatFechaUTC(promocion.fecha_fin) : 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                {/* FOOTER - BOTONES + FECHA */}
                                <div className="pt-2 sm:pt-4 lg:pt-6 border-t border-gray-200 flex items-center justify-between">
                                    {/* FECHA - OCULTA EN MÓVIL */}
                                    <span className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:block truncate max-w-[120px]">
                                        {formatFechaUTC(promocion.fecha_inicio)}
                                    </span>
                                    
                                    {/* BOTONES - SOLO ÍCONOS SVG LIMPIOS */}
                                    <div className="flex gap-1.5 sm:gap-2">
                                        {/* EDITAR - SVG SIMPLE */}
                                        <button
                                            onClick={() => openEditModal(promocion)}
                                            className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                                            title="Editar promoción"
                                        >
                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        
                                        {/* DELETE/ACTIVAR - SVG SIMPLE */}
                                        <button
                                            onClick={() => openDeleteModal(promocion)}
                                            className={`w-8 h-8 sm:w-9 sm:h-9 text-white rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                                                promocion.activo 
                                                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                                                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                                            }`}
                                            title={promocion.activo ? 'Desactivar' : 'Reactivar'}
                                        >
                                            {promocion.activo ? (
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            ) : (
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* MODAL CREAR */}
            {showCreateModal && (
                <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">➕ Nueva Promoción</h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre de la promoción *
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombre_promocion}
                                    onChange={(e) => setFormData({...formData, nombre_promocion: e.target.value})}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    placeholder="Ej: 2x1 Cerveza Lager"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Producto *
                                </label>
                                <select
                                    value={formData.producto_id}
                                    onChange={(e) => setFormData({...formData, producto_id: e.target.value})}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    required
                                >
                                    <option value="">Seleccionar producto</option>
                                    {productos.map(producto => (
                                        <option key={producto.id} value={producto.id}>
                                            {producto.id} - {producto.descripcion} {producto.presentacion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nuevo precio * ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.nuevo_precio_venta}
                                    onChange={(e) => setFormData({...formData, nuevo_precio_venta: e.target.value})}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    placeholder="1.50"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha inicio</label>
                                    <input
                                        type="date"
                                        value={formData.fecha_inicio}
                                        onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha fin</label>
                                    <input
                                        type="date"

                                        value={formData.fecha_fin}
                                        onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
                                >
                                    {creating ? '⏳ Creando...' : '✅ Crear Promoción'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all"
                                    disabled={creating}
                                >
                                    Cancelar
                                </button>                                
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL EDITAR */}
            {showEditModal && selectedPromocion && (
                <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">✏️ Editar Promoción</h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre de la promoción *
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombre_promocion}
                                    onChange={(e) => setFormData({...formData, nombre_promocion: e.target.value})}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Producto *
                                </label>
                                <select
                                    value={formData.producto_id}
                                    onChange={(e) => setFormData({...formData, producto_id: e.target.value})}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    required
                                >
                                    <option value="">Seleccionar producto</option>
                                    {productos.map(producto => (
                                        <option key={producto.id} value={producto.id}>
                                            {producto.id} - {producto.descripcion} {producto.presentacion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nuevo precio * ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.nuevo_precio_venta}
                                    onChange={(e) => setFormData({...formData, nuevo_precio_venta: e.target.value})}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    placeholder="1.50"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha inicio</label>
                                    <input
                                        type="date"
                                        value={formData.fecha_inicio}
                                        onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha fin</label>
                                    <input
                                        type="date"
                                        value={formData.fecha_fin}
                                        onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    disabled={updating}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
                                >
                                    {updating ? '⏳ Guardando...' : '💾 Actualizar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all"
                                    disabled={updating}
                                >
                                    Cancelar
                                </button>                                
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DELETE */}
            {showDeleteModal && selectedPromocion && (
                <div 
                onClick={() => {setShowDeleteModal(false)}}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
                        <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-lg border-4 transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-red-200`}>                            
                            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>                            
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 leading-tight">
                            ¿Desactivar promoción?
                        </h3>
                        <p className="text-lg font-semibold text-gray-900 mb-2">
                            <span className="bg-gray-100 px-4 py-2 rounded-full text-sm inline-block">
                                "{selectedPromocion.nombre_promocion}"
                            </span>
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto pb-4">
                            Esta promoción se ocultará de la lista.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
                            <button
                                onClick={handleDelete}
                                className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all"
                            >
                                🗑️ Desactivar
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all"
                            >
                                ❌ Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            
        </div>
    );
};

export default Promociones;