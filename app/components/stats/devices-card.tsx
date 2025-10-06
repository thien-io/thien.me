// @ts-nocheck
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

export default function DevicesCard() {
  const devices = [
    { name: "Desktop", visitors: 14580, percentage: 59.8, color: "hsl(var(--chart-1))" },
    { name: "Mobile", visitors: 8420, percentage: 34.5, color: "hsl(var(--chart-2))" },
    { name: "Tablet", visitors: 1390, percentage: 5.7, color: "hsl(var(--chart-3))" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Devices</CardTitle>
        <CardDescription>Device usage by your visitors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <ChartContainer className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={devices}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="visitors"
                >
                  {devices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
              <TableHead className="text-right">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.name}>
                <TableCell className="font-medium">{device.name}</TableCell>
                <TableCell className="text-right">{device.visitors.toLocaleString()}</TableCell>
                <TableCell className="text-right">{device.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
