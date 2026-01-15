"use client";

import React from "react";
import MemberForm from "@/components/MemberForm";

export default function NewMemberPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Add New Member</h2>
                <p className="text-muted-foreground">User will receive login credentials via email (simulated).</p>
            </div>
            <MemberForm />
        </div>
    );
}
