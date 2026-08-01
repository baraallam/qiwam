import { prisma } from "../config/prisma.js";

export async function getProfile(userId) {
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
  });

  if (!profile) return null;
  return {
    id: profile.id,
    full_name: profile.fullName,
    email: profile.email,
    username: profile.username,
  };
}

export async function createProfile({ id, name, email, passwordHash }) {
  const username = name.trim().toLowerCase();
  return prisma.profile.create({
    data: {
      id,
      fullName: name,
      username,
      email,
      passwordHash,
    },
  });
}

export async function findProfileByIdentifier(identifier) {
  const value = identifier.trim().toLowerCase();
  const rows = await prisma.$queryRaw`
    select id, full_name, email, username, password_hash
    from public.profiles
    where lower(email) = ${value}
       or lower(username) = ${value}
       or lower(full_name) = ${value}
    limit 1
  `;

  return rows[0] || null;
}

export async function profileEmailOrNameExists({ email, name }) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim().toLowerCase();
  const rows = await prisma.$queryRaw`
    select id
    from public.profiles
    where lower(email) = ${normalizedEmail}
       or lower(username) = ${normalizedName}
       or lower(full_name) = ${normalizedName}
    limit 1
  `;

  return Boolean(rows[0]);
}
