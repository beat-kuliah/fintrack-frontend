"use client";

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, ChevronDown, Filter, Edit2 } from "lucide-react"
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
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

// Define the spending entry type
interface SpendingEntry {
  id: number
  date: string
  description: string
  category: string
  total: number
  account: string
}

// Initial spending data
const initialSpendingData: SpendingEntry[] = [
  {
    id: 1,
    date: "01 Jan 2025",
    description: "Alokasi makan seminggu",
    category: "Food",
    total: 450000,
    account: "Bank 1",
  },
  {
    id: 2,
    date: "02 Jan 2025",
    description: "Belanja kebutuhan rumah bulanan",
    category: "Supplies",
    total: 300000,
    account: "Bank 2",
  },
  {
    id: 3,
    date: "03 Jan 2025",
    description: "Langganan netflix",
    category: "Entertainment",
    total: 65000,
    account: "Bank 1",
  },
  {
    id: 4,
    date: "04 Jan 2025",
    description: "Gopay untuk transport",
    category: "Transportation",
    total: 300000,
    account: "Bank 1",
  },
  {
    id: 5,
    date: "05 Jan 2025",
    description: "Nongkrong bersama sobat",
    category: "Food",
    total: 250000,
    account: "Bank 1",
  },
  {
    id: 6,
    date: "06 Jan 2025",
    description: "Beli obat di Halodoc",
    category: "Healthcare",
    total: 199990,
    account: "Bank 2",
  },
  {
    id: 7,
    date: "07 Jan 2025",
    description: "Tambahan belanja bulanan",
    category: "Supplies",
    total: 100000,
    account: "Bank 2",
  },
  {
    id: 8,
    date: "08 Jan 2025",
    description: "Alokasi makan seminggu",
    category: "Supplies",
    total: 450000,
    account: "Bank 3",
  },
  {
    id: 9,
    date: "09 Jan 2025",
    description: "Belanja kebutuhan rumah bulanan",
    category: "Shopping",
    total: 300000,
    account: "Bank 1",
  },
  {
    id: 10,
    date: "10 Jan 2025",
    description: "Langganan netflix",
    category: "Entertainment",
    total: 65000,
    account: "Bank 1",
  },
  {
    id: 11,
    date: "11 Jan 2025",
    description: "Gopay untuk transport",
    category: "Gifts",
    total: 175000,
    account: "Bank 1",
  },
  {
    id: 12,
    date: "12 Jan 2025",
    description: "Spending utiliti",
    category: "Utilities",
    total: 300000,
    account: "Bank 1",
  },
  {
    id: 13,
    date: "13 Jan 2025",
    description: "Spending beda bulan",
    category: "Home Rent",
    total: 1000000,
    account: "Bank 1",
  },
  {
    id: 14,
    date: "14 Jan 2025",
    description: "Spending",
    category: "Home Rent",
    total: 0,
    account: "Bank 1",
  },
]

// Available categories
const categories = [
  "Food",
  "Supplies",
  "Entertainment",
  "Transportation",
  "Healthcare",
  "Shopping",
  "Gifts",
  "Utilities",
  "Home Rent",
]

// Available accounts
const accounts = ["Bank 1", "Bank 2", "Bank 3"]

const Spending = () => {
  const [spendingData, setSpendingData] = useState<SpendingEntry[]>(initialSpendingData)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<SpendingEntry | null>(null)
  const [newEntry, setNewEntry] = useState<Partial<SpendingEntry>>({
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "Food",
    total: 0,
    account: "Bank 1",
  })

  // Calculate total balance
  const totalBalance = 2345000 // This would normally be calculated from actual data

  // Handle adding a new entry
  const handleAddEntry = () => {
    if (newEntry.description && newEntry.total) {
      const formattedDate = formatDateString(newEntry.date as string)
      const entry: SpendingEntry = {
        id: spendingData.length + 1,
        date: formattedDate,
        description: newEntry.description,
        category: newEntry.category || "Food",
        total: newEntry.total,
        account: newEntry.account || "Bank 1",
      }

      setSpendingData([...spendingData, entry])
      setIsAddModalOpen(false)
      setNewEntry({
        date: new Date().toISOString().split("T")[0],
        description: "",
        category: "Food",
        total: 0,
        account: "Bank 1",
      })
    }
  }

  // Handle editing an entry
  const handleEditEntry = () => {
    if (selectedEntry && selectedEntry.description && selectedEntry.total !== undefined) {
      const updatedData = spendingData.map((entry) => (entry.id === selectedEntry.id ? selectedEntry : entry))
      setSpendingData(updatedData)
      setIsEditModalOpen(false)
      setSelectedEntry(null)
    }
  }

  // Format date string
  const formatDateString = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = date.toLocaleString("default", { month: "short" })
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  // Open edit modal for an entry
  const openEditModal = (entry: SpendingEntry) => {
    setSelectedEntry({ ...entry })
    setIsEditModalOpen(true)
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-2 sm:px-4">
        <div className="flex items-center gap-2 w-full">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm sm:text-lg font-semibold truncate">Spending Tracker</h1>
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
              <h1 className="text-2xl font-bold text-rose-500">Spending Tracker</h1>
              <Select defaultValue="january">
                <SelectTrigger className="w-32 bg-white text-rose-500 border-rose-200">
                  <SelectValue placeholder="January" />
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
            </motion.div>

            {/* Date and Balance */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-lg p-4 border-b border-gray-200"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-rose-400">Date:</span>
                <span className="text-sm font-medium">24 Jan 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-amber-500 font-medium">January Balance</span>
                <span className="text-sm font-bold text-amber-500">Rp{totalBalance.toLocaleString()}</span>
              </div>
            </motion.div>

            {/* Add Button */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-end"
            >
              <Button onClick={() => setIsAddModalOpen(true)} className="bg-rose-500 hover:bg-rose-600 text-white">
                <Plus className="h-4 w-4 mr-2" /> Add New Spending
              </Button>
            </motion.div>

            {/* Spending Table */}
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
                  <Select defaultValue="all">
                    <SelectTrigger className="h-6 text-xs ml-1 w-16 bg-white">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
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
                        <SelectItem key={account} value={account.toLowerCase().replace(" ", "")}>
                          {account}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 text-center">Action</div>
              </div>

              {/* Table Body */}
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {spendingData.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.03 }}
                    className="grid grid-cols-12 p-3 border-b border-gray-100 hover:bg-gray-50 text-sm"
                  >
                    <div className="col-span-2 text-gray-600">{entry.date}</div>
                    <div className="col-span-3 font-medium">{entry.description}</div>
                    <div className="col-span-2">
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100">{entry.category}</span>
                    </div>
                    <div className="col-span-2 text-right font-mono">Rp{entry.total.toLocaleString()}</div>
                    <div className="col-span-2">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600">{entry.account}</span>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => openEditModal(entry)}>
                        <Edit2 className="h-3 w-3 text-gray-500" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Spending</DialogTitle>
            <DialogDescription>Enter the details of your new spending entry.</DialogDescription>
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
                value={newEntry.date as string}
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-sm font-medium">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Enter spending description"
                className="col-span-3"
                value={newEntry.description}
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
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total" className="text-right text-sm font-medium">
                Amount (Rp)
              </Label>
              <Input
                id="total"
                type="number"
                placeholder="0"
                className="col-span-3"
                value={newEntry.total || ""}
                onChange={(e) => setNewEntry({ ...newEntry, total: Number(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="account" className="text-right text-sm font-medium">
                Bank Account
              </Label>
              <Select value={newEntry.account} onValueChange={(value) => setNewEntry({ ...newEntry, account: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select bank account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
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
            <Button onClick={handleAddEntry} className="bg-rose-500 hover:bg-rose-600">
              Add Spending
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Spending</DialogTitle>
            <DialogDescription>Update the details of your spending entry.</DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right text-sm font-medium">
                  Date
                </Label>
                <Input
                  id="edit-date"
                  className="col-span-3"
                  value={selectedEntry.date}
                  onChange={(e) => setSelectedEntry({ ...selectedEntry, date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right text-sm font-medium">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  placeholder="Enter spending description"
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
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-total" className="text-right text-sm font-medium">
                  Amount (Rp)
                </Label>
                <Input
                  id="edit-total"
                  type="number"
                  placeholder="0"
                  className="col-span-3"
                  value={selectedEntry.total}
                  onChange={(e) => setSelectedEntry({ ...selectedEntry, total: Number(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-account" className="text-right text-sm font-medium">
                  Bank Account
                </Label>
                <Select
                  value={selectedEntry.account}
                  onValueChange={(value) => setSelectedEntry({ ...selectedEntry, account: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select bank account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account} value={account}>
                        {account}
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
            <Button onClick={handleEditEntry} className="bg-rose-500 hover:bg-rose-600">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
};

export default Spending;
