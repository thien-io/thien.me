import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TopPagesCardProps {
  fullView?: boolean
}

export default function TopPagesCard({ fullView = false }: TopPagesCardProps) {
  const topPages = [
    { path: "/", visitors: 5420, pageViews: 7890 },
    { path: "/blog", visitors: 3210, pageViews: 4560 },
    { path: "/products", visitors: 2840, pageViews: 3980 },
    { path: "/about", visitors: 2150, pageViews: 2780 },
    { path: "/contact", visitors: 1890, pageViews: 2340 },
    { path: "/blog/getting-started", visitors: 1680, pageViews: 2190 },
    { path: "/products/featured", visitors: 1540, pageViews: 1980 },
    { path: "/pricing", visitors: 1420, pageViews: 1760 },
    { path: "/blog/tutorials", visitors: 1320, pageViews: 1650 },
    { path: "/faq", visitors: 1180, pageViews: 1420 },
  ]

  const displayPages = fullView ? topPages : topPages.slice(0, 5)

  return (
    <Card className={fullView ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle>Top Pages</CardTitle>
        <CardDescription>Most visited pages on your website</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
              {fullView && <TableHead className="text-right">Page Views</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayPages.map((page) => (
              <TableRow key={page.path}>
                <TableCell className="font-medium">{page.path}</TableCell>
                <TableCell className="text-right">{page.visitors.toLocaleString()}</TableCell>
                {fullView && <TableCell className="text-right">{page.pageViews.toLocaleString()}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
