"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

export default function EditMemberPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    // params.id is available from the hook directly in Client Components
    const id = params?.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [packages, setPackages] = useState<any[]>([]);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const [memberRes, pkgRes] = await Promise.all([
                fetch(`/api/admin/members/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch("/api/admin/fee-packages")
            ]);

            if (memberRes.ok) {
                const data = await memberRes.json();
                // Flatten data roughly
                setFormData({
                    ...data,
                    name: data.user.name, // Display only
                    email: data.user.email, // Display only
                    packageId: data.currentPackage ? data.currentPackage._id : ""
                });
            }
            if (pkgRes.ok) {
                setPackages(await pkgRes.json());
            }
        } catch (e) {
            console.error("Error loading data");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/admin/members/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    phone: formData.phone,
                    gender: formData.gender,
                    status: formData.status,
                    packageId: formData.packageId
                }),
            });
            if (res.ok) {
                router.push("/admin/members");
            } else {
                alert("Failed to update");
            }
        } catch (e) {
            alert("Error updating");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this member?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/admin/members/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) router.push("/admin/members");
        } catch (e) {
            alert("Failed to delete");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Edit Member</h2>
                <Button variant="destructive" onClick={handleDelete}><Trash2 className="mr-2 h-4 w-4" /> Delete Member</Button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl border p-6 rounded-lg shadow-sm bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Name (Read Only)</Label>
                        <Input value={formData.name || ''} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label>Email (Read Only)</Label>
                        <Input value={formData.email || ''} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" value={formData.phone || ''} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            name="status"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={formData.status || 'active'}
                            onChange={handleChange}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="packageId">Change Package</Label>
                        <select
                            id="packageId"
                            name="packageId"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={formData.packageId || ''}
                            onChange={handleChange}
                        >
                            <option value="">Select Package</option>
                            {packages.map(pkg => (
                                <option key={pkg._id} value={pkg._id}>{pkg.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <Button type="submit" disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Changes
                </Button>
            </form>
        </div>
    );
}
