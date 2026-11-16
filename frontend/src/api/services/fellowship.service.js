/** Fellowships: public listings and admin CRUD. */

import { get, post, remove } from "../client";
import { endpoints } from "../endpoints";

export const fellowshipService = {
  all: () => get(endpoints.fellowship.all),

  latest: () => get(endpoints.fellowship.latest),

  adminList: () => get(endpoints.fellowship.adminList),

  /** @param {FormData} formData */
  create: (formData) => post(endpoints.fellowship.create, formData),

  adminDelete: (id) => remove(endpoints.fellowship.adminDelete(id)),

  getForEdit: (id) => get(endpoints.fellowship.adminEdit(id)),

  /** @param {FormData} formData */
  update: (id, formData) => post(endpoints.fellowship.adminEdit(id), formData),
};

export default fellowshipService;
