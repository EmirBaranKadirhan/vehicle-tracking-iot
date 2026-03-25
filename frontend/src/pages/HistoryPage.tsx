import React, { useEffect, useState } from 'react'
import { getHistory } from '../api/history'
import type { ILocationHistory } from '../types/gps'
import { useNavigate } from 'react-router'
import { VEHICLE_COLORS } from '../constants/vehicles'


export default function HistoryPage() {
    const [data, setData] = useState<ILocationHistory[]>([])
    const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>(undefined)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const res = await getHistory(selectedVehicle)
            setData(res)
        }
        fetchData()
    }, [selectedVehicle])

    return (
        <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-['Inter']">

            {/* Top Bar */}
            <header className="h-16 border-b border-[#131b2e] px-8 flex items-center justify-between sticky top-0 bg-[#0b1326]/80 backdrop-blur-md z-50">
                <h1 className="text-xl font-bold tracking-tighter text-cyan-500 font-['Space_Grotesk']">OBSIDIAN VELOCITY</h1>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-sm font-bold uppercase tracking-widest"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Dashboard
                </button>
            </header>

            <div className="p-8 space-y-6">
                <header>
                    <h2 className="text-4xl font-['Space_Grotesk'] font-bold tracking-tight">Location History</h2>
                    <p className="text-slate-400">Last <span className="text-cyan-400 font-bold">{data.length} records</span></p>
                </header>

                {/* Filtre Butonları */}
                <div className="flex gap-3 flex-wrap">

                    {/* ALL butonu — selectedVehicle undefined olunca aktif */}
                    <button
                        onClick={() => setSelectedVehicle(undefined)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${selectedVehicle === undefined
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500'
                                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        All Vehicles
                    </button>

                    {/* VEHICLE_COLORS'tan map — her araç için bir buton */}
                    {Object.entries(VEHICLE_COLORS).map(([id, info]) => (
                        <button
                            key={id}
                            onClick={() => setSelectedVehicle(id)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${selectedVehicle === id
                                    ? 'bg-white/10 border'
                                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                                }`}
                            style={selectedVehicle === id ? { color: info.color, borderColor: info.color } : {}}
                        >
                            {info.label}
                        </button>
                    ))}
                </div>

                <section className="bg-[#131b2e] rounded-2xl overflow-hidden border border-white/5">
                    <div className="p-6 border-b border-white/5 flex justify-between">
                        <h3 className="font-bold uppercase tracking-widest text-xs">Last Records</h3>
                        <span className="text-[10px] text-slate-500">GET /api/history</span>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-black/20 text-slate-500 uppercase text-[10px] tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Vehicle</th>
                                <th className="px-6 py-4">Speed</th>
                                <th className="px-6 py-4">Altitude</th>
                                <th className="px-6 py-4">Position</th>
                                <th className="px-6 py-4">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((log) => {
                                const colorInfo = VEHICLE_COLORS[log.vehicleId]
                                return (
                                    <tr key={log._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorInfo?.color }}></span>
                                            <span style={{ color: colorInfo?.color }}>{colorInfo?.label}</span>
                                        </td>
                                        <td className="px-6 py-4 font-mono">{log.speed} km/h</td>
                                        <td className="px-6 py-4 font-mono">{log.altitude} m</td>
                                        <td className="px-6 py-4 text-slate-400 text-xs font-mono">{log.lat.toFixed(4)}, {log.long.toFixed(4)}</td>
                                        <td className="px-6 py-4 text-slate-400 text-xs font-mono">
                                            {new Date(log.createdAt).toLocaleTimeString('tr-TR')}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    )
}