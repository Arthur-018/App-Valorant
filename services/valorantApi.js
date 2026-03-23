const BASE_URL = "https://valorant-api.com/v1";

export async function getEndpoint(endpoint) {
  const response = await fetch(`${BASE_URL}/${endpoint}`);
  const json = await response.json();
  return json.data;
}