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
  static email = z.string().email("Provide a valid email");
  static fullName = z
    .string()
    .min(1, "Please provide a name")
    .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces");

  static phoneNumber = z
    .string()
    .regex(/^\d+$/, "Provide a valid phone number")
    .regex(/^8/, "Phone Number should starts with number 8")
    .min(10, "At least 10 characters")
    .max(12);

  static date = z.string().min(1, "Pick a date");
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

    static createVisitor = z.object({
      visitorData: z
        .object({
          email: z.string().optional(),
          fullName: schema.fullName,
          phoneNumber: schema.phoneNumber,
          gender: schema.gender,
        })
        .refine(
          ({ email }) => {
            if (email) return regex.email.test(email);
            return true;
          },
          {
            message: "Please provide a valid email",
            path: ["email"],
          },
        ),

      packageData: z
        .object({
          packageId: z.string(),
          transactionDate: schema.date,
          paymentMethodId: z.string(),
          promoCodeId: z.string().optional(),
        })
        .optional(),
    });

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

  static package = class {
    static create = z
      .object({
        name: z.string().min(4),
        description: z.string().nullable(),
        price: z.number().min(1),
        validityInDays: z.number().nullable(),
        totalPermittedSessions: z.number().nullable(),
        type: schema.packageType,
        sportIDs: z.array(z.string()).min(1, "Pick at least 1 sport type"),
        placeIDs: z.array(z.string()).min(1, "Pick at least 1 place"),
        trainerIDs: z.array(z.string()).optional(),
        isUnlimitedSessions: z.boolean(),
      })
      .refine(
        ({ type, validityInDays }) => {
          if (type !== "TRAINER" && !validityInDays) return false;
          return true;
        },
        {
          message: "Validity is required",
          path: ["validityInDays"],
        },
      )
      .refine(
        ({ type, totalPermittedSessions }) => {
          if (type === "TRAINER" && !totalPermittedSessions) return false;
          return true;
        },
        {
          message: "This field is required since the type is Trainer",
          path: ["totalPermittedSessions"],
        },
      )
      .refine(
        ({ isUnlimitedSessions, totalPermittedSessions }) => {
          if (!isUnlimitedSessions && !totalPermittedSessions) return false;
          return true;
        },
        {
          message: "This field is required since you unchecked unlimited sessions",
          path: ["totalPermittedSessions"],
        },
      )
      .refine(
        ({ type, trainerIDs }) => {
          if (type === "TRAINER" && !trainerIDs?.length) return false;
          return true;
        },
        {
          message: "Pick at least 1 trainer",
          path: ["trainerIDs"],
        },
      );
  };

  static sport = class {
    static create = z.object({ name: z.string().min(3, "At least 3 characters") });
  };
  static place = class {
    static create = z.object({
      name: z.string().min(3),
      address: z.string().min(3),
      url: z.string().url("Provide a google maps link"),
    });
  };
}

export type Pagination = z.infer<typeof schema.pagination>;
export type Login = z.infer<typeof schema.login>;
export type LoginVisitor = z.infer<typeof schema.loginVisitor>;
export type TokenType = z.infer<typeof schema.tokenType>;
export type Register = z.infer<typeof schema.user.create>;
export type RegisterVisitor = z.infer<typeof schema.user.createVisitor>;
