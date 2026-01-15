"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    ShoppingBag,
    FileText,
    Settings,
    LogOut,
    Dumbbell
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
    const pathname = usePathname();
    const { logout } = useAuth();

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/admin/dashboard",
            color: "text-sky-500",
        },
        {
            label: "Members",
            icon: Users,
            href: "/admin/members",
            color: "text-violet-500",
        },
        {
            label: "Fees & Payments",
            icon: CreditCard,
            href: "/admin/payments", // Or /fees
            color: "text-pink-700",
        },
        {
            label: "Supplements",
            icon: ShoppingBag,
            href: "/admin/supplements",
            color: "text-orange-700",
        },
        {
            label: "Diet Plans",
            icon: FileText,
            href: "/admin/diet-plans",
            color: "text-emerald-500",
        },
        {
            label: "Logs", // Admin only
            icon: Settings,
            href: "/admin/logs",
        },
    ];

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/admin/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <Dumbbell className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">GymPro</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                <div
                    onClick={logout}
                    className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                    <div className="flex items-center flex-1">
                        <LogOut className="h-5 w-5 mr-3 text-red-500" />
                        Logout
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
