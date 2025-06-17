import { FC } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  PieChart as RechartsPieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Pie,
} from "recharts";

const summaryCards = [
  {
    title: "Total Income",
    amount: 11000000,
    color: "bg-teal-500",
    textColor: "text-teal-600",
  },
  {
    title: "January Savings",
    amount: 4500000,
    color: "bg-teal-500",
    textColor: "text-teal-600",
  },
  {
    title: "January Spending",
    amount: 3954990,
    color: "bg-teal-500",
    textColor: "text-teal-600",
  },
  {
    title: "Balance Bank 1",
    amount: 2345000,
    color: "bg-teal-500",
    textColor: "text-teal-600",
  },
];

const expenseData = [
  {
    id: 1,
    category: "Home Rent",
    allocation: 1350000,
    realization: 1000000,
    percentage: 74.07,
    color: "bg-yellow-400",
  },
  {
    id: 2,
    category: "Utilities",
    allocation: 450000,
    realization: 300000,
    percentage: 66.67,
    color: "bg-teal-400",
  },
  {
    id: 3,
    category: "Food",
    allocation: 1450000,
    realization: 700000,
    percentage: 48.28,
    color: "bg-teal-400",
  },
  {
    id: 4,
    category: "Supplies",
    allocation: 500000,
    realization: 850000,
    percentage: 170.0,
    color: "bg-red-400",
  },
  {
    id: 5,
    category: "Transportation",
    allocation: 300000,
    realization: 300000,
    percentage: 100.0,
    color: "bg-red-400",
  },
  {
    id: 6,
    category: "Healthcare",
    allocation: 200000,
    realization: 199990,
    percentage: 100.0,
    color: "bg-yellow-400",
  },
  {
    id: 7,
    category: "Debt",
    allocation: 250000,
    realization: 0,
    percentage: 0.0,
    color: "bg-gray-300",
  },
  {
    id: 8,
    category: "Shopping",
    allocation: 500000,
    realization: 300000,
    percentage: 60.0,
    color: "bg-teal-400",
  },
  {
    id: 9,
    category: "Gifts",
    allocation: 1500000,
    realization: 175000,
    percentage: 11.67,
    color: "bg-teal-400",
  },
];

const pieData = [
  { name: "Home Rent", value: 26.1, color: "#f59e0b" },
  { name: "Food", value: 18.3, color: "#10b981" },
  { name: "Supplies", value: 22.2, color: "#ef4444" },
  { name: "Utilities", value: 7.8, color: "#f59e0b" },
  { name: "Transportation", value: 7.8, color: "#3b82f6" },
  { name: "Healthcare", value: 5.2, color: "#8b5cf6" },
  { name: "Shopping", value: 7.8, color: "#f59e0b" },
  { name: "Gifts", value: 4.6, color: "#10b981" },
];

const trendData = [
  { month: "January", amount: 3954990 },
  { month: "February", amount: 0 },
  { month: "March", amount: 0 },
  { month: "April", amount: 0 },
  { month: "May", amount: 0 },
  { month: "June", amount: 0 },
  { month: "July", amount: 0 },
  { month: "August", amount: 0 },
  { month: "September", amount: 0 },
  { month: "October", amount: 0 },
  { month: "November", amount: 0 },
  { month: "December", amount: 0 },
];

const COLORS = [
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
];

const MainLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="main-layout">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-2 sm:px-4">
        <div className="flex items-center gap-2 w-full">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm sm:text-lg font-semibold truncate">
            Dashboard
          </h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-2 sm:gap-4 p-2 sm:p-4 pt-0">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4 rounded-xl">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-lg p-4 sm:p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-green-500 rounded transform rotate-45"></div>
                <h1 className="text-xl sm:text-2xl font-bold text-teal-600">
                  Money Management Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Year:
                  </span>
                  <span className="text-sm font-bold">2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Month:
                  </span>
                  <Select defaultValue="january">
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                      <ChevronDown className="h-4 w-4" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="january">January</SelectItem>
                      <SelectItem value="february">February</SelectItem>
                      <SelectItem value="march">March</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            {/* Monthly Report Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-teal-500 rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <h2 className="text-white text-lg font-bold">Monthly Report</h2>
                <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">📊</span>
                </div>
              </div>
              <Select defaultValue="bank1">
                <SelectTrigger className="w-32 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank1">Bank 1</SelectItem>
                  <SelectItem value="bank2">Bank 2</SelectItem>
                  <SelectItem value="bank3">Bank 3</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              {summaryCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className="bg-teal-500 p-3 text-center">
                      <h3 className="text-white font-medium text-sm">
                        {card.title}
                      </h3>
                    </div>
                    <CardContent className="p-4 bg-white text-center">
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        Rp{card.amount.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Expense Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardContent className="p-0">
                  {/* Mobile Card View */}
                  <div className="block lg:hidden space-y-3 p-4">
                    {expenseData.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                        className="bg-gray-50 rounded-lg p-3 space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">
                            {item.category}
                          </span>
                          <span className="text-sm font-bold">
                            {item.percentage}%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>
                            Allocation: Rp{item.allocation.toLocaleString()}
                          </span>
                          <span>
                            Realization: Rp{item.realization.toLocaleString()}
                          </span>
                        </div>
                        <Progress
                          value={item.percentage > 100 ? 100 : item.percentage}
                          className="h-2"
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-teal-500">
                        <tr>
                          <th className="text-left p-3 font-medium text-white text-sm">
                            Expenses List
                          </th>
                          <th className="text-left p-3 font-medium text-white text-sm">
                            <div className="flex items-center gap-1">
                              Allocation
                              <div className="w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center">
                                <span className="text-xs">🔒</span>
                              </div>
                            </div>
                          </th>
                          <th className="text-left p-3 font-medium text-white text-sm">
                            <div className="flex items-center gap-1">
                              Realization
                              <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                                <span className="text-xs">↗</span>
                              </div>
                            </div>
                          </th>
                          <th className="text-left p-3 font-medium text-white text-sm">
                            Budget Usage Progress
                          </th>
                          <th className="text-left p-3 font-medium text-white text-sm">
                            % Usage
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenseData.map((item, index) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.05 }}
                            className="border-b hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-3 font-medium text-sm">
                              {item.category}
                            </td>
                            <td className="p-3 text-sm">
                              Rp{item.allocation.toLocaleString()}
                            </td>
                            <td className="p-3 text-sm">
                              Rp{item.realization.toLocaleString()}
                            </td>
                            <td className="p-3">
                              <div className="w-full max-w-xs">
                                <Progress
                                  value={
                                    item.percentage > 100
                                      ? 100
                                      : item.percentage
                                  }
                                  className={`h-6 ${item.color}`}
                                />
                              </div>
                            </td>
                            <td className="p-3 text-sm font-bold">
                              <span
                                className={
                                  item.percentage > 100
                                    ? "text-red-600"
                                    : "text-gray-900"
                                }
                              >
                                {item.percentage}%
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Pie Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">
                      Expense Realization Percentage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 sm:pt-0">
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}\n${(percent * 100).toFixed(1)}%`
                          }
                          labelLine={true}
                          fontSize={10}
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [
                            `${value}%`,
                            "Percentage",
                          ]}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Line Chart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">
                      Monthly Expense Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 sm:pt-0">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="month"
                          fontSize={10}
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis
                          tickFormatter={(value) =>
                            `Rp${(value / 1000000).toFixed(1)}M`
                          }
                          fontSize={10}
                          tick={{ fontSize: 10 }}
                        />
                        <Tooltip
                          formatter={(value: number) => [
                            `Rp${value.toLocaleString()}`,
                            "Amount",
                          ]}
                          labelStyle={{ color: "#374151" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="#ef4444"
                          strokeWidth={3}
                          dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <div className="content">{children}</div>
    </main>
  );
};

export default MainLayout;
