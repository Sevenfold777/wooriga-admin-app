import { METHOD, _promise } from "./ApiConfig";

const prefix = "admin/letter";

export function getTodaySentApi() {
  return _promise(METHOD.GET, `${prefix}/today/sent`);
}

export function findLetterThemesApi({ prev }) {
  return _promise(METHOD.GET, `${prefix}/themes?prev=${prev}`);
}

export function findLetterThemeApi({ id }) {
  return _promise(METHOD.GET, `${prefix}/theme/${id}`);
}

export function deleteLetterThemeApi({ id }) {
  return _promise(METHOD.DELETE, `${prefix}/theme/${id}`);
}

export function editLetterThemeApi({
  id,
  title,
  payload,
  recommendText,
  example,
  hashtags,
}) {
  return _promise(METHOD.PATCH, `${prefix}/theme/${id}`, {
    title,
    payload,
    recommendText,
    example,
    hashtags,
  });
}

export function createLetterThemeApi({
  title,
  payload,
  recommendText,
  example,
  hashtags,
}) {
  return _promise(METHOD.POST, `${prefix}/theme`, {
    title,
    payload,
    recommendText,
    example,
    hashtags,
  });
}

export function findAllHashTagsApi() {
  return _promise(METHOD.GET, `${prefix}/hashtags`);
}

export function createHashTagApi({ name }) {
  return _promise(METHOD.POST, `${prefix}/hashtag`, { name });
}

export function deleteHashTagApi({ name }) {
  return _promise(METHOD.DELETE, `${prefix}/hashtag`, { name });
}

export function sendThemeRecommendNotifApi({ themeId }) {
  return _promise(METHOD.POST, `${prefix}/theme/${themeId}/recommend`);
}
