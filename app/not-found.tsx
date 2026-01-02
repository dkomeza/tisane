import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Baby } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-brand-softPink to-brand-pink/20 p-4">
      <Card className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">
            404 - Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Baby className="mx-auto w-24 h-24 text-brand-pink/70 mb-6 animate-bounce" />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            asChild
            className="w-full bg-brand-softPink hover:bg-brand-pink"
          >
            <Link href="/">Go back home</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
