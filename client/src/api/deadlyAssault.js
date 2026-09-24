const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function getCurrentDeadlyAssault(signal) {
  const response = await fetch(`${API_BASE_URL}/api/deadly-assault/current`, { signal });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Unable to load Deadly Assault data.');
  return response.json();
}
