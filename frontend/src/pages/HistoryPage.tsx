import React, { useEffect, useState } from 'react'
import { getHistory } from '../api/history'
import type { ILocationHistory } from '../types/gps'
import { useNavigate } from 'react-router'
import { useVehicles } from '../hooks/useVehicles'

import Sidebar from '../components/Sidebar'

export default function HistoryPage() {
    const [data, setData] = useState<ILocationHistory[]>([])
    const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>(undefined)
    const navigate = useNavigate()

    const vehicleList = useVehicles()

    useEffect(() => {
        const fetchData = async () => {
            const res = await getHistory(selectedVehicle)
            setData(res)
        }
        fetchData()
    }, [selectedVehicle])

    return (
        <div className="flex min-h-screen bg-[#0b1326] text-[#dae2fd] font-['Inter']">

            <Sidebar />

            <div className="ml-64 flex-1 p-8 space-y-6">
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

                <section className="bg-[#131b2e] rounded-2xl overflow-hidden border border-white/5">
                    <div className="p-6 border-b border-white/5 flex justify-between">
                        <h3 className="font-bold uppercase tracking-widest text-xs">Last Records</h3>

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
                                const colorInfo = vehicleList.find(v => v.vehicleId === log.vehicleId)
                                return (
                                    <tr key={log._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorInfo?.color }}></span>
                                            <span style={{ color: colorInfo?.color }}>{colorInfo?.vehicleName}</span>
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