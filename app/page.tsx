import { Button } from "@/components/ui/button";
import Link from "next/link";


export default async function Index() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <section className="flex flex-col items-center text-center py-20 space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Take Control of Your <span className="text-primary">Finances</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Streamline your finances and make informed decisions with our
            user-friendly expense tracker.
          </p>
          {/* Wrap Button inside Link component */}
          <Link href="/dashboard">
            <Button className="mt-8 text-lg px-8 py-4">Get Started</Button>
          </Link>
        </section>
      </main>
    </>
  );
}
