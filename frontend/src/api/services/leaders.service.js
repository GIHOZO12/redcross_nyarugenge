/** Unit leadership. */

import { get } from "../client";
import { endpoints } from "../endpoints";

export const leadersService = {
  list: () => get(endpoints.leaders.list),
};

export default leadersService;
