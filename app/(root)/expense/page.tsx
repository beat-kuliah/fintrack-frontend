"use client";

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Filter, Loader2, ChevronDown, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import useTransactions, { Transaction, TransactionFilters, CreateTransactionData } from "@/components/hooks/useTransactions"
import useExpenseAnalytics, { CategorySummary, TrendData } from "@/components/hooks/useExpenseAnalytics"
import usePockets, { Account } from "@/components/hooks/usePockets"
import useLogout from "@/components/hooks/useLogout"
// Removed useBudgetCategories import as budgeting feature is removed

// Updated interface to match API response
interface ExpenseEntry {
  id: number
  user_id: number
  account_id: number
  description: string
  amount: string
  category: string
  transaction_date: string
  transaction_type: string
  created_at: string
  updated_at: string
}

// Helper function to format date from API response
const formatApiDate = (dateString: string) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, "0")
  const month = date.toLocaleString("default", { month: "short" })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

// Helper function to convert Transaction to ExpenseEntry for display
const transactionToExpenseEntry = (transaction: Transaction): ExpenseEntry => {
  return {
    id: transaction.id,
    user_id: transaction.user_id,
    account_id: transaction.account_id,
    description: transaction.description,
    amount: transaction.amount,
    category: transaction.category,
    transaction_date: transaction.transaction_date,
    transaction_type: transaction.transaction_type,
    created_at: transaction.created_at,
    updated_at: transaction.updated_at,
  }
}

// Helper function to get account name by ID
const getAccountName = (accountId: number, accounts: Account[]) => {
  const account = accounts.find(acc => acc.id === accountId)
  return account ? `${account.name} (${account.account.String})` : `Account ${accountId}`
}

// Helper function to get month dates
const getMonthDates = (month: string, year: number) => {
  const monthMap: { [key: string]: number } = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
  }
  
  const monthIndex = monthMap[month]
  // Use UTC to avoid timezone issues
  const firstDay = new Date(Date.UTC(year, monthIndex, 1))
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0))
  
  return {
    from_date: firstDay.toISOString().split('T')[0],
    to_date: lastDay.toISOString().split('T')[0]
  }
}

const getDetailedPeriod = (month: string, year: number) => {
  const monthMap: { [key: string]: number } = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
  }
  
  const monthNames: { [key: string]: string } = {
    january: 'Januari', february: 'Februari', march: 'Maret', april: 'April', 
    may: 'Mei', june: 'Juni', july: 'Juli', august: 'Agustus', 
    september: 'September', october: 'Oktober', november: 'November', december: 'Desember'
  }
  
  const monthIndex = monthMap[month]
  const lastDay = new Date(year, monthIndex + 1, 0).getDate()
  
  return `1 - ${lastDay} ${monthNames[month]} ${year}`
}

// Categories will be loaded from API

// Available accounts will be loaded from API

const Expense = () => {
  // Authentication hook
  const { logout } = useLogout();
  
  // API hooks
  const { 
    loading: transactionsLoading, 
    error: transactionsError, 
    getTransactions, 
    createTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions(logout)
  
  const { 
    loading: analyticsLoading, 
    error: analyticsError, 
    getExpenseSummary,
    getCategoryBreakdown,
    getMonthlyTrends
  } = useExpenseAnalytics(logout)
  
  const {
    getActiveAccounts
  } = usePockets(logout)
  
  // Static categories since budgeting feature is removed
  const categories = ["Food", "Transportation", "Entertainment", "Shopping", "Bills", "Healthcare", "Other"]
  const categoriesLoading = false
  const categoriesError = null

  // State management
  const [expenseData, setExpenseData] = useState<ExpenseEntry[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<ExpenseEntry | null>(null)
  const [totalBalance, setTotalBalance] = useState<number>(0)
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategorySummary[]>([])
  const [monthlyTrends, setMonthlyTrends] = useState<TrendData[]>([])
  
  // Loading states to prevent double clicks
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [isEditingExpense, setIsEditingExpense] = useState(false)
  const [isDeletingExpense, setIsDeletingExpense] = useState(false)


  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date()
    const monthNames = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ]
    return monthNames[now.getMonth()]
  })
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [newEntry, setNewEntry] = useState<Partial<CreateTransactionData>>({
    account_id: 1,
    description: "",
    category: "",
    amount: "",
    transaction_date: new Date().toISOString().split("T")[0],
    transaction_type: "expense",
  })

  // Load initial data
  useEffect(() => {
    loadTransactions()
    loadExpenseSummary()
    loadAccounts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedCategory, selectedMonth, selectedYear])
  
  // Load accounts on component mount
  useEffect(() => {
    loadAccounts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Set default category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !newEntry.category) {
      setNewEntry(prev => ({
        ...prev,
        category: categories[0]
      }))
    }
  }, [categories, newEntry.category])

  // Handle errors
  useEffect(() => {
    if (transactionsError) {
      toast.error(`Transactions Error: ${transactionsError}`)
    }
    if (analyticsError) {
      toast.error(`Analytics Error: ${analyticsError}`)
    }
  }, [transactionsError, analyticsError])

  // Load transactions with current filters
  const loadTransactions = async () => {
    const filters: TransactionFilters = {
      page: currentPage,
      limit: itemsPerPage,
      transaction_type: "expense",
    }
    
    if (selectedCategory !== "all") {
      filters.category = selectedCategory
    }
    
    // Add date range for selected month and year
    const dateParams = getMonthDates(selectedMonth, selectedYear)
    filters.from_date = dateParams.from_date
    filters.to_date = dateParams.to_date
    
    const response = await getTransactions(filters)
    if (response?.data) {
      const entries = response.data.map(transactionToExpenseEntry)
    setExpenseData(entries)
      setTotalItems(response.total_items || 0)
      setTotalPages(Math.ceil((response.total_items || 0) / itemsPerPage))
    }
  }

  // Load expense summary for selected month and year
  const loadExpenseSummary = async () => {
    const dateParams = getMonthDates(selectedMonth, selectedYear)
    
    // Load summary
    const summary = await getExpenseSummary(dateParams)
    if (summary) {
      setTotalBalance(parseFloat(summary.total_expense))
    }
    
    // Load category breakdown
    const categoryData = await getCategoryBreakdown(dateParams)
    if (categoryData) {
      setCategoryBreakdown(categoryData.categories || [])
    }
    
    // Load monthly trends (last 6 months from selected year)
    const sixMonthsAgo = new Date(selectedYear, new Date().getMonth() - 5, 1)
    const currentMonth = new Date(selectedYear, 11, 31) // End of selected year
    const trendsParams = {
      from_date: sixMonthsAgo.toISOString().split('T')[0],
      to_date: currentMonth.toISOString().split('T')[0]
    }
    const trendsData = await getMonthlyTrends(trendsParams)
    if (trendsData) {
      setMonthlyTrends(trendsData.trends || [])
    }
    

  }
  
  // Load active accounts
  const loadAccounts = async () => {
    const response = await getActiveAccounts()
    if (response && Array.isArray(response)) {
      setAccounts(response)
      // Set default account_id to first active account if available
      if (response.length > 0 && newEntry.account_id === 1) {
        setNewEntry(prev => ({ ...prev, account_id: response[0].id }))
      }
    }
  }

  // Handle adding a new entry
  const handleAddEntry = async () => {
    if (isAddingExpense) return
    if (newEntry.description && newEntry.amount && newEntry.account_id) {
      setIsAddingExpense(true)
      try {
        const result = await createTransaction(newEntry as CreateTransactionData)
        
        if (result) {
          setIsAddModalOpen(false)
          setNewEntry({
            account_id: 1,
            description: "",
            category: categories.length > 0 ? categories[0] : "",
            amount: "",
            transaction_date: new Date().toISOString().split("T")[0],
            transaction_type: "expense",
          })
          // Reload transactions
          loadTransactions()
          loadExpenseSummary()
        }
      } finally {
        setIsAddingExpense(false)
      }
    }
  }

  // Handle editing an entry
  const handleEditEntry = async () => {
    if (isEditingExpense) return
    if (selectedEntry && selectedEntry.description && selectedEntry.amount) {
      setIsEditingExpense(true)
      try {
        const updateData: CreateTransactionData = {
          account_id: selectedEntry.account_id,
          description: selectedEntry.description,
          amount: selectedEntry.amount,
          category: selectedEntry.category,
          transaction_date: selectedEntry.transaction_date.split('T')[0],
          transaction_type: "expense",
        }
        
        const result = await updateTransaction(selectedEntry.id, updateData)
        
        if (result) {
          setIsEditModalOpen(false)
          setSelectedEntry(null)
          // Reload transactions
          loadTransactions()
          loadExpenseSummary()
        }
      } finally {
        setIsEditingExpense(false)
      }
    }
  }

  // Handle deleting an entry
  const handleDeleteEntry = async (id: number) => {
    if (isDeletingExpense) return
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    setIsDeletingExpense(true)
    try {
      const result = await deleteTransaction(id);
      
      if (result) {
        // Immediately update local state to remove the deleted item
        const updatedData = expenseData.filter(item => item.id !== id);
        setExpenseData(updatedData);
        
        // If current page becomes empty and we're not on page 1, go to previous page
        if (updatedData.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        
        // Then reload data to ensure consistency with server
        await loadTransactions();
        await loadExpenseSummary();
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      // Reload data even on error to ensure UI is in sync with server
      await loadTransactions();
    } finally {
      setIsDeletingExpense(false)
    }
  };



  // Open edit modal for an entry
  const openEditModal = (entry: ExpenseEntry) => {
    setSelectedEntry({ ...entry })
    setIsEditModalOpen(true)
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-2 sm:px-4">
        <div className="flex items-center gap-2 w-full">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm sm:text-lg font-semibold truncate">Expense Tracker</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-2 sm:gap-4 p-2 sm:p-4 pt-0">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4 rounded-xl">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-rose-50 rounded-lg p-4 sm:p-6 shadow-sm"
            >
              <h1 className="text-2xl font-bold text-rose-500">Expense Tracker</h1>
              <div className="flex gap-2">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-32 bg-white text-rose-500 border-rose-200">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="january">January</SelectItem>
                  <SelectItem value="february">February</SelectItem>
                  <SelectItem value="march">March</SelectItem>
                  <SelectItem value="april">April</SelectItem>
                  <SelectItem value="may">May</SelectItem>
                  <SelectItem value="june">June</SelectItem>
                  <SelectItem value="july">July</SelectItem>
                  <SelectItem value="august">August</SelectItem>
                  <SelectItem value="september">September</SelectItem>
                  <SelectItem value="october">October</SelectItem>
                  <SelectItem value="november">November</SelectItem>
                  <SelectItem value="december">December</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
                <SelectTrigger className="w-20 bg-white text-rose-500 border-rose-200">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => 2025 + i).map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>
            </motion.div>

            {/* Date and Balance */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-lg p-4 border-b border-gray-200"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-rose-400">Period:</span>
                <span className="text-sm font-medium">{getDetailedPeriod(selectedMonth, selectedYear)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-amber-500 font-medium">{selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)} Balance</span>
                <span className="text-sm font-bold text-amber-500">Rp{totalBalance.toLocaleString()}</span>
              </div>
            </motion.div>



            {/* Add Button and Loading */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between items-center"
            >
              <div>
                {(transactionsLoading || analyticsLoading) && (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
                    <span className="text-sm text-gray-500">
                      {transactionsLoading && analyticsLoading ? 'Loading data...' : 
                       transactionsLoading ? 'Loading transactions...' : 'Loading analytics...'}
                    </span>
                  </div>
                )}
              </div>
              <Button 
                onClick={() => setIsAddModalOpen(true)} 
                className="bg-rose-500 hover:bg-rose-600 text-white"
                disabled={transactionsLoading || isAddingExpense}
              >
                {(transactionsLoading || isAddingExpense) ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />{transactionsLoading ? "Loading..." : "Adding..."}</>
                ) : (
                  <><Plus className="h-4 w-4 mr-2" /> Add New Expense</>
                )}
              </Button>
            </motion.div>

            {/* Expense Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {/* Table Header */}
              <div className="grid grid-cols-12 bg-gray-100 p-3 border-b border-gray-200 text-sm font-medium text-gray-600">
                <div className="col-span-2 flex items-center gap-1">
                  Date <ChevronDown className="h-3 w-3" />
                </div>
                <div className="col-span-3">Description</div>
                <div className="col-span-2 flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Category
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-6 text-xs ml-1 w-16 bg-white">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {categoriesLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading categories...
                    </SelectItem>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-categories" disabled>
                      No categories available
                    </SelectItem>
                  )}
                </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-2 flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Account
                  <Select defaultValue="all">
                    <SelectTrigger className="h-6 text-xs ml-1 w-16 bg-white">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id.toString()}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 text-center">Actions</div>
              </div>

              {/* Table Body */}
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {expenseData.length === 0 && !transactionsLoading ? (
                  <div className="p-8 text-center text-gray-500">
                    No transactions found for the current filters.
                  </div>
                ) : (
                  expenseData.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.03 }}
                      className="grid grid-cols-12 p-3 border-b border-gray-100 hover:bg-gray-50 text-sm"
                    >
                      <div className="col-span-2 text-gray-600">{formatApiDate(entry.transaction_date)}</div>
                      <div className="col-span-3 font-medium">{entry.description}</div>
                      <div className="col-span-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100">{entry.category}</span>
                      </div>
                      <div className="col-span-2 text-right font-mono">Rp{parseFloat(entry.amount).toLocaleString()}</div>
                      <div className="col-span-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600">{getAccountName(entry.account_id, accounts)}</span>
                      </div>
                      <div className="col-span-1 flex justify-center gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => openEditModal(entry)}>
                          <Edit2 className="h-3 w-3 text-gray-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700" 
                          onClick={() => handleDeleteEntry(entry.id)}
                          disabled={isDeletingExpense}
                        >
                          {isDeletingExpense ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Pagination Controls */}
             {totalPages > 1 && (
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="flex justify-center items-center gap-2 bg-white rounded-lg p-4 shadow-sm"
               >
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                   disabled={currentPage === 1 || transactionsLoading}
                 >
                   Previous
                 </Button>
                 
                 <div className="flex items-center gap-2">
                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                     const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                     if (pageNum > totalPages) return null
                     
                     return (
                       <Button
                         key={pageNum}
                         variant={currentPage === pageNum ? "default" : "outline"}
                         size="sm"
                         onClick={() => setCurrentPage(pageNum)}
                         disabled={transactionsLoading}
                         className={currentPage === pageNum ? "bg-rose-500 hover:bg-rose-600" : ""}
                       >
                         {pageNum}
                       </Button>
                     )
                   })}
                 </div>
                 
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                   disabled={currentPage === totalPages || transactionsLoading}
                 >
                   Next
                 </Button>
                 
                 <div className="ml-4 text-sm text-gray-500">
                   Page {currentPage} of {totalPages} ({totalItems} items)
                 </div>
               </motion.div>
             )}

             {/* Analytics Section */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
               {/* Category Breakdown */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5 }}
                 className="bg-white rounded-lg p-6 shadow-sm"
               >
                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h3>
                 {analyticsLoading ? (
                   <div className="flex justify-center py-8">
                     <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
                   </div>
                 ) : categoryBreakdown.length > 0 ? (
                   <div className="space-y-3">
                     {categoryBreakdown.map((category, index) => (
                       <div key={index} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className="w-3 h-3 rounded-full bg-rose-500" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}></div>
                           <span className="text-sm font-medium">{category.category}</span>
                         </div>
                         <div className="text-right">
                           <div className="text-sm font-semibold">Rp {Number(category.total_amount).toLocaleString('id-ID')}</div>
                           <div className="text-xs text-gray-500">{category.percentage}% ({category.transaction_count} transactions)</div>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center py-8 text-gray-500">
                     No category data available
                   </div>
                 )}
               </motion.div>

               {/* Monthly Trends */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.6 }}
                 className="bg-white rounded-lg p-6 shadow-sm"
               >
                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trends</h3>
                 {analyticsLoading ? (
                   <div className="flex justify-center py-8">
                     <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
                   </div>
                 ) : monthlyTrends.length > 0 ? (
                   <div className="space-y-3">
                     {monthlyTrends.map((trend, index) => {
                       const maxAmount = Math.max(...monthlyTrends.map(t => Number(t.total_amount)))
                       const percentage = (Number(trend.total_amount) / maxAmount) * 100
                       
                       return (
                         <div key={index} className="space-y-2">
                           <div className="flex justify-between items-center">
                             <span className="text-sm font-medium">{trend.period}</span>
                             <span className="text-sm text-gray-600">Rp {Number(trend.total_amount).toLocaleString('id-ID')}</span>
                           </div>
                           <div className="w-full bg-gray-200 rounded-full h-2">
                             <div 
                               className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                               style={{ width: `${percentage}%` }}
                             ></div>
                           </div>
                           <div className="text-xs text-gray-500">{trend.transaction_count} transactions</div>
                         </div>
                       )
                     })}
                   </div>
                 ) : (
                   <div className="text-center py-8 text-gray-500">
                     No trend data available
                   </div>
                 )}
               </motion.div>
             </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>Enter the details of your new expense entry.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right text-sm font-medium">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                className="col-span-3"
                value={newEntry.transaction_date as string}
                onChange={(e) => setNewEntry({ ...newEntry, transaction_date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-sm font-medium">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Enter expense description"
                className="col-span-3"
                value={newEntry.description || ""}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right text-sm font-medium">
                Category
              </Label>
              <Select
                value={newEntry.category}
                onValueChange={(value) => setNewEntry({ ...newEntry, category: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading categories...
                    </SelectItem>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-categories" disabled>
                      No categories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right text-sm font-medium">
                Amount (Rp)
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                className="col-span-3"
                value={newEntry.amount || ""}
                onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account_id" className="text-right text-sm font-medium">
                Account
              </Label>
              <Select
                value={newEntry.account_id?.toString() || ""}
                onValueChange={(value) => setNewEntry({ ...newEntry, account_id: Number(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.name} ({account.account.String})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddEntry} 
              className="bg-rose-500 hover:bg-rose-600"
              disabled={isAddingExpense}
            >
              {isAddingExpense ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                "Add Expense"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>Update the details of your expense entry.</DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right text-sm font-medium">
                  Date
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  className="col-span-3"
                  value={selectedEntry.transaction_date.split('T')[0]}
                  onChange={(e) => setSelectedEntry({ ...selectedEntry, transaction_date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right text-sm font-medium">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  placeholder="Enter expense description"
                  className="col-span-3"
                  value={selectedEntry.description}
                  onChange={(e) => setSelectedEntry({ ...selectedEntry, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right text-sm font-medium">
                  Category
                </Label>
                <Select
                  value={selectedEntry.category}
                  onValueChange={(value) => setSelectedEntry({ ...selectedEntry, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading categories...
                      </SelectItem>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>
                        No categories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-amount" className="text-right text-sm font-medium">
                  Amount (Rp)
                </Label>
                <Input
                  id="edit-amount"
                  type="number"
                  placeholder="0"
                  className="col-span-3"
                  value={selectedEntry.amount}
                  onChange={(e) => setSelectedEntry({ ...selectedEntry, amount: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-account_id" className="text-right text-sm font-medium">
                  Account
                </Label>
                <Select
                  value={selectedEntry.account_id?.toString() || ""}
                  onValueChange={(value) => setSelectedEntry({ ...selectedEntry, account_id: Number(value) })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id.toString()}>
                        {account.name} ({account.account.String})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditEntry} 
              className="bg-rose-500 hover:bg-rose-600"
              disabled={isEditingExpense}
            >
              {isEditingExpense ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
};

export default Expense;
