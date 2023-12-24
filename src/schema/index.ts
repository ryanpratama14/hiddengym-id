import { z } from "zod";

export const regex = {
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

export class schema {
  // enums
  static role = z.enum(["OWNER", "ADMIN", "TRAINER", "VISITOR"]).default("VISITOR");
  static gender = z.enum(["MALE", "FEMALE"]);
  static packageType = z.enum(["MEMBER", "VISIT", "TRAINER"]);
  static tokenType = z.enum(["VERIFY_EMAIL", "FORGOT_PASSWORD"]);
  static order = z.enum(["asc", "desc"]).optional();

  static pagination = z.object({ page: z.number().min(1), limit: z.number().min(1).optional() });
  static email = z.string().email("Please provide a valid email");
  static fullName = z
    .string()
    .min(1, "Please provide your name")
    .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces");

  static phoneNumber = z
    .string()
    .regex(/^\d+$/, "Please provide a valid phone number")
    .regex(/^8/, "Please start with number 8")
    .min(10, "At least 10 characters")
    .max(12);

  static date = z.string().min(1, "Please pick a date");
  static dateNullable = z.string().nullable();
  static password = z.string().min(10, "At least 10 characters");
  static loginVisitor = z.object({ credential: schema.phoneNumber });
  static login = z.object({ email: schema.email, credential: schema.password }); // also for next-auth

  static user = class {
    static create = z.object({
      email: schema.email,
      fullName: schema.fullName,
      phoneNumber: schema.phoneNumber,
      birthDate: schema.dateNullable,
      credential: schema.password,
      gender: schema.gender,
    });

    static createVisitor = z
      .object({
        email: z
          .string()
          .optional()
          .refine(
            (email) => {
              if (email) return regex.email.test(email);
              return true;
            },
            {
              message: "Please provide a valid email",
              path: ["email"],
            }
          ),
        fullName: schema.fullName,
        phoneNumber: schema.phoneNumber,
        gender: schema.gender,
        packageTransactionId: z.string().optional(),
        transactionDate: z.string().optional(),
      })
      .refine(
        ({ packageTransactionId, transactionDate }) => {
          if (packageTransactionId && !transactionDate) return false;
          return true;
        },
        {
          message: "Transaction date is required",
          path: ["transactionDate"],
        }
      );

    static update = z.object({
      body: z.object({
        email: schema.email,
        fullName: schema.fullName,
        phoneNumber: schema.phoneNumber,
        birthDate: schema.date,
        gender: schema.gender,
      }),
      userId: z.string(),
    });

    static list = z.object({
      pagination: schema.pagination,
      sorting: z.string().optional(),
      params: z.object({
        role: schema.role,
        fullName: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.string().optional(),
        gender: schema.gender.optional(),
        totalSpending: z.string().optional(),
      }),
    });
  };
}

export type Pagination = z.infer<typeof schema.pagination>;
export type Login = z.infer<typeof schema.login>;
export type LoginVisitor = z.infer<typeof schema.loginVisitor>;
export type TokenType = z.infer<typeof schema.tokenType>;
export type Register = z.infer<typeof schema.user.create>;
export type RegisterVisitor = z.infer<typeof schema.user.createVisitor>;
