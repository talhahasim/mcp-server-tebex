import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as tebex from "../tebex-client.js";

export function registerPackageTools(server: McpServer) {
  server.tool(
    "list-packages",
    "List all packages available in the store, grouped by category",
    {},
    async () => {
      const result = await tebex.listPackages();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
