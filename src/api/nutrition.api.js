import { httpGet, httpPut } from "./http";

export function fetchNutritionPlan(clientId) {
  return httpGet(`/nutrition/${clientId}`);
}

export function saveNutritionPlan(clientId, nutritionState) {
  return httpPut(`/nutrition/${clientId}`, nutritionState);
}
