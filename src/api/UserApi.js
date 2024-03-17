import { METHOD, _promise } from "./ApiConfig";

const prefix = "admin/user";

export function getFamilyCntApi() {
  return _promise(METHOD.GET, `${prefix}/family`);
}

export function getUserCntApi() {
  return _promise(METHOD.GET, `${prefix}`);
}

export function getActiveUserApi() {
  return _promise(METHOD.GET, `${prefix}/active`);
}

export function getFamilyWithUserApi({ prev = 0 }) {
  return _promise(METHOD.GET, `${prefix}/byFamily?prev=${prev}`);
}

export function getPediaEdittedApi() {
  return _promise(METHOD.GET, `${prefix}/pedia`);
}

export function getUserStatApi({ prev }) {
  return _promise(METHOD.GET, `${prefix}/stat?prev=${prev}`);
}

export function getEmoSelectedApi() {
  return _promise(METHOD.GET, `${prefix}/emotion`);
}

export function getDAUApi({ prev = 0 }) {
  return _promise(METHOD.GET, `${prefix}/dau?prev=${prev}`);
}

export function getMAUApi({ prev = 0 }) {
  return _promise(METHOD.GET, `${prefix}/mau?prev=${prev}`);
}

// export function getBirthUsersApi() {
//   return _promise(METHOD.GET, `${prefix}/birthday`);
// }
