import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as tebex from "../tebex-client.js";

export function registerBanTools(server: McpServer) {
  server.tool(
    "list-bans",
    "List all banned users",
    {},
    async () => {
      const result = await tebex.listBans();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );

  server.tool(
    "create-ban",
    "Ban a user from the store, optionally by IP address",
    {
      user: z.string().min(1).describe("Username or UUID of the user to ban"),
      ip: z.string().optional().describe("IP address to ban"),
      reason: z.string().optional().describe("Reason for the ban"),
    },
    async (params) => {
      const result = await tebex.createBan(params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
