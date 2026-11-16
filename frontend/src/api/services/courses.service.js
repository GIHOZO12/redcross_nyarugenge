/** First-aid courses. */

import { get } from "../client";
import { endpoints } from "../endpoints";

export const coursesService = {
  firstAidList: () => get(endpoints.courses.firstAid),

  firstAidDetail: (id) => get(endpoints.courses.firstAidDetail(id)),
};

export default coursesService;
