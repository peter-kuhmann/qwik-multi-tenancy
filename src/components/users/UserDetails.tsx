import { component$, useSignal } from "@builder.io/qwik";
import AppPageSection from "~/components/routes/index/app/AppPageSection";
import type { PermissionAssignment } from "~/logic/permissions/PermissionAssignment";
import type { BasePermission } from "~/logic/permissions/Permissions";
import classNames from "classnames";
import { TrashOutline } from "qwik-ionicons";
import { is } from "date-fns/locale";

export type UserDetailsUser = {
  userId: string;
  name: string;
  email: string;
  tenant: {
    tenantId: string;
    name: string;
  };
  permissionAssignment: PermissionAssignment;
};

export type OnPermissionAssignmentChangedHandler = (
  user: { userId: string; tenantId: string },
  permission: BasePermission,
  assigned: boolean
) => void;

export type OnDeleteUserHandler = (user: {
  userId: string;
  tenantId: string;
}) => void;

export default component$<{
  user: UserDetailsUser;
  onPermissionAssignmentChanged$: OnPermissionAssignmentChangedHandler;
  onDelete$: OnDeleteUserHandler;
  showSuperPermissions: boolean;
  showDeletion: boolean;
  isSuperView: boolean;
  isMe: boolean;
}>(
  ({
    user,
    onPermissionAssignmentChanged$,
    showSuperPermissions,
    onDelete$,
    showDeletion,
    isSuperView,
    isMe,
  }) => {
    return (
      <div class={"flex flex-col gap-8"}>
        <InformationSection user={user} isSuperView={isSuperView} />

        <PermissionsSection
          user={user}
          onPermissionAssignmentChanged$={onPermissionAssignmentChanged$}
          showSuperPermissions={showSuperPermissions}
          isSuperView={isSuperView}
          isMe={isMe}
        />
        {showDeletion && <DeleteSection user={user} onDelete$={onDelete$} />}
      </div>
    );
  }
);

const InformationSection = component$<{
  user: UserDetailsUser;
  isSuperView: boolean;
}>(({ user, isSuperView }) => {
  return (
    <AppPageSection title={"Information"}>
      <div class={"grid grid-cols-2 gap-8 mb-2"}>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">ID</span>
          </label>
          <input
            type="text"
            readOnly
            placeholder="ID"
            class="input input-sm input-bordered w-full"
            value={user.userId}
          />
        </div>
      </div>

      <div class={"grid grid-cols-2 gap-8"}>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Name</span>
          </label>
          <input
            type="text"
            readOnly
            placeholder="Name"
            class="input input-sm input-bordered w-full"
            value={user.name}
          />
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">E-Mail</span>
          </label>
          <input
            type="text"
            readOnly
            placeholder="E-Mail"
            class="input input-sm input-bordered w-full"
            value={user.email}
          />
        </div>
      </div>

      {isSuperView && (
        <div class={"grid grid-cols-2 gap-8 mt-2"}>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Tenant</span>
            </label>
            <input
              type="text"
              readOnly
              placeholder="ID"
              class="input input-sm input-bordered w-full"
              value={user.tenant.name}
            />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Tenant ID</span>
            </label>
            <input
              type="text"
              readOnly
              placeholder="ID"
              class="input input-sm input-bordered w-full"
              value={user.tenant.tenantId}
            />
          </div>
        </div>
      )}
    </AppPageSection>
  );
});

const PermissionsSection = component$<{
  user: UserDetailsUser;
  onPermissionAssignmentChanged$: OnPermissionAssignmentChangedHandler;
  showSuperPermissions: boolean;
  isSuperView: boolean;
  isMe: boolean;
}>(
  ({
    user,
    onPermissionAssignmentChanged$,
    showSuperPermissions,
    isSuperView,
    isMe,
  }) => {
    return (
      <AppPageSection title={"Permissions"}>
        <div
          class={classNames("grid gap-16", {
            "grid-cols-1": !showSuperPermissions,
            "grid-cols-2": showSuperPermissions,
          })}
        >
          <div>
            <PermissionCheckbox
              disabled={!isSuperView && isMe}
              permission={"USERS_MANAGE"}
              user={user}
              label={"Manage users"}
              onAssignedChange$={onPermissionAssignmentChanged$}
            />

            <PermissionCheckbox
              permission={"POSTS_READ"}
              user={user}
              label={"Read posts"}
              onAssignedChange$={onPermissionAssignmentChanged$}
            />

            <PermissionCheckbox
              permission={"POSTS_CREATE"}
              user={user}
              label={"Write posts"}
              onAssignedChange$={onPermissionAssignmentChanged$}
            />
          </div>

          {showSuperPermissions && (
            <div>
              <div class={"text-sm mb-2"}>Super permissions</div>
              <PermissionCheckbox
                permission={"SUPER_TENANTS_MANAGE"}
                user={user}
                label={"Manage tenants"}
                onAssignedChange$={onPermissionAssignmentChanged$}
              />

              <PermissionCheckbox
                disabled={isSuperView && isMe}
                permission={"SUPER_ALL_USERS_MANAGE"}
                user={user}
                label={"Manage all users"}
                onAssignedChange$={onPermissionAssignmentChanged$}
              />
            </div>
          )}
        </div>
      </AppPageSection>
    );
  }
);

const PermissionCheckbox = component$<{
  permission: BasePermission;
  user: UserDetailsUser;
  label: string;
  onAssignedChange$: OnPermissionAssignmentChangedHandler;
  disabled?: boolean;
}>(({ permission, user, label, onAssignedChange$, disabled }) => {
  const loading = useSignal(false);
  const computedDisabled = loading.value || disabled;

  return (
    <div class="form-control">
      <label
        class={classNames("label justify-start gap-4", {
          "cursor-pointer": !computedDisabled,
        })}
      >
        <input
          disabled={computedDisabled}
          type="checkbox"
          checked={user.permissionAssignment[permission] === true}
          class="checkbox checkbox-sm"
          onChange$={(e) => {
            loading.value = true;
            void onAssignedChange$(
              { userId: user.userId, tenantId: user.tenant.tenantId },
              permission,
              e.target.checked
            ).finally(() => {
              loading.value = false;
            });
          }}
        />

        <span class="label-text">{label}</span>

        {loading.value && (
          <span class="loading loading-spinner loading-xs"></span>
        )}
      </label>
    </div>
  );
});

const DeleteSection = component$<{
  user: UserDetailsUser;
  onDelete$: OnDeleteUserHandler;
}>(({ user, onDelete$ }) => {
  return (
    <AppPageSection title={"Delete"}>
      <button
        class={"btn btn-neutral btn-error"}
        onClick$={() => {
          void onDelete$({
            userId: user.userId,
            tenantId: user.tenant.tenantId,
          });
        }}
      >
        Delete user permanently <TrashOutline />
      </button>
    </AppPageSection>
  );
});
