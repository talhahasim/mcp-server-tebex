# mcp-server-tebex

MCP (Model Context Protocol) server for managing your [Tebex](https://tebex.io) game server store through AI assistants like Claude.

Provides 20 tools covering store info, payments, coupons, sales, bans, gift cards, players, and packages via the [Tebex Plugin API](https://docs.tebex.io/plugin/).

## Setup

### 1. Get your Tebex Secret Key

Go to [Tebex Server Settings](https://server.tebex.io/settings/servers) and copy your **Secret Key**.

### 2. Configure Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "tebex": {
      "command": "npx",
      "args": ["mcp-server-tebex"],
      "env": {
        "TEBEX_SECRET": "your-tebex-secret-key"
      }
    }
  }
}
```

### 3. Configure Claude Code

```bash
claude mcp add tebex -- npx mcp-server-tebex
```

Set the environment variable:
```bash
export TEBEX_SECRET="your-tebex-secret-key"
```

## Available Tools

### Store
| Tool | Description |
|------|-------------|
| `get-store-info` | Get store name, domain, currency, game type |

### Payments
| Tool | Description |
|------|-------------|
| `list-payments` | List recent payments (with optional limit) |
| `get-payment` | Get payment details by transaction ID |
| `create-manual-payment` | Create a manual payment for a user |
| `update-payment` | Update payment status or username |
| `add-payment-note` | Add a note to a payment |

### Coupons
| Tool | Description |
|------|-------------|
| `list-coupons` | List all coupons |
| `get-coupon` | Get coupon details by ID |
| `create-coupon` | Create a new coupon with discount settings |
| `delete-coupon` | Delete a coupon |

### Sales
| Tool | Description |
|------|-------------|
| `list-sales` | List active sales/discounts |

### Bans
| Tool | Description |
|------|-------------|
| `list-bans` | List all banned users |
| `create-ban` | Ban a user (optionally by IP) |

### Gift Cards
| Tool | Description |
|------|-------------|
| `list-gift-cards` | List all gift cards |
| `get-gift-card` | Get gift card details |
| `create-gift-card` | Create a new gift card |
| `topup-gift-card` | Add balance to a gift card |
| `void-gift-card` | Void/cancel a gift card |

### Players
| Tool | Description |
|------|-------------|
| `get-player-packages` | Get a player's active packages |

### Packages
| Tool | Description |
|------|-------------|
| `list-packages` | List all store packages |

## Example Usage

Once connected, you can ask Claude things like:

- "Show me my store info"
- "List the last 10 payments"
- "Create a 20% off coupon code SUMMER20 for all packages"
- "Ban user cheater123 for reason: chargeback fraud"
- "Create a $50 gift card expiring December 2025"
- "What packages does player Steve have?"

## API Rate Limits

Tebex Plugin API allows **500 requests per 5 minutes**.

## Development

```bash
git clone https://github.com/talhahasim/mcp-server-tebex.git
cd mcp-server-tebex
npm install
npm run build
```

## License

MIT
