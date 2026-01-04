// pages/Mesas.jsx - Vista completa CRUD + Status real-time
import React, { useState, useEffect } from 'react';
const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Mesas = () => {
    const [mesas, setMesas] = useState([]);
    const [mesasPagination, setMesasPagination] = useState({ totalPages: 1, totalItems: 0 });
    const [mesasPage, setMesasPage] = useState(1);
    const [mesasFilter, setMesasFilter] = useState(''); // disponible/ocupada
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Form estados
    const [formData, setFormData] = useState({ numero_mesa: '', estado: 'disponible' });
    const [editingId, setEditingId] = useState(null);
    
    // Auto-refresh cada 10s
    useEffect(() => {
        fetchMesas();
    }, [mesasPage, mesasFilter]);

    const fetchMesas = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: mesasPage,
                limit: 24,
                ...(mesasFilter && { estado: mesasFilter })
            });
            
            const res = await fetch(`${apiURL}/mesas?${params}`);
            const data = await res.json();
            
            if (data.success) {
                setMesas(data.data);
                setMesasPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error mesas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMesa = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${apiURL}/mesas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (data.success) {
                setShowCreateModal(false);
                setFormData({ numero_mesa: '', estado: 'disponible' });
                fetchMesas();
            }
        } catch (error) {
            alert('Error creando mesa');
        }
    };

    const handleEditMesa = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${apiURL}/mesas/${editingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (data.success) {
                setShowEditModal(false);
                setEditingId(null);
                setFormData({ numero_mesa: '', estado: 'disponible' });
                fetchMesas();
            }
        } catch (error) {
            alert('Error editando mesa');
        }
    };

    const handleDeleteMesa = async (id) => {
        if (!confirm('¿Eliminar esta mesa?')) return;
        
        try {
            const res = await fetch(`${apiURL}/mesas/${id}`, { method: 'DELETE' });
            const data = await res.json();
            
            if (data.success) {
                fetchMesas();
            }
        } catch (error) {
            alert('Error eliminando mesa');
        }
    };

    const openEditModal = (mesa) => {
        setEditingId(mesa.id);
        setFormData({ numero_mesa: mesa.numero_mesa, estado: mesa.estado });
        setShowEditModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
                        🪑 Gestión de Mesas
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Administra mesas en tiempo real
                    </p>
                </div>

                {/* FILTROS + ACCIONES */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => { setMesasFilter(''); setMesasPage(1); }}
                            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                                !mesasFilter ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-400/50' : 'bg-gray-100 hover:bg-emerald-100'
                            }`}
                        >
                            Todas ({mesasPagination.totalItems})
                        </button>
                        <button
                            onClick={() => { setMesasFilter('disponible'); setMesasPage(1); }}
                            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                                mesasFilter === 'disponible' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-400/50' : 'bg-gray-100 hover:bg-emerald-100'
                            }`}
                        >
                            ✅ Disponibles
                        </button>
                        <button
                            onClick={() => { setMesasFilter('ocupada'); setMesasPage(1); }}
                            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                                mesasFilter === 'ocupada' ? 'bg-orange-500 text-white shadow-lg shadow-orange-400/50' : 'bg-gray-100 hover:bg-orange-100'
                            }`}
                        >
                            🪑 Ocupadas
                        </button>
                    </div>
                    
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                        ➕ Nueva Mesa
                    </button>
                </div>

                {/* GRID MESAS */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4 mb-12">
                    {loading ? (
                        Array(24).fill().map((_, i) => (
                            <div key={i} className="animate-pulse bg-white/50 rounded-2xl p-8 h-32 shadow-lg"></div>
                        ))
                    ) : mesas.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            <div className="text-6xl mb-4">🪑</div>
                            <h3 className="text-2xl font-bold mb-2">No hay mesas</h3>
                            <p>Crea tu primera mesa</p>
                        </div>
                    ) : (
                        mesas.map(mesa => (
                            <div
                                key={mesa.id}
                                className={`group p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-32 flex flex-col items-center justify-center text-center border-4 ${
                                    mesa.estado === 'disponible'
                                        ? 'bg-emerald-50 border-emerald-400 hover:border-emerald-500 hover:bg-emerald-100'
                                        : 'bg-orange-50 border-orange-400 hover:border-orange-500 hover:bg-orange-100'
                                }`}
                            >
                                <div className="text-3xl mb-2">🪑</div>
                                <div className="font-black text-xl mb-2 text-gray-900">Mesa {mesa.numero_mesa}</div>
                                
                                <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md ${
                                    mesa.estado === 'disponible'
                                        ? 'bg-emerald-200 text-emerald-800 shadow-emerald-200/50'
                                        : 'bg-orange-200 text-orange-800 shadow-orange-200/50'
                                }`}>
                                    {mesa.estado === 'disponible' ? '✅ LIBRE' : '🪑 OCUPADA'}
                                </span>
                                
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => openEditModal(mesa)}
                                        className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                                        title="Editar"
                                    >
                                        ✏️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* PAGINACIÓN */}
                {mesasPagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mb-12">
                        <button
                            onClick={() => setMesasPage(Math.max(1, mesasPage - 1))}
                            disabled={mesasPage === 1}
                            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center disabled:cursor-not-allowed"
                        >
                            ‹
                        </button>
                        
                        <span className="px-6 py-3 bg-white rounded-2xl shadow-md font-bold text-gray-700">
                            Pg {mesasPage} de {mesasPagination.totalPages} ({mesasPagination.totalItems} mesas)
                        </span>
                        
                        <button
                            onClick={() => setMesasPage(Math.min(mesasPagination.totalPages, mesasPage + 1))}
                            disabled={mesasPage === mesasPagination.totalPages}
                            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center disabled:cursor-not-allowed"
                        >
                            ›
                        </button>
                    </div>
                )}

                {/* MODAL CREAR */}
                {showCreateModal && (
                    <>
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={() => setShowCreateModal(false)} />
                        <div className="fixed inset-0 z-[60] p-4 flex items-center justify-center">
                            <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">➕ Nueva Mesa</h2>
                                
                                <form onSubmit={handleCreateMesa} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3">Número de Mesa *</label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-lg"
                                            value={formData.numero_mesa}
                                            onChange={(e) => setFormData({ ...formData, numero_mesa: e.target.value })}
                                            placeholder="Ej: 1, 2, 3..."
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3">Estado Inicial</label>
                                        <select
                                            className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-lg"
                                            value={formData.estado}
                                            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                        >
                                            <option value="disponible">✅ Disponible</option>
                                            <option value="ocupada">🪑 Ocupada</option>
                                        </select>
                                    </div>
                                    
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateModal(false)}
                                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl hover:shadow-2xl"
                                        >
                                            Crear Mesa
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}

                {/* MODAL EDITAR */}
                {showEditModal && (
                    <>
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={() => setShowEditModal(false)} />
                        <div className="fixed inset-0 z-[60] p-4 flex items-center justify-center">
                            <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">✏️ Editar Mesa</h2>
                                
                                <form onSubmit={handleEditMesa} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3">Número de Mesa</label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                                            value={formData.numero_mesa}
                                            onChange={(e) => setFormData({ ...formData, numero_mesa: e.target.value })}
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3">Estado</label>
                                        <select
                                            className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                                            value={formData.estado}
                                            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                        >
                                            <option value="disponible">✅ Disponible</option>
                                            <option value="ocupada">🪑 Ocupada</option>
                                        </select>
                                    </div>
                                    
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => { setShowEditModal(false); setEditingId(null); }}
                                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl hover:shadow-2xl"
                                        >
                                            Actualizar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Mesas;