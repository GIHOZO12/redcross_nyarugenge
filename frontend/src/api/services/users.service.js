/** Members, profiles and the general-information form. */

import { get, post, put, downloadFile } from "../client";
import { endpoints } from "../endpoints";

export const usersService = {
  list: () => get(endpoints.users.list),

  adminDashboard: () => get(endpoints.users.adminInfo),

  allGeneralInformation: () => get(endpoints.users.allGeneralInformation),

  getGeneralInformation: (userId) =>
    get(endpoints.users.editGeneralInformation(userId)),

  /** Create the member's general information record. */
  createGeneralInformation: (payload) =>
    post(endpoints.users.generalInformation, payload),

  /** Update an existing general information record (the API expects PUT). */
  updateGeneralInformation: (userId, payload) =>
    put(endpoints.users.editGeneralInformation(userId), payload),

  /** Save the short profile (names, phone, ...) from the profile tab. */
  addUserInfo: (payload) => post(endpoints.users.addUserInfo, payload),

  /**
   * Is this national ID already registered?
   *
   * A courtesy check so the form can flag the problem next to the field
   * instead of failing on save. It never blocks submission: if the check
   * itself fails - offline, endpoint missing, server asleep - this answers
   * "not taken" and lets the request through, because `nationalId` is unique
   * in the database and that is what actually enforces it. Throwing here
   * would stop a member registering over a failed *optional* lookup.
   *
   * @returns {Promise<boolean>} true only when the ID is known to be taken.
   */
  async isNationalIdTaken(nationalId) {
    try {
      const data = await get(endpoints.users.checkNationalId, {
        params: { nationalId },
      });
      return Boolean(data?.exists ?? data?.is_taken ?? false);
    } catch (error) {
      console.warn(
        "National ID check unavailable; the server will validate on save.",
        error?.response?.status ?? error?.message ?? error
      );
      return false;
    }
  },

  downloadUserInfo: (userId, filename = `member-${userId}.pdf`) =>
    downloadFile(endpoints.users.downloadUserInfo(userId), filename),

  downloadProofOfRegistration: (
    userId,
    filename = `proof-of-registration-${userId}.pdf`
  ) => downloadFile(endpoints.users.proofOfRegistration(userId), filename),
};

export default usersService;
