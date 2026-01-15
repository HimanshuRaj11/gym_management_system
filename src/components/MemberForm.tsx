"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast"; // Skipped for now

export default function MemberForm() {
    const router = useRouter();
    // const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "male",
        joiningDate: new Date().toISOString().split("T")[0],
        packageId: "",
    });

    useEffect(() => {
        // Fetch packages for dropdown
        const fetchPackages = async () => {
            try {
                const res = await fetch("/api/admin/fee-packages");
                if (res.ok) {
                    const data = await res.json();
                    setPackages(data);
                }
            } catch (e) {
                console.error("Failed to load packages");
            }
        };
        fetchPackages();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/admin/members", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                // toast({ title: "Success", description: "Member created successfully" });
                router.push("/admin/members");
            } else {
                const err = await res.json();
                alert(err.error || "Failed to create member");
                // toast({ title: "Error", description: err.error, variant: "destructive" });
            }
        } catch (error) {
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl border p-6 rounded-lg shadow-sm bg-white">
            <div className="space-y-2">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" required value={formData.phone} onChange={handleChange} placeholder="+1234567890" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <select
                            id="gender"
                            name="gender"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-medium">Membership Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="joiningDate">Joining Date</Label>
                        <Input id="joiningDate" name="joiningDate" type="date" required value={formData.joiningDate} onChange={handleChange} />
                    </div>
                    {/* Package selection logic will be handled better in Payment flow usually, but we can assign initial package here */}
                    <div className="space-y-2">
                        <Label htmlFor="packageId">Assign Package (Optional)</Label>
                        <select
                            id="packageId"
                            name="packageId"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.packageId}
                            onChange={handleChange}
                        >
                            <option value="">Select a package</option>
                            {packages.map(pkg => (
                                <option key={pkg._id} value={pkg._id}>{pkg.name} - ${pkg.amount}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Member
            </Button>
        </form>
    );
}
