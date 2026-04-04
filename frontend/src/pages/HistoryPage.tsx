import React, { useEffect, useState } from 'react'
import { getHistory } from '../api/history'
import type { ILocationHistory } from '../types/gps'
import { useVehicles } from '../hooks/useVehicles'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import Sidebar from '../components/Sidebar'

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap()
    useEffect(() => {
        map.setView(center, zoom)
    }, [center[0], center[1], zoom])
    return null
}

export default function HistoryPage() {
    const [data, setData] = useState<ILocationHistory[]>([])
    const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>(undefined)
    const vehicleList = useVehicles()

    useEffect(() => {
        const fetchData = async () => {
            const res = await getHistory(selectedVehicle)
            setData(res)
        }
        fetchData()
    }, [selectedVehicle])

    // Her araç için konum grubu
    const groupedByVehicle = data.reduce<Record<string, ILocationHistory[]>>((acc, log) => {
        if (!acc[log.vehicleId]) acc[log.vehicleId] = []
        acc[log.vehicleId].push(log)
        return acc
    }, {})

    const mapCenter: [number, number] = data.length > 0
        ? [data[0].lat, data[0].long]
        : [39.0, 35.0]
    const mapZoom = selectedVehicle ? 12 : 6

    return (
        <div className="flex min-h-screen bg-[#060e20] text-[#dae2fd] font-['Inter']">
            <Sidebar />

            <main className="ml-64 flex-1 p-8 space-y-6">

                <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/60 mb-2 font-['Space_Grotesk']">Fleet Intelligence</p>
                    <h2 className="text-4xl font-black font-['Space_Grotesk'] tracking-tight">Location History</h2>
                    <p className="text-slate-400 mt-1 text-sm">
                        Last <span className="text-cyan-400 font-bold">{data.length}</span> records
                    </p>
                </div>

                <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={() => setSelectedVehicle(undefined)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${selectedVehicle === undefined
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500'
                            : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        All Vehicles
                    </button>
                    {vehicleList.map((v) => (
                        <button
                            key={v.vehicleId}
                            onClick={() => setSelectedVehicle(v.vehicleId)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${selectedVehicle === v.vehicleId
                                ? 'bg-white/10 border'
                                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                                }`}
                            style={selectedVehicle === v.vehicleId ? { color: v.color, borderColor: v.color } : {}}
                        >
                            {v.vehicleName}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* Sol — Timeline */}
                    <div className="flex-1 min-w-0">
                        <div className="relative pl-8">
                            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-400 via-cyan-400/20 to-transparent" />

                            {data.length === 0 ? (
                                <div className="py-20 text-center text-slate-500 text-sm">No records found.</div>
                            ) : data.map((log) => {
                                const colorInfo = vehicleList.find(v => v.vehicleId === log.vehicleId)
                                const color = colorInfo?.color ?? '#4cd7f6'
                                const isAlert = log.speed > 90

                                return (
                                    <div key={log._id} className="relative mb-6">
                                        <div
                                            className="absolute -left-[24px] top-4 w-4 h-4 rounded-full border-4 border-[#060e20]"
                                            style={{
                                                background: isAlert ? '#ff4d6d' : color,
                                                boxShadow: `0 0 10px ${isAlert ? '#ff4d6d' : color}80`,
                                            }}
                                        />
                                        <div
                                            className="p-5 rounded-xl transition-all hover:bg-white/[0.03]"
                                            style={{
                                                background: 'rgba(34,42,61,0.5)',
                                                backdropFilter: 'blur(12px)',
                                                borderLeft: `2px solid ${isAlert ? '#ff4d6d' : color}40`,
                                                borderTop: '1px solid rgba(76,215,246,0.08)',
                                            }}
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-center gap-5">
                                                    <span className="material-symbols-outlined text-2xl" style={{ color: isAlert ? '#ff4d6d' : color }}>
                                                        {isAlert ? 'warning' : log.speed === 0 ? 'stop_circle' : 'check_circle'}
                                                    </span>
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-black font-['Space_Grotesk'] text-xl tracking-tighter">
                                                                {new Date(log.createdAt).toLocaleTimeString('tr-TR')}
                                                            </span>
                                                            {isAlert && (
                                                                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest"
                                                                    style={{ background: 'rgba(255,77,109,0.1)', color: '#ff4d6d', border: '1px solid rgba(255,77,109,0.2)' }}>
                                                                    Speed Violation
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-1 text-slate-400 text-[10px] uppercase tracking-widest font-['Space_Grotesk']">
                                                            <span style={{ color }}>{colorInfo?.vehicleName ?? log.vehicleId}</span>
                                                            <span style={{ color: isAlert ? '#ff4d6d' : 'inherit' }}>{log.speed} km/h</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-right">
                                                    <div>
                                                        <p className="text-[9px] text-slate-500 uppercase tracking-widest">Position</p>
                                                        <p className="text-xs font-mono">{log.lat.toFixed(4)}, {log.long.toFixed(4)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-slate-500 uppercase tracking-widest">Altitude</p>
                                                        <p className="text-xs font-mono">{log.altitude} m</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Sağ — Harita */}
                    <div className="w-full lg:w-80 shrink-0 sticky top-8">
                        <div className="rounded-xl overflow-hidden" style={{
                            border: '1px solid rgba(76,215,246,0.1)',
                            boxShadow: '0 20px 40px rgba(6,14,32,0.4)',
                        }}>
                            <div className="px-4 py-3 flex items-center justify-between" style={{ background: '#131b2e', borderBottom: '1px solid rgba(76,215,246,0.08)' }}>
                                <h3 className="text-[10px] font-black font-['Space_Grotesk'] uppercase tracking-widest text-cyan-400">
                                    Spatial Preview
                                </h3>
                                <span className="text-[10px] text-slate-500 font-mono">{data.length} points</span>
                            </div>

                            <MapContainer
                                center={mapCenter}
                                zoom={mapZoom}
                                style={{ height: '320px', width: '100%' }}
                                zoomControl={false}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <MapUpdater center={mapCenter} zoom={mapZoom} />

                                {/* Her araç için ayrı polyline + marker */}
                                {Object.entries(groupedByVehicle).map(([vehicleId, logs]) => {
                                    const colorInfo = vehicleList.find(v => v.vehicleId === vehicleId)
                                    const color = colorInfo?.color ?? '#4cd7f6'
                                    const positions: [number, number][] = logs.map(l => [l.lat, l.long])
                                    const latest = logs[0]

                                    return (
                                        <React.Fragment key={vehicleId}>
                                            {positions.length > 1 && (
                                                <Polyline positions={positions} color={color} weight={2} opacity={0.7} />
                                            )}
                                            <Marker position={[latest.lat, latest.long]}>
                                                <Popup>
                                                    <strong style={{ color }}>{colorInfo?.vehicleName ?? vehicleId}</strong>
                                                    <br />
                                                    {latest.speed} km/h — {new Date(latest.createdAt).toLocaleTimeString('tr-TR')}
                                                </Popup>
                                            </Marker>
                                        </React.Fragment>
                                    )
                                })}
                            </MapContainer>

                            <div className="p-4 space-y-3" style={{ background: '#131b2e' }}>
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] text-slate-500 uppercase tracking-widest">Tracking</span>
                                    <span className="text-[10px] font-bold font-['Space_Grotesk'] text-cyan-400">
                                        {selectedVehicle
                                            ? vehicleList.find(v => v.vehicleId === selectedVehicle)?.vehicleName ?? selectedVehicle
                                            : 'All Vehicles'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] text-slate-500 uppercase tracking-widest">Max Speed</span>
                                    <span className="text-[10px] font-bold font-mono"
                                        style={{ color: Math.max(...data.map(d => d.speed), 0) > 90 ? '#ff4d6d' : '#94de2d' }}>
                                        {data.length > 0 ? Math.max(...data.map(d => d.speed)) : 0} km/h
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] text-slate-500 uppercase tracking-widest">Avg Speed</span>
                                    <span className="text-[10px] font-bold font-mono text-slate-300">
                                        {data.length > 0
                                            ? Math.round(data.reduce((sum, d) => sum + d.speed, 0) / data.length)
                                            : 0} km/h
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="fixed top-0 right-0 w-96 h-96 bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-0 left-20 w-80 h-80 bg-indigo-900/10 blur-[100px] rounded-full pointer-events-none -z-10" />
        </div>
    )
}