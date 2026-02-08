import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as tebex from "../tebex-client.js";

export function registerCouponTools(server: McpServer) {
  server.tool(
    "list-coupons",
    "List all coupons in the store",
    {},
    async () => {
      const result = await tebex.listCoupons();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "get-coupon",
    "Get details of a specific coupon by ID",
    {
      coupon_id: z.number().int().describe("The coupon ID"),
    },
    async ({ coupon_id }) => {
      const result = await tebex.getCoupon(coupon_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "create-coupon",
    "Create a new coupon with discount settings, usage limits, and targeting",
    {
      code: z.string().min(1).describe("Coupon code (e.g. 'SUMMER20')"),
      effective_on: z
        .enum(["cart", "package", "category"])
        .describe("What the coupon applies to"),
      packages: z
        .array(z.number().int())
        .optional()
        .describe("Package IDs the coupon applies to (when effective_on is 'package')"),
      categories: z
        .array(z.number().int())
        .optional()
        .describe("Category IDs the coupon applies to (when effective_on is 'category')"),
      discount_type: z
        .enum(["value", "percentage"])
        .describe("Type of discount"),
      discount_amount: z
        .number()
        .min(0)
        .default(0)
        .describe("Fixed discount amount (when discount_type is 'value')"),
      discount_percentage: z
        .number()
        .min(0)
        .max(100)
        .default(0)
        .describe("Percentage discount (when discount_type is 'percentage')"),
      redeem_unlimited: z
        .boolean()
        .default(true)
        .describe("Whether the coupon can be used unlimited times"),
      expire_never: z
        .boolean()
        .default(true)
        .describe("Whether the coupon never expires"),
      expire_limit: z
        .number()
        .int()
        .optional()
        .describe("Maximum number of redemptions"),
      expire_date: z
        .string()
        .optional()
        .describe("Expiry date (YYYY-MM-DD format)"),
      start_date: z
        .string()
        .optional()
        .describe("Start date (YYYY-MM-DD format)"),
      basket_type: z
        .enum(["single", "subscription", "both"])
        .default("both")
        .describe("Type of basket the coupon applies to"),
      minimum: z
        .number()
        .min(0)
        .optional()
        .describe("Minimum basket value for coupon to apply"),
      username: z
        .string()
        .optional()
        .describe("Restrict coupon to a specific username"),
      note: z.string().optional().describe("Internal note about the coupon"),
    },
    async (params) => {
      const result = await tebex.createCoupon(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "delete-coupon",
    "Delete a coupon by ID",
    {
      coupon_id: z.number().int().describe("The coupon ID to delete"),
    },
    async ({ coupon_id }) => {
      const result = await tebex.deleteCoupon(coupon_id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result ?? { success: true, message: `Coupon ${coupon_id} deleted` }, null, 2),
          },
        ],
      };
    }
  );
}
