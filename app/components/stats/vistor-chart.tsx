"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const dailyData = [
  { date: "Apr 01", visitors: 1240, pageViews: 2180 },
  { date: "Apr 02", visitors: 1350, pageViews: 2390 },
  { date: "Apr 03", visitors: 1480, pageViews: 2590 },
  { date: "Apr 04", visitors: 1520, pageViews: 2780 },
  { date: "Apr 05", visitors: 1620, pageViews: 3050 },
  { date: "Apr 06", visitors: 1780, pageViews: 3290 },
  { date: "Apr 07", visitors: 1850, pageViews: 3400 },
  { date: "Apr 08", visitors: 1890, pageViews: 3570 },
  { date: "Apr 09", visitors: 1950, pageViews: 3750 },
  { date: "Apr 10", visitors: 2050, pageViews: 3890 },
  { date: "Apr 11", visitors: 2120, pageViews: 4020 },
  { date: "Apr 12", visitors: 2190, pageViews: 4230 },
  { date: "Apr 13", visitors: 2230, pageViews: 4390 },
  { date: "Apr 14", visitors: 2290, pageViews: 4520 },
]

const weeklyData = [
  { date: "Week 1", visitors: 9840, pageViews: 18200 },
  { date: "Week 2", visitors: 10350, pageViews: 19800 },
  { date: "Week 3", visitors: 11480, pageViews: 21500 },
  { date: "Week 4", visitors: 12520, pageViews: 23780 },
]

const monthlyData = [
  { date: "Jan", visitors: 42400, pageViews: 78200 },
  { date: "Feb", visitors: 45350, pageViews: 82390 },
  { date: "Mar", visitors: 48480, pageViews: 89590 },
  { date: "Apr", visitors: 52520, pageViews: 97780 },
]

export default function VisitorChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitor Trends</CardTitle>
        <CardDescription>Track visitor and page view trends over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <ChartContainer
              config={{
                visitors: {
                  label: "Visitors",
                  color: "hsl(var(--chart-1))",
                },
                pageViews: {
                  label: "Page Views",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} padding={{ left: 10, right: 10 }} />
                  <YAxis tickLine={false} axisLine={false} width={40} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="visitors" stroke="var(--color-visitors)" strokeWidth={2} dot={false} />
                  <Line
                    type="monotone"
                    dataKey="pageViews"
                    stroke="var(--color-pageViews)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="weekly">
            <ChartContainer
              config={{
                visitors: {
                  label: "Visitors",
                  color: "hsl(var(--chart-1))",
                },
                pageViews: {
                  label: "Page Views",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} padding={{ left: 10, right: 10 }} />
                  <YAxis tickLine={false} axisLine={false} width={40} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="visitors" stroke="var(--color-visitors)" strokeWidth={2} dot={false} />
                  <Line
                    type="monotone"
                    dataKey="pageViews"
                    stroke="var(--color-pageViews)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="monthly">
            <ChartContainer
              config={{
                visitors: {
                  label: "Visitors",
                  color: "hsl(var(--chart-1))",
                },
                pageViews: {
                  label: "Page Views",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} padding={{ left: 10, right: 10 }} />
                  <YAxis tickLine={false} axisLine={false} width={40} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="visitors" stroke="var(--color-visitors)" strokeWidth={2} dot={false} />
                  <Line
                    type="monotone"
                    dataKey="pageViews"
                    stroke="var(--color-pageViews)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
