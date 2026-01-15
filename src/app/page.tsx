import Link from "next/link";
import { Button } from "@/components/ui/button";
import MemberSearch from "@/components/MemberSearch";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-2xl">GymPro</div>
          <nav className="flex gap-4 items-center">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-slate-900 text-white text-center">
          <div className="container mx-auto px-4 space-y-6">
            <h1 className="text-5xl font-extrabold tracking-tight">Manage Your Gym Like a Pro</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              The ultimate solution for gym owners, trainers, and members. Streamline operations, track payments, and engage members.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <MemberSearch />
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2024 GymPro Management System. All rights reserved.
      </footer>
    </div>
  );
}
