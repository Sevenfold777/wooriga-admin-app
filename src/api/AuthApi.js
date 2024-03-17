import { METHOD, _promise } from "./ApiConfig";

export function loginApi(payload) {
  return _promise(METHOD.POST, "users/login", payload);
}
