import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-it";
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1. Exclude public paths
    const publicPaths = [
        "/login",
        "/signup",
        "/",
        "/api/auth/login",
        "/api/auth/register",
    ];
    if (publicPaths.some((path) => pathname.startsWith(path)) || pathname.startsWith("/_next") || pathname.startsWith("/static")) {
        return NextResponse.next();
    }

    // 2. Check for token
    const token = req.headers.get("Authorization")?.split(" ")[1] || req.cookies.get("token")?.value;

    if (!token) {
        if (pathname.startsWith("/api")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        // 3. Verify token
        const { payload } = await jwtVerify(token, encodedSecret);
        const role = payload.role as string;

        // 4. Role-Based Access Control (RBAC)
        if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
            if (role !== "admin") {
                if (pathname.startsWith("/api")) {
                    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
                }
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }
        }

        if (pathname.startsWith("/member") || pathname.startsWith("/api/member")) {
            if (role !== "member") {
                // Optional: Allow admin to access member routes? For now, strict.
                if (pathname.startsWith("/api")) {
                    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
                }
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }
        }

        // Add user info to headers for downstream access
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-user-id", payload.id as string);
        requestHeaders.set("x-user-role", role);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

    } catch (error) {
        console.error("Middleware Auth Error:", error);
        if (pathname.startsWith("/api")) {
            return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
