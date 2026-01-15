"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function MemberSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            const res = await fetch(`/api/public/members?q=${encodeURIComponent(query)}`);
            if (res.ok) {
                const data = await res.json();
                setResults(data);
            } else {
                setResults([]);
            }
        } catch (err) {
            console.error("Search failed");
        } finally {
            setSearched(true);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Find a Gym Member</h2>
                <p className="text-muted-foreground">Verify membership status (Public Directory)</p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-4">
                <Input
                    placeholder="Search by name or email..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit">
                    <Search className="mr-2 h-4 w-4" /> Search
                </Button>
            </form>

            {searched && (
                <div className="grid gap-4 md:grid-cols-2">
                    {results.length === 0 ? (
                        <p className="text-center text-muted-foreground col-span-2">No members found.</p>
                    ) : (
                        results.map((member) => (
                            <Card key={member._id}>
                                <CardContent className="p-4 flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-500">
                                        {member.user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{member.user.name}</h3>
                                        <p className="text-sm text-muted-foreground">Status: <span className={member.status === 'active' ? 'text-green-600' : 'text-red-500'}>{member.status}</span></p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
