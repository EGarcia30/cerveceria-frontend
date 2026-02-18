// src/components/CorteCajaModal.jsx - VERSIÓN FINAL PERFECTA
import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const CorteCajaModal = ({ isOpen, onClose }) => {
    const [corteData, setCorteData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [usuarioActual, setUsuarioActual] = useState('Cajero SV');
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    const obtenerUsuario = () => {
        const userData = localStorage.getItem('user');
        if (userData === 'undefined' || userData === 'null') {
            return 'Cajero SV';
        }
        
        try {
            const parsedUser = JSON.parse(userData);
            return parsedUser?.nombre || 'Cajero SV';
        } catch (error) {
            return 'Cajero SV';
        }
    };

    const obtenerTurnoActualSV = () => {
        const ahora = new Date();
        const hora = ahora.getHours();
        return (hora >= 18 || hora < 6);
    };

    const horaSV = () => new Date().toLocaleString('es-SV', {
        timeZone: 'America/El_Salvador',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const cargarDatosCorte = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${apiURL}/dashboard?filtro=turno`);
            const data = await res.json();
            if (data.success) {
                setCorteData(data.data);
            }
        } catch (error) {
            console.error('Error cargando corte:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setUsuarioActual(obtenerUsuario());
            cargarDatosCorte();
        }
    }, [isOpen]);

    const esTurnoNoche = obtenerTurnoActualSV();
    const horaActualSV = horaSV();
    
    const utilNetaTurno = (corteData?.ventasPeriodo?.ingresos_periodo || 0) - 
                         (corteData?.ganancias?.costos || 0) - 
                         (corteData?.gastosOperativos?.gastos_operativos || 0);

    const formatDinero = (numero) => {
        return Number(numero ?? 0).toLocaleString('es-SV', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    };

    // ✅ ESTILOS PDF - FONTSIZE MÁS PEQUEÑO + LAYOUT EXACTO
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            padding: 20, // ← REDUCIDO
            fontSize: 9, // ← BASE MÁS PEQUEÑA
            lineHeight: 1.3,
            width: 300, // ← ANCHO EXACTO
            height: 450, // ← ALTURA EXACTA 1 PÁGINA
        },
        header: {
            alignItems: 'center',
            marginBottom: 15,
            borderBottom: '2px solid #10B981',
            paddingBottom: 8,
        },
        nombreLocal: {
            fontSize: 13, // ← MÁS PEQUEÑO
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: 2,
            letterSpacing: 0.5,
        },
        titulo: {
            fontSize: 16, // ← MÁS PEQUEÑO
            fontWeight: 'extrabold',
            color: '#1E3A8A',
            marginBottom: 4,
            textAlign: 'center',
        },
        horaTurno: {
            fontSize: 9,
            color: '#6B7280',
            marginBottom: 3,
        },
        turnoBadge: {
            backgroundColor: esTurnoNoche ? '#8B5CF6' : '#10B981',
            color: 'white',
            paddingHorizontal: 6,
            paddingVertical: 1,
            borderRadius: 3,
            fontSize: 8, // ← MÁS PEQUEÑO
            fontWeight: 'bold',
            alignSelf: 'center',
            marginTop: 2,
        },
        separador: {
            borderBottom: '1px solid #D1D5DB',
            marginVertical: 6,
        },
        seccion: {
            marginBottom: 8,
        },
        label: {
            fontSize: 9,
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: 1,
        },
        valor: {
            fontSize: 12, // ← MÁS PEQUEÑO
            fontWeight: 'bold',
            color: '#10B981',
            marginBottom: 1,
        },
        valorRojo: {
            fontSize: 12, // ← MÁS PEQUEÑO
            fontWeight: 'bold',
            color: '#EF4444',
            marginBottom: 1,
        },
        utilidad: {
            fontSize: 14, // ← MÁS PEQUEÑO
            fontWeight: 'extrabold',
            marginTop: 6,
            paddingTop: 8,
            borderTop: '2px double #000',
            textAlign: 'center',
            paddingHorizontal: 8,
            marginBottom: 10,
        },
        quienGenero: {
            fontSize: 10,
            fontWeight: 'bold',
            color: '#1F2937',
            marginTop: 8,
            textAlign: 'center',
        },
        footer: {
            position: 'absolute',
            bottom: 15,
            left: 20,
            right: 20,
            textAlign: 'center',
            fontSize: 8, // ← MÁS PEQUEÑO
            color: '#6B7280',
            lineHeight: 1.2,
        }
    });

    const TicketCorteCaja = () => (
    <Document>
        <Page size={[300, 450]} style={styles.page}>
            {/* ✅ HEADER */}
            <View style={styles.header}>
                <Text style={styles.nombreLocal}>LAS TOÑITAS</Text>
                <Text style={styles.titulo}>CORTE DE CAJA</Text>
                <Text style={styles.horaTurno}>Hora: {horaActualSV}</Text>
                <Text style={styles.turnoBadge}>
                    {esTurnoNoche ? 'TURNO NOCHE' : 'TURNO DIA'}
                </Text>
            </View>

            <View style={styles.separador}></View>

            {/* ✅ GASTOS OPERATIVOS */}
            <View style={styles.seccion}>
                <Text style={styles.label}>GASTOS OPERATIVOS</Text>
                <Text style={styles.valorRojo}>${formatDinero(corteData?.gastosOperativos?.gastos_operativos)}</Text>
                <Text style={[styles.label, {fontSize: 8}]}>({corteData?.gastosOperativos?.total_gastos || 0} gastos)</Text>
            </View>

            {/* ✅ GASTOS PRODUCTOS */}
            <View style={styles.seccion}>
                <Text style={styles.label}>GASTOS PRODUCTOS</Text>
                <Text style={styles.valorRojo}>${formatDinero(corteData?.ganancias?.costos)}</Text>
            </View>

            {/* ✅ VENTAS TOTALES */}
            <View style={styles.seccion}>
                <Text style={styles.label}>VENTAS TOTALES</Text>
                <Text style={styles.valor}>${formatDinero(corteData?.ventasPeriodo?.ingresos_periodo)}</Text>
                <Text style={[styles.label, {fontSize: 8}]}>({corteData?.ventasPeriodo?.ventas_periodo || 0} ventas)</Text>
            </View>

            {/* ✅ UTILIDAD DESTACADA */}
            <View style={styles.utilidad}>
                <Text style={[styles.label, { 
                    fontSize: 13,
                    color: utilNetaTurno >= 0 ? '#059669' : '#DC2626'
                }]}>
                    UTILIDAD DEL TURNO
                </Text>
                <Text style={[styles.valor, { 
                    fontSize: 18, 
                    color: utilNetaTurno >= 0 ? '#059669' : '#DC2626',
                    marginTop: 1
                }]}>
                    ${formatDinero(utilNetaTurno)}
                </Text>
            </View>

            {/* ✅ QUIEN GENERÓ */}
            <View style={styles.quienGenero}>
                <Text>Generado por:</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1E40AF' }}>{usuarioActual}</Text>
            </View>

            {/* ✅ FOOTER FIJO ABAJO */}
            <View style={styles.footer}>
                <Text>America/El_Salvador (UTC-6)</Text>
                <Text>Turno: 18:00 - 06:00 SV</Text>
                <Text>────────────────────────────────</Text>
            </View>
        </Page>
    </Document>
);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3">
                        🖨️ Corte de Caja - Las Toñitas
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-xl sm:text-2xl text-gray-500 hover:text-red-500 transition-colors p-2 hover:bg-gray-100 rounded-xl"
                    >
                        ×
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center gap-4 py-12 text-center">
                        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                        <p className="text-lg font-bold text-gray-700">Cargando Corte de Caja...</p>
                        <p className="text-sm text-gray-500">🕐 America/El_Salvador</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mb-8">
                            <div className="text-center p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
                                <p className="text-sm text-gray-600 mb-1">🕐 {horaActualSV}</p>
                                <p className={`text-xl font-black px-3 py-1 rounded-xl ${
                                    esTurnoNoche 
                                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' 
                                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                                }`}>
                                    {esTurnoNoche ? '🌙 TURNO NOCHE' : '☀️ TURNO DÍA'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 p-6 bg-gradient-to-br from-gray-50 to-emerald-50 rounded-2xl border-2 border-gray-200">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-red-600 mb-1">
                                        ${formatDinero(corteData?.gastosOperativos?.gastos_operativos)}
                                    </p>
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Gastos Op.</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-red-600 mb-1">
                                        ${formatDinero(corteData?.ganancias?.costos)}
                                    </p>
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Gastos Prod.</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-emerald-600 mb-1">
                                        ${formatDinero(corteData?.ventasPeriodo?.ingresos_periodo)}
                                    </p>
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Ventas Total</p>
                                </div>
                                <div className="text-center">
                                    <p className={`text-2xl font-black mb-1 ${utilNetaTurno >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        ${formatDinero(utilNetaTurno)}
                                    </p>
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Utilidad</p>
                                </div>
                            </div>

                            <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                                <p className="text-sm font-semibold text-blue-800">👤 Generado por: {usuarioActual}</p>
                            </div>
                        </div>

                        <PDFDownloadLink 
                            document={<TicketCorteCaja />} 
                            fileName={`Corte_LasTonitas_${horaActualSV.replace(/:/g, '-')}_${usuarioActual}.pdf`}
                        >
                            {({ blob, url, loading: pdfLoading, error }) => (
                                pdfLoading ? (
                                    <div className="flex items-center justify-center gap-3 p-5 bg-emerald-100 text-emerald-800 rounded-2xl font-bold text-lg border-2 border-emerald-300">
                                        <div className="w-6 h-6 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin"></div>
                                        Generando Ticket...
                                    </div>
                                ) : (
                                    <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black py-5 px-6 rounded-3xl text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border-4 border-emerald-400 flex items-center justify-center gap-3">
                                        🖨️ Descargar Ticket Las Toñitas
                                    </button>
                                )
                            )}
                        </PDFDownloadLink>

                        <div className="mt-6 pt-6 border-t-2 border-gray-200 text-center">
                            <p className="text-sm text-gray-500 font-medium">
                                📄 Este corte solo se puede generar <strong>1 vez por turno</strong>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CorteCajaModal;