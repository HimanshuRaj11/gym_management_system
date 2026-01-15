"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Calendar, CreditCard, Activity } from "lucide-react";

export default function MemberDashboard() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/member/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                }
            } catch (e) {
                console.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="text-sm text-muted-foreground">
                    Welcome back, {user?.name}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {/* Status Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Membership Status</CardTitle>
                        <Activity className={`h-4 w-4 ${profile?.status === 'active' ? 'text-green-500' : 'text-red-500'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{profile?.status || "Inactive"}</div>
                        <p className="text-xs text-muted-foreground">
                            Joined: {profile?.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'N/A'}
                        </p>
                    </CardContent>
                </Card>

                {/* Package Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{profile?.currentPackage?.name || "No Plan"}</div>
                        {profile?.packageEndDate && (
                            <p className="text-xs text-muted-foreground">
                                Expires: {new Date(profile.packageEndDate).toLocaleDateString()}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* BMI / Health (Placeholder) */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Physical Stats</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{profile?.weight ? `${profile.weight} kg` : "-"}</div>
                        <p className="text-xs text-muted-foreground">
                            Height: {profile?.height ? `${profile.height} cm` : "-"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Messages or Recent Notifications can go here */}
        </div>
    );
}
