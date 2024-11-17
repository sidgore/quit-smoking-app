'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from 'react'

interface Entry {
    date: string
    entries: {
        react_time: string
        react_native_time: string
        applications_time: string
        internshala_time: string
        interview_prep_time: string
        other_time: string
    }
}

export default function Dashboard() {
    const [entries, setEntries] = useState<Entry[]>([])

    useEffect(() => {
        fetch('/api/daily-entries')
            .then(res => res.json())
            .then(data => setEntries(data))
    }, [])

    // Prepare data for charts
    const prepareData = (sliceSize: number) =>
        entries.slice(0, sliceSize).map(entry => ({
            date: new Date(entry.date).toLocaleDateString(),
            React: parseFloat(entry.entries.react_time),
            'React Native': parseFloat(entry.entries.react_native_time),
            Internshala: parseFloat(entry.entries.internshala_time),
            Applications: parseInt(entry.entries.applications_time),
            'Interview Preparation': parseInt(entry.entries.interview_prep_time),
            Other: parseInt(entry.entries.other_time)
        })).reverse()

    const dailyData = prepareData(7)
    const weeklyData = prepareData(28) // Sample size for a week's view, can adjust as needed
    const monthlyData = prepareData(30) // Sample size for a month's view

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Development Dashboard</h1>

            <Tabs defaultValue="daily" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>

                {/* Daily Tab Content */}
                <TabsContent value="daily" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Time Investment (Hours)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dailyData}>
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="React" fill="#0ea5e9" />
                                        <Bar dataKey="React Native" fill="#8b5cf6" />
                                        <Bar dataKey="Internshala" fill="#10b981" />
                                        <Bar dataKey="Applications" fill="#f59e0b" />
                                        <Bar dataKey="Interview Preparation" fill="#ef4444" />
                                        <Bar dataKey="Other" fill="#6366f1" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Weekly Tab Content */}
                <TabsContent value="weekly" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Time Investment (Hours) - Weekly</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={weeklyData}>
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="React" fill="#0ea5e9" />
                                        <Bar dataKey="React Native" fill="#8b5cf6" />
                                        <Bar dataKey="Internshala" fill="#10b981" />
                                        <Bar dataKey="Applications" fill="#f59e0b" />
                                        <Bar dataKey="Interview Preparation" fill="#ef4444" />
                                        <Bar dataKey="Other" fill="#6366f1" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Monthly Tab Content */}
                <TabsContent value="monthly" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Time Investment (Hours) - Monthly</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={monthlyData}>
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="React" fill="#0ea5e9" />
                                        <Bar dataKey="React Native" fill="#8b5cf6" />
                                        <Bar dataKey="Internshala" fill="#10b981" />
                                        <Bar dataKey="Applications" fill="#f59e0b" />
                                        <Bar dataKey="Interview Preparation" fill="#ef4444" />
                                        <Bar dataKey="Other" fill="#6366f1" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
