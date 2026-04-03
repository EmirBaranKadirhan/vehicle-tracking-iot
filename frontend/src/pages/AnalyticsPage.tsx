import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import type { IVehicleAnalytics } from '../types/analytics'
import { getAnalytics } from '../api/analytics'
import { useVehicles } from '../hooks/useVehicles'

// VEHICLES array kaldırıldı — useVehicles hook'undan geliyor

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const WEEKLY_ALERTS: Record<string, number[]> = {
    '1': [3, 5, 2, 8, 4, 6, 3],
    '2': [6, 4, 7, 3, 9, 2, 5],
    '3': [2, 3, 5, 4, 3, 7, 4],
}
const LAST_WEEK_ALERTS = [8, 10, 9, 12, 11, 13, 10]

const WEEKLY_STATS: Record<string, {
    idleHours: number; idleRatio: number; riskScore: number
    estimatedFuel: number; speedViolations: number; offlineCount: number; efficiency: number
}> = {
    '1': { idleHours: 8.4, idleRatio: 18.4, riskScore: 78, estimatedFuel: 520, speedViolations: 12, offlineCount: 3, efficiency: 81.6 },
    '2': { idleHours: 5.1, idleRatio: 9.2, riskScore: 54, estimatedFuel: 410, speedViolations: 8, offlineCount: 1, efficiency: 90.8 },
    '3': { idleHours: 6.7, idleRatio: 14.1, riskScore: 32, estimatedFuel: 310, speedViolations: 2, offlineCount: 2, efficiency: 85.9 },
    all: { idleHours: 20.2, idleRatio: 13.9, riskScore: 55, estimatedFuel: 1240, speedViolations: 22, offlineCount: 6, efficiency: 86.1 },
}

const DAILY_STATS: Record<string, Record<number, {
    idleHours: number; idleRatio: number; riskScore: number
    estimatedFuel: number; speedViolations: number; offlineCount: number; efficiency: number
    violations: { type: string; severity: 'critical' | 'warning' | 'info'; count: number }[]
}>> = {
    '1': {
        0: { idleHours: 1.2, idleRatio: 15, riskScore: 45, estimatedFuel: 62, speedViolations: 2, offlineCount: 0, efficiency: 85, violations: [{ type: 'Speed Violation', severity: 'warning', count: 2 }, { type: 'Hard Brake', severity: 'info', count: 1 }] },
        1: { idleHours: 1.8, idleRatio: 22, riskScore: 72, estimatedFuel: 88, speedViolations: 4, offlineCount: 1, efficiency: 78, violations: [{ type: 'Speed Violation', severity: 'critical', count: 4 }, { type: 'Offline', severity: 'warning', count: 1 }] },
        2: { idleHours: 0.8, idleRatio: 10, riskScore: 28, estimatedFuel: 55, speedViolations: 0, offlineCount: 0, efficiency: 90, violations: [{ type: 'Idle', severity: 'info', count: 2 }] },
        3: { idleHours: 2.1, idleRatio: 26, riskScore: 91, estimatedFuel: 110, speedViolations: 6, offlineCount: 1, efficiency: 74, violations: [{ type: 'Speed Violation', severity: 'critical', count: 6 }, { type: 'Hard Brake', severity: 'warning', count: 2 }] },
        4: { idleHours: 1.0, idleRatio: 12, riskScore: 40, estimatedFuel: 70, speedViolations: 0, offlineCount: 1, efficiency: 88, violations: [{ type: 'Offline', severity: 'warning', count: 2 }, { type: 'Idle', severity: 'info', count: 2 }] },
        5: { idleHours: 0.9, idleRatio: 11, riskScore: 65, estimatedFuel: 80, speedViolations: 5, offlineCount: 0, efficiency: 89, violations: [{ type: 'Speed Violation', severity: 'warning', count: 5 }, { type: 'Hard Brake', severity: 'info', count: 1 }] },
        6: { idleHours: 0.6, idleRatio: 8, riskScore: 20, estimatedFuel: 55, speedViolations: 0, offlineCount: 0, efficiency: 92, violations: [{ type: 'Idle', severity: 'info', count: 3 }] },
    },
    '2': {
        0: { idleHours: 0.9, idleRatio: 11, riskScore: 70, estimatedFuel: 75, speedViolations: 5, offlineCount: 1, efficiency: 89, violations: [{ type: 'Speed Violation', severity: 'critical', count: 5 }, { type: 'Offline', severity: 'warning', count: 1 }] },
        1: { idleHours: 0.6, idleRatio: 7, riskScore: 35, estimatedFuel: 52, speedViolations: 0, offlineCount: 0, efficiency: 93, violations: [{ type: 'Hard Brake', severity: 'info', count: 4 }] },
        2: { idleHours: 1.2, idleRatio: 15, riskScore: 68, estimatedFuel: 90, speedViolations: 6, offlineCount: 0, efficiency: 85, violations: [{ type: 'Speed Violation', severity: 'warning', count: 6 }, { type: 'Idle', severity: 'info', count: 1 }] },
        3: { idleHours: 0.4, idleRatio: 5, riskScore: 22, estimatedFuel: 48, speedViolations: 0, offlineCount: 0, efficiency: 95, violations: [{ type: 'Idle', severity: 'info', count: 3 }] },
        4: { idleHours: 1.5, idleRatio: 19, riskScore: 88, estimatedFuel: 105, speedViolations: 8, offlineCount: 0, efficiency: 81, violations: [{ type: 'Speed Violation', severity: 'critical', count: 8 }, { type: 'Hard Brake', severity: 'warning', count: 1 }] },
        5: { idleHours: 0.3, idleRatio: 4, riskScore: 18, estimatedFuel: 40, speedViolations: 0, offlineCount: 0, efficiency: 96, violations: [{ type: 'Offline', severity: 'warning', count: 2 }] },
        6: { idleHours: 0.2, idleRatio: 3, riskScore: 42, estimatedFuel: 60, speedViolations: 4, offlineCount: 0, efficiency: 97, violations: [{ type: 'Speed Violation', severity: 'warning', count: 4 }, { type: 'Idle', severity: 'info', count: 1 }] },
    },
    '3': {
        0: { idleHours: 0.8, idleRatio: 10, riskScore: 18, estimatedFuel: 38, speedViolations: 0, offlineCount: 0, efficiency: 90, violations: [{ type: 'Idle', severity: 'info', count: 2 }] },
        1: { idleHours: 1.0, idleRatio: 13, riskScore: 32, estimatedFuel: 44, speedViolations: 3, offlineCount: 0, efficiency: 87, violations: [{ type: 'Speed Violation', severity: 'warning', count: 3 }] },
        2: { idleHours: 1.4, idleRatio: 17, riskScore: 44, estimatedFuel: 50, speedViolations: 0, offlineCount: 1, efficiency: 83, violations: [{ type: 'Offline', severity: 'warning', count: 2 }, { type: 'Hard Brake', severity: 'info', count: 3 }] },
        3: { idleHours: 0.9, idleRatio: 11, riskScore: 38, estimatedFuel: 47, speedViolations: 4, offlineCount: 0, efficiency: 89, violations: [{ type: 'Speed Violation', severity: 'warning', count: 4 }] },
        4: { idleHours: 1.1, idleRatio: 14, riskScore: 25, estimatedFuel: 42, speedViolations: 0, offlineCount: 1, efficiency: 86, violations: [{ type: 'Idle', severity: 'info', count: 3 }] },
        5: { idleHours: 1.0, idleRatio: 13, riskScore: 55, estimatedFuel: 58, speedViolations: 6, offlineCount: 1, efficiency: 87, violations: [{ type: 'Speed Violation', severity: 'critical', count: 6 }, { type: 'Offline', severity: 'warning', count: 1 }] },
        6: { idleHours: 0.5, idleRatio: 6, riskScore: 20, estimatedFuel: 31, speedViolations: 0, offlineCount: 0, efficiency: 94, violations: [{ type: 'Hard Brake', severity: 'info', count: 4 }] },
    },
}

// VehicleItem tipi — useVehicles'dan gelen + fakeId eklendi
interface VehicleItem {
    vehicleId: string
    vehicleName: string
    color?: string
    fakeId: string
}

function getRiskBadge(score: number) {
    if (score >= 75) return { label: 'Critical', color: '#ff4d6d', bg: 'rgba(255,77,109,0.12)' }
    if (score >= 50) return { label: 'Warning', color: '#ffb873', bg: 'rgba(255,184,115,0.12)' }
    if (score >= 25) return { label: 'Stable', color: '#94de2d', bg: 'rgba(148,222,45,0.12)' }
    return { label: 'Optimal', color: '#4cd7f6', bg: 'rgba(76,215,246,0.12)' }
}

function getIdleLevel(ratio: number, hours: number) {
    if (ratio >= 20) return { label: 'Critical', color: '#ff4d6d', bg: 'rgba(255,77,109,0.10)', comment: `${hours}h idle this week — engine running, vehicle stationary. Route planning required.` }
    if (ratio >= 12) return { label: 'High', color: '#ffb873', bg: 'rgba(255,184,115,0.10)', comment: `${hours}h spent idle this week. ${ratio}% of driving time is being wasted.` }
    if (ratio >= 6) return { label: 'Normal', color: '#94de2d', bg: 'rgba(148,222,45,0.10)', comment: `Wait time is within acceptable range. ${hours}h idle is below average for this vehicle.` }
    return { label: 'Low', color: '#4cd7f6', bg: 'rgba(76,215,246,0.10)', comment: `Only ${hours}h idle. Vehicle is being used efficiently.` }
}
const SEV_STYLE = {
    critical: { color: '#ff4d6d', bg: 'rgba(255,77,109,0.12)' },
    warning: { color: '#ffb873', bg: 'rgba(255,184,115,0.12)' },
    info: { color: '#4cd7f6', bg: 'rgba(76,215,246,0.12)' },
}

interface ActiveCtx { vehicleId: string; dayIndex?: number }

function getActiveStats(ctx: ActiveCtx | null, vehicleAnalytics: IVehicleAnalytics[], vehicleList: VehicleItem[]) {
    // ctx.vehicleId artık TRUCK-001 formatında — fakeId'ye çevirip WEEKLY_STATS'a bakıyoruz
    const fakeId = ctx ? vehicleList.find(v => v.vehicleId === ctx.vehicleId)?.fakeId ?? null : null

    const weeklyBase = fakeId ? WEEKLY_STATS[fakeId] : WEEKLY_STATS.all
    const dailyBase = ctx?.dayIndex !== undefined && fakeId
        ? DAILY_STATS[fakeId]?.[ctx.dayIndex] ?? weeklyBase
        : weeklyBase

    const realData = ctx
        ? vehicleAnalytics.find(x => x.vehicleId === ctx.vehicleId)
        : vehicleAnalytics.length > 0 ? {
            riskScore: Math.round(vehicleAnalytics.reduce((sum, v) => sum + v.riskScore, 0) / vehicleAnalytics.length),
            speedViolations: vehicleAnalytics.reduce((sum, v) => sum + v.speedViolations, 0),
            offlineCount: vehicleAnalytics.reduce((sum, v) => sum + v.offlineCount, 0),
        } : null

    return {
        ...dailyBase,
        riskScore: realData?.riskScore ?? dailyBase?.riskScore ?? 0,
        speedViolations: realData?.speedViolations ?? dailyBase?.speedViolations ?? 0,
        offlineCount: realData?.offlineCount ?? dailyBase?.offlineCount ?? 0,
    }
}

function Breadcrumb({ ctx, onNavigate, vehicleList }: {
    ctx: ActiveCtx | null
    onNavigate: (next: ActiveCtx | null) => void
    vehicleList: VehicleItem[]
}) {
    const vehicle = vehicleList.find(v => v.vehicleId === ctx?.vehicleId)

    type Crumb = { label: string; onClick?: () => void }

    const crumbs: Crumb[] = [
        {
            label: 'Fleet Overview',
            onClick: ctx !== null ? () => onNavigate(null) : undefined,
        },
    ]

    if (ctx?.vehicleId && vehicle) {
        crumbs.push({
            label: `${vehicle.vehicleName} — ${vehicle.vehicleId}`,
            onClick: ctx.dayIndex !== undefined ? () => onNavigate({ vehicleId: ctx.vehicleId }) : undefined,
        })
    }

    if (ctx?.dayIndex !== undefined) {
        crumbs.push({
            label: DAYS[ctx.dayIndex],
        })
    }

    return (
        <div className="flex items-center gap-1 flex-wrap">
            {crumbs.map((c, i) => {
                const isActive = !c.onClick
                const isVehicleCrumb = i === 1
                const vehicleColor = vehicle?.color ?? '#dae2fd'

                return (
                    <React.Fragment key={i}>
                        {i > 0 && (
                            <span className="material-symbols-outlined text-slate-700 text-sm select-none">
                                chevron_right
                            </span>
                        )}
                        <button
                            onClick={c.onClick}
                            disabled={isActive}
                            className="text-[11px] font-bold font-['Space_Grotesk'] uppercase tracking-widest transition-all px-2 py-1 rounded"
                            style={{
                                color: isActive
                                    ? (isVehicleCrumb || i === 2 ? vehicleColor : '#dae2fd')
                                    : '#475569',
                                background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                                cursor: isActive ? 'default' : 'pointer',
                            }}
                        >
                            {c.label}
                        </button>
                    </React.Fragment>
                )
            })}
        </div>
    )
}

function LineChart({ ctx, onVehicleClick, onDayClick, vehicleList }: {
    ctx: ActiveCtx | null
    onVehicleClick: (id: string) => void
    onDayClick: (vehicleId: string, dayIndex: number) => void
    vehicleList: VehicleItem[]
}) {
    const W = 700, H = 200, PX = 20, PY = 10
    const maxVal = Math.max(...vehicleList.flatMap(v => WEEKLY_ALERTS[v.fakeId] ?? [0]), ...LAST_WEEK_ALERTS) + 2
    const toX = (i: number) => PX + (i / 6) * (W - PX * 2)
    const toY = (v: number) => H - PY - (v / maxVal) * (H - PY * 2)
    const makePath = (vals: number[]) =>
        vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ')

    return (
        <div>
            <div className="flex flex-wrap gap-5 items-center mb-6">
                {vehicleList.map(v => {
                    const isActive = ctx?.vehicleId === v.vehicleId
                    const isDimmed = ctx !== null && ctx.vehicleId !== v.vehicleId
                    return (
                        <button key={v.vehicleId} onClick={() => onVehicleClick(v.vehicleId)}
                            className="flex items-center gap-2 transition-all"
                            style={{ opacity: isDimmed ? 0.25 : 1 }}>
                            <span className="w-3 h-3 rounded-full transition-all" style={{
                                background: v.color,
                                boxShadow: isActive ? `0 0 8px ${v.color}` : undefined,
                            }} />
                            <span className="text-[10px] text-slate-400 font-['Space_Grotesk'] uppercase tracking-wider">
                                {v.vehicleName}
                            </span>
                        </button>
                    )
                })}
                <div className="flex items-center gap-2 ml-2 pl-3 border-l border-white/10">
                    <svg width="20" height="10">
                        <line x1="0" y1="5" x2="20" y2="5" stroke="#869397"
                            strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
                    </svg>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-['Space_Grotesk']">
                        Previous Week
                    </span>
                </div>
            </div>

            <svg viewBox={`0 0 ${W} ${H + 30}`} className="w-full" style={{ overflow: 'visible' }}>
                {[0, 1, 2, 3, 4].map(i => (
                    <line key={i} x1={PX} y1={toY((maxVal / 4) * i)} x2={W - PX} y2={toY((maxVal / 4) * i)}
                        stroke="rgba(76,215,246,0.05)" strokeWidth="1" />
                ))}
                <path d={makePath(LAST_WEEK_ALERTS)} fill="none"
                    stroke="rgba(134,147,151,0.3)" strokeWidth="1.5" strokeDasharray="4,4" />

                {vehicleList.map(v => {
                    const alerts = WEEKLY_ALERTS[v.fakeId] ?? []
                    const isSelected = ctx?.vehicleId === v.vehicleId
                    const isDimmed = ctx !== null && ctx.vehicleId !== v.vehicleId
                    return (
                        <g key={v.vehicleId}>
                            <path d={makePath(alerts)} fill="none"
                                stroke={v.color} strokeWidth={isSelected ? 3 : 2}
                                opacity={isDimmed ? 0.1 : 1}
                                style={{ transition: 'all 0.3s' }} />
                            {alerts.map((val, i) => {
                                const isActiveDay = ctx?.vehicleId === v.vehicleId && ctx?.dayIndex === i
                                return (
                                    <g key={i}>
                                        <circle cx={toX(i)} cy={toY(val)} r={14} fill="transparent"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => onDayClick(v.vehicleId, i)} />
                                        <circle cx={toX(i)} cy={toY(val)}
                                            r={isActiveDay ? 7 : isSelected ? 5 : 3}
                                            fill={isActiveDay ? '#fff' : v.color}
                                            stroke={isActiveDay ? v.color : 'none'}
                                            strokeWidth={isActiveDay ? 2.5 : 0}
                                            opacity={isDimmed ? 0.1 : 1}
                                            style={{ transition: 'all 0.25s', cursor: 'pointer' }}
                                            onClick={() => onDayClick(v.vehicleId, i)} />
                                    </g>
                                )
                            })}
                        </g>
                    )
                })}

                {DAYS.map((d, i) => (
                    <text key={d} x={toX(i)} y={H + 22} textAnchor="middle"
                        fontSize="10" fill="rgba(188,201,205,0.45)" fontFamily="Space Grotesk">
                        {d}
                    </text>
                ))}
            </svg>
        </div>
    )
}

function StatCard({ label, value, sub, color, icon, highlight }: {
    label: string; value: string; sub?: string
    color: string; icon: string; highlight?: boolean
}) {
    return (
        <div className="p-5 rounded-xl flex flex-col justify-between min-h-[120px] transition-all duration-300"
            style={{
                background: highlight ? `${color}10` : 'rgba(34,42,61,0.5)',
                backdropFilter: 'blur(12px)',
                borderTop: `1px solid ${color}${highlight ? '50' : '25'}`,
                borderLeft: `1px solid ${color}${highlight ? '30' : '12'}`,
                boxShadow: highlight ? `0 0 20px -8px ${color}50` : undefined,
            }}>
            <div className="flex justify-between items-start">
                <p className="text-[10px] uppercase tracking-widest font-['Space_Grotesk'] text-slate-400">{label}</p>
                <span className="material-symbols-outlined text-lg" style={{ color }}>{icon}</span>
            </div>
            <div>
                <p className="text-3xl font-black font-['Space_Grotesk'] transition-all duration-300" style={{ color }}>
                    {value}
                </p>
                {sub && <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{sub}</p>}
            </div>
        </div>
    )
}

function ViolationPanel({ ctx, vehicleList }: { ctx: ActiveCtx | null, vehicleList: VehicleItem[] }) {
    if (!ctx || ctx.dayIndex === undefined) return null
    const vehicle = vehicleList.find(v => v.vehicleId === ctx.vehicleId)
    if (!vehicle) return null
    const daily = DAILY_STATS[vehicle.fakeId]?.[ctx.dayIndex]
    if (!daily) return null

    return (
        <div className="p-5 rounded-xl" style={{
            background: 'rgba(23,31,51,0.7)',
            border: `1px solid ${vehicle.color}20`,
        }}>
            <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-sm" style={{ color: vehicle.color }}>report</span>
                <h3 className="font-black font-['Space_Grotesk'] text-sm uppercase tracking-widest">
                    {DAYS[ctx.dayIndex]} Day Violations
                </h3>
                <span className="text-[10px] text-slate-500">— {vehicle.vehicleName}</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {daily.violations.length === 0
                    ? <span className="text-[10px] text-slate-600 uppercase tracking-widest">No violations this day</span>
                    : daily.violations.map((v, i) => {
                        const s = SEV_STYLE[v.severity]
                        return (
                            <div key={i}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                style={{ color: s.color, background: s.bg }}>
                                <span>{v.type}</span>
                                <span className="opacity-60">×{v.count}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

function RiskTable({ ctx, onVehicleClick, vehicleAnalytics, vehicleList }: {
    ctx: ActiveCtx | null
    onVehicleClick: (id: string) => void
    vehicleAnalytics: IVehicleAnalytics[]
    vehicleList: VehicleItem[]
}) {
    const sorted = [...vehicleList].sort((a, b) => {
        const aData = vehicleAnalytics.find(x => x.vehicleId === a.vehicleId)
        const bData = vehicleAnalytics.find(x => x.vehicleId === b.vehicleId)
        return (bData?.riskScore ?? 0) - (aData?.riskScore ?? 0)
    })

    return (
        <div className="rounded-2xl overflow-hidden" style={{
            background: 'rgba(23,31,51,0.7)', border: '1px solid rgba(76,215,246,0.08)',
        }}>
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-black font-['Space_Grotesk'] text-sm uppercase tracking-widest">Risk Analysis</h3>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">weekly — out of 100</span>
            </div>
            <div className="divide-y divide-white/5">
                {sorted.map(v => {
                    const s = vehicleAnalytics.find(x => x.vehicleId === v.vehicleId)
                    const badge = getRiskBadge(s?.riskScore ?? 0)
                    const isActive = ctx?.vehicleId === v.vehicleId
                    return (
                        <div key={v.vehicleId} onClick={() => onVehicleClick(v.vehicleId)}
                            className="px-6 py-5 cursor-pointer hover:bg-white/5 transition-all"
                            style={{ background: isActive ? `${v.color}08` : undefined }}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full" style={{ background: v.color }} />
                                    <span className="font-bold font-['Space_Grotesk'] text-sm text-white">{v.vehicleName}</span>
                                    <span className="text-[10px] text-slate-500">{v.vehicleId}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                                        style={{ color: badge.color, background: badge.bg }}>{badge.label}</span>
                                    <span className="font-black font-['Space_Grotesk'] text-sm" style={{ color: badge.color }}>
                                        {s?.riskScore ?? 0}
                                    </span>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-700" style={{
                                    width: `${s?.riskScore ?? 0}%`,
                                    background: `linear-gradient(90deg, ${v.color}80, ${badge.color})`,
                                    boxShadow: isActive ? `0 0 8px ${badge.color}60` : undefined,
                                }} />
                            </div>
                            <div className="flex gap-6 mt-3">
                                <span className="text-[10px] text-slate-500">
                                    <span className="text-slate-300 font-bold">{s?.speedViolations ?? 0}</span> speed violations
                                </span>
                                <span className="text-[10px] text-slate-500">
                                    <span className="text-slate-300 font-bold">{s?.offlineCount ?? 0}</span> offline
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function IdleAnalysis({ ctx, onVehicleClick, vehicleList }: {
    ctx: ActiveCtx | null
    onVehicleClick: (id: string) => void
    vehicleList: VehicleItem[]
}) {
    const sorted = [...vehicleList].sort((a, b) => WEEKLY_STATS[b.fakeId]?.idleHours - WEEKLY_STATS[a.fakeId]?.idleHours)
    const maxHours = Math.max(...vehicleList.map(v => WEEKLY_STATS[v.fakeId]?.idleHours ?? 0))
    const activeFakeId = vehicleList.find(v => v.vehicleId === ctx?.vehicleId)?.fakeId ?? 'all'
    const summary = WEEKLY_STATS[activeFakeId] ?? WEEKLY_STATS.all

    return (
        <div className="p-6 rounded-2xl" style={{
            background: 'rgba(23,31,51,0.7)', border: '1px solid rgba(76,215,246,0.08)',
        }}>
            <div className="mb-6">
                <h3 className="font-black font-['Space_Grotesk'] text-sm uppercase tracking-widest">Idle Analysis</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Vehicle is running but not moving — this burns fuel and reduces efficiency.
                    High idle ratio signals the need for route optimization.
                </p>
            </div>

            <div className="space-y-4">
                {sorted.map(v => {
                    const s = WEEKLY_STATS[v.fakeId]
                    if (!s) return null
                    const level = getIdleLevel(s.idleRatio, s.idleHours)
                    const barWidth = (s.idleHours / maxHours) * 100
                    const isActive = ctx?.vehicleId === v.vehicleId
                    const isDimmed = ctx !== null && ctx.vehicleId !== v.vehicleId

                    return (
                        <div key={v.vehicleId}
                            className="rounded-xl p-4 cursor-pointer transition-all duration-300"
                            style={{
                                background: isActive ? level.bg : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${isActive ? level.color + '30' : 'transparent'}`,
                                opacity: isDimmed ? 0.35 : 1,
                            }}
                            onClick={() => onVehicleClick(v.vehicleId)}>

                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{
                                        background: v.color,
                                        boxShadow: isActive ? `0 0 6px ${v.color}` : undefined,
                                    }} />
                                    <span className="text-xs font-bold font-['Space_Grotesk'] uppercase tracking-wider"
                                        style={{ color: isActive ? v.color : '#dae2fd' }}>
                                        {v.vehicleName}
                                    </span>
                                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                                        style={{ color: level.color, background: level.bg }}>
                                        {level.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-500">{s.idleRatio}%</span>
                                    <span className="text-sm font-black font-['Space_Grotesk']" style={{ color: level.color }}>
                                        {s.idleHours}s
                                    </span>
                                </div>
                            </div>

                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                                <div className="h-full rounded-full transition-all duration-700" style={{
                                    width: `${barWidth}%`,
                                    background: level.color,
                                    boxShadow: isActive ? `0 0 8px ${level.color}60` : undefined,
                                }} />
                            </div>

                            {(isActive || ctx === null) && (
                                <p className="text-[10px] leading-relaxed" style={{ color: level.color + 'cc' }}>
                                    {level.comment}
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Total Idle</p>
                    <p className="font-black font-['Space_Grotesk'] text-cyan-400">{summary.idleHours}s</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Avg. Ratio</p>
                    <p className="font-black font-['Space_Grotesk'] text-orange-400">{summary.idleRatio}%</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Efficiency</p>
                    <p className="font-black font-['Space_Grotesk'] text-lime-400">{summary.efficiency}%</p>
                </div>
            </div>
        </div>
    )
}

export default function AnalyticsPage() {
    const [ctx, setCtx] = useState<ActiveCtx | null>(null)
    const [vehicleAnalytics, setVehicleAnalytics] = useState<IVehicleAnalytics[]>([])

    // useVehicles'dan gelen listeye fakeId ekliyoruz — WEEKLY_STATS/DAILY_STATS '1','2','3' key'i kullanıyor
    const rawList = useVehicles()
    const vehicleList: VehicleItem[] = rawList.map((v, i) => ({ ...v, fakeId: String(i + 1) }))

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAnalytics()
                setVehicleAnalytics(res)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    const stats = getActiveStats(ctx, vehicleAnalytics, vehicleList)
    const isDay = ctx?.dayIndex !== undefined

    const handleVehicleClick = (vehicleId: string) => {
        setCtx(prev =>
            prev?.vehicleId === vehicleId && prev.dayIndex === undefined
                ? null
                : { vehicleId }
        )
    }

    const handleDayClick = (vehicleId: string, dayIndex: number) => {
        setCtx(prev => {
            if (prev?.vehicleId === vehicleId && prev?.dayIndex === dayIndex) {
                return { vehicleId }
            }
            return { vehicleId, dayIndex }
        })
    }

    return (
        <div className="flex min-h-screen bg-[#060e20] text-[#dae2fd] font-['Inter'] overflow-x-hidden">
            <Sidebar />

            <main className="ml-64 flex-1 p-8 space-y-6">

                <div className="space-y-3">
                    <h2 className="text-4xl font-black font-['Space_Grotesk'] tracking-tight">Fleet Analytics</h2>
                    <Breadcrumb ctx={ctx} onNavigate={setCtx} vehicleList={vehicleList} />
                    <p className="text-slate-500 text-xs">
                        {!ctx && "Select a vehicle from the legend · Click a point on the chart → view that day"}
                        {ctx && !isDay && 'Click a point on the chart → cards will show that day\'s data'}
                        {ctx && isDay && `Cards show ${DAYS[ctx.dayIndex!]} data  · Click the same point again → deselect day`}
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Idle Ratio" value={`${stats.idleRatio}%`} sub={`${stats.idleHours}s idle`} color="#4cd7f6" icon="timer" highlight={isDay} />
                    <StatCard label="Risk Score" value={`${stats.riskScore}`} sub={`${stats.speedViolations} speed viol.`} color="#ff4d6d" icon="warning" highlight={isDay} />
                    <StatCard label="Est. Fuel" value={`${stats.estimatedFuel}L`} sub="estimated consumption" color="#ffb873" icon="local_gas_station" highlight={isDay} />
                    <StatCard label="Efficiency" value={`${stats.efficiency}%`} sub={`${stats.offlineCount} offline`} color="#94de2d" icon="speed" highlight={isDay} />
                </div>

                <div className="p-6 rounded-2xl" style={{
                    background: 'rgba(23,31,51,0.7)',
                    backdropFilter: 'blur(12px)',
                    borderTop: '1px solid rgba(76,215,246,0.15)',
                    borderLeft: '1px solid rgba(76,215,246,0.08)',
                }}>
                    <div className="mb-4">
                        <h3 className="font-black font-['Space_Grotesk'] text-lg">Weekly Alert Trend</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                            Click a point → view that day\'s data in the cards
                        </p>
                    </div>
                    <LineChart ctx={ctx} onVehicleClick={handleVehicleClick} onDayClick={handleDayClick} vehicleList={vehicleList} />
                </div>

                <ViolationPanel ctx={ctx} vehicleList={vehicleList} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RiskTable ctx={ctx} onVehicleClick={handleVehicleClick} vehicleAnalytics={vehicleAnalytics} vehicleList={vehicleList} />
                    <IdleAnalysis ctx={ctx} onVehicleClick={handleVehicleClick} vehicleList={vehicleList} />
                </div>

            </main>

            <div className="fixed top-0 right-0 w-96 h-96 bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="fixed bottom-0 left-20 w-80 h-80 bg-indigo-900/10 blur-[100px] rounded-full pointer-events-none -z-10" />
        </div>
    )
}