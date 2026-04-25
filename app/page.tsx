import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  let username: string | null = null;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { username: true },
    });
    username = user?.username ?? null;
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-100 via-white to-sky-100 dark:from-violet-950 dark:via-black dark:to-sky-950" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-300/40 blur-3xl dark:bg-violet-700/30" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-6xl">
          Your links,
          <br />
          one page.
        </h1>
        <p className="mt-6 max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          A tiny link-in-bio you can share anywhere. Built with Next.js, Postgres, and a weekend.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:scale-105 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Go to dashboard
              </Link>
              {username && (
                <Link
                  href={`/${username}`}
                  className="rounded-full border border-zinc-300 bg-white/70 px-6 py-3 text-sm font-medium text-zinc-900 backdrop-blur transition hover:scale-105 hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  View /{username}
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/api/auth/signin?callbackUrl=/dashboard"
              className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:scale-105 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Sign in to get started
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
