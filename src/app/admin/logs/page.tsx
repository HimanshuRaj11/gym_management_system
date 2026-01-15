"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function LogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/admin/logs", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) setLogs(await res.json());
            } catch (e) { console.error("Error"); }
            finally { setLoading(false); }
        };
        fetchLogs();
    }, []);

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">System Logs</h2>
                <Button variant="outline" onClick={() => window.location.reload()}>Refresh</Button>
            </div>

            <div className="border rounded-lg shadow-sm bg-black text-green-400 font-mono text-sm p-4 h-[500px] overflow-auto">
                {loading ? <p>Loading logs...</p> : logs.map(log => (
                    <div key={log._id} className="mb-2 border-b border-green-900/30 pb-2">
                        <span className="opacity-70">[{new Date(log.createdAt).toLocaleString()}]</span>{" "}
                        <span className="font-bold text-blue-400">{log.user?.name || "System"}</span>:{" "}
                        <span>{log.action}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
