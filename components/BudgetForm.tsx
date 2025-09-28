"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BudgetCategory, MonthlyBudget } from './hooks/useBudgetAPI';
import { toast } from '@/components/ui/use-toast';

interface BudgetFormProps {
  initialBudget?: MonthlyBudget | null;
  onSave: (budget: Omit<MonthlyBudget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

const categoryColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const categoryTypes = [
  { value: 'needs', label: 'Kebutuhan' },
  { value: 'wants', label: 'Keinginan' },
  { value: 'savings', label: 'Tabungan' },
];

const BudgetForm: React.FC<BudgetFormProps> = ({ 
  initialBudget, 
  onSave, 
  loading = false,
  open,
  onClose,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryType, setCategoryType] = useState<'needs' | 'wants' | 'savings'>('needs');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Initialize form with existing budget data for editing
  useEffect(() => {
    if (initialBudget && initialBudget.categories.length > 0) {
      const firstCategory = initialBudget.categories[0];
      setCategoryName(firstCategory.name);
      setCategoryType(firstCategory.type);
      setBudgetAmount(firstCategory.budgetedAmount.toString());
      setIsEditing(true);
      setEditingCategoryId(firstCategory.id);
    } else {
      // Reset form for new budget
      setCategoryName('');
      setCategoryType('needs');
      setBudgetAmount('');
      setIsEditing(false);
      setEditingCategoryId(null);
    }
  }, [initialBudget, open]);



  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi input
    const errors: string[] = [];
    
    if (!categoryName.trim()) {
      errors.push("Nama kategori harus diisi");
    } else if (categoryName.trim().length < 2) {
      errors.push("Nama kategori minimal 2 karakter");
    }
    
    if (!categoryType) {
      errors.push("Tipe kategori harus dipilih");
    }
    
    const amount = parseFloat(budgetAmount);
    if (!budgetAmount || isNaN(amount) || amount <= 0) {
      errors.push("Jumlah budget harus lebih dari 0");
    } else if (amount > 1000000000) {
      errors.push("Jumlah budget terlalu besar");
    }
    
    // Tampilkan error jika ada
    if (errors.length > 0) {
      toast({
        title: "Validasi Error",
        description: errors[0], // Tampilkan error pertama
        variant: "destructive",
      });
      return;
    }

    const now = new Date();

    // Create category object
    const category: BudgetCategory = {
      id: isEditing && editingCategoryId ? editingCategoryId : Date.now().toString(),
      name: categoryName.trim(),
      type: categoryType,
      budgetedAmount: amount,
      actualAmount: 0,
      color: categoryColors[Math.floor(Math.random() * categoryColors.length)],
    };

    // Create budget data with single category
    const budgetData = {
      month: (now.getMonth() + 1).toString(),
      year: now.getFullYear(),
      totalIncome: 0,
      categories: [category],
    };

    try {
      await onSave(budgetData);
      toast({
        title: "Berhasil!",
        description: isEditing ? "Kategori budget berhasil diupdate" : "Kategori budget berhasil ditambahkan",
      });
      onClose?.();
    } catch (error) {
      console.error('Error saving budget:', error);
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };



  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isEditing ? 'Edit Kategori Budget' : 'Tambah Kategori Budget'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryName" className="text-sm font-medium">
                Nama Kategori
              </Label>
              <Input
                id="categoryName"
                placeholder="Contoh: Makanan, Transport"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="mt-1"
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="categoryType" className="text-sm font-medium">
                Tipe Kategori
              </Label>
              <Select value={categoryType} onValueChange={(value) => setCategoryType(value as 'needs' | 'wants' | 'savings')}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budgetAmount" className="text-sm font-medium">
                Jumlah Budget
              </Label>
              <Input
                id="budgetAmount"
                type="number"
                placeholder="0"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Menyimpan...' : (isEditing ? 'Update' : 'Simpan')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetForm;