import { httpGet, httpPut } from "./http";

export function fetchTrainingPlan(clientId) {
  return httpGet(`/training/${clientId}`);
}

export function saveTrainingPlan(clientId, plan) {
  return httpPut(`/training/${clientId}`, plan);
}
