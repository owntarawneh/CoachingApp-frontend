// src/api/clients.api.js
import { httpGet, httpPut } from "./http";

export function fetchClients() {
  return httpGet("/clients");
}

export function fetchClientById(clientId) {
  return httpGet(`/clients/${clientId}`);
}

export function updateClient(clientId, payload) {
  return httpPut(`/clients/${clientId}`, payload);
}
