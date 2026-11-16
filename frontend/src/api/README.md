# API layer

All backend communication goes through this folder. No component imports
`axios`, calls `fetch`, or contains a backend URL.

## Switching backends

One line in `frontend/.env`:

```
VITE_BACKEND_URL=https://redcross-backend-urqo.onrender.com
```

Restart `npm run dev` afterwards — Vite only reads `.env` at startup.

## Layout

| File | Responsibility |
| --- | --- |
| `../config/env.js` | Reads `VITE_BACKEND_URL`, warns loudly if missing |
| `client.js` | The one axios instance: auth header, CSRF header, cookies, token refresh + retry, blob downloads, `toFormData` |
| `endpoints.js` | Every backend path, in one object. Also `FAMILIES` |
| `services/` | One module per domain, e.g. `activitiesService.all()` |
| `session.js` | The only place that touches tokens / role flags / the refresh cookie |
| `errors.js` | `getErrorMessage(error)` → one readable sentence |
| `media.js` | `mediaUrl(path)` → absolute URL for images the API returns |
| `../hooks/` | `useFetch`, `useMutation`, `useFamilyPage` |

## Reading data in a page

```jsx
import { activitiesService } from "../api";
import { useFetch } from "../hooks";

const { data: activities, loading, error, refetch } = useFetch(
  activitiesService.all, // the request
  [],                    // deps, like useEffect
  []                     // value while loading
);
```

`useFetch` handles loading and error state, ignores responses that arrive
after unmount, and gives you `refetch` for use after a create or delete.

For a request that depends on a route param, wrap it so it is stable:

```jsx
const { data } = useFetch(
  useCallback(() => coursesService.firstAidDetail(id), [id]),
  [id]
);
```

## Writing data

```jsx
import { announcementsService, toFormData, getErrorMessage } from "../api";

try {
  await announcementsService.create(toFormData({ title, text }));
} catch (error) {
  setMessage(getErrorMessage(error));
}
```

Or with the hook, when you want `loading` for free:

```jsx
const { mutate: save, loading, error } = useMutation(announcementsService.create, {
  onSuccess: () => navigate("/admin/announcement"),
});
```

## What the client does for you

- **Auth** — attaches `Authorization: Bearer <token>` from `session`.
- **CSRF** — attaches `X-CSRFToken` from the `csrftoken` cookie on POST /
  PUT / PATCH / DELETE. Pages never read cookies themselves. If the cookie
  may not exist yet, call `authService.fetchCsrfToken()` once on mount.
- **Token refresh** — on a `401` it calls `/api/token/refresh/` once (shared
  between concurrent failures), then replays the original request. If the
  refresh token is dead it clears the session and fires
  `redcross:session-expired`, which `AppContext` listens for to reopen login.
- **File uploads** — pass a `FormData` body and let axios set the multipart
  boundary. Never set `Content-Type` by hand.
- **Downloads** — `usersService.downloadUserInfo(id)` fetches the blob and
  triggers the browser download.

## Adding an endpoint

1. Add the path to `endpoints.js`.
2. Add a method to the matching service in `services/`.
3. Call it from the page via `useFetch` / `useMutation`.
