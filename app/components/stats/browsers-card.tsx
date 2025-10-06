import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface BrowsersCardProps {
  fullView?: boolean
}

export default function BrowsersCard({ fullView = false }: BrowsersCardProps) {
  const browsers = [
    { name: "Chrome", visitors: 12840, percentage: 52.6 },
    { name: "Safari", visitors: 5420, percentage: 22.2 },
    { name: "Firefox", visitors: 2980, percentage: 12.2 },
    { name: "Edge", visitors: 1890, percentage: 7.7 },
    { name: "Opera", visitors: 780, percentage: 3.2 },
    { name: "Other", visitors: 480, percentage: 2.0 },
  ]

  const displayBrowsers = fullView ? browsers : browsers.slice(0, 5)

  return (
    <Card className={fullView ? "col-span-full md:col-span-1" : ""}>
      <CardHeader>
        <CardTitle>Browsers</CardTitle>
        <CardDescription>Browser usage by your visitors</CardDescription>
      </CardHeader>
      <CardContent>
        {fullView && (
          <div className="mb-6">
            <ChartContainer
              config={{
                visitors: {
                  label: "Visitors",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={browsers}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={40} />
                  <Bar dataKey="visitors" fill="var(--color-visitors)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Browser</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
              <TableHead className="text-right">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayBrowsers.map((browser) => (
              <TableRow key={browser.name}>
                <TableCell className="font-medium">{browser.name}</TableCell>
                <TableCell className="text-right">{browser.visitors.toLocaleString()}</TableCell>
                <TableCell className="text-right">{browser.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

