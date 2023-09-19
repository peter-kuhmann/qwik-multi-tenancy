import type { DocumentHead, DocumentHeadProps } from "@builder.io/qwik-city";
import { useTenant } from "~/routes/plugin@tenants";

export function tenantHead(
  prefix?: string | ((props: DocumentHeadProps) => string)
): DocumentHead {
  return (props) => {
    const tenant = props.resolveValue(useTenant);
    const baseTitle = tenant ? tenant.name : "Multi-Tenancy with Qwik ⚡️";

    return {
      title: prefix
        ? `${
            typeof prefix === "function" ? prefix(props) : prefix
          } | ${baseTitle}`
        : baseTitle,
    };
  };
}
