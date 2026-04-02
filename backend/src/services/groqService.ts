import Groq from "groq-sdk";


interface TypeCounts {
    speed_violation: number
    offline: number
    idle: number
}

interface TypeVehicleCounts {
    vehicleId: string
    speedViolations: number
    offlineCount: number
    idleCount: number
}



export async function analyzeAlerts(typeCounts: TypeCounts, vehicleCounts: TypeVehicleCounts[]) {

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            {
                role: "user",
                content: `You are a fleet management AI analyst. Analyze the following alert data from the last 7 days and return EXACTLY 5 analysis cards as a JSON array.

                        Fleet Alert Summary (Last 7 Days):
                        - Speed Violations: ${typeCounts.speed_violation}
                        - Offline Alerts: ${typeCounts.offline}
                        - Idle Alerts: ${typeCounts.idle}
                        - Total Alerts: ${typeCounts.speed_violation + typeCounts.offline + typeCounts.idle}

                        Per Vehicle Breakdown:
                            ${vehicleCounts.map(v => `- Vehicle ${v.vehicleId}: speed=${v.speedViolations}, offline=${v.offlineCount}, idle=${v.idleCount}`).join('\n')}

                        Return ONLY a JSON array with exactly 5 objects. No explanation, no markdown, no extra text. Just the raw JSON array.

                        Each object must have:
                        - "title": card title (max 5 words)
                        - "insight": analysis text (2-3 sentences)
                        - "severity": "critical" | "warning" | "info"

                        Cards must cover these topics in order:
                        1. General Fleet Overview
                        2. Risk Analysis (speed violations focus)
                        3. Operational Efficiency (offline & idle focus)
                        4. Most Problematic Vehicle
                        5. Recommendations & Actions
                        
                        Severity guidelines:
                        - "info": positive performance, good metrics, or neutral observations
                        - "warning": moderate issues that need attention
                        - "critical": serious problems requiring immediate action

                        Not every card must be critical. If a vehicle performed well, acknowledge it positively.`,
            },
        ],
    });
    return completion.choices[0]?.message?.content
}
