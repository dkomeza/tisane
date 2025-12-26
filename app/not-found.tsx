"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div>
            <h1>404</h1>
            <Button asChild>
                <Link href="/">Strona główna</Link>
            </Button>
        </div>
    );
}
