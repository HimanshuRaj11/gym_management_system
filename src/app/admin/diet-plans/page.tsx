"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DietPlansPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/admin/diet-plans", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setPlans(await res.json());
        } catch (e) { console.error("Error"); }
        finally { setLoading(false); }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Diet Plans</h2>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Assign Plan
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? <p>Loading...</p> : plans.map(plan => (
                    <Card key={plan._id}>
                        <CardHeader>
                            <CardTitle>{plan.planName}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">Assigned to: {plan.member?.user?.name || "Unknown"}</p>
                            <p className="text-sm">{plan.description}</p>
                            <div className="mt-4 space-y-2">
                                {plan.meals.slice(0, 3).map((meal: any, i: number) => (
                                    <div key={i} className="text-xs bg-slate-50 p-2 rounded">
                                        <span className="font-bold">{meal.time}:</span> {meal.items.join(", ")}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
