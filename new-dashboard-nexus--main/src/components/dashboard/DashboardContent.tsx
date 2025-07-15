'use client';

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

interface ChartData {
  name: string;
  total: number;
}

const data: ChartData[] = [
  {
    name: "Jan",
    total: 1320,
  },
  {
    name: "Feb",
    total: 1780,
  },
  {
    name: "Mar",
    total: 1530,
  },
  {
    name: "Apr",
    total: 2100,
  },
  {
    name: "May",
    total: 1850,
  },
  {
    name: "Jun",
    total: 2300,
  },
]

const stats = [
  {
    name: "Total Parts",
    value: "2,345",
    icon: "📦",
    change: "+12%",
    trend: "up"
  },
  {
    name: "Active Orders",
    value: "45",
    icon: "📝",
    change: "+5%",
    trend: "up"
  },
  {
    name: "Critical Stock",
    value: "12",
    icon: "⚠️",
    change: "-3%",
    trend: "down"
  },
  {
    name: "Monthly Revenue",
    value: "$123.5K",
    icon: "💰",
    change: "+18%",
    trend: "up"
  }
]

export function DashboardContent() {
  return (
    <div className="flex flex-col gap-4">
      {/* Overview Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-panel p-6 backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{stat.icon}</span>
                <span className={cn(
                  "text-sm font-medium",
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                )}>
                  {stat.change}
                </span>
              </div>
              <div className="mt-3">
                <h3 className="text-sm text-white/70">{stat.name}</h3>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-panel p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Parts Overview</h3>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <TrendingUp className="h-4 w-4" />
              Last 6 months
            </div>
          </div>
          <div className="mt-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Bar
                  dataKey="total"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary opacity-70"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Activity Feed */}
        <Card className="glass-panel p-6">
          <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: item * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-lg glass-input"
              >
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm text-white">New order placed for Engine Parts</p>
                  <p className="text-xs text-white/50">2 hours ago</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
