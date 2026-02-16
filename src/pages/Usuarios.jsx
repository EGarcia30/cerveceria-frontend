// pages/Usuarios.jsx - DISEÑO PREMIUM 🍻
import React, { useState, useEffect } from 'react';
const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 0, page: 1 });
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'cajero' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState(null);
    const [updating, setUpdating] = useState(null);

    const fetchUsuarios = async (pageNum = 1, searchTerm = '') => {
        setLoading(true);
        try {
        const params = new URLSearchParams({ page: pageNum, search: searchTerm });
            const res = await fetch(`${apiURL}/usuarios?${params}`);
            const data = await res.json();
            setUsuarios(data.data || []);
            setPagination(data.pagination || { totalPages: 1, page: 1 });
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios(page, search);
    }, [page, search]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
        await fetch(`${apiURL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
            setShowCreateModal(false);
            setForm({ nombre: '', email: '', password: '', rol: 'cajero' });
            fetchUsuarios(page, search);
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
        await fetch(`${apiURL}/usuarios/${editingUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, password: form.password || undefined }),
        });
            setShowEditModal(false);
            setEditingUser(null);
            setForm({ nombre: editingUser.nombre, email: editingUser.email, rol: editingUser.rol, password: '' });
            fetchUsuarios(page, search);
            closeModal();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingUserId) return;
        
        setUpdating(deletingUserId);
        try {
            await fetch(`${apiURL}/usuarios/${deletingUserId}`, { 
                method: 'DELETE' 
            });
            setShowDeleteModal(false);
            setDeletingUserId(null);
            fetchUsuarios(page, search);
            closeModal();
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setUpdating(null);
        }
    };

    const handleDelete = (userId) => {
        setDeletingUserId(userId);
        setShowDeleteModal(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setForm({ nombre: user.nombre, email: user.email, rol: user.rol, password: '' });
        setShowEditModal(true);
    };

    const closeModal = () =>{

        setForm({ nombre: '', email: '', rol: '', password: ''})

        if(showCreateModal) setShowCreateModal(false);
        if(showEditModal) setShowEditModal(false);
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-6 px-4 sm:py-8 sm:px-6 lg:py-12">
                <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 lg:mb-12 gap-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
                    👥 Usuarios
                    <span className="text-sm sm:text-base bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold">
                        {usuarios.length} total
                    </span>
                    </h1>
                    <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base"
                    >
                    ➕ Nuevo Usuario
                    </button>
                </div>

                {/* SEARCH + PAGINACIÓN */}
                <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-md lg:shadow-lg mb-8 lg:mb-12">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <input
                        type="text"
                        placeholder="🔍 Buscar por nombre o email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 max-w-md p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base"
                    />
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center gap-2 flex-wrap">
                        <button
                            className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-md lg:shadow-lg text-xs flex-shrink-0"
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page <= 1}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-xl">
                            Pg. <span className="text-blue-600 font-bold">{page}</span> de <span className="text-purple-600 font-bold">{pagination.totalPages}</span>
                        </span>
                        <button
                            className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-md lg:shadow-lg text-xs flex-shrink-0"
                            onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                            disabled={page >= pagination.totalPages}
                        >
                            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        </div>
                    )}
                    </div>
                </div>

                {/* GRID USUARIOS - COMPACTO (sin desbordar botones) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10">
                {usuarios.map((usuario) => (
                    <div 
                    key={usuario.id}
                    className="group bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm relative overflow-hidden max-h-[440px]"
                    >                  
                    {/* CONTENIDO PRINCIPAL - COMPACTO */}
                    <div className="space-y-3 sm:space-y-4">  
                        {/* HEADER */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-700 leading-tight">
                            {usuario.nombre}
                        </h3>
                        <span className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold self-start sm:self-end ${
                            usuario.activo 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                            {usuario.activo ? '🟢 Activo' : '🔴 Inactivo'}
                        </span>
                        </div>
                        
                        {/* INFO COMPACTA */}
                        <div className="space-y-2 mb-3 sm:mb-5">
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600 font-medium">Email:</span>
                            <span className="text-gray-900 font-medium truncate">{usuario.email}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600 font-medium">Rol:</span>
                            <span className={`font-bold text-xs sm:text-sm ${
                            usuario.rol === 'admin' ? 'text-red-600' : usuario.rol === 'cajero' ? 'text-emerald-600' : 'text-indigo-600'
                            }`}>
                            {usuario.rol === 'admin' ? '👑 Admin' : usuario.rol === 'cajero' ? '💰 Cajero' : '👤 Personal'}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600 font-medium">Creado:</span>
                            <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                            {new Date(usuario.fecha_creado).toLocaleDateString('es-SV')}
                            </span>
                        </div>
                        </div>

                        {/* CARDS VERTICALES */}
                        <div className="flex flex-col gap-2 sm:gap-3 mb-4 sm:mb-5 h-[150px]">
                        <div className="flex-1 text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 hover:shadow-md hover:border-indigo-200 transition-all duration-300 min-h-[70px] flex flex-col justify-between">
                            <span className="block text-xs text-indigo-600 font-bold uppercase tracking-wide leading-none">Email</span>
                            <span className="text-lg font-bold text-indigo-700 block leading-relaxed px-2 line-clamp-2 mt-1">
                            {usuario.email}
                            </span>
                        </div>
                        <div className="flex-1 text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 hover:shadow-md hover:border-emerald-200 transition-all duration-300 min-h-[70px] flex flex-col justify-between">
                            <span className="block text-xs text-emerald-600 font-bold uppercase tracking-wide leading-none">Rol</span>
                            <span className={`text-lg font-bold text-emerald-700 flex items-center justify-center gap-2 leading-relaxed py-1`}>
                            {usuario.rol === 'admin' ? '👑' : usuario.rol === 'cajero' ? '💰' : '👤'}
                            <span className="hidden sm:inline">{usuario.rol}</span>
                            </span>
                        </div>
                        </div>

                        {/* BOTONES - TOTALMENTE ABAJO */}
                        <div className="pt-2 sm:pt-4 border-t border-gray-200 mt-auto">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                            {new Date(usuario.fecha_creado).toLocaleDateString('es-SV', { month: 'short', day: 'numeric' })}
                            </span>
                            
                            <div className="flex gap-1.5 sm:gap-2">
                            {/* EDITAR */}
                            <button
                                onClick={() => openEditModal(usuario)}
                                className="w-9 h-9 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex-shrink-0"
                                title="Editar usuario"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            
                            {/* TOGGLE */}
                            <button
                                onClick={() => handleDelete(usuario.id)}
                                className={`w-9 h-9 text-white rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                                usuario.activo ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'
                                }`}
                                title={usuario.activo ? 'Desactivar' : 'Activar'}
                            >
                                {usuario.activo ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                )}
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>

                {/* PAGINACIÓN PRINCIPAL */}
                {pagination.totalPages > 1 && (
                    <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-md lg:shadow-lg mt-8 lg:mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-4">
                    <button
                        className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 hover:scale-105 shadow-md lg:shadow-lg text-xs lg:text-sm flex-shrink-0"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page <= 1}
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="hidden sm:flex gap-1 lg:gap-2 justify-center min-w-[120px] lg:min-w-[160px]">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const startPage = Math.max(1, page - 2);
                        const pageNum = Math.min(startPage + i, pagination.totalPages);
                        return (
                            <button
                            key={pageNum}
                            className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-sm lg:shadow-md flex items-center justify-center text-sm lg:text-base flex-shrink-0 ${
                                pageNum === page
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 border border-gray-200 hover:border-blue-200'
                            }`}
                            onClick={() => setPage(pageNum)}
                            >
                            {pageNum}
                            </button>
                        );
                        })}
                    </div>

                    <button
                        className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 hover:scale-105 shadow-md lg:shadow-lg text-xs lg:text-sm flex-shrink-0"
                        onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                        disabled={page >= pagination.totalPages}
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    </div>
                )}
                </div>
            </div>

            {/* MODAL CREAR USUARIO */}
            {showCreateModal && (
                <>
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-in fade-in-0 zoom-in-95 duration-200" onClick={() => setShowCreateModal(false)} />
                <div className="fixed inset-0 z-[60] p-4 sm:p-6 flex items-center justify-center">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
                    <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">👥 Nuevo Usuario</h2>
                        <button onClick={closeModal} className="p-2 rounded-2xl hover:bg-gray-200 transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        </div>
                    </div>
                    <form onSubmit={handleCreate} className="p-6 sm:p-8">
                        <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            👤 Nombre Completo *
                            </label>
                            <input
                            type="text"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base"
                            required
                            placeholder="Juan Pérez"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            ✉️ Email *
                            </label>
                            <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base"
                            required
                            placeholder="juan@gastrobar.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            🔐 Contraseña *
                            </label>
                            <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base"
                            required
                            placeholder="Mínimo 6 caracteres"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Rol *</label>
                            <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: 'admin', label: '👑 Admin', color: 'from-red-500 to-pink-600' },
                                { value: 'cajero', label: '💰 Cajero', color: 'from-emerald-500 to-teal-600' },
                                { value: 'personal', label: '👤 Personal', color: 'from-indigo-500 to-purple-600' },
                            ].map((rol) => (
                                <button
                                key={rol.value}
                                type="button"
                                onClick={() => setForm({ ...form, rol: rol.value })}
                                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-semibold transition-all duration-200 hover:scale-105 ${
                                    form.rol === rol.value
                                    ? `bg-gradient-to-r ${rol.color} text-white border-transparent shadow-lg`
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
                                }`}
                                >
                                {rol.label}
                                </button>
                            ))}
                            </div>
                        </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-6">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-base"
                            >
                                ➕ Crear Usuario
                            </button>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-50 hover:shadow-md transition-all text-base"
                            >
                                Cancelar
                            </button>                        
                        </div>
                    </form>
                    </div>
                </div>
                </>
            )}

            {/* MODAL EDITAR USUARIO */}
            {showEditModal && editingUser && (
                <>
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-in fade-in-0 zoom-in-95 duration-200" onClick={() => setShowEditModal(false)} />
                <div className="fixed inset-0 z-[60] p-4 sm:p-6 flex items-center justify-center">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
                    <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">✏️ Editar Usuario</h2>
                        <button onClick={closeModal} className="p-2 rounded-2xl hover:bg-gray-200 transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        </div>
                    </div>
                    <form onSubmit={handleEdit} className="p-6 sm:p-8">
                        <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            👤 Nombre Completo *
                            </label>
                            <input
                            type="text"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
                            required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            ✉️ Email *
                            </label>
                            <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
                            required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            🔐 Nueva Contraseña (opcional)
                            </label>
                            <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
                            placeholder="Dejar vacío para mantener actual"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Rol *</label>
                            <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: 'admin', label: '👑 Admin', color: 'from-red-500 to-pink-600' },
                                { value: 'cajero', label: '💰 Cajero', color: 'from-emerald-500 to-teal-600' },
                                { value: 'personal', label: '👤 Personal', color: 'from-indigo-500 to-purple-600' },
                            ].map((rol) => (
                                <button
                                key={rol.value}
                                type="button"
                                onClick={() => setForm({ ...form, rol: rol.value })}
                                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-semibold transition-all duration-200 hover:scale-105 ${
                                    form.rol === rol.value
                                    ? `bg-gradient-to-r ${rol.color} text-white border-transparent shadow-lg`
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
                                }`}
                                >
                                {rol.label}
                                </button>
                            ))}
                            </div>
                        </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-6">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-base"
                            >
                                💾 Actualizar Usuario
                            </button>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-50 hover:shadow-md transition-all text-base"
                            >
                                Cancelar
                            </button>                   
                        </div>
                    </form>
                    </div>
                </div>
                </>
            )}

            {showDeleteModal && deletingUserId && usuarios.find(u => u.id === deletingUserId) && (
                <>
                    {/* Fondo overlay */}
                    <div 
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                        onClick={() => setShowDeleteModal(false)}
                    />
                    
                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-[60] pointer-events-none">
                        <div className="w-full max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto transform transition-all duration-300 ease-out scale-100 opacity-100 translate-y-0 bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 mx-4">
                            
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-lg border-4 transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-red-200">
                                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                
                                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 leading-tight">
                                    ¿Eliminar usuario?
                                </h3>
                                
                                <p className="text-lg font-semibold text-gray-900 mb-2">
                                    <span className="bg-gray-100 px-4 py-2 rounded-full text-sm inline-block">
                                        "{usuarios.find(u => u.id === deletingUserId)?.nombre}"
                                    </span>
                                </p>
                                
                                <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                                    Esta acción eliminará permanentemente al usuario y no podrá deshacerse. ¿Estás seguro?
                                </p>
                            </div>

                            {/* Botones */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
                                <button
                                    onClick={handleConfirmDelete}
                                    disabled={updating === deletingUserId}
                                    className={`w-full sm:flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border border-red-200`}
                                >
                                    {updating === deletingUserId ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span className="text-sm sm:text-base">Eliminando...</span>
                                        </div>
                                    ) : '🗑️ Eliminar usuario'}
                                </button>
                                
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={updating === deletingUserId}
                                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-bold rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 border border-gray-300 text-sm sm:text-base whitespace-nowrap"
                                >
                                    ❌ Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Usuarios;
