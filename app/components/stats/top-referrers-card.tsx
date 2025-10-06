import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TopReferrersCardProps {
  fullView?: boolean
}

export default function TopReferrersCard({ fullView = false }: TopReferrersCardProps) {
  const topReferrers = [
    { source: "google.com", visitors: 8420, percentage: 34.5 },
    { source: "twitter.com", visitors: 3210, percentage: 13.2 },
    { source: "facebook.com", visitors: 2840, percentage: 11.6 },
    { source: "linkedin.com", visitors: 2150, percentage: 8.8 },
    { source: "github.com", visitors: 1890, percentage: 7.7 },
    { source: "youtube.com", visitors: 1680, percentage: 6.9 },
    { source: "reddit.com", visitors: 1540, percentage: 6.3 },
    { source: "bing.com", visitors: 1420, percentage: 5.8 },
    { source: "instagram.com", visitors: 1320, percentage: 5.4 },
    { source: "duckduckgo.com", visitors: 1180, percentage: 4.8 },
  ]

  const displayReferrers = fullView ? topReferrers : topReferrers.slice(0, 5)

  return (
    <Card className={fullView ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle>Top Referrers</CardTitle>
        <CardDescription>Where your visitors are coming from</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
              {fullView && <TableHead className="text-right">Percentage</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayReferrers.map((referrer) => (
              <TableRow key={referrer.source}>
                <TableCell className="font-medium">{referrer.source}</TableCell>
                <TableCell className="text-right">{referrer.visitors.toLocaleString()}</TableCell>
                {fullView && <TableCell className="text-right">{referrer.percentage}%</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
