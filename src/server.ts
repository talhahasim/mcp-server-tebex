import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerStoreTools } from "./tools/store.js";
import { registerPaymentTools } from "./tools/payments.js";
import { registerCouponTools } from "./tools/coupons.js";
import { registerSaleTools } from "./tools/sales.js";
import { registerBanTools } from "./tools/bans.js";
import { registerGiftCardTools } from "./tools/gift-cards.js";
import { registerPlayerTools } from "./tools/players.js";
import { registerPackageTools } from "./tools/packages.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "tebex",
    version: "1.0.0",
  });

  registerStoreTools(server);
  registerPaymentTools(server);
  registerCouponTools(server);
  registerSaleTools(server);
  registerBanTools(server);
  registerGiftCardTools(server);
  registerPlayerTools(server);
  registerPackageTools(server);

  return server;
}
