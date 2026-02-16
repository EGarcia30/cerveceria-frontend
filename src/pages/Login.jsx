// pages/Login.jsx - DISEÑO LIMPIO + EMOJIS + NOMBRE USUARIO ✨
import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
        const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const response = await fetch(`${apiURL}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, password }), // 👈 CAMBIADO A NOMBRE
        });

        const data = await response.json();

        if (data.success) {
            console.log('✅ BACKEND RESPONSE:', data); // DEBUG
        
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.data)); // data.data
            onLoginSuccess(data.data); // data.data
            setTimeout(() => {
                window.location.href = '/cuentas';
            }, 500);
        } else {
            setError(data.error || 'Credenciales inválidas');
        }
        } catch (err) {
        setError('Error de conexión');
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-emerald-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Emojis flotantes */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 text-4xl animate-bounce">🍺</div>
                <div className="absolute top-40 right-20 text-5xl animate-bounce delay-1000">🍔</div>
                <div className="absolute bottom-32 left-20 text-4xl animate-bounce delay-2000">🍟</div>
                <div className="absolute bottom-20 right-32 text-6xl animate-bounce delay-3000">🍕</div>
                <div className="absolute top-1/4 right-1/4 text-3xl animate-pulse delay-500">🪑</div>
                <div className="absolute bottom-1/4 left-1/4 text-5xl animate-pulse delay-1500">🍻</div>
            </div>

            {/* Fondo sutil */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-emerald-500/10"></div>
            
            {/* Card limpia */}
            <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50 hover:shadow-3xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">🍻</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Las Toñitas</h1>
                    <p className="text-slate-600 font-medium">Inicia sesión en tu gastrobar</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm font-medium transition-all duration-200 flex items-center gap-2">
                        <span>⚠️</span>{error}
                    </div>
                )}

                {/* Formulario */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <span>👤</span> Nombre de usuario
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full px-4 py-3 text-lg border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-sm hover:shadow-md bg-white hover:bg-slate-50 text-slate-900 placeholder-slate-500 font-medium"
                            placeholder="admin"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <span>🔐</span> Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-lg border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-sm hover:shadow-md bg-white hover:bg-slate-50 text-slate-900 placeholder-slate-500 font-medium"
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Entrando...
                            </>
                        ) : (
                            <>
                                <span>🚀</span>
                                Entrar al sistema
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-8 pt-6 border-t border-slate-200">
                    <p className="text-sm text-slate-600 font-medium">👑 Las Toñitas Gastrobar 2026</p>
                </div>
            </div>
        </div>
    );
};

export default Login;