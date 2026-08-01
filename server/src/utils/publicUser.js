export function toPublicUser(authUser, profile = null) {
  if (!authUser) return null;

  const metadata = authUser.user_metadata || {};
  return {
    id: authUser.id,
    email: profile?.email || authUser.email,
    username: profile?.username || metadata.username || profile?.full_name || metadata.full_name || authUser.email,
    name: profile?.full_name || profile?.username || metadata.full_name || metadata.username || authUser.email,
  };
}
