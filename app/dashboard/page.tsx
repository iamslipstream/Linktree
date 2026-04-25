import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { addLink, deleteLink, setUsername } from "./actions";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { links: { orderBy: { order: "asc" } } },
  });

  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-black">
      <div className="mx-auto w-full max-w-xl">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
              Dashboard
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {user.name} · {user.email}
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Sign out
            </button>
          </form>
        </header>

        <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Your username
          </h2>
          <p className="mt-1 text-zinc-700 dark:text-zinc-300">
            {user.username ? (
              <>
                Public page:{" "}
                <a
                  href={`/${user.username}`}
                  className="font-mono underline"
                  target="_blank"
                >
                  /{user.username}
                </a>
              </>
            ) : (
              "Pick one to publish your link page."
            )}
          </p>
          <form action={setUsername} className="mt-3 flex gap-2">
            <input
              name="username"
              defaultValue={user.username ?? ""}
              placeholder="rahul"
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Save
            </button>
          </form>
        </section>

        <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Add a link
          </h2>
          <form action={addLink} className="mt-3 flex flex-col gap-2">
            <input
              name="title"
              placeholder="My GitHub"
              required
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <input
              name="url"
              placeholder="https://github.com/yourname"
              required
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              type="submit"
              className="self-start rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Add link
            </button>
          </form>
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Your links ({user.links.length})
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {user.links.length === 0 ? (
              <li className="text-sm text-zinc-500">No links yet.</li>
            ) : (
              user.links.map((link) => (
                <li
                  key={link.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-black dark:text-zinc-50">
                      {link.title}
                    </div>
                    <div className="truncate text-sm text-zinc-500">
                      {link.url}
                    </div>
                  </div>
                  <form action={deleteLink}>
                    <input type="hidden" name="id" value={link.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
                    >
                      Delete
                    </button>
                  </form>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}
