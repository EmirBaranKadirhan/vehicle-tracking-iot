import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { getVehicles, addVehicle, deleteVehicle } from '../api/vehicles'
import type { IVehicle } from '../types/vehicles'

export default function VehicleManagement() {
    const [vehicles, setVehicles] = useState<IVehicle[]>([])
    const [loading, setLoading] = useState(true)
    const [vehicleId, setVehicleId] = useState('')
    const [vehicleName, setVehicleName] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const fetchVehicles = async () => {
        try {
            const data = await getVehicles()
            setVehicles(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVehicles()
    }, [])

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setSubmitting(true)
        try {
            await addVehicle(vehicleId, vehicleName)
            setVehicleId('')
            setVehicleName('')
            setSuccess('Vehicle registered successfully.')
            await fetchVehicles()
        } catch (err: any) {
            setError(err?.response?.data?.message ?? 'An error occurred.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        try {
            await deleteVehicle(id)
            await fetchVehicles()
        } catch (err) {
            console.error(err)
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="flex min-h-screen bg-[#060e20] text-[#dae2fd] font-['Inter'] overflow-x-hidden">
            <Sidebar />

            <main className="ml-64 flex-1 p-8 space-y-8">

                {/* Header */}
                <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/60 mb-2 font-['Space_Grotesk']">Fleet Intelligence</p>
                    <h2 className="text-4xl font-black font-['Space_Grotesk'] tracking-tight">Vehicle Management</h2>
                    <p className="text-slate-400 mt-2 text-sm">Register new vehicles and manage your fleet roster.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Sol — Registration Desk */}
                    <section className="lg:col-span-4 space-y-4">
                        <div className="p-8 rounded-2xl relative overflow-hidden" style={{
                            background: 'rgba(34,42,61,0.7)',
                            backdropFilter: 'blur(12px)',
                            borderTop: '1px solid rgba(76,215,246,0.2)',
                            borderLeft: '1px solid rgba(76,215,246,0.1)',
                        }}>
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-400/10 blur-[60px] rounded-full pointer-events-none" />

                            <div className="flex items-center gap-3 mb-8">
                                <span className="w-1 h-6 bg-cyan-400 rounded-full" />
                                <h3 className="text-base font-black font-['Space_Grotesk'] uppercase tracking-widest">Registration Desk</h3>
                            </div>

                            <form onSubmit={handleAdd} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-['Space_Grotesk']">Vehicle Name</label>
                                    <input
                                        type="text"
                                        value={vehicleName}
                                        onChange={e => setVehicleName(e.target.value)}
                                        placeholder="e.g. Alpha"
                                        required
                                        className="w-full bg-transparent border-b border-slate-700 focus:border-cyan-400 focus:outline-none transition-all py-3 px-1 text-sm text-white placeholder:text-slate-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-['Space_Grotesk']">Vehicle ID</label>
                                    <input
                                        type="text"
                                        value={vehicleId}
                                        onChange={e => setVehicleId(e.target.value)}
                                        placeholder="e.g. TRUCK-004"
                                        required
                                        className="w-full bg-transparent border-b border-slate-700 focus:border-cyan-400 focus:outline-none transition-all py-3 px-1 text-sm text-white placeholder:text-slate-600"
                                    />
                                </div>

                                {error && <p className="text-red-400 text-xs">{error}</p>}
                                {success && <p className="text-emerald-400 text-xs">{success}</p>}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 rounded-xl font-black font-['Space_Grotesk'] uppercase tracking-widest text-sm transition-all disabled:opacity-50 active:scale-[0.98]"
                                    style={{ background: 'rgba(76,215,246,0.15)', color: '#4cd7f6', border: '1px solid rgba(76,215,246,0.3)' }}
                                >
                                    {submitting ? 'Registering...' : 'Add Vehicle'}
                                </button>
                            </form>
                        </div>

                        {/* Info card */}
                        <div className="p-5 rounded-xl flex items-start gap-4" style={{
                            background: 'rgba(23,31,51,0.7)',
                            border: '1px solid rgba(255,184,115,0.15)',
                        }}>
                            <span className="material-symbols-outlined text-orange-400 text-lg mt-0.5">info</span>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                <span className="text-orange-400 font-bold">Note: </span>
                                Registered vehicles will immediately start receiving telemetry data from the simulator.
                            </p>
                        </div>
                    </section>

                    {/* Sağ — Fleet Roster */}
                    <section className="lg:col-span-8">
                        <div className="rounded-2xl overflow-hidden" style={{
                            background: 'rgba(23,31,51,0.7)',
                            border: '1px solid rgba(76,215,246,0.08)',
                        }}>
                            <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center">
                                <h3 className="font-black font-['Space_Grotesk'] text-sm uppercase tracking-widest">Fleet Roster</h3>
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-['Space_Grotesk']">
                                    {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {loading ? (
                                <div className="py-20 text-center text-slate-500 text-sm">Loading...</div>
                            ) : vehicles.length === 0 ? (
                                <div className="py-20 text-center text-slate-500 text-sm">No vehicles registered yet.</div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-black/20 text-slate-500 uppercase text-[10px] tracking-widest font-['Space_Grotesk']">
                                        <tr>
                                            <th className="px-8 py-4">Vehicle Name</th>
                                            <th className="px-8 py-4">Vehicle ID</th>
                                            <th className="px-8 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {vehicles.map(v => (
                                            <tr key={v.vehicleId} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(76,215,246,0.1)' }}>
                                                            <span className="material-symbols-outlined text-cyan-400 text-sm">local_shipping</span>
                                                        </div>
                                                        <span className="font-bold font-['Space_Grotesk'] text-sm">{v.vehicleName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 font-mono text-slate-400 text-xs">{v.vehicleId}</td>
                                                <td className="px-8 py-5 text-right">
                                                    <button
                                                        onClick={() => handleDelete(v.vehicleId)}
                                                        disabled={deletingId === v.vehicleId}
                                                        className="flex items-center gap-2 ml-auto px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 hover:bg-red-500/10"
                                                        style={{ color: '#ff4d6d', border: '1px solid rgba(255,77,109,0.2)' }}
                                                    >
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                        {deletingId === v.vehicleId ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </section>

                </div>
            </main>

            <div className="fixed top-0 right-0 w-96 h-96 bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-0 left-20 w-80 h-80 bg-indigo-900/10 blur-[100px] rounded-full pointer-events-none -z-10" />
        </div>
    )
}