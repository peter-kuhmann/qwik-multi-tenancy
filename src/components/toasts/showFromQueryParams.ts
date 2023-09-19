import type { ShowToastOptions } from "~/components/toasts/show";
import { showToast } from "~/components/toasts/show";

export type ShowToastFromQueryParams = {
  [queryParam: string]: { message: string; options?: ShowToastOptions };
};

export default function showToastsFromQueryParams(
  definitions: ShowToastFromQueryParams,
  doNotRemoveQueryParams?: true
) {
  const removeQueryParams = !doNotRemoveQueryParams;
  const searchParams = new URLSearchParams(location.search);

  for (const key of searchParams.keys()) {
    const definitionKey = `${key}=${searchParams.get(key)}`;
    const definition = definitions[definitionKey];
    if (definition) {
      showToast(definition.message, definition.options);

      if (removeQueryParams) {
        searchParams.delete(key);
      }
    }
  }

  if (removeQueryParams && window.history) {
    const newUrl = new URL(window.location.href);
    newUrl.search = searchParams.toString();
    window.history.replaceState(null, "", newUrl);
  }
}
