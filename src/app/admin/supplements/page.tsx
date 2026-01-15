"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";

export default function SupplementsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: "", brand: "", description: "", price: "", stock: "", category: "", image: ""
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/admin/supplements", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setItems(await res.json());
        } catch (e) {
            console.error("Error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/admin/supplements", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    stock: Number(formData.stock)
                })
            });
            if (res.ok) {
                setIsAdding(false);
                fetchItems();
                setFormData({ name: "", brand: "", description: "", price: "", stock: "", category: "", image: "" });
            } else {
                alert("Failed to add item");
            }
        } catch (e) { alert("Error"); }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Store Inventory</h2>
                <Button onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> Add Product</>}
                </Button>
            </div>

            {isAdding && (
                <Card>
                    <CardHeader><CardTitle>Add New Product</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Brand</Label>
                                <Input required value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Input required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Protein, Vitamin..." />
                            </div>
                            <div className="space-y-2">
                                <Label>Price ($)</Label>
                                <Input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Stock</Label>
                                <Input type="number" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                            </div>
                            <div className="col-span-2">
                                <Button type="submit" className="w-full">Save Product</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? <p>Loading...</p> : items.map(item => (
                    <Card key={item._id} className="overflow-hidden">
                        <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-400">
                            {item.image ? <img src={item.image} alt={item.name} className="h-full object-cover" /> : "No Image"}
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.brand}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="font-bold text-primary">${item.price}</span>
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded">Stock: {item.stock}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
