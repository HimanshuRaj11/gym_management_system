"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        memberId: "",
        amount: "",
        paymentMethod: "cash",
        transactionId: "",
        notes: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const [payRes, memRes] = await Promise.all([
                fetch("/api/admin/payments", { headers }),
                fetch("/api/admin/members", { headers })
            ]);

            if (payRes.ok) setPayments(await payRes.json());
            if (memRes.ok) setMembers(await memRes.json());
        } catch (e) {
            console.error("Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/admin/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    ...formData,
                    amount: Number(formData.amount)
                })
            });

            if (res.ok) {
                setIsRecording(false);
                fetchData(); // Refresh list
                setFormData({ memberId: "", amount: "", paymentMethod: "cash", transactionId: "", notes: "" });
            } else {
                alert("Failed to record payment");
            }
        } catch (e) {
            alert("Error");
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
                <Button onClick={() => setIsRecording(!isRecording)}>
                    {isRecording ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> Record Payment</>}
                </Button>
            </div>

            {isRecording && (
                <Card>
                    <CardHeader>
                        <CardTitle>Record New Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Member</Label>
                                    <select
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        required
                                        value={formData.memberId}
                                        onChange={e => setFormData({ ...formData, memberId: e.target.value })}
                                    >
                                        <option value="">Select Member</option>
                                        {members.map(m => (
                                            <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Amount</Label>
                                    <Input type="number" required value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Method</Label>
                                    <select
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={formData.paymentMethod}
                                        onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="upi">UPI</option>
                                        <option value="card">Card</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Transaction ID (Optional)</Label>
                                    <Input value={formData.transactionId} onChange={e => setFormData({ ...formData, transactionId: e.target.value })} />
                                </div>
                            </div>
                            <Button type="submit">Save Payment</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="border rounded-lg shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b hover:bg-muted/50">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Member</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Amount</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Method</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {loading ? <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr> :
                                payments.map(payment => (
                                    <tr key={payment._id} className="border-b hover:bg-muted/50">
                                        <td className="p-4 align-middle">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle">{payment.member?.user?.name || "Unknown"}</td>
                                        <td className="p-4 align-middle font-bold">${payment.amount}</td>
                                        <td className="p-4 align-middle capitalize">{payment.paymentMethod}</td>
                                        <td className="p-4 align-middle capitalize">{payment.status}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
