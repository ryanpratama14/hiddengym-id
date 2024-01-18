import { PAGINATION_LIMIT } from "@/trpc/shared";
import { z } from "zod";

export const regex = {
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

const stringMessage = (field: string, min: number) => `${field} must contain at least ${min} character(s)`;
const numberMessage = (field: string, min: number) => `${field} must be greater than or equal to ${min}`;

export class schema {
  // enums
  static role = z.enum(["OWNER", "ADMIN", "TRAINER", "VISITOR"]).default("VISITOR");
  static promoCodeType = z.enum(["REGULAR", "STUDENT"]);
  static gender = z.enum(["MALE", "FEMALE"]);
  static packageType = z.enum(["MEMBER", "VISIT", "SESSIONS"]);
  static tokenType = z.enum(["VERIFY_EMAIL", "FORGOT_PASSWORD"]);
  static order = z.enum(["asc", "desc"]).optional();

  static names = z.string().min(3, "At least 3 characters");
  static pagination = z.object({
    page: z.coerce.number().positive().default(1),
    limit: z.coerce.number().positive().default(PAGINATION_LIMIT),
  });
  static sorting = z.object({ sort: z.string().optional() });
  static email = z.string().email("Provide a valid email");
  static fullName = z
    .string()
    .min(1, "Please provide a name")
    .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces");

  static phoneNumber = z
    .string()
    .regex(/^\d+$/, "Provide a valid phone number")
    .regex(/^8/, "Phone Number should starts with number 8")
    .min(10, stringMessage("Phone Number", 10))
    .max(12);

  static date = z.string().min(1, "Pick a date");
  static dateNullable = z.string().nullable();
  static dateOptional = z.string().optional();
  static promoCodeCode = z
    .string()
    .min(4, "At least 4 characters")
    .regex(/^[A-Z0-9]+$/, "Code should be uppercase and contain only letters and numbers");
  static password = z.string().min(10, stringMessage("Password", 10));
  static loginVisitor = z.object({ credential: schema.phoneNumber });
  static login = z.object({ email: schema.email, credential: schema.password });

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
          birthDate: schema.dateOptional,
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
          packageId: z.string().min(1, "Select package"),
          transactionDate: schema.date,
          paymentMethodId: z.string().min(1, "Select payment method"),
          promoCodeCode: z.string().optional(),
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
      ...schema.pagination.shape,
      ...schema.sorting.shape,
      role: schema.role,
      fullName: z.string().optional(),
      phoneNumber: z.string().optional(),
      email: z.string().optional(),
      gender: schema.gender.optional(),
      totalSpending: z.coerce.number().optional(),
    });
  };

  static product = class {
    static create = z.object({
      name: schema.names,
      price: z.number().min(1),
    });
    static list = z.object({
      name: z.string().optional(),
      price: z.coerce.number().optional(),
      totalTransactions: z.coerce.number().optional(),
    });
  };

  static package = class {
    static list = z.object({
      name: z.string().optional(),
      type: schema.packageType.optional(),
      price: z.coerce.number().optional(),
      totalTransactions: z.coerce.number().optional(),
    });

    static create = z
      .object({
        name: z.string().min(4),
        description: z.string().nullable(),
        price: z.number().min(1),
        validityInDays: z.number().nullable(),
        approvedSessions: z.number().nullable(),
        type: schema.packageType,
        sportIDs: z.array(z.string()).min(1, "Pick at least 1 sport type"),
        placeIDs: z.array(z.string()).min(1, "Pick at least 1 place"),
        trainerIDs: z.array(z.string()).optional(),
      })
      .refine(({ type, approvedSessions }) => type === "SESSIONS" && approvedSessions, {
        message: "This field is required since the type is Sessions",
        path: ["approvedSessions"],
      })
      .refine(({ type, trainerIDs }) => type === "SESSIONS" && trainerIDs?.length, {
        message: "Pick at least 1 trainer",
        path: ["trainerIDs"],
      });

    static update = z.object({
      id: z.string(),
      body: this.create,
    });
  };

  static sport = class {
    static create = z.object({ name: schema.names });
  };

  static paymentMethod = class {
    static create = z.object({ name: schema.names });
  };

  static place = class {
    static create = z.object({
      name: schema.names,
      address: schema.names,
      url: z.string().url("Provide a google maps link"),
    });
  };

  static promoCode = class {
    static create = z.object({
      code: schema.promoCodeCode,
      discountPrice: z.number().min(1),
      type: schema.promoCodeType,
      isActive: z.boolean().default(true),
    });
  };

  static packageTransaction = class {
    static create = z.object({
      transactionDate: schema.date,
      paymentMethodId: z.string().min(1, "Select payment method"),
      packageId: z.string().min(1, "Select package"),
      buyerId: z.string().min(1, "Select buyer"),
      promoCodeCode: z.string().optional(),
      promoCodeId: z.string().optional(),
    });

    static list = z.object({
      ...schema.pagination.shape,
      ...schema.sorting.shape,
      buyer: z.string().optional(),
      package: z.string().optional(),
      packageType: schema.packageType.optional(),
      paymentMethod: z.string().optional(),
      promoCodeCode: z.string().optional(),
      totalPrice: z.coerce.number().optional(),
      transactionDate: schema.dateOptional,
    });
  };

  static productTransaction = class {
    static list = z.object({
      ...schema.pagination.shape,
      ...schema.sorting.shape,
      totalPrice: z.coerce.number().optional(),
      paymentMethod: z.string().optional(),
      buyer: z.string().optional(),
      transactionDate: z.string().optional(),
    });

    static create = z.object({
      transactionDate: schema.date,
      paymentMethodId: z.string().min(1, "Select payment method"),
      buyerId: z.string().min(1, "Select buyer"),
      products: z
        .array(
          z.object({
            productId: z.string().min(1, "Select product"),
            quantity: z.number().min(1, numberMessage("Quantity", 1)),
            unitPrice: z.number(),
            name: z.string(),
          }),
        )
        .min(1),
    });
  };
}

export type Pagination = z.infer<typeof schema.pagination>;
export type Login = z.infer<typeof schema.login>;
export type LoginVisitor = z.infer<typeof schema.loginVisitor>;
export type TokenType = z.infer<typeof schema.tokenType>;
export type Register = z.infer<typeof schema.user.create>;
export type RegisterVisitor = z.infer<typeof schema.user.createVisitor>;
