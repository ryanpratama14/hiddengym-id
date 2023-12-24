import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { THROW_OK } from "@/trpc/shared";

const f = createUploadthing();

export const ourFileRouter = {
  uploadUserImage: f({ image: { maxFileSize: "1MB" } })
    .middleware(async () => {
      const session = await getServerAuthSession();
      if (!session || !session.user) throw new Error("UNAUTHORIZED");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      const newImage = await db.file.create({ data: { url: file.url, name: file.name } });
      await db.user.update({ where: { id: metadata.userId }, data: { imageId: newImage.id } });
      return THROW_OK("CREATED");
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
