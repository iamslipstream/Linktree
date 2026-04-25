import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

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

  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
        {user.name ?? user.username}
      </h1>
      <p className="mt-1 text-sm text-zinc-500">@{user.username}</p>

      <div className="mt-10 flex w-full max-w-md flex-col gap-3">
        {user.links.length === 0 ? (
          <p className="text-center text-zinc-500">No links yet.</p>
        ) : (
          user.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-zinc-200 bg-white px-5 py-4 text-center font-medium text-zinc-900 transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              {link.title}
            </a>
          ))
        )}
      </div>
    </main>
  );
}
