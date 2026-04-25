"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not signed in");
  }
  return session.user.id;
}

export async function setUsername(formData: FormData) {
  const userId = await requireUser();
  const raw = (formData.get("username") as string | null) ?? "";
  const username = raw.trim().toLowerCase();

  if (!/^[a-z0-9_-]{2,30}$/.test(username)) {
    throw new Error(
      "Username must be 2-30 chars, lowercase letters/numbers/_/- only"
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: { username },
  });

  revalidatePath("/dashboard");
}

export async function addLink(formData: FormData) {
  const userId = await requireUser();
  const title = ((formData.get("title") as string | null) ?? "").trim();
  const url = ((formData.get("url") as string | null) ?? "").trim();

  if (!title || !url) {
    throw new Error("Title and URL required");
  }

  const maxOrder = await prisma.link.aggregate({
    where: { userId },
    _max: { order: true },
  });
  const nextOrder = (maxOrder._max.order ?? -1) + 1;

  await prisma.link.create({
    data: { title, url, order: nextOrder, userId },
  });

  revalidatePath("/dashboard");
}

export async function deleteLink(formData: FormData) {
  const userId = await requireUser();
  const id = Number(formData.get("id"));

  const link = await prisma.link.findUnique({ where: { id } });
  if (!link || link.userId !== userId) {
    throw new Error("Not allowed");
  }

  await prisma.link.delete({ where: { id } });

  revalidatePath("/dashboard");
}
