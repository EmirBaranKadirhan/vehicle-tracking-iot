import React, { useEffect, useState } from 'react'
import type { IGPSData, ILocationHistory } from '../types/gps'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { useNavigate } from 'react-router'

const VEHICLE_COLORS: Record<string, { color: string; label: string }> = {
    '1': { color: '#06b6d4', label: 'Alpha-1' },
    '2': { color: '#a855f7', label: 'Alpha-2' },
    '3': { color: '#f59e0b', label: 'Alpha-3' },
}

export default function Dashboard() {
    const [vehicles, setVehicles] = useState<Record<string, IGPSData>>({})
    const [liveLog, setLiveLog] = useState<Array<IGPSData & { id: string }>>([])
    const [historyLog, setHistoryLog] = useState<ILocationHistory[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080')
        socket.onmessage = (event) => {
            const incoming = JSON.parse(event.data)
            const { id, ...gpsData } = incoming
            setVehicles(prev => ({ ...prev, [id]: gpsData }))
            setLiveLog(prev => [{ id, ...gpsData }, ...prev].slice(0, 10))
        }
        return () => socket.close()
    }, [])

    return (
        <div className="flex h-screen overflow-hidden bg-[#0b1326] text-[#dae2fd] font-['Inter']">
            <aside className="w-64 border-r border-[#131b2e] bg-[#0b1326] flex flex-col p-6 space-y-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-900/50 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-cyan-400">local_shipping</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-black font-['Space_Grotesk'] leading-tight">Fleet Alpha</h3>
                        <p className="text-[10px] text-slate-400 tracking-widest uppercase">{Object.keys(vehicles).length} Active Units</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold px-2">Vehicles</p>
                    {Object.entries(vehicles).map(([id, vehicle]) => {
                        const colorInfo = VEHICLE_COLORS[id]
                        return (
                            <div key={id} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorInfo?.color }}></span>
                                <div>
                                    <p className="text-sm font-bold font-['Space_Grotesk']">{colorInfo?.label}</p>
                                    <p className="text-[10px] text-slate-500">{vehicle.speed} km/h</p>
                                </div>
                                <span className="ml-auto text-[10px] text-emerald-400 font-bold">LIVE</span>
                            </div>
                        )
                    })}
                </div>

                <nav className="space-y-2">
                    <NavItem icon="dashboard" label="Dashboard" active onClick={() => navigate('/')} />
                    <NavItem icon="map" label="Live Map" onClick={() => navigate('/')} />
                    <NavItem icon="history" label="Historical" onClick={() => navigate('/historical')} />
                </nav>
            </aside>

            {/* buradan aşağısı hiç değişmedi, aynen bıraktım */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="h-16 border-b border-[#131b2e] px-8 flex items-center justify-between sticky top-0 bg-[#0b1326]/80 backdrop-blur-md z-50">
                    <h1 className="text-xl font-bold tracking-tighter text-cyan-500 font-['Space_Grotesk']">OBSIDIAN VELOCITY</h1>
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-emerald-400">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        System: Nominal
                    </div>
                </header>

                <div className="p-8 space-y-8">
                    <header>
                        <h2 className="text-4xl font-['Space_Grotesk'] font-bold tracking-tight">Vehicle Dashboard</h2>
                        <p className="text-slate-400">Real-time telemetry — <span className="text-cyan-400 font-bold">{Object.keys(vehicles).length} vehicles tracked</span></p>
                    </header>

                    {Object.entries(vehicles).map(([id, vehicle]) => {
                        const colorInfo = VEHICLE_COLORS[id]
                        return (
                            <div key={id} className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colorInfo?.color }}></span>
                                    <h3 className="text-lg font-bold font-['Space_Grotesk']" style={{ color: colorInfo?.color }}>{colorInfo?.label}</h3>
                                </div>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12 lg:col-span-3 bg-[#131b2e] p-6 rounded-2xl border border-white/5 flex flex-col items-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Speed</p>
                                        <div className="relative w-32 h-32 flex items-center justify-center">
                                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                <circle cx="64" cy="64" r="56" fill="transparent" stroke="#1e293b" strokeWidth="8" />
                                                <circle cx="64" cy="64" r="56" fill="transparent" stroke={colorInfo?.color} strokeWidth="8"
                                                    strokeDasharray="352" strokeDashoffset={352 - (352 * vehicle.speed) / 120}
                                                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }} />
                                            </svg>
                                            <div className="text-center">
                                                <span className="text-3xl font-black">{vehicle.speed}</span>
                                                <p className="text-[10px] font-bold uppercase" style={{ color: colorInfo?.color }}>km/h</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-12 md:col-span-3 bg-[#131b2e] p-6 rounded-2xl border border-white/5">
                                        <div className="flex justify-between items-start mb-4">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Altitude</p>
                                            <span className="material-symbols-outlined text-orange-400">terrain</span>
                                        </div>
                                        <h3 className="text-4xl font-black font-['Space_Grotesk']">{vehicle.altitude}m</h3>
                                    </div>
                                    <div className="col-span-12 md:col-span-3 bg-[#131b2e] p-6 rounded-2xl border border-white/5">
                                        <div className="flex justify-between items-start mb-4">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Heading</p>
                                            <span className="material-symbols-outlined" style={{ color: colorInfo?.color, transform: `rotate(${vehicle.direction}deg)`, transition: 'transform 0.5s', display: 'inline-block' }}>navigation</span>
                                        </div>
                                        <h3 className="text-4xl font-black font-['Space_Grotesk']">{vehicle.direction}°</h3>
                                    </div>
                                    <div className="col-span-12 md:col-span-3 bg-[#131b2e] p-6 rounded-2xl border border-white/5">
                                        <div className="flex justify-between items-start mb-4">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</p>
                                            <span className="material-symbols-outlined text-emerald-400">sensors</span>
                                        </div>
                                        <h3 className="text-2xl font-black font-['Space_Grotesk'] text-emerald-400">{vehicle.speed > 0 ? 'Moving' : 'Idle'}</h3>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    <div className="bg-[#131b2e] rounded-2xl overflow-hidden border border-white/5">
                        <div className="p-4 border-b border-white/5">
                            <h3 className="font-bold font-['Space_Grotesk']">Live Map</h3>
                        </div>
                        <MapContainer center={[39.6484, 27.8826]} zoom={14} style={{ height: '450px', width: '100%' }} zoomControl={true}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {Object.entries(vehicles).map(([id, vehicle]) => (
                                <Marker key={id} position={[vehicle.lat, vehicle.long]} />
                            ))}
                        </MapContainer>
                    </div>

                    <section className="bg-[#131b2e] rounded-2xl overflow-hidden border border-white/5">
                        <div className="p-6 border-b border-white/5 flex justify-between">
                            <h3 className="font-bold uppercase tracking-widest text-xs">Telemetry Log Stream</h3>
                            <span className="text-[10px] text-slate-500">Live Updates via WebSocket</span>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-black/20 text-slate-500 uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Vehicle</th>
                                    <th className="px-6 py-4">Velocity</th>
                                    <th className="px-6 py-4">Altitude</th>
                                    <th className="px-6 py-4">Position</th>
                                </tr>
                            </thead>
                            <tbody>
                                {liveLog.map((log, i) => {
                                    const colorInfo = VEHICLE_COLORS[log.id]
                                    return (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorInfo?.color }}></span>
                                                <span style={{ color: colorInfo?.color }}>{colorInfo?.label}</span>
                                            </td>
                                            <td className="px-6 py-4 font-mono">{log.speed} km/h</td>
                                            <td className="px-6 py-4 font-mono">{log.altitude} m</td>
                                            <td className="px-6 py-4 text-slate-400 text-xs font-mono">{log.lat.toFixed(4)}, {log.long.toFixed(4)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </section>
                </div>
            </main>
        </div>
    )
}

function NavItem({ icon, label, active = false, onClick }: { icon: string; label: string; active?: boolean; onClick?: () => void }) {
    return (
        <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${active ? 'bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-500' : 'text-slate-400 hover:bg-white/5'}`}>
            <span className="material-symbols-outlined">{icon}</span>
            <span className="font-['Space_Grotesk'] text-sm uppercase tracking-widest">{label}</span>
        </div>
    )
}