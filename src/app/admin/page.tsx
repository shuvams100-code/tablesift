"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/admin/blog");
    }, [router]);

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
            <p style={{ color: "#64748b" }}>Redirecting to Blog Admin...</p>
        </div>
    );
}
