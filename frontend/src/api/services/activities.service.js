/** Red Cross activities: public listings and admin CRUD. */

import { get, post, remove } from "../client";
import { endpoints } from "../endpoints";

export const activitiesService = {
  all: () => get(endpoints.activities.all),

  latest: () => get(endpoints.activities.latest),

  adminList: () => get(endpoints.activities.adminList),

  /** @param {FormData} formData - includes the image file */
  create: (formData) => post(endpoints.activities.create, formData),

  /** @param {FormData} formData */
  adminCreate: (formData) => post(endpoints.activities.adminCreate, formData),

  adminDelete: (id) => remove(endpoints.activities.adminDelete(id)),

  /** Load one activity into the edit form. */
  getForEdit: (id) => get(endpoints.activities.edit(id)),

  /** @param {FormData} formData */
  saveEdit: (id, formData) => post(endpoints.activities.edit(id), formData),

  getForUpdate: (id) => get(endpoints.activities.update(id)),

  /** @param {FormData} formData */
  update: (id, formData) => post(endpoints.activities.update(id), formData),
};

export default activitiesService;
