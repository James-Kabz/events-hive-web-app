import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">Events Hive</h1>
        <div>
          <Link href="/login">
            <Button variant="ghost" className="mr-2">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="mt-16">
        <h1 className="text-5xl font-bold mb-4">Post & Discover Events</h1>
        <p className="text-lg mb-8">
          Share your events with the world or explore exciting ones happening near you!
        </p>
        <div>
          <Button size="lg" className="mr-4">Create Event</Button>
          <Button size="lg" variant="ghost">Explore Events</Button>
        </div>
      </div>
    </section>
  );
}
