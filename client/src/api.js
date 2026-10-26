// All talk to the server goes through here. The login token is kept in localStorage.
const KEY = 'wwe_token'

export const getToken = () => { try { return localStorage.getItem(KEY) } catch { return null } }
export const setToken = (t) => {
  try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY) } catch { /* ignore */ }
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.status = status
    this.data = data || {}
  }
}

async function call(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  let res
  try {
    res = await fetch(`/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  } catch {
    throw new ApiError('Cannot reach the server. Check that it is running.', 0)
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.error || 'Something went wrong.', res.status, data)
  return data
}

export const api = {
  catalog: () => call('GET', '/catalog'),
  signup: (b) => call('POST', '/auth/signup', b),
  verify: (b) => call('POST', '/auth/verify', b),
  resend: (b) => call('POST', '/auth/resend', b),
  login: (b) => call('POST', '/auth/login', b),
  me: () => call('GET', '/me'),
  leaderboard: () => call('GET', '/leaderboard'),
  startArena: (id) => call('POST', `/arenas/${id}/start`),
  answer: (id, choice) => call('POST', `/arenas/${id}/answer`, { choice }),
  forfeit: (id) => call('POST', `/arenas/${id}/forfeit`),
  unlockPlayer: (id) => call('POST', `/players/${id}/unlock`),
  bonus: () => call('POST', '/bonus'),
}
