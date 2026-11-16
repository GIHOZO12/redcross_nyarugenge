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

  /** @returns {Promise<boolean>} true when the national ID is already taken. */
  async isNationalIdTaken(nationalId) {
    const data = await get(endpoints.users.checkNationalId, {
      params: { nationalId },
    });
    return Boolean(data?.exists ?? data?.is_taken ?? false);
  },

  downloadUserInfo: (userId, filename = `member-${userId}.pdf`) =>
    downloadFile(endpoints.users.downloadUserInfo(userId), filename),

  downloadProofOfRegistration: (
    userId,
    filename = `proof-of-registration-${userId}.pdf`
  ) => downloadFile(endpoints.users.proofOfRegistration(userId), filename),
};

export default usersService;
