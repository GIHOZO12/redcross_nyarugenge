/** Announcements: public list and admin CRUD. */

import { get, post, remove } from "../client";
import { endpoints } from "../endpoints";

export const announcementsService = {
  list: () => get(endpoints.announcements.list),

  /** The backend wraps this one in `{ announcements: [...] }`. */
  async adminList() {
    const data = await get(endpoints.announcements.adminList);
    return data?.announcements ?? data ?? [];
  },

  /** @param {FormData} formData */
  create: (formData) => post(endpoints.announcements.create, formData),

  remove: (id) => remove(endpoints.announcements.remove(id)),

  getForEdit: (id) => get(endpoints.announcements.edit(id)),

  /** @param {FormData} formData */
  update: (id, formData) => post(endpoints.announcements.edit(id), formData),
};

export default announcementsService;
