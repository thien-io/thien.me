import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Users, Eye, MousePointerClick, Clock } from "lucide-react"

export default function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24,389</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <span className="text-emerald-500 flex items-center">
              <ArrowUpRight className="h-3 w-3" />
              12%
            </span>
            vs previous period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Page Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">56,742</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <span className="text-emerald-500 flex items-center">
              <ArrowUpRight className="h-3 w-3" />
              8%
            </span>
            vs previous period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
          <MousePointerClick className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">32.8%</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <span className="text-emerald-500 flex items-center">
              <ArrowUpRight className="h-3 w-3 rotate-180" />
              3%
            </span>
            vs previous period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2m 14s</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <span className="text-emerald-500 flex items-center">
              <ArrowUpRight className="h-3 w-3" />
              10%
            </span>
            vs previous period
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
