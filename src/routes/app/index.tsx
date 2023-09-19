import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { tenantHead } from "~/utils/head";
import AppPage from "~/components/routes/index/app/AppPage";
import {
  Form,
  routeAction$,
  routeLoader$,
  useLocation,
  zod$,
} from "@builder.io/qwik-city";
import { z } from "zod";
import { useSession } from "~/routes/plugin@sessions";
import {
  createPost,
  fetchPostsPaginatedWithAuthorName,
} from "~/db/models/posts";
import { useHasPermission } from "~/hooks/permissions";
import { getTenantByUrl } from "~/logic/tenants/read";
import { getSessionFromCookieAndTenantId } from "~/logic/sessions/read";
import {
  AddOutline,
  ChevronBackOutline,
  ChevronForwardOutline,
} from "qwik-ionicons";
import classNames from "classnames";
import { formatDistance, format, differenceInDays } from "date-fns";

const PageSize = 10;
const PageParamName = "page";

export default component$(() => {
  const canReadPosts = useHasPermission("POSTS_READ");
  const canCreatePosts = useHasPermission("POSTS_CREATE");

  return (
    <AppPage title={"Posts"}>
      {canCreatePosts && (
        <div class={"mb-8"}>
          <CreatePostForm />
          <hr class={"mt-8"} />
        </div>
      )}

      <div class={"mb-8"}>
        {canReadPosts ? (
          <PostList />
        ) : (
          <>You don't have enough permissions to read posts.</>
        )}
      </div>
    </AppPage>
  );
});

const CreatePostForm = component$(() => {
  const createPost = useCreatePost();
  const formRef = useSignal<HTMLFormElement>();

  useVisibleTask$(({ track }) => {
    track(() => createPost.value?.success);
    if (formRef.value && createPost.value?.success) {
      formRef.value.reset();
    }
  });

  return (
    <Form
      class={"flex flex-col gap-2 items-start max-w-[30rem]"}
      action={createPost}
      ref={formRef}
    >
      <textarea
        disabled={createPost.isRunning}
        class="textarea textarea-primary w-full"
        placeholder="Your post's content ..."
        required
        name={"text"}
      />

      <button
        type={"submit"}
        class={"btn btn-primary btn-sm"}
        disabled={createPost.isRunning}
      >
        {createPost.isRunning ? (
          <span class="loading loading-spinner"></span>
        ) : (
          <>
            Create post <AddOutline />
          </>
        )}
      </button>
    </Form>
  );
});

const Pagination = component$<{ class?: string }>((props) => {
  const data = usePosts().value;
  const { url } = useLocation();
  if (!data.accessGranted) return <></>;

  const { total } = data;
  const pageParam = url.searchParams.get(PageParamName);
  const page = pageParam ? parseInt(pageParam) : 0;
  const pageCount = Math.ceil(total / PageSize);

  return (
    <div class={classNames("join", props.class)}>
      <button
        class={"btn btn-sm dark:btn-neutral join-item"}
        disabled={page === 0}
        onClick$={() => {
          const nextPage = page - 1;
          if (nextPage === 0) {
            location.search = "";
          } else {
            location.search = `?${PageParamName}=${encodeURIComponent(
              nextPage
            )}`;
          }
        }}
      >
        <ChevronBackOutline />
      </button>

      <button class={"btn btn-sm dark:btn-neutral join-item"}>
        {`${page + 1} / ${pageCount}`}
      </button>

      <button
        class={"btn btn-sm dark:btn-neutral join-item"}
        disabled={page === pageCount - 1}
        onClick$={() => {
          location.search = `?${PageParamName}=${encodeURIComponent(page + 1)}`;
        }}
      >
        <ChevronForwardOutline />
      </button>
    </div>
  );
});

const PostList = component$(() => {
  const posts = usePosts().value;

  if (!posts.accessGranted) {
    return <></>;
  }

  return (
    <div>
      {posts.total === 0 ? (
        <>Nothing has been posted yet.</>
      ) : (
        <>
          <div class={"mb-4"}>{`There are ${posts.total} posts in total.`}</div>

          <Pagination class={"mb-4"} />

          <div class={"flex flex-col gap-2"}>
            {posts.posts.map((post) => {
              return (
                <div
                  key={post.postId}
                  class={
                    "rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-transparent px-6 py-3"
                  }
                >
                  <div class={"text-[1.13rem] mb-2"}>{post.text}</div>
                  <div class={"italic text-sm"}>
                    {formatDate(post.createdAt)}
                    {post.author ? " – " + post.author.name : ""}
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination class={"mt-4"} />
        </>
      )}
    </div>
  );
});

function formatDate(date: Date): string {
  const dayDifference = differenceInDays(Date.now(), date);

  if (dayDifference > 0) {
    return format(date, "dd.MM.yyyy HH.mm");
  }

  return formatDistance(date, Date.now(), {
    includeSeconds: true,
    addSuffix: true,
  });
}

export const head = tenantHead("Posts");

export const useCreatePost = routeAction$(
  async (data, { url, cookie }) => {
    const tenant = await getTenantByUrl(url);
    if (!tenant) throw new Error("No tenant");

    const session = await getSessionFromCookieAndTenantId(cookie, tenant.id);
    if (!session) throw new Error("No session");

    if (!session.user.permissionAssignment.POSTS_CREATE) {
      throw new Error("No permission");
    }

    await createPost({
      text: data.text,
      authorUserId: session.user.userId,
      tenantId: tenant.id,
    });

    return { success: true };
  },
  zod$({
    text: z.string(),
  })
);

export const usePosts = routeLoader$(
  async ({ resolveValue, redirect, query }) => {
    const pageParam = query.get(PageParamName);
    const page = pageParam ? parseInt(pageParam) : 0;

    if (page < 0) {
      throw redirect(302, "/app/");
    }

    const session = await resolveValue(useSession);
    if (!session) throw new Error("No session");
    if (!session.user.permissionAssignment.POSTS_READ)
      return { accessGranted: false } as const;

    const postData = UsePostsSchema.parse(
      await fetchPostsPaginatedWithAuthorName(
        session.tenantId,
        page * PageSize,
        PageSize
      )
    );

    // No posts and page > 0 -> redirect to first page
    if (postData.posts.length === 0 && page > 0) {
      throw redirect(302, "/app/");
    }

    return {
      ...postData,
      accessGranted: true,
    } as const;
  }
);

const UsePostsSchema = z.object({
  total: z.number(),
  posts: z.array(
    z.object({
      postId: z.string(),
      text: z.string(),
      createdAt: z.date(),
      author: z
        .object({
          name: z.string(),
        })
        .nullable()
        .optional(),
    })
  ),
});
