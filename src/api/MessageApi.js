import { METHOD, _promise } from "./ApiConfig";

const prefix = "admin/message";

export function getTodayCommentsCntApi() {
  return _promise(METHOD.GET, `${prefix}/comments`);
}

export function getTodayMetoosApi() {
  return _promise(METHOD.GET, `${prefix}/metoos`);
}

export function findMessagesNearArriveApi() {
  return _promise(METHOD.GET, `${prefix}/near`);
}

export function findMessageApi({ id, isSent }) {
  return _promise(METHOD.GET, `${prefix}/${id}?isSent=${isSent}`);
}

export function findMessagesApi({ prev }) {
  return _promise(METHOD.GET, `${prefix}?prev=${prev}`);
}

export function createMessageApi({
  payload,
  emotion,
  isNow = false,
  uploadAt,
  linkTo,
}) {
  return _promise(METHOD.POST, `${prefix}`, {
    payload,
    emotion,
    isNow,
    uploadAt,
    linkTo,
  });
}

export function editMessageApi({ id, payload, emotion, uploadAt, linkTo }) {
  return _promise(METHOD.PATCH, `${prefix}/${id}`, {
    payload,
    emotion,
    uploadAt,
    linkTo,
  });
}

export function deleteMessageApi({ id }) {
  return _promise(METHOD.DELETE, `${prefix}/${id}`);
}

export function sendMessagToFamApi({ messageId, receiveDate }) {
  return _promise(METHOD.POST, `${prefix}/send`, { messageId, receiveDate });
}

export function getAllFamiliesCntApi() {
  return _promise(METHOD.GET, `${prefix}/familyCnt`);
}

export function getCommentedUserFamCntApi() {
  return _promise(METHOD.GET, `${prefix}/comments/userFam`);
}
