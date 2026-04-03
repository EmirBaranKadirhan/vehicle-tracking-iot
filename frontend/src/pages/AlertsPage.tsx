import React, { useEffect, useState } from 'react'
import instance from '../api/client'
import Sidebar from '../components/Sidebar'
import type { IAlert, IAiCards } from '../types/alert'
import { getAiSummary } from '@/api/analytics'
import { useVehicles } from '../hooks/useVehicles'



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
    const [page, setPage] = useState(1)
    const [limit] = useState(5)            // limit hep sabit kalacagi icin "set" kullanmadik !!
    const [total, setTotal] = useState(0)
    const [typeCounts, setTypeCounts] = useState({
        speed_violation: 0,
        offline: 0,
        idle: 0,
    })
    const [aiCards, setAiCards] = useState<IAiCards[]>([])
    const [aiLoading, setAiLoading] = useState(false)

    const [activeCard, setActiveCard] = useState(0)

    const vehicleList = useVehicles()

    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true)
            try {
                const params = filter !== 'all' ? `?type=${filter}&page=${page}&limit=${limit}` : `?page=${page}&limit=${limit}`    // sayfa baslar baslamaz yukaridaki state degerlerini alirlar
                const { data } = await instance.get(`/api/alerts${params}`)
                setAlerts(data.response)
                setTotal(data.total)

                // const { speedViolationCounts, offlineCounts, idleCounts } = data
                setTypeCounts({
                    speed_violation: data.speedViolationCounts,
                    offline: data.offlineCounts,
                    idle: data.idleCounts,
                })

            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchAlerts()
    }, [filter, page])


    const handleAiAnalysis = async () => {

        setAiLoading(true)

        try {

            const cards = await getAiSummary()
            setAiCards(cards)

        } catch (error) {
            console.error(error)
        } finally {
            setAiLoading(false)
        }

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
                            { label: 'Hız İhlali', count: typeCounts.speed_violation, color: '#ff4d6d' },
                            { label: 'Offline', count: typeCounts.offline, color: '#facc15' },
                            { label: 'Hareketsiz', count: typeCounts.idle, color: '#4cd7f6' },
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
                            onClick={() => {
                                setFilter(tab.value)
                                setPage(1)              // filter degistiginde buranin da sifirlanmasi lazim
                            }}
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
                                        <p className="font-bold font-['Space_Grotesk'] text-sm">{vehicleList.find(v => v.vehicleId === alert.vehicleId)?.vehicleName ?? `Vehicle ${alert.vehicleId}`}</p>
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

                {/* Pagination */}
                {total > limit && (
                    <div className="flex items-center justify-between py-4">
                        <p className="text-[11px] text-slate-500 uppercase tracking-widest font-['Space_Grotesk']">
                            <span className="text-slate-300 font-bold">{(page - 1) * limit + 1}–{Math.min(page * limit, total)}</span>
                            {' '}/ {total} kayıt
                        </p>
                        <div className="flex items-center gap-1">
                            {/* İlk sayfa */}
                            <button
                                onClick={() => setPage(1)}
                                disabled={page === 1}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <span className="material-symbols-outlined text-sm">first_page</span>
                            </button>

                            {/* Önceki */}
                            <button
                                onClick={() => setPage(p => p - 1)}
                                disabled={page === 1}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>

                            {/* Sayfa numaraları */}
                            {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === Math.ceil(total / limit) || Math.abs(p - page) <= 1)
                                .reduce<(number | string)[]>((acc, p, i, arr) => {
                                    if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('...')
                                    acc.push(p)
                                    return acc
                                }, [])
                                .map((p, i) =>
                                    p === '...' ? (
                                        <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-slate-600 text-sm">···</span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p as number)}
                                            className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold font-['Space_Grotesk'] transition-all"
                                            style={{
                                                background: page === p ? 'rgba(76,215,246,0.15)' : 'transparent',
                                                color: page === p ? '#4cd7f6' : '#475569',
                                                border: page === p ? '1px solid rgba(76,215,246,0.4)' : '1px solid transparent',
                                            }}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}

                            {/* Sonraki */}
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page === Math.ceil(total / limit)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>

                            {/* Son sayfa */}
                            <button
                                onClick={() => setPage(Math.ceil(total / limit))}
                                disabled={page === Math.ceil(total / limit)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <span className="material-symbols-outlined text-sm">last_page</span>
                            </button>
                        </div>
                    </div>
                )}

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
                                { label: 'Hız İhlali', count: typeCounts.speed_violation, color: '#ff4d6d' },
                                { label: 'Bağlantı Kesildi', count: typeCounts.offline, color: '#facc15' },
                                { label: 'Araç Hareketsiz', count: typeCounts.idle, color: '#4cd7f6' },
                            ].map((item) => {
                                const totalCount = typeCounts.speed_violation + typeCounts.offline + typeCounts.idle || 1
                                const pct = Math.round((item.count / totalCount) * 100)
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
                    <div className="p-6 rounded-2xl flex flex-col gap-4" style={{
                        background: 'rgba(34,42,61,0.7)',
                        backdropFilter: 'blur(12px)',
                        borderTop: '1px solid rgba(76,215,246,0.2)',
                        borderLeft: '1px solid rgba(76,215,246,0.1)',
                    }}>
                        {/* Başlık */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-cyan-400">auto_awesome</span>
                                <h3 className="font-bold font-['Space_Grotesk'] text-sm uppercase tracking-widest text-cyan-400">AI Analysis</h3>
                            </div>
                            <button
                                onClick={handleAiAnalysis}
                                disabled={aiLoading}
                                className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                                style={{ background: 'rgba(76,215,246,0.1)', color: '#4cd7f6', border: '1px solid rgba(76,215,246,0.3)' }}
                            >
                                {aiLoading ? 'Analyzing...' : 'Run Analysis'}
                            </button>
                        </div>

                        {/* Carousel */}
                        {aiCards.length === 0 && !aiLoading && (
                            <p className="text-slate-500 text-xs leading-relaxed">
                                Filo verilerinize göre otomatik analiz için "Analiz Et" butonuna tıklayın.
                            </p>
                        )}

                        {aiLoading && (
                            <div className="flex items-center gap-2 py-4">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        )}

                        {aiCards.length > 0 && (() => {
                            const SEVERITY_COLORS = {
                                critical: '#ff4d6d',
                                warning: '#ffb873',
                                info: '#4cd7f6',
                            }

                            const card = aiCards[activeCard]
                            const color = SEVERITY_COLORS[card.severity]

                            return (
                                <div className="flex flex-col gap-3">
                                    {/* Kart */}
                                    <div className="p-4 rounded-xl transition-all" style={{
                                        background: `${color}08`,
                                        border: `1px solid ${color}25`,
                                    }}>
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>{card.title}</p>
                                            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase" style={{ color, background: `${color}15` }}>
                                                {card.severity}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-300 leading-relaxed">{card.insight}</p>
                                    </div>

                                    {/* Dot navigasyon */}
                                    <div className="flex items-center justify-center gap-2">
                                        {aiCards.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActiveCard(i)}
                                                className="w-2 h-2 rounded-full transition-all"
                                                style={{
                                                    background: i === activeCard ? '#4cd7f6' : 'rgba(76,215,246,0.2)',
                                                    transform: i === activeCard ? 'scale(1.3)' : 'scale(1)',
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        })()}
                    </div>
                </div>
            </main>

            {/* BG blur */}
            <div className="fixed top-0 right-0 w-96 h-96 bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-0 left-20 w-80 h-80 bg-indigo-900/10 blur-[100px] rounded-full pointer-events-none -z-10" />
        </div>
    )
}