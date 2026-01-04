import React, { useState, useEffect } from 'react';
const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Compras = () => {
    // Estados principales
    const [compras, setCompras] = useState([]);
    const [productos, setProductos] = useState([]);
    const [pagination, setPagination] = useState({});
    const [productosPagination, setProductosPagination] = useState({});
    const [page, setPage] = useState(1);
    const [productosPage, setProductosPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    // Modal estados - CREAR
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedProductos, setSelectedProductos] = useState([]);
    const [createForm, setCreateForm] = useState({
        proveedor: '',
        direccion: '',
        total: 0
    });

    // ✅ MODAL DETALLE - NUEVO
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedCompra, setSelectedCompra] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // ✅ FORMATEAR DINERO - 2 DECIMALES SIEMPRE
    const formatDinero = (numero) => {
        return Number(numero ?? 0).toLocaleString('es-SV', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    };

    // Fetch compras
    const fetchCompras = async (currentPage = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/compras?page=${currentPage}&limit=10`);
            const data = await response.json();
            if (data.success) {
                setCompras(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error cargando compras:', error);
        } finally {
            setLoading(false);
        }
    };

    // PAGINACIÓN PRODUCTOS
    const fetchProductos = async (currentPage = 1) => {
        try {
            const response = await fetch(`${apiURL}/productos?page=${currentPage}&limit=10`);
            const data = await response.json();
            if (data.success) {
                setProductos(data.data);
                setProductosPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
    };

    // ✅ VER DETALLE COMPRA (usa TU endpoint /api/compras/:id)
    const handleVerDetalle = async (compraId) => {
        try {
            setLoadingDetail(compraId);
            const response = await fetch(`${apiURL}/compras/${compraId}`);
            const data = await response.json();
            if (data.success) {
                setSelectedCompra(data.data);
                setShowDetailModal(true);
            }
        } catch (error) {
            console.error('Error cargando detalle:', error);
        } finally {
            setLoadingDetail(null);
        }
    };

    useEffect(() => {
        fetchCompras(page);
    }, [page]);

    useEffect(() => {
        if (showCreateModal) {
            fetchProductos(productosPage);
        }
    }, [showCreateModal, productosPage]);

    // CERRAR MODAL CREAR
    const handleCerrarModal = () => {
        setShowCreateModal(false);
        setSelectedProductos([]);
        setCreateForm({ proveedor: '', direccion: '', total: 0 });
        setProductosPage(1);
    };

    // AUMENTAR/DISMINUIR/BORRAR - SIN CAMBIOS
    const handleAumentarCantidad = (productoId) => {
        setSelectedProductos(selectedProductos.map(p => 
            p.id === productoId ? { ...p, cantidad: p.cantidad + 1 } : p
        ));
    };

    const handleDisminuirCantidad = (productoId) => {
        const producto = selectedProductos.find(p => p.id === productoId);
        if (producto && producto.cantidad > 1) {
            setSelectedProductos(selectedProductos.map(p => 
                p.id === productoId ? { ...p, cantidad: p.cantidad - 1 } : p
            ));
        }
    };

    const handleBorrarProducto = (productoId) => {
        setSelectedProductos(selectedProductos.filter(p => p.id !== productoId));
    };

    const handleCantidadChange = (productoId, nuevaCantidad) => {
        if (nuevaCantidad < 1) {
            setSelectedProductos(selectedProductos.filter(p => p.id !== productoId));
        } else {
            setSelectedProductos(selectedProductos.map(p => 
                p.id === productoId ? { ...p, cantidad: parseFloat(nuevaCantidad) || 1 } : p
            ));
        }
    };

    const handleCrearCompra = async (e) => {
        e.preventDefault();
        try {
            setUpdating('new');
            const compraResponse = await fetch(`${apiURL}/compras`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...createForm,
                    total: calcularTotal(),
                    estado: 'pendiente',
                    detalles: selectedProductos.map(p => ({
                        producto_id: p.id,
                        cantidad_vendida: p.cantidad,
                        precio_compra_actual: p.precio_compra,
                        precio_venta: p.precio_venta
                    }))
                })
            });

            if (compraResponse.ok) {
                handleCerrarModal();
                fetchCompras(page);
            }
        } catch (error) {
            console.error('Error creando compra:', error);
        } finally {
            setUpdating(null);
        }
    };

    const handleAgregarProducto = (producto) => {
        const existe = selectedProductos.find(p => p.id === producto.id);
        if (existe) {
            handleAumentarCantidad(producto.id);
        } else {
            setSelectedProductos([...selectedProductos, { ...producto, cantidad: 1 }]);
        }
    };

    const handlePagarCompra = async (compraId) => {
        try {
            setUpdating(compraId);
            const response = await fetch(`${apiURL}/compras/${compraId}/pagar`, {
                method: 'PATCH'
            });
            if (response.ok) {
                fetchCompras(page);
            }
        } catch (error) {
            console.error('Error pagando compra:', error);
        } finally {
            setUpdating(null);
        }
    };

    const calcularTotal = () => {
        return selectedProductos.reduce((total, p) => total + (p.precio_compra * p.cantidad), 0);
    };

    if (loading) {
        return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:py-20">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200/50 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <p className="text-lg sm:text-xl font-medium text-gray-700 text-center">Cargando compras...</p>
        </div>
        );
    }
    return (
        <>
            {/* ✅ LISTA PRINCIPAL */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-6 px-4 sm:py-8 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">🛒 Compras</h1>
                        <button
                            onClick={() => {
                                setShowCreateModal(true);
                                setProductosPage(1);
                                fetchProductos(1);
                            }}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-2.5 px-6 sm:py-3 sm:px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base"
                        >
                            ➕ Nueva Compra
                        </button>
                    </div>

                    {/* ✅ PAGINACIÓN COMPRAS*/}
                    {pagination.totalPages > 1 && (
                        <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 shadow-md lg:shadow-lg flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-4 mb-8">
                            
                            {/* ← Anterior */}
                            <button 
                                className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md lg:shadow-lg text-xs lg:text-sm flex-shrink-0"
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page <= 1}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Números de página */}
                            <div className="hidden sm:flex gap-1 sm:gap-1.5 lg:gap-2 justify-center min-w-[100px] sm:min-w-[120px] lg:min-w-[140px] flex-wrap">
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    const startPage = Math.max(1, page - 2);
                                    const pageNum = Math.min(startPage + i, pagination.totalPages);
                                    
                                    return (
                                        <button
                                            key={`page-btn-${pageNum}-${i}`}
                                            className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-sm lg:shadow-md flex items-center justify-center text-xs sm:text-sm lg:text-base flex-shrink-0 ${
                                                pageNum === page 
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/25' 
                                                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 border border-gray-200 hover:border-blue-200'
                                            }`}
                                            onClick={() => setPage(pageNum)}
                                            aria-label={`Ir a página ${pageNum}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Siguiente → */}
                            <button 
                                className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md lg:shadow-lg text-xs lg:text-sm flex-shrink-0"
                                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                                disabled={page >= pagination.totalPages}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Info página */}
                            <div className="hidden sm:block lg:flex text-gray-700 font-semibold bg-gray-100 px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 text-xs sm:text-sm lg:text-base whitespace-nowrap flex-shrink-0">
                                <span className="hidden sm:inline lg:hidden">{page}/{pagination.totalPages}</span>
                                <span className="lg:inline hidden">Pg. <span className="text-blue-600 font-bold">{page}</span> de <span className="text-purple-600 font-bold">{pagination.totalPages}</span></span>
                            </div>
                        </div>
                    )}


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {compras.map(compra => (
                            <div key={compra.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                                    <h3 className="font-bold text-lg sm:text-xl text-gray-900">#{compra.id}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-bold ${
                                        compra.estado === 'pagado' 
                                            ? 'bg-emerald-100 text-emerald-800' 
                                            : 'bg-amber-100 text-amber-800'
                                    }`}>
                                        {compra.estado === 'pagado' ? '✅ Pagado' : '⏳ Pendiente'}
                                    </span>
                                </div>
                                <p className="text-sm sm:text-base text-gray-600 mb-2"><strong>Proveedor:</strong> {compra.proveedor}</p>
                                <p className="text-sm sm:text-base text-gray-600 mb-4"><strong>Dirección:</strong> {compra.direccion}</p>
                                <div className="text-xl sm:text-2xl font-bold text-emerald-600 mb-6">
                                    ${formatDinero(compra.total)}
                                </div>
                                
                                {/* ✅ BOTONES RESPONSIVE */}
                                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                                    {compra.estado === 'pendiente' && (
                                        <button
                                            onClick={() => handlePagarCompra(compra.id)}
                                            disabled={updating === compra.id}
                                            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 text-sm"
                                        >
                                            {updating === compra.id ? 'Procesando...' : '✅ Marcar Pagado'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleVerDetalle(compra.id)}
                                        disabled={loadingDetail === compra.id}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 text-sm"
                                    >
                                        {loadingDetail === compra.id ? 'Cargando...' : '👁️ Ver Detalle'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ✅ PAGINACIÓN COMPRAS*/}
                    {pagination.totalPages > 1 && (
                        <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 shadow-md lg:shadow-lg flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-4 my-8">
                            
                            {/* ← Anterior */}
                            <button 
                                className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md lg:shadow-lg text-xs lg:text-sm flex-shrink-0"
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page <= 1}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Números de página */}
                            <div className="hidden sm:flex gap-1 sm:gap-1.5 lg:gap-2 justify-center min-w-[100px] sm:min-w-[120px] lg:min-w-[140px] flex-wrap">
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    const startPage = Math.max(1, page - 2);
                                    const pageNum = Math.min(startPage + i, pagination.totalPages);
                                    
                                    return (
                                        <button
                                            key={`page-btn-${pageNum}-${i}`}
                                            className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-sm lg:shadow-md flex items-center justify-center text-xs sm:text-sm lg:text-base flex-shrink-0 ${
                                                pageNum === page 
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/25' 
                                                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 border border-gray-200 hover:border-blue-200'
                                            }`}
                                            onClick={() => setPage(pageNum)}
                                            aria-label={`Ir a página ${pageNum}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Siguiente → */}
                            <button 
                                className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md lg:shadow-lg text-xs lg:text-sm flex-shrink-0"
                                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                                disabled={page >= pagination.totalPages}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Info página */}
                            <div className="hidden sm:block lg:flex text-gray-700 font-semibold bg-gray-100 px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 text-xs sm:text-sm lg:text-base whitespace-nowrap flex-shrink-0">
                                <span className="hidden sm:inline lg:hidden">{page}/{pagination.totalPages}</span>
                                <span className="lg:inline hidden">Pg. <span className="text-blue-600 font-bold">{page}</span> de <span className="text-purple-600 font-bold">{pagination.totalPages}</span></span>
                            </div>
                        </div>
                    )}

                    {/* VACÍO */}
                    {compras.length === 0 && (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-6">🛒</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No hay compras</h3>
                            <p className="text-gray-600 mb-6">Crea tu primera compra para empezar</p>
                            <button
                                onClick={() => {
                                    setShowCreateModal(true);
                                    setProductosPage(1);
                                    fetchProductos(1);
                                }}
                                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                            >
                                ➕ Crear Primera Compra
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ MODAL DETALLE */}
            {showDetailModal && selectedCompra && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]" 
                        onClick={() => setShowDetailModal(false)}
                    />
                    <div className="fixed inset-0 z-[70] p-4 sm:p-6 flex items-center justify-center overflow-y-auto">
                        <div className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl max-h-[95vh] bg-white rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                            <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                            Detalle Compra #{selectedCompra.id}
                                        </h2>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold mt-2 inline-block ${
                                            selectedCompra.estado === 'pagado' 
                                                ? 'bg-emerald-100 text-emerald-800' 
                                                : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {selectedCompra.estado === 'pagado' ? '✅ Pagado' : '⏳ Pendiente'}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => setShowDetailModal(false)}
                                        className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all self-start lg:self-end"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* ENCABEZADO */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 p-6 bg-gray-50 rounded-2xl">
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Proveedor</p>
                                        <p className="text-lg sm:text-xl font-bold text-gray-900 break-words">{selectedCompra.proveedor}</p>
                                    </div>
                                    {selectedCompra.direccion && (
                                        <div>
                                            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Dirección</p>
                                            <p className="text-lg sm:text-xl font-bold text-gray-900 break-words">{selectedCompra.direccion}</p>
                                        </div>
                                    )}
                                    <div className="sm:col-span-2 lg:col-span-1">
                                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total</p>
                                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600">
                                            ${formatDinero(selectedCompra.total)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Fecha</p>
                                        <p className="text-base sm:text-lg font-bold text-gray-900">
                                            {new Date(selectedCompra.fecha_creado).toLocaleDateString('es-SV', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* DETALLES PRODUCTOS */}
                                {selectedCompra.detalles && selectedCompra.detalles.length > 0 ? (
                                    <>
                                        <h3 className="px-6 sm:px-8 pb-4 sm:pb-6 text-xl sm:text-2xl font-bold text-gray-900">
                                            Productos ({selectedCompra.detalles.length})
                                        </h3>
                                        <div className="px-2 sm:px-6 pb-6 sm:pb-8 space-y-4 max-h-96 overflow-y-auto">
                                            {selectedCompra.detalles.map((detalle, index) => (
                                                <div key={detalle.id || index} className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border shadow-sm hover:shadow-md transition-all">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start lg:items-center">
                                                        <div className="lg:col-span-2">
                                                            <p className="font-bold text-base sm:text-lg text-gray-900 line-clamp-2">{detalle.descripcion}</p>
                                                            <p className="text-sm text-gray-600 mt-1">{detalle.presentacion}</p>
                                                        </div>
                                                        <div className="text-center sm:text-left">
                                                            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Precio Compra</p>
                                                            <p className="text-lg sm:text-xl font-bold text-emerald-600">
                                                                ${detalle.precio_compra_actual?.toLocaleString('es-SV')}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-medium text-gray-600 mb-1">Cantidad</p>
                                                            <div>
                                                                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                                                                    {detalle.cantidad_vendida}
                                                                </p>
                                                                <p className="text-lg font-bold text-emerald-600">
                                                                    ${(detalle.precio_compra_actual * detalle.cantidad_vendida)?.toLocaleString('es-SV')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="px-6 sm:px-8 pb-12 text-center text-gray-500">
                                        <div className="text-4xl mb-4">📦</div>
                                        <p className="text-lg font-medium">No hay productos en esta compra</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ✅ MODAL CREAR */}
            {showCreateModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] sm:bg-black/40" onClick={handleCerrarModal} />
                    <div className="fixed inset-0 z-[60] p-4 sm:p-6 flex items-center justify-center">
                        <div className="w-full max-w-md sm:max-w-2xl md:max-w-4xl max-h-[95vh] flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                            
                            {/* ✅ HEADER FIJO */}
                            <div className="p-6 sm:p-8 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50 flex-shrink-0">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Nueva Compra</h2>
                                        <p className="text-sm sm:text-base text-gray-600 mt-1">Selecciona productos y completa la información</p>
                                    </div>
                                    <button 
                                        onClick={handleCerrarModal} 
                                        className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all w-10 h-10 flex items-center justify-center sm:ml-auto self-start sm:self-auto"
                                    >
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* ✅ FORM CABECERA */}
                                <form onSubmit={handleCrearCompra} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Proveedor *</label>
                                        <input
                                            className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                            value={createForm.proveedor}
                                            onChange={(e) => setCreateForm({...createForm, proveedor: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Dirección</label>
                                        <input
                                            className="w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                            value={createForm.direccion}
                                            onChange={(e) => setCreateForm({...createForm, direccion: e.target.value})}
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-col-reverse sm:items-end md:items-end gap-1">
                                        <span className="text-xs sm:text-sm text-gray-500 text-right">Total seleccionados</span>
                                        <div className="text-lg sm:text-2xl font-bold text-emerald-600">
                                            ${calcularTotal().toLocaleString('es-SV', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* ✅ CONTENIDO SCROLLABLE */}
                            <div className="flex-1 overflow-y-auto">
                                
                                {/* PRODUCTOS SELECCIONADOS */}
                                {selectedProductos.length > 0 && (
                                    <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
                                        <h3 className="font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
                                            Productos ({selectedProductos.length})
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3 sm:gap-4 pb-4">
                                            {selectedProductos.map(producto => (
                                                <div key={producto.id} className="bg-white p-4 rounded-xl border shadow-sm flex flex-col sm:flex-row sm:items-center sm:gap-4 hover:shadow-md transition-all">
                                                    <div className="flex-1 mb-3 sm:mb-0">
                                                        <p className="font-bold text-sm sm:text-base text-gray-900 line-clamp-2">{producto.descripcion}</p>
                                                        <p className="text-xs text-gray-600">{producto.presentacion}</p>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                                                            <button
                                                                onClick={() => handleDisminuirCantidad(producto.id)}
                                                                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl flex items-center justify-center font-bold hover:scale-105 transition-all disabled:opacity-50"
                                                                disabled={producto.cantidad <= 1}
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="number"
                                                                value={producto.cantidad}
                                                                onChange={(e) => handleCantidadChange(producto.id, parseFloat(e.target.value))}
                                                                className="w-20 p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-center font-bold text-base bg-white shadow-sm"
                                                            />
                                                            <button
                                                                onClick={() => handleAumentarCantidad(producto.id)}
                                                                className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold hover:scale-105 transition-all shadow-md"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <div className="flex items-end sm:items-center gap-2 sm:gap-3">
                                                            <span className="font-bold text-lg sm:text-xl text-emerald-600 min-w-[70px] text-right sm:text-left">
                                                                ${(producto.precio_compra * producto.cantidad).toLocaleString('es-SV')}
                                                            </span>
                                                            <button
                                                                onClick={() => handleBorrarProducto(producto.id)}
                                                                className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center font-bold hover:scale-105 transition-all shadow-md flex-shrink-0"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ✅ LISTA PRODUCTOS + BOTÓN CREAR */}
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                                        <h3 className="font-bold text-base sm:text-lg">
                                            Página {productosPage} de {productosPagination.totalPages || 1}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={handleCrearCompra}
                                            disabled={selectedProductos.length === 0 || updating === 'new'}
                                            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 w-full sm:w-auto order-last sm:order-first"
                                        >
                                            {updating === 'new' ? 'Creando...' : `✅ Crear Compra (${selectedProductos.length})`}
                                        </button>
                                    </div>

                                    {/* PAGINACIÓN */}
                                    {productosPagination.totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-1 sm:gap-2 pt-4 pb-6">
                                            <button
                                                onClick={() => setProductosPage(Math.max(1, productosPage - 1))}
                                                disabled={productosPage <= 1}
                                                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center text-sm sm:text-base"
                                            >
                                                ←
                                            </button>
                                            <div className="flex gap-1 sm:gap-1 hidden sm:flex">
                                                {Array.from({ length: Math.min(5, productosPagination.totalPages) }, (_, i) => {
                                                    const pageNum = Math.min(Math.max(1, productosPage - 2) + i, productosPagination.totalPages);
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => setProductosPage(pageNum)}
                                                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-bold shadow-md flex items-center justify-center transition-all text-xs sm:text-base ${
                                                                pageNum === productosPage
                                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/25'
                                                                    : 'bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 border hover:border-blue-200'
                                                            }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <button
                                                onClick={() => setProductosPage(Math.min(productosPagination.totalPages, productosPage + 1))}
                                                disabled={productosPage >= productosPagination.totalPages}
                                                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center text-sm sm:text-base"
                                            >
                                                →
                                            </button>
                                        </div>
                                    )}

                                    {/* BOTONES PRODUCTOS */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-6">
                                        {productos.map(producto => (
                                            <button
                                                key={producto.id}
                                                onClick={() => handleAgregarProducto(producto)}
                                                className="group p-3 sm:p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all duration-200 hover:scale-105 bg-white disabled:opacity-50 disabled:cursor-not-allowed h-full flex flex-col items-start"
                                                disabled={producto.cantidad_disponible <= 0}
                                            >
                                                <div className="font-semibold text-xs sm:text-sm mb-1 line-clamp-2 group-hover:text-emerald-700 leading-tight">
                                                    {producto.descripcion}
                                                </div>
                                                <div className="text-xs text-gray-600 mb-2">{producto.presentacion}</div>
                                                <div className="font-bold text-emerald-600 text-sm sm:text-base mb-1">
                                                    ${producto.precio_compra.toLocaleString('es-SV')}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Stock: {producto.cantidad_disponible}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* PAGINACIÓN */}
                                    {productosPagination.totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-1 sm:gap-2 pt-4 pb-6">
                                            <button
                                                onClick={() => setProductosPage(Math.max(1, productosPage - 1))}
                                                disabled={productosPage <= 1}
                                                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center text-sm sm:text-base"
                                            >
                                                ←
                                            </button>
                                            <div className="flex gap-1 sm:gap-1 hidden sm:flex">
                                                {Array.from({ length: Math.min(5, productosPagination.totalPages) }, (_, i) => {
                                                    const pageNum = Math.min(Math.max(1, productosPage - 2) + i, productosPagination.totalPages);
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => setProductosPage(pageNum)}
                                                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-bold shadow-md flex items-center justify-center transition-all text-xs sm:text-base ${
                                                                pageNum === productosPage
                                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/25'
                                                                    : 'bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 border hover:border-blue-200'
                                                            }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <button
                                                onClick={() => setProductosPage(Math.min(productosPagination.totalPages, productosPage + 1))}
                                                disabled={productosPage >= productosPagination.totalPages}
                                                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center text-sm sm:text-base"
                                            >
                                                →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Compras;
