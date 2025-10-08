type RefreshFn = () => Promise<string | void>
type LogoutFn = () => Promise<void> | void

let _refresh: RefreshFn | null = null
let _logout: LogoutFn | null = null

export function setAuthHandlers(handlers: { refresh: RefreshFn; logout: LogoutFn }) {
  _refresh = handlers.refresh
  _logout = handlers.logout
}
export function getRefresh() {
  if (!_refresh) throw new Error('Auth refresh handler not set')
  return _refresh
}
export function getLogout() {
  if (!_logout) throw new Error('Auth logout handler not set')
  return _logout
}