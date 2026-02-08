import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as tebex from "../tebex-client.js";

export function registerStoreTools(server: McpServer) {
  server.tool(
    "get-store-info",
    "Get store information including name, domain, currency, and game type",
    {},
    async () => {
      const result = await tebex.getStoreInfo();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
