import { METHOD, _promise } from "./ApiConfig";

const prefix = "admin/photo";

export function getPhotosCntApi() {
  return _promise(METHOD.GET, `${prefix}`);
}

export function getPhotoCommentsCntApi() {
  return _promise(METHOD.GET, `${prefix}/comments`);
}

export function getPhotoLikesCntApi() {
  return _promise(METHOD.GET, `${prefix}/comments`);
}
