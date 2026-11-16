/** Contact messages: the public form and the admin inbox. */

import { get, post, toFormData } from "../client";
import { endpoints } from "../endpoints";

/** Inbox filters used by the admin message list. */
export const MESSAGE_FILTERS = {
  ALL: "all",
  UNREAD: "unread",
  READ: "read",
  REPLIED: "replied",
};

const FILTER_ENDPOINTS = {
  [MESSAGE_FILTERS.ALL]: endpoints.messages.adminList,
  [MESSAGE_FILTERS.UNREAD]: endpoints.messages.unread,
  [MESSAGE_FILTERS.READ]: endpoints.messages.read,
  [MESSAGE_FILTERS.REPLIED]: endpoints.messages.replied,
};

export const messagesService = {
  all: () => get(endpoints.messages.all),

  /** @param {string} filter - a value from `MESSAGE_FILTERS` */
  inbox: (filter = MESSAGE_FILTERS.ALL) =>
    get(FILTER_ENDPOINTS[filter] || endpoints.messages.adminList),

  /** Public "share an idea" / contact submission (multipart, as the view expects). */
  send: (payload) => post(endpoints.messages.send, toFormData(payload)),

  /** Reply to one message. */
  reply: (messageId, reply) =>
    post(endpoints.messages.reply(messageId), { reply }),

  /**
   * Bulk action over selected messages.
   * @param {Array<number>} ids
   * @param {"read"|"unread"|"delete"} action
   */
  updateStatus: (ids, action) =>
    post(endpoints.messages.updateStatus, { ids, action }),
};

export default messagesService;
