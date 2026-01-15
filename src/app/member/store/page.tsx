"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function MemberStorePage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="p-8 space-y-8">
            <h2 className="text-3xl font-bold">Supplement Store</h2>
            <p className="text-muted-foreground">Browse our latest products.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? <p>Loading...</p> : items.map(item => (
                    <Card key={item._id} className="overflow-hidden hover:shadow-lg transition">
                        <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-400">
                            {item.image ? <img src={item.image} alt={item.name} className="h-full object-cover" /> : "No Image"}
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.brand}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="font-bold text-primary">${item.price}</span>
                                <Button variant="outline" size="sm">Details</Button>
                                {/* Here we could add "Buy Now" integration via Payment API */}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// Importing Button locally to avoid missing import if I copy-pasted too fast
import { Button } from "@/components/ui/button";
