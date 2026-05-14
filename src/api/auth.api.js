import { httpPost } from "./http";

export function signup(email, password) {
  return httpPost("/auth/signup", { email, password });
}

export function login(email, password) {
  return httpPost("/auth/login", { email, password });
}
