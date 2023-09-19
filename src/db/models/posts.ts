import { getPrisma } from "~/db/prisma";

export async function createPost(data: {
  text: string;
  tenantId: string;
  authorUserId: string;
}) {
  return getPrisma().post.create({
    data: {
      text: data.text,
      tenant: {
        connect: {
          tenantId: data.tenantId,
        },
      },
      author: {
        connect: {
          userId_tenantId: {
            userId: data.authorUserId,
            tenantId: data.tenantId,
          },
        },
      },
    },
  });
}

export async function fetchPostsPaginatedWithAuthorName(
  tenantId: string,
  skip: number,
  take: number
) {
  const [total, posts] = await getPrisma().$transaction([
    getPrisma().post.count({
      where: {
        tenantId: tenantId,
      },
    }),
    getPrisma().post.findMany({
      where: {
        tenantId: tenantId,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      skip,
      take,
    }),
  ]);

  return {
    total,
    posts,
  };
}
