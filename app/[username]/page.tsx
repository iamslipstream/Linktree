import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
    select: { name: true, username: true },
  });
  if (!user) return { title: "Not found" };
  return {
    title: `${user.name ?? user.username} — links`,
    description: `${user.name ?? user.username}'s link page.`,
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: { links: { orderBy: { order: "asc" } } },
  });

  if (!user) {
    notFound();
  }

  const initial = (user.name ?? user.username ?? "?")[0]?.toUpperCase() ?? "?";

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-100 via-white to-sky-100 dark:from-violet-950 dark:via-black dark:to-sky-950" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-300/40 blur-3xl dark:bg-violet-700/30" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <div className="overflow-hidden rounded-full ring-4 ring-white shadow-xl shadow-black/10 dark:ring-zinc-900">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? user.username ?? "Profile"}
              width={96}
              height={96}
              className="h-24 w-24 object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center bg-gradient-to-br from-violet-500 to-sky-500 text-3xl font-semibold text-white">
              {initial}
            </div>
          )}
        </div>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
          {user.name ?? user.username}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">@{user.username}</p>

        <div className="mt-10 flex w-full flex-col gap-3">
          {user.links.length === 0 ? (
            <p className="text-center text-zinc-500">No links yet.</p>
          ) : (
            user.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-white/60 bg-white/80 px-5 py-4 text-center font-medium text-zinc-900 shadow-sm shadow-black/5 backdrop-blur transition hover:scale-[1.02] hover:bg-white hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900/70 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                {link.title}
              </a>
            ))
          )}
        </div>

        <footer className="mt-16 text-xs text-zinc-400 dark:text-zinc-600">
          made with{" "}
          <a href="/" className="underline-offset-2 hover:underline">
            linktree
          </a>
        </footer>
      </div>
    </main>
  );
}
