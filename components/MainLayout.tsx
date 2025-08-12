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

      <div className="flex flex-1 flex-col gap-4 sm:gap-6 p-4 sm:p-6 pt-0">
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-teal-50/50 p-4 sm:p-6 rounded-2xl">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 rounded-2xl p-6 sm:p-8 border border-blue-200"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-md transform rotate-45"></div>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-800 to-cyan-700 bg-clip-text text-transparent mb-1">
                      Financial Overview
                    </h1>
                    <p className="text-blue-700 text-sm sm:text-base">
                      Track your expenses and manage your budget
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-blue-700">
                      Year:
                    </span>
                    <span className="text-sm font-bold text-blue-800 bg-white px-3 py-1 rounded-lg border border-blue-200">2025</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-blue-700">
                      Month:
                    </span>
                    <Select defaultValue="january">
                      <SelectTrigger className="w-36 h-9 bg-white border-blue-300 text-blue-800">
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
              </div>
            </motion.div>

            {/* Monthly Report Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-cyan-50 to-blue-100 rounded-xl p-5 flex justify-between items-center border border-cyan-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <span className="text-cyan-700 text-lg">📊</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-800 to-blue-700 bg-clip-text text-transparent">Monthly Report</h2>
                  <p className="text-cyan-700 text-sm">January 2025 Overview</p>
                </div>
              </div>
              <Select defaultValue="bank1">
                <SelectTrigger className="w-40 bg-white border-cyan-300 text-cyan-800">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              {summaryCards.map((card, index) => {
                const icons = ['💰', '💎', '📊', '🏦'];
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="group"
                  >
                    <Card className="overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300">
                      <div className="bg-gray-50 p-4 relative">
                        <div className="absolute top-2 right-2 text-2xl opacity-30">
                          {icons[index]}
                        </div>
                        <h3 className="text-gray-700 font-semibold text-sm mb-1">
                          {card.title}
                        </h3>
                        <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                      </div>
                      <CardContent className="p-4 bg-white">
                        <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                          Rp{card.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Current Balance
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Expense Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border border-cyan-200 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-100 p-6 border-b border-cyan-200">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-800 to-blue-700 bg-clip-text text-transparent mb-2">Expense Breakdown</h3>
                  <p className="text-cyan-700 text-sm">Track your spending across different categories</p>
                </div>
                <CardContent className="p-0 bg-gradient-to-br from-white to-cyan-50/30">
                  {/* Mobile Card View */}
                  <div className="block lg:hidden space-y-4 p-6">
                    {expenseData.map((item, index) => {
                      const isOverBudget = item.percentage > 100;
                      const isNearBudget = item.percentage > 80 && item.percentage <= 100;
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.05 }}
                          className="bg-white rounded-xl p-4 shadow-md border border-gray-100 space-y-3"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                isOverBudget ? 'bg-red-500' : 
                                isNearBudget ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                              <span className="font-semibold text-gray-800">
                                {item.category}
                              </span>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              isOverBudget ? 'bg-red-100 text-red-800' :
                              isNearBudget ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {item.percentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 block">Budget</span>
                              <span className="font-medium text-gray-800">
                                Rp{item.allocation.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 block">Spent</span>
                              <span className={`font-medium ${
                                isOverBudget ? 'text-red-600' : 'text-gray-800'
                              }`}>
                                Rp{item.realization.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Progress</span>
                              <span>{item.percentage.toFixed(1)}%</span>
                            </div>
                            <Progress
                              value={item.percentage > 100 ? 100 : item.percentage}
                              className={`h-3 ${
                                isOverBudget ? 'bg-red-100' :
                                isNearBudget ? 'bg-yellow-100' : 'bg-green-100'
                              }`}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-cyan-100 to-blue-100 border-b border-cyan-200">
                        <tr>
                          <th className="text-left p-4 font-semibold text-cyan-800 text-sm">
                            Category
                          </th>
                          <th className="text-left p-4 font-semibold text-cyan-800 text-sm">
                            Budget
                          </th>
                          <th className="text-left p-4 font-semibold text-cyan-800 text-sm">
                            Spent
                          </th>
                          <th className="text-left p-4 font-semibold text-cyan-800 text-sm">
                            Progress
                          </th>
                          <th className="text-left p-4 font-semibold text-cyan-800 text-sm">
                            Usage %
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {expenseData.map((item, index) => {
                          const isOverBudget = item.percentage > 100;
                          const isNearBudget = item.percentage > 80 && item.percentage <= 100;
                          return (
                            <motion.tr
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 + index * 0.05 }}
                              className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-blue-50/50 transition-all duration-200"
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    isOverBudget ? 'bg-red-500' : 
                                    isNearBudget ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}></div>
                                  <span className="font-semibold text-gray-800">{item.category}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="text-gray-700 font-medium">
                                  Rp{item.allocation.toLocaleString()}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`font-medium ${
                                  isOverBudget ? 'text-red-600' : 'text-gray-700'
                                }`}>
                                  Rp{item.realization.toLocaleString()}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="w-full max-w-xs">
                                  <div className="flex items-center gap-2">
                                    <Progress
                                      value={item.percentage > 100 ? 100 : item.percentage}
                                      className={`h-3 flex-1 ${
                                        isOverBudget ? 'bg-red-100' :
                                        isNearBudget ? 'bg-yellow-100' : 'bg-green-100'
                                      }`}
                                    />
                                    <span className="text-xs text-gray-500 min-w-[3rem]">
                                      {item.percentage.toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  isOverBudget ? 'bg-red-100 text-red-800' :
                                  isNearBudget ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {item.percentage.toFixed(1)}%
                                </span>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="border border-cyan-200 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-100 p-6 border-b border-cyan-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <span className="text-xl text-cyan-700">🥧</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold bg-gradient-to-r from-cyan-800 to-blue-700 bg-clip-text text-transparent">
                          Expense Distribution
                        </CardTitle>
                        <p className="text-cyan-700 text-sm mt-1">
                          Breakdown by category
                        </p>
                      </div>
                    </div>
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
                <Card className="border border-cyan-200 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-100 p-6 border-b border-cyan-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <span className="text-xl text-cyan-700">📈</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold bg-gradient-to-r from-cyan-800 to-blue-700 bg-clip-text text-transparent">
                          Spending Trends
                        </CardTitle>
                        <p className="text-cyan-700 text-sm mt-1">
                          Monthly expense patterns
                        </p>
                      </div>
                    </div>
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
                          stroke="#0891b2"
                          strokeWidth={3}
                          dot={{ fill: "#0891b2", strokeWidth: 2, r: 4 }}
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
