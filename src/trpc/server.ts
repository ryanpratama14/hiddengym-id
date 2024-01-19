import "server-only";
import { appRouter, type AppRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { createTRPCClient, loggerLink, TRPCClientError } from "@trpc/client";
import { callTRPCProcedure } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { type TRPCErrorResponse } from "@trpc/server/rpc";
import { cookies } from "next/headers";
import { cache } from "react";
import { transformer } from "./shared";

const createContext = cache(() =>
  createTRPCContext({ headers: new Headers({ cookie: cookies().toString(), "x-trpc-source": "rsc" }) }),
);

export const api = createTRPCClient<AppRouter>({
  transformer,
  links: [
    loggerLink({
      enabled: (op) => process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error),
    }),
    () =>
      ({ op }) =>
        observable((observer) => {
          createContext()
            .then((ctx) =>
              callTRPCProcedure({
                getRawInput: async () => await op.input,
                procedures: appRouter._def.procedures,
                path: op.path,
                ctx,
                type: op.type,
              }),
            )
            .then((data) => {
              observer.next({ result: { data } });
              observer.complete();
            })
            .catch((cause: TRPCErrorResponse) => {
              observer.error(TRPCClientError.from(cause));
            });
        }),
  ],
});
