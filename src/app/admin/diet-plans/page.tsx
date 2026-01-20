"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function DietPlansPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        memberId: "",
        planName: "",
        description: "",
        meals: [{ time: "", items: "" }] // items as string for input, will split later
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const [plansRes, membersRes] = await Promise.all([
                axios.get("/api/admin/diet-plans", { headers }),
                axios.get("/api/admin/members", { headers })
            ]);

            setPlans(plansRes.data);
            setMembers(membersRes.data);
        } catch (e) {
            console.error("Error fetching data", e);
        } finally {
            setLoading(false);
        }
    };

    const handleMealChange = (index: number, field: string, value: string) => {
        const newMeals = [...formData.meals];
        (newMeals[index] as any)[field] = value;
        setFormData({ ...formData, meals: newMeals });
    };

    const addMealLine = () => {
        setFormData({
            ...formData,
            meals: [...formData.meals, { time: "", items: "" }]
        });
    };

    const removeMealLine = (index: number) => {
        const newMeals = formData.meals.filter((_, i) => i !== index);
        setFormData({ ...formData, meals: newMeals });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const payload = {
                ...formData,
                meals: formData.meals.map(m => ({
                    time: m.time,
                    items: m.items.split(",").map(i => i.trim()).filter(i => i)
                }))
            };

            const res = await axios.post("/api/admin/diet-plans", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 201) {
                setPlans([...plans, res.data]);
                setShowModal(false);
                setFormData({
                    memberId: "",
                    planName: "",
                    description: "",
                    meals: [{ time: "", items: "" }]
                });
            }
        } catch (error) {
            console.error("Error creating plan", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8 space-y-8 relative">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Diet Plans</h2>
                <Button onClick={() => setShowModal(true)}>
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
                            <p className="text-sm mb-2">{plan.description}</p>
                            <div className="space-y-2">
                                {plan.meals.slice(0, 3).map((meal: any, i: number) => (
                                    <div key={i} className="text-xs bg-slate-50 p-2 rounded border">
                                        <span className="font-bold block text-blue-600">{meal.time}</span>
                                        {meal.items.join(", ")}
                                    </div>
                                ))}
                                {plan.meals.length > 3 && <p className="text-xs text-muted-foreground">+{plan.meals.length - 3} more meals</p>}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div className=" inset-0 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold">Assign Diet Plan</h3>
                            <button onClick={() => setShowModal(false)}>
                                <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Select Member</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.memberId}
                                        onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a member</option>
                                        {members.map(m => (
                                            <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Plan Name</Label>
                                    <Input
                                        value={formData.planName}
                                        onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                                        placeholder="e.g. Weight Loss Plan A"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Optional description"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base">Meals</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addMealLine}>Add Meal</Button>
                                </div>

                                {formData.meals.map((meal, idx) => (
                                    <div key={idx} className="flex gap-4 items-start p-4 bg-slate-50 rounded-md">
                                        <div className="flex-1 space-y-2">
                                            <Label className="text-xs">Time (e.g. 8:00 AM)</Label>
                                            <Input
                                                value={meal.time}
                                                onChange={(e) => handleMealChange(idx, "time", e.target.value)}
                                                placeholder="Time"
                                                required
                                            />
                                        </div>
                                        <div className="flex-[2] space-y-2">
                                            <Label className="text-xs">Items (comma separated)</Label>
                                            <Input
                                                value={meal.items}
                                                onChange={(e) => handleMealChange(idx, "items", e.target.value)}
                                                placeholder="Oats, Banana, Milk..."
                                                required
                                            />
                                        </div>
                                        {formData.meals.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="mt-6 text-red-500"
                                                onClick={() => removeMealLine(idx)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? "Assigning..." : "Assign Plan"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
