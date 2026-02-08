import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as tebex from "../tebex-client.js";

export function registerPlayerTools(server: McpServer) {
  server.tool(
    "get-player-packages",
    "Get the active packages for a specific player by their username or UUID",
    {
      player_identifier: z
        .string()
        .min(1)
        .describe("Player username or UUID"),
    },
    async ({ player_identifier }) => {
      const result = await tebex.getPlayerPackages(player_identifier);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }
  );
}
