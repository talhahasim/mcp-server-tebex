import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as tebex from "../tebex-client.js";

export function registerSaleTools(server: McpServer) {
  server.tool(
    "list-sales",
    "List all active sales/discounts in the store",
    {},
    async () => {
      const result = await tebex.listSales();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
