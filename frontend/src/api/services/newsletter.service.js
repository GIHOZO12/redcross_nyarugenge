/** Newsletter subscribers and campaigns. */

import { get, post, toFormData } from "../client";
import { endpoints } from "../endpoints";

export const newsletterService = {
  letters: () => get(endpoints.newsletter.letters),

  subscribers: () => get(endpoints.newsletter.subscribers),

  /** Sent as multipart because the Django view reads `request.POST`. */
  subscribe: (email) => post(endpoints.newsletter.subscribe, toFormData({ email })),

  /** @param {{subject: string, message: string}} payload */
  send: (payload) => post(endpoints.newsletter.send, payload),
};

export default newsletterService;
