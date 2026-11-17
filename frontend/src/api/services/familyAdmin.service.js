/**
 * Committee family administration: President, Vice President, Secretary.
 *
 * Every call here requires an authenticated officer (staff included). The
 * client attaches the bearer token, so a 401 means "not signed in" and a 403
 * means "signed in, but not an officer" - worth telling those apart in the UI.
 */

import { get, post } from "../client";
import { endpoints } from "../endpoints";

export const familyAdminService = {
  /** Every family with its parents and child count. */
  async overview() {
    const data = await get(endpoints.familyAdmin.overview);
    return data?.families ?? [];
  },

  /** One family: parents plus the full list of children. */
  async detail(familyId) {
    const data = await get(endpoints.familyAdmin.detail(familyId));
    return data?.family ?? null;
  },

  /** Accounts an officer can pick, each with where they already sit. */
  async assignableUsers() {
    const data = await get(endpoints.familyAdmin.assignableUsers);
    return data?.users ?? [];
  },

  /**
   * Set or clear a family's father or mother.
   * @param {number} familyId
   * @param {"father"|"mother"} parent
   * @param {number|null} userId - null clears the slot
   */
  assignParent: (familyId, parent, userId) =>
    post(endpoints.familyAdmin.assignParent(familyId), {
      parent,
      user_id: userId,
    }),

  /**
   * Add a child, either from an existing account or as a plain record.
   * @param {number} familyId
   * @param {{user_id?: number, first_name?: string, last_name?: string, email?: string}} payload
   */
  addChild: (familyId, payload) =>
    post(endpoints.familyAdmin.addChild(familyId), payload),
};

export default familyAdminService;
