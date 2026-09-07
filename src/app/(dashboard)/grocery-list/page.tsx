"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Check, X, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroceryItem {
  id: string;
  name: string;
  checked: boolean;
  category: string;
}

const INITIAL_GROCERY_LIST: GroceryItem[] = [
  { id: "1", name: "Moong dal (split yellow)", checked: false, category: "Pulses & Proteins" },
  { id: "2", name: "Turmeric powder", checked: true, category: "Spices & Herbs" },
  { id: "3", name: "Onions (1kg)", checked: false, category: "Vegetables" },
  { id: "4", name: "Tomatoes (500g)", checked: false, category: "Vegetables" },
  { id: "5", name: "Peanuts", checked: false, category: "Pulses & Proteins" },
];

export default function GroceryListPage() {
  const [items, setItems] = useState<GroceryItem[]>(INITIAL_GROCERY_LIST);
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    fetch("/api/grocery")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.items && data.items.length > 0) {
          setItems(
            data.items.map((i: any) => ({
              id: i.id,
              name: i.name,
              checked: i.isChecked,
              category: i.category || "Other",
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const categories = Array.from(new Set(items.map(i => i.category)));

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    
    const tempId = Math.random().toString(36).substring(7);
    const newItem: GroceryItem = {
      id: tempId,
      name: newItemName.trim(),
      checked: false,
      category: "Other",
    };
    
    setItems([...items, newItem]);
    const nameToAdd = newItemName.trim();
    setNewItemName("");

    try {
      const res = await fetch("/api/grocery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameToAdd, category: "OTHER" }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.item?.id) {
          setItems((prev) =>
            prev.map((i) => (i.id === tempId ? { ...i, id: data.item.id } : i))
          );
        }
      }
    } catch (e) {
      console.error("Failed to add grocery item:", e);
    }
  };

  const toggleItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    const newChecked = !item?.checked;

    setItems(items.map(item => 
      item.id === id ? { ...item, checked: newChecked } : item
    ));

    try {
      await fetch(`/api/grocery?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isChecked: newChecked }),
      });
    } catch (e) {
      console.error("Failed to update item checked status:", e);
    }
  };

  const removeItem = async (id: string) => {
    setItems(items.filter(item => item.id !== id));
    try {
      await fetch(`/api/grocery?id=${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete grocery item:", e);
    }
  };

  const clearChecked = async () => {
    setItems(items.filter(item => !item.checked));
    try {
      await fetch(`/api/grocery?clearChecked=true`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to clear checked grocery items:", e);
    }
  };

  const checkedCount = items.filter(i => i.checked).length;
  const progressPercent = items.length === 0 ? 0 : Math.round((checkedCount / items.length) * 100);

  return (
    <div className="container-app py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="w-5 h-5 text-brand-turmeric" aria-hidden />
            <h1 className="page-title">Grocery List</h1>
          </div>
          <p className="text-text-muted">
            Items you need for your planned meals.
          </p>
        </div>
        
        {checkedCount > 0 && (
          <button 
            onClick={clearChecked}
            className="text-sm font-medium text-text-muted hover:text-status-error transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            Clear checked
          </button>
        )}
      </div>

      {/* Progress */}
      {items.length > 0 && (
        <div className="card p-4 mb-6 bg-surface-muted/50 border-dashed">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-text-secondary">{checkedCount} of {items.length} items collected</span>
            <span className="text-brand-green">{progressPercent}%</span>
          </div>
          <div className="progress-bar h-2">
            <div 
              className="progress-fill bg-brand-green" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>
      )}

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="relative mb-8">
        <input
          type="text"
          className="input pr-12 shadow-sm"
          placeholder="Add an item..."
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <button
          type="submit"
          disabled={!newItemName.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-brand-green text-white rounded-lg disabled:opacity-50 transition-opacity"
          aria-label="Add item"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {/* List */}
      {items.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-text-placeholder" />
          </div>
          <h2 className="font-semibold text-text-primary mb-1">Your list is empty</h2>
          <p className="text-sm text-text-muted">
            Add items manually or plan meals to generate a list.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {categories.map(category => {
            const categoryItems = items.filter(i => i.category === category);
            if (categoryItems.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3 px-1">
                  {category}
                </h3>
                <div className="card overflow-hidden">
                  <ul className="flex flex-col">
                    {categoryItems.map((item, index) => (
                      <li 
                        key={item.id}
                        className={cn(
                          "flex items-center gap-3 p-3 sm:p-4 border-b border-border-muted last:border-0 transition-colors",
                          item.checked && "bg-surface-muted/30"
                        )}
                      >
                        <button
                          className="text-text-placeholder cursor-grab active:cursor-grabbing hover:text-text-secondary transition-colors touch-none"
                          aria-label="Drag to reorder"
                        >
                          <GripVertical className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={cn(
                            "w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors",
                            item.checked 
                              ? "bg-brand-green border-brand-green text-white" 
                              : "border-text-placeholder hover:border-brand-green"
                          )}
                          aria-label={item.checked ? `Mark ${item.name} as uncompleted` : `Mark ${item.name} as completed`}
                        >
                          {item.checked && <Check className="w-4 h-4" />}
                        </button>
                        
                        <span className={cn(
                          "flex-1 font-medium text-sm transition-all",
                          item.checked ? "text-text-placeholder line-through" : "text-text-primary"
                        )}>
                          {item.name}
                        </span>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-text-placeholder hover:text-status-error hover:bg-status-error-bg transition-colors shrink-0"
                          aria-label={`Remove ${item.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
