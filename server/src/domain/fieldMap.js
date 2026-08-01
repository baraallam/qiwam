export const dbTables = {
  profiles: "public.profiles",
  plans: "public.plans",
  expenses: "public.expenses",
  categories: "public.categories",
  budgets: "public.budgets",
  monthlyReports: "public.monthly_reports",
};

export const userFieldMap = {
  id: {
    api: "user.id",
    db: "profiles.id",
  },
  email: {
    api: "email",
    db: "profiles.email",
  },
  name: {
    api: "name",
    db: "profiles.full_name and profiles.username",
  },
  username: {
    api: "derived from name",
    db: "profiles.username",
    note: "The UI now has one name field. The backend stores the lowercase version as username for login.",
  },
  password: {
    api: "password",
    db: "profiles.password_hash",
    note: "Passwords are hashed with bcrypt. Plaintext passwords are never stored or returned.",
  },
};

export const planFieldMap = {
  userId: {
    api: "authenticated user id",
    db: "plans.user_id",
  },
  data: {
    api: "plan data object",
    db: "plans.data",
    note: "The current app stores calculator, goals, categories, tx, fixed expenses, and targets inside this JSONB blob.",
  },
};
