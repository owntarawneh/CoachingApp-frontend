import { httpGet, httpPost, httpPut } from "./http";

export function createCheckIn(payload) {
  return httpPost("/checkins", payload);
}

export function fetchCheckIns(query = "") {
  return httpGet(`/checkins${query}`);
}

export function fetchCheckInById(id) {
  return httpGet(`/checkins/${id}`);
}

export function reviewCheckIn(id, body) {
  return httpPut(`/checkins/${id}/review`, body);
}
