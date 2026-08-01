export const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

export function normalizeRegisterPayload(body) {
  return {
    name: String(body.name || "").trim().slice(0, 80),
    email: String(body.email || "").trim().toLowerCase().slice(0, 120),
    password: String(body.password || ""),
  };
}

export function normalizeLoginPayload(body) {
  return {
    identifier: String(body.identifier || "").trim().toLowerCase().slice(0, 120),
    password: String(body.password || ""),
  };
}
