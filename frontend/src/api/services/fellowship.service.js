/** Fellowships: public listings and admin CRUD. */

import { get, post, remove, toFormData } from "../client";
import { endpoints } from "../endpoints";

export const fellowshipService = {
  all: () => get(endpoints.fellowship.all),

  /** One fellowship with its full description and captioned gallery. */
  async detail(id) {
    const data = await get(endpoints.fellowship.detail(id));
    return data?.fellowship ?? null;
  },

  /**
   * Attach a captioned image. Officer or staff only.
   * @param {number} id
   * @param {{image: File, caption?: string}} payload
   */
  addImage: (id, { image, caption }) =>
    post(endpoints.fellowship.addImage(id), toFormData({ image, caption })),

  /** Remove one gallery image, file included. Officer or staff only. */
  deleteImage: (imageId) => remove(endpoints.fellowship.deleteImage(imageId)),

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
