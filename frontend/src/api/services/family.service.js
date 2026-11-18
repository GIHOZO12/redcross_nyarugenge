/**
 * The seven-principle "families" (Humanity, Unit, Neutrality, ...).
 *
 * Every family page needs the same two lists plus a delete, so they share
 * these three calls and only pass their own slug from `FAMILIES`.
 */

import { get, remove } from "../client";
import { endpoints } from "../endpoints";

export const familyService = {
  adminList: () => get(endpoints.family.adminList),

  /** @param {string} family - a value from `FAMILIES` */
  members: (family) => get(endpoints.family.list(family)),

  /** @param {string} family - a value from `FAMILIES` */
  activities: (family) => get(endpoints.family.activities(family)),

  deleteActivity: (id) => remove(endpoints.family.deleteActivity(id)),

  /** One family activity with its full text. */
  async activityDetail(id) {
    const data = await get(endpoints.family.activityDetail(id));
    return data?.activity ?? null;
  },

  /** Members and activities in one round trip, for a family page's loader. */
  async overview(family) {
    const [members, activities] = await Promise.all([
      familyService.members(family),
      familyService.activities(family),
    ]);
    return { members, activities };
  },
};

export default familyService;
