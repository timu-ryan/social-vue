let _get = () => ''
export const setTokenGetter = (fn: () => string) => { _get = fn }
export const getToken = () => _get()
