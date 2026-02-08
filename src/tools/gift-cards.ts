import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as tebex from "../tebex-client.js";

export function registerGiftCardTools(server: McpServer) {
  server.tool(
    "list-gift-cards",
    "List all gift cards in the store",
    {},
    async () => {
      const result = await tebex.listGiftCards();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "get-gift-card",
    "Get details of a specific gift card",
    {
      gift_card_id: z.number().int().describe("The gift card ID"),
    },
    async ({ gift_card_id }) => {
      const result = await tebex.getGiftCard(gift_card_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "create-gift-card",
    "Create a new gift card with an amount and expiry date",
    {
      amount: z.number().min(0.01).describe("Gift card value amount"),
      expires_at: z
        .string()
        .describe("Expiry date in ISO 8601 format (e.g. '2025-12-31')"),
      note: z.string().optional().describe("Internal note about the gift card"),
    },
    async (params) => {
      const result = await tebex.createGiftCard(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "topup-gift-card",
    "Add balance to an existing gift card",
    {
      gift_card_id: z.number().int().describe("The gift card ID to top up"),
      amount: z.number().min(0.01).describe("Amount to add to the gift card"),
    },
    async ({ gift_card_id, amount }) => {
      const result = await tebex.topupGiftCard(gift_card_id, amount);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "void-gift-card",
    "Void/cancel a gift card, making it unusable",
    {
      gift_card_id: z.number().int().describe("The gift card ID to void"),
    },
    async ({ gift_card_id }) => {
      const result = await tebex.voidGiftCard(gift_card_id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result ?? { success: true, message: `Gift card ${gift_card_id} voided` }, null, 2),
          },
        ],
      };
    }
  );
}
