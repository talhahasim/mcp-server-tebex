import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as tebex from "../tebex-client.js";

export function registerPaymentTools(server: McpServer) {
  server.tool(
    "list-payments",
    "List recent payments with optional limit",
    {
      limit: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe("Maximum number of payments to return (1-100)"),
    },
    async ({ limit }) => {
      const result = await tebex.listPayments(limit);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "get-payment",
    "Get details of a specific payment by transaction ID",
    {
      transaction_id: z
        .string()
        .min(1)
        .describe("The transaction ID of the payment"),
    },
    async ({ transaction_id }) => {
      const result = await tebex.getPayment(transaction_id);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "create-manual-payment",
    "Create a manual payment for a user and package",
    {
      ign: z.string().min(1).describe("In-game name / username of the buyer"),
      price: z.number().min(0).describe("Price of the payment"),
      packages: z
        .array(
          z.object({
            package_id: z.number().int().describe("Package ID to purchase"),
            options: z
              .record(z.string())
              .optional()
              .default({})
              .describe("Package variable options"),
          })
        )
        .min(1)
        .describe("Packages to include in the payment"),
    },
    async ({ ign, price, packages }) => {
      const result = await tebex.createManualPayment({ ign, price, packages });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "update-payment",
    "Update a payment's username or status",
    {
      transaction_id: z
        .string()
        .min(1)
        .describe("The transaction ID of the payment"),
      username: z
        .string()
        .optional()
        .describe("New username for the payment"),
      status: z
        .string()
        .optional()
        .describe("New status for the payment (e.g. 'complete', 'chargeback')"),
    },
    async ({ transaction_id, username, status }) => {
      const data: { username?: string; status?: string } = {};
      if (username) data.username = username;
      if (status) data.status = status;

      const result = await tebex.updatePayment(transaction_id, data);
      return {
        content: [{ type: "text", text: JSON.stringify(result ?? { success: true }, null, 2) }],
      };
    }
  );

  server.tool(
    "add-payment-note",
    "Add a note to a payment",
    {
      transaction_id: z
        .string()
        .min(1)
        .describe("The transaction ID of the payment"),
      note: z.string().min(1).describe("Note text to add to the payment"),
    },
    async ({ transaction_id, note }) => {
      const result = await tebex.addPaymentNote(transaction_id, note);
      return {
        content: [{ type: "text", text: JSON.stringify(result ?? { success: true }, null, 2) }],
      };
    }
  );
}
