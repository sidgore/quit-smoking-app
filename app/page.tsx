'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Cigarette } from "lucide-react"


const CIGARETTE_COST = 18 // Rs per cigarette



export default function SmokingTracker() {
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [cigaretteCount, setCigaretteCount] = useState(0)
  const [timeRange, setTimeRange] = useState('today')
  const [statsData, setStatsData] = useState([])
  const [hourlyData, setHourlyData] = useState([])
  const [activeTab, setActiveTab] = useState('tracker')
  const { toast } = useToast()

  console.log('statsData', statsData)

  const fetchTodayCount = async () => {
    try {
      const response = await fetch('/api/cigg-entries?filter=today')
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setCigaretteCount(data.length)
        }
      }
    } catch (error) {
      console.error("Error fetching today's count:", error)
    }
  }

  const fetch24HourData = async () => {
    try {
      const response = await fetch('/api/cigg-entries?filter=24hours')
      if (response.ok) {
        const rawData = await response.json()
        const processedData = processHourlyData(rawData)
        setHourlyData(processedData)
      }
    } catch (error) {
      console.error("Error fetching 24-hour data:", error)
    }
  }

  const fetchStatistics = async (range: string) => {
    try {
      const response = await fetch(`/api/cigg-entries?filter=${range}`)
      if (response.ok) {
        const rawData = await response.json()
        const processedData = processStatsData(rawData)
        setStatsData(processedData)
      }
    } catch (error) {
      console.error("Error fetching statistics:", error)
    }
  }

  useEffect(() => {
    fetchTodayCount()
  }, [])

  useEffect(() => {
    if (activeTab === 'statistics') {
      fetch24HourData()
      fetchStatistics(timeRange)
    }
  }, [activeTab, timeRange])

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/cigg-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setCigaretteCount(prevCount => prevCount + 1)
        setIsAlertOpen(false)
        toast({
          title: "Success!",
          description: "Your smoking record has been saved.",
          className: "top-0 right-0 bg-green-600 text-white",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your record. Please try again.",
        variant: "destructive",
        className: "top-0 right-0",
      })
    }
  }


  const processHourlyData = (rawData: any[]) => {
    const hourlyMap = new Map()

    rawData.forEach(entry => {
      const hour = new Date(entry.createdAt).getHours()
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1)
    })

    return Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      count: hourlyMap.get(hour) || 0,
      cost: (hourlyMap.get(hour) || 0) * CIGARETTE_COST
    }))
  }

  const processStatsData = (rawData: any[]) => {
    const dataMap = new Map()

    rawData.forEach(entry => {
      const date = new Date(entry.createdAt).toLocaleDateString()
      dataMap.set(date, (dataMap.get(date) || 0) + 1)
    })

    return Array.from(dataMap.entries()).map(([date, count]) => ({
      date,
      count,
      cost: count * CIGARETTE_COST
    }))
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-3xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tracker">Tracker</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="tracker">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Cigarette className="w-5 h-5 md:w-6 md:h-6" />
                <CardTitle className="text-lg md:text-xl">Daily Smoking Tracker</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 md:space-y-8">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
                  {/* Cigarette Count Circle - Responsive size */}
                  <div className="w-36 h-36 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg border-4 border-background">
                    <div className="text-center">
                      <div className="text-4xl md:text-6xl font-bold text-primary-foreground">{cigaretteCount}</div>
                      <div className="text-xs md:text-sm text-primary-foreground/80">Cigarettes Today</div>
                    </div>
                  </div>

                  {/* Money Spent Circle - Responsive size */}
                  <div className="w-36 h-36 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-lg border-4 border-background">
                    <div className="text-center">
                      <div className="text-2xl md:text-4xl font-bold text-white">₹{cigaretteCount * CIGARETTE_COST}</div>
                      <div className="text-xs md:text-sm text-white/80">Spent Today</div>
                    </div>
                  </div>
                </div>

                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full h-12 md:h-16 text-lg md:text-xl">
                      Log Cigarette
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Logging</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to log a cigarette?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSubmit}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          {/* Statistics Cards */}
          <div className="space-y-4">
            {/* 24-Hour Usage Card */}
            <Card>
              <CardHeader className="space-y-2">
                <CardTitle className="text-lg md:text-xl">Last 24 Hours - Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] md:h-[300px] -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" name="Cigarettes" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Time Range Selection and Charts */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <CardTitle className="text-lg md:text-xl">Smoking Trends</CardTitle>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] md:h-[300px] -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={statsData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" name="Cigarettes" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Cost Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Money Spent (Rs)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] md:h-[300px] -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={statsData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="cost" stroke="#82ca9d" name="Cost (Rs)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
