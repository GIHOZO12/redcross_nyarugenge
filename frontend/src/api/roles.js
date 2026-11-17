/**
 * Committee offices.
 *
 * A user's `role` records the office they hold. It is NOT where they sit in a
 * family: the same person can be a child of one family, the father of another,
 * and President of the unit all at once. Family placement lives in the
 * relations the API returns (`father`, `mother`, `children`), never in `role`.
 */

export const OFFICER_ROLES = ["President", "Vice President", "Secretary"];

/**
 * May this user manage family structure?
 *
 * Office only. `is_staff` deliberately does not qualify - it is a Django
 * permission flag ticked for all sorts of reasons, and reaching the admin
 * dashboard is not the same as being entitled to restructure families. The
 * server enforces the identical rule; this just decides whether to show the
 * control, so the UI never offers something the API would refuse.
 *
 * @param {{role?: string}|null|undefined} user
 */
export const isFamilyOfficer = (user) =>
  Boolean(user && OFFICER_ROLES.includes(user.role));

export default isFamilyOfficer;
