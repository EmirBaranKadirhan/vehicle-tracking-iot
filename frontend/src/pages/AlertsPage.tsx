import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import instance from '../api/client'
import Sidebar from '../components/Sidebar'


interface IAlert {
    _id: string
    vehicleId: string
    type: 'speed_violation' | 'offline' | 'idle'
    message: string
    speed?: number
    createdAt: string
}

const VEHICLE_LABELS: Record<string, string> = {
    '1': 'Alpha — Ayvalık',
    '2': 'Beta — Mersin',
    '3': 'Zeta — İzmir',
}

const ALERT_CONFIG = {
    speed_violation: {
        label: 'Hız İhlali',
        color: '#ff4d6d',
        bg: 'rgba(255,77,109,0.08)',
        border: '#ff4d6d',
        icon: 'speed',
    },
    offline: {
        label: 'Bağlantı Kesildi',
        color: '#facc15',
        bg: 'rgba(250,204,21,0.08)',
        border: '#facc15',
        icon: 'wifi_off',
    },
    idle: {
        label: 'Araç Hareketsiz',
        color: '#4cd7f6',
        bg: 'rgba(76,215,246,0.08)',
        border: '#4cd7f6',
        icon: 'pause_circle',
    },
}

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<IAlert[]>([])
    const [filter, setFilter] = useState<string>('all')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true)
            try {
                const params = filter !== 'all' ? `?type=${filter}` : ''
                const { data } = await instance.get(`/api/alerts${params}`)
                setAlerts(data.response)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchAlerts()
    }, [filter])

    const counts = {
        speed_violation: alerts.filter(a => a.type === 'speed_violation').length,
        offline: alerts.filter(a => a.type === 'offline').length,
        idle: alerts.filter(a => a.type === 'idle').length,
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div className="flex min-h-screen bg-[#060e20] text-[#dae2fd] font-['Inter'] overflow-x-hidden">

            {/* Sidebar */}
            <Sidebar />

            {/* Main */}
            <main className="ml-64 flex-1 p-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/60 mb-2 font-['Space_Grotesk']">Fleet Intelligence</p>
                        <h2 className="text-4xl font-black font-['Space_Grotesk'] tracking-tight">Aktif Alarmlar</h2>
                        <p className="text-slate-400 mt-2 text-sm">Araç filonuza ait gerçek zamanlı uyarılar ve sistem istisnaları.</p>
                    </div>

                    {/* Stat Cards */}
                    <div className="flex gap-3">
                        {[
                            { label: 'Hız İhlali', count: counts.speed_violation, color: '#ff4d6d' },
                            { label: 'Offline', count: counts.offline, color: '#facc15' },
                            { label: 'Hareketsiz', count: counts.idle, color: '#4cd7f6' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="px-5 py-4 rounded-xl min-w-[110px]"
                                style={{
                                    background: 'rgba(34,42,61,0.7)',
                                    backdropFilter: 'blur(12px)',
                                    borderTop: `1px solid ${stat.color}40`,
                                    borderLeft: `1px solid ${stat.color}20`,
                                }}
                            >
                                <p className="text-[10px] uppercase tracking-widest font-['Space_Grotesk'] mb-1" style={{ color: stat.color }}>{stat.label}</p>
                                <p className="text-3xl font-black font-['Space_Grotesk']">{stat.count.toString().padStart(2, '0')}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 flex-wrap">
                    {[
                        { value: 'all', label: 'Tümü' },
                        { value: 'speed_violation', label: 'Hız İhlali' },
                        { value: 'offline', label: 'Offline' },
                        { value: 'idle', label: 'Hareketsiz' },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setFilter(tab.value)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest font-['Space_Grotesk'] transition-all ${filter === tab.value
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500'
                                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Alert List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-20 text-slate-500 text-sm">Yükleniyor...</div>
                    ) : alerts.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 text-sm">Kayıt bulunamadı.</div>
                    ) : alerts.map((alert) => {
                        const config = ALERT_CONFIG[alert.type]
                        return (
                            <div
                                key={alert._id}
                                className="relative flex items-center gap-6 p-5 rounded-xl transition-all duration-200 hover:bg-white/5"
                                style={{
                                    background: config.bg,
                                    borderLeft: `4px solid ${config.border}`,
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                {/* Icon */}
                                <div
                                    className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                                    style={{ background: `${config.color}15`, border: `1px solid ${config.color}30` }}
                                >
                                    <span className="material-symbols-outlined text-xl" style={{ color: config.color }}>{config.icon}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-['Space_Grotesk'] mb-1">Araç</p>
                                        <p className="font-bold font-['Space_Grotesk'] text-sm">{VEHICLE_LABELS[alert.vehicleId] ?? `Vehicle ${alert.vehicleId}`}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-['Space_Grotesk'] mb-1">Alarm Tipi</p>
                                        <p className="font-semibold text-sm" style={{ color: config.color }}>{config.label}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-['Space_Grotesk'] mb-1">Mesaj</p>
                                        <p className="text-sm text-slate-300 truncate">{alert.message}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-['Space_Grotesk'] mb-1">Zaman</p>
                                        <p className="text-xs font-mono text-slate-400">
                                            {new Date(alert.createdAt).toLocaleString('tr-TR')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Severity Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                    <div
                        className="lg:col-span-2 p-6 rounded-2xl"
                        style={{
                            background: 'rgba(34,42,61,0.7)',
                            backdropFilter: 'blur(12px)',
                            borderTop: '1px solid rgba(76,215,246,0.2)',
                            borderLeft: '1px solid rgba(76,215,246,0.1)',
                        }}
                    >
                        <h3 className="font-bold font-['Space_Grotesk'] text-lg mb-6">Alarm Dağılımı</h3>
                        <div className="space-y-5">
                            {[
                                { label: 'Hız İhlali', count: counts.speed_violation, color: '#ff4d6d' },
                                { label: 'Bağlantı Kesildi', count: counts.offline, color: '#facc15' },
                                { label: 'Araç Hareketsiz', count: counts.idle, color: '#4cd7f6' },
                            ].map((item) => {
                                const total = alerts.length || 1
                                const pct = Math.round((item.count / total) * 100)
                                return (
                                    <div key={item.label}>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-xs text-slate-400">{item.label}</span>
                                            <span className="text-xs font-bold" style={{ color: item.color }}>{pct}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%`, background: item.color }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* AI Yorum Paneli */}
                    <div
                        className="p-6 rounded-2xl flex flex-col justify-between"
                        style={{
                            background: 'rgba(34,42,61,0.7)',
                            backdropFilter: 'blur(12px)',
                            borderTop: '1px solid rgba(76,215,246,0.2)',
                            borderLeft: '1px solid rgba(76,215,246,0.1)',
                        }}
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-cyan-400">auto_awesome</span>
                                <h3 className="font-bold font-['Space_Grotesk'] text-sm uppercase tracking-widest text-cyan-400">AI Analiz</h3>
                            </div>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                Filo verilerinize göre otomatik analiz burada görünecek. Bu özellik yakında eklenecek.
                            </p>
                        </div>
                        <div className="mt-6 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                            <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-['Space_Grotesk'] mb-2">Sistem Durumu</p>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <p className="text-xs text-slate-300">Tüm sistemler nominal</p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* BG blur */}
            <div className="fixed top-0 right-0 w-96 h-96 bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-0 left-20 w-80 h-80 bg-indigo-900/10 blur-[100px] rounded-full pointer-events-none -z-10" />
        </div>
    )
}