import { prisma } from "../config/prisma.js";

export async function getPlan(userId) {
  const plan = await prisma.plan.findUnique({
    where: { userId },
  });

  return plan?.data || null;
}

export async function savePlan(userId, data) {
  await prisma.plan.upsert({
    where: { userId },
    create: { userId, data: data || {} },
    update: { data: data || {} },
  });
}
