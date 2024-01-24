import { type AppRouter } from "@/server/api/root";
import { Prisma } from "@prisma/client";
import { type Pagination } from "@schema";
import { TRPCError, type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { type TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import SuperJSON from "superjson";
import { z } from "zod";

export type TRPC_OK_CODE_KEY = "OK" | "CREATED" | "ACCEPTED" | "NO_CONTENT" | "RESET_CONTENT" | "PARTIAL_CONTENT";
export type TRPC_CODE_KEY = TRPC_OK_CODE_KEY | TRPC_ERROR_CODE_KEY;
type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never;
type Entity = A<keyof typeof Prisma>;
type Keys<T extends Entity> = Extract<keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>], string>;

export const getUTCStartDate = (dateString: string): Date => {
  const updatedDate = new Date(dateString);
  updatedDate.setUTCHours(0, 0, 0, 0);
  return updatedDate;
};

export const getUTCEndDate = (dateString: string): Date => {
  const updatedDate = new Date(dateString);
  updatedDate.setUTCHours(23, 59, 59, 999);
  return updatedDate;
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const getUrl = () => `${getBaseUrl()}/api/trpc`;

export const PAGINATION_LIMIT = 50;

export const ERROR_MESSAGES: Record<TRPC_ERROR_CODE_KEY, string> = {
  PARSE_ERROR: "Error parsing the request. Please check the syntax of your request.",
  BAD_REQUEST: "Invalid request. Please provide valid request parameters.",
  INTERNAL_SERVER_ERROR: "Internal server error. Please try again later.",
  NOT_IMPLEMENTED: "Feature not implemented. This functionality is currently unavailable.",
  UNAUTHORIZED: "Unauthorized access. Please authenticate to access this resource.",
  FORBIDDEN: "Access forbidden. You do not have permission to access this resource.",
  NOT_FOUND: "Resource not found. The requested resource does not exist.",
  METHOD_NOT_SUPPORTED: "HTTP method not supported. Please use a supported HTTP method.",
  TIMEOUT: "Request timeout. The server did not receive a timely response.",
  CONFLICT: "Conflict in resource state. There is a conflict with the current state of the resource.",
  PRECONDITION_FAILED: "Precondition failed for the request. Please meet the required conditions.",
  PAYLOAD_TOO_LARGE: "Request payload too large. The size of the request payload exceeds the limit.",
  UNPROCESSABLE_CONTENT: "Unprocessable request content. The request content is not valid or cannot be processed.",
  TOO_MANY_REQUESTS: "Too many requests. Please try again later.",
  CLIENT_CLOSED_REQUEST: "Client closed the request. The client terminated the request unexpectedly.",
};

export const OK_MESSAGES: Record<TRPC_OK_CODE_KEY, string> = {
  OK: "OK",
  CREATED: "Resource created successfully.",
  ACCEPTED: "Request accepted.",
  NO_CONTENT: "No content available.",
  RESET_CONTENT: "Reset content successful.",
  PARTIAL_CONTENT: "Partial content received successfully.",
};

export type TRPC_RESPONSE = {
  code: TRPC_CODE_KEY;
  status: boolean;
  message: string;
};

export const THROW_TRPC_ERROR = (code: TRPC_ERROR_CODE_KEY, message?: string) => {
  throw new TRPCError({ code, message: message ?? ERROR_MESSAGES[code] });
};

export const THROW_OK = (code: TRPC_OK_CODE_KEY, message?: string): TRPC_RESPONSE => ({
  code,
  status: true,
  message: message ? message : OK_MESSAGES[code],
});

export const THROW_ERROR = (code: TRPC_ERROR_CODE_KEY, message?: string): TRPC_RESPONSE => ({
  code,
  status: false,
  message: message ? message : ERROR_MESSAGES[code],
});

export const THROW_CODE = (code: TRPC_CODE_KEY, message?: string): TRPC_RESPONSE => ({
  code,
  status: code in OK_MESSAGES ? true : false,
  message: message
    ? message
    : code in OK_MESSAGES
      ? (OK_MESSAGES as Record<TRPC_CODE_KEY, string>)[code]
      : (ERROR_MESSAGES as Record<TRPC_CODE_KEY, string>)[code],
});

export const getConflictMessage = (thing: string, field: string) => `A ${thing} with this ${field} already exists.`;
export const getCreatedMessage = (thing: string) => `A ${thing} has been created.`;
export const getUpdatedMessage = (thing: string) => `A ${thing} has been updated.`;
export const getDeletedMessage = (thing: string) => `A ${thing} has been deleted.`;

export const prismaExclude = <T extends Entity, K extends Keys<T>>(type: T, omit: K[]) => {
  type Key = Exclude<Keys<T>, K>;
  type TMap = Record<Key, true>;
  const result: TMap = {} as TMap;
  for (const key in Prisma[`${type}ScalarFieldEnum`]) {
    if (!omit.includes(key as K)) {
      result[key as Key] = true;
    }
  }
  return result;
};

export const removeFieldsFromArray = <T extends Record<string, unknown>, K extends keyof T>(
  objects: Array<T>,
  fieldsToRemove: K[],
): Array<Omit<T, K>> => {
  return objects.map((obj) => {
    const updatedObj = structuredClone(obj);
    for (const field of fieldsToRemove) {
      delete updatedObj[field];
    }
    return updatedObj;
  });
};

export const removeFieldsFromObject = <T extends Record<string, unknown>, K extends keyof T>(
  object: T,
  fieldsToRemove: K[],
): Omit<T, K> => {
  const updatedObj = structuredClone(object);
  for (const field of fieldsToRemove) {
    delete updatedObj[field];
  }
  return updatedObj;
};

export const mergeZodSchema = <T extends Entity>(entity: T): z.ZodObject<Record<Keys<T>, z.ZodString>, "strip"> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const entityFields: Keys<T>[] = Object.keys((Prisma as any)[`${entity}ScalarFieldEnum`]) as Keys<T>[];

  const schema = entityFields.reduce((schema, field) => {
    return schema.merge(
      z.object({
        [field]: z.string().optional(),
      }),
    );
  }, z.object({}));

  return schema as z.ZodObject<Record<Keys<T>, z.ZodString>, "strip">;
};

export const getZodKeys = (schema: z.ZodType): string[] => {
  if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return getZodKeys(schema.unwrap());
  }
  if (schema instanceof z.ZodArray) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return getZodKeys(schema.element);
  }
  if (schema instanceof z.ZodObject) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const entries = Object.entries<z.ZodType>(schema.shape);
    return entries.flatMap(([key, value]) => {
      const nested = getZodKeys(value).map((subKey) => `${key}.${subKey}`);
      return nested.length ? nested : key;
    });
  }
  return [];
};

export const getZodEnum = <K extends string>(obj: Record<K, unknown>): z.ZodOptional<z.ZodEnum<[K, ...K[]]>> => {
  const [firstKey, ...otherKeys] = Object.keys(obj) as K[];
  return z.enum([firstKey!, ...otherKeys]).optional();
};

export const getEnum = <K extends string>(obj: Record<K, unknown>): [K, ...K[]] => {
  const [firstKey, ...otherKeys] = Object.keys(obj) as K[];
  return [firstKey!, ...otherKeys];
};

export const getEnumKeys = <K extends string>(obj: Record<K, unknown>): K | undefined => {
  const keys = Object.keys(obj) as K[];
  if (keys[0]) return keys[0];
};

export const getPaginationData = ({ totalData, limit, page }: Pagination & { totalData: number }) => {
  const totalPages = Math.ceil(totalData / limit) || 1;
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    limit,
    page,
    totalData,
    totalPages,
    hasNextPage: end < totalData,
    hasPrevPage: start > 0,
    isPaginationInvalid: page > totalPages || page < 1 || limit < 1,
  };
};

export const insensitiveMode = { mode: "insensitive" as Prisma.QueryMode };

export const getPaginationQuery = ({ limit, page }: Pagination) => ({ skip: (page - 1) * limit, take: limit });

export const getSortingQuery = (sorting?: string) => {
  if (sorting) {
    const [name, value] = sorting.split("-");
    return { orderBy: { [name!]: value } };
  }
  return undefined;
};

export const transformer = SuperJSON;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
