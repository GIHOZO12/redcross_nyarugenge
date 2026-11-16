/** Membership requests and their approval. */

import { get, post } from "../client";
import { endpoints } from "../endpoints";

export const membershipService = {
  request: (payload = {}) => post(endpoints.membership.request, payload),

  allRequests: () => get(endpoints.membership.allRequests),

  /** @returns {Promise<number>} pending request count for the sidebar badge. */
  async totalRequests() {
    const data = await get(endpoints.membership.totalRequests);
    return data?.total_requests ?? 0;
  },

  approve: (requestId) => post(endpoints.membership.approve(requestId)),
};

export default membershipService;
