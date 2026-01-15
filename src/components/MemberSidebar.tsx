"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    UserCircle,
    CreditCard,
    Target,
    ShoppingBag,
    LogOut,
    Dumbbell
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const MemberSidebar = () => {
    const pathname = usePathname();
    const { logout } = useAuth();

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/member/dashboard",
            color: "text-sky-500",
        },
        {
            label: "My Profile",
            icon: UserCircle,
            href: "/member/profile",
            color: "text-violet-500",
        },
        {
            label: "Payments",
            icon: CreditCard,
            href: "/member/payments",
            color: "text-pink-700",
        },
        {
            label: "Diet & Workout",
            icon: Target,
            href: "/member/diet",
            color: "text-emerald-500",
        },
        {
            label: "Store",
            icon: ShoppingBag,
            href: "/member/store",
            color: "text-orange-700",
        },
    ];

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/member/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <Dumbbell className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">GymPro Member</h1>
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

export default MemberSidebar;
