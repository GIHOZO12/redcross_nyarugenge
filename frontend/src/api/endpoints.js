/**
 * Single source of truth for every backend route.
 *
 * Paths only - never full URLs. The host comes from `VITE_BACKEND_URL`
 * via the axios instance in `api/client.js`. If a route is renamed on the
 * Django side, it is corrected here once and the whole app follows.
 */

export const endpoints = {
  auth: {
    login: "/api/login/",
    register: "/api/register/",
    logout: "/api/logout/",
    refreshToken: "/api/token/refresh/",
    resetPassword: "/api/reset_password/",
    currentUser: "/api/current_user/",
    changeProfilePicture: "/api/change_profile_picture/",
    // Django CSRF cookie primers (the backend exposes both spellings).
    csrfToken: "/get-csrf-token/",
    csrfTokenAlt: "/get_csrf_token/",
    userToken: "/user_get_token/",
  },

  users: {
    list: "/users_info/",
    adminInfo: "/admin_info/",
    generalInformation: "/api/general_information/",
    addUserInfo: "/api/add_user_info/",
    allGeneralInformation: "/api/admin_all_generalinformation/",
    editGeneralInformation: (userId) => `/api/edit_general_information/${userId}/`,
    downloadUserInfo: (userId) => `/api/download_single_user_info/${userId}/`,
    proofOfRegistration: (userId) => `/api/proof_of_registration/${userId}/`,
    checkNationalId: "/api/check_national_id/",
  },

  membership: {
    request: "/api/request_membership/",
    allRequests: "/api/all_requested_memberships/",
    totalRequests: "/api/total_requested_memberships/",
    approve: (requestId) => `/api/approve_request_membership/${requestId}/`,
  },

  activities: {
    all: "/All_activities/",
    latest: "/latest_redcross_activities/",
    adminList: "/admin_activities/",
    create: "/create_activity/",
    // NOTE: these two must NOT start with `admin/`. The backend mounts the
    // Django admin site at `admin/`, which matches first and swallows any
    // route under it (redirecting to /admin/login/). Every other admin route
    // uses the `admin_` prefix for exactly this reason.
    adminCreate: "/admin_add_activity/",
    adminDelete: (id) => `/admin_delete_activity/${id}/`,
    edit: (id) => `/edit_activity/${id}`,
    update: (id) => `/update_activity/${id}/`,
  },

  /**
   * Committee family administration (President / Vice President / Secretary).
   * Unlike the other admin routes these require an authenticated officer.
   */
  familyAdmin: {
    overview: "/family_admin/families/",
    detail: (id) => `/family_admin/families/${id}/`,
    assignParent: (id) => `/family_admin/families/${id}/assign_parent/`,
    addChild: (id) => `/family_admin/families/${id}/children/`,
    assignableUsers: "/family_admin/assignable_users/",
  },

  family: {
    adminList: "/admin_family/",
    /** Members of one family, e.g. "Humanity", "unit", "neutrality". */
    list: (family) => `/family_list/${family}/`,
    /** Activities of one family. */
    activities: (family) => `/family_activities/${family}/`,
    deleteActivity: (id) => `/family_delete_activity/${id}/`,
  },

  fellowship: {
    all: "/all_fellowships/",
    latest: "/latest_fellowership/",
    adminList: "/admin_fellowships/",
    create: "/add_fellowship/",
    adminDelete: (id) => `/admin_deleter_fellowship/${id}/`,
    adminEdit: (id) => `/admin_edit_fellowship/${id}/`,
  },

  announcements: {
    list: "/announcement_list/",
    adminList: "/admin_announcement/",
    create: "/admin_add_announcement/",
    remove: (id) => `/admin_delete_announcement/${id}/`,
    edit: (id) => `/edit_announcement/${id}/`,
  },

  messages: {
    all: "/all_messages/",
    adminList: "/admin_messages/",
    unread: "/get_unread_messages/",
    read: "/get_read_messages/",
    replied: "/get_replied_messages/",
    send: "/messages_info/",
    reply: (id) => `/reply_to_message/${id}/`,
    updateStatus: "/update_message_status/",
  },

  newsletter: {
    letters: "/all_letter/",
    subscribers: "/all_subscribes/",
    subscribe: "/add_email_toseubscribenewsletter/",
    send: "/send_newsletter/",
  },

  courses: {
    firstAid: "/first-aid_course/",
    firstAidDetail: (id) => `/first-aid_course/${id}/`,
  },

  leaders: {
    list: "/leaders",
  },
};

/** The family slugs the backend recognises, kept here so pages don't hardcode typos. */
export const FAMILIES = {
  HUMANITY: "Humanity",
  UNIT: "unit",
  NEUTRALITY: "neutrality",
  IMPARTIALITY: "impartiality",
  UNIVERSALITY: "universality",
};

export default endpoints;
