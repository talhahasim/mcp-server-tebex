const BASE_URL = "https://plugin.tebex.io";

export class TebexApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: string
  ) {
    super(`Tebex API error ${status} ${statusText}: ${body}`);
    this.name = "TebexApiError";
  }
}

function getSecret(): string {
  const secret = process.env.TEBEX_SECRET;
  if (!secret) {
    throw new Error(
      "TEBEX_SECRET environment variable is not set. Get your secret key from https://server.tebex.io/settings/servers"
    );
  }
  return secret;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const secret = getSecret();

  const headers: Record<string, string> = {
    "X-Tebex-Secret": secret,
    "Accept": "application/json",
  };

  const init: RequestInit = { method, headers };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, init);

  if (!res.ok) {
    const text = await res.text();
    throw new TebexApiError(res.status, res.statusText, text);
  }

  // Some endpoints return 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// --- Store ---

export function getStoreInfo() {
  return request<{
    account: {
      id: number;
      domain: string;
      name: string;
      currency: { iso_4217: string; symbol: string };
      online_mode: boolean;
      game_type: string;
      log_events: boolean;
    };
  }>("GET", "/information");
}

// --- Payments ---

export function listPayments(limit?: number) {
  const params = limit ? `?pager.limit=${limit}` : "";
  return request<unknown>("GET", `/payments${params}`);
}

export function getPayment(transactionId: string) {
  return request<unknown>("GET", `/payments/${encodeURIComponent(transactionId)}`);
}

export function createManualPayment(data: {
  packages: Array<{ package_id: number; options: Record<string, string> }>;
  ign: string;
  price: number;
}) {
  const body = {
    ign: data.ign,
    price: data.price,
    packages: data.packages.map((pkg) => ({
      id: pkg.package_id,
      options: pkg.options || {},
    })),
  };
  return request<unknown>("POST", "/payments", body);
}

export function updatePayment(
  transactionId: string,
  data: { username?: string; status?: string }
) {
  return request<unknown>(
    "PUT",
    `/payments/${encodeURIComponent(transactionId)}`,
    data
  );
}

export function addPaymentNote(
  transactionId: string,
  note: string
) {
  return request<unknown>(
    "POST",
    `/payments/${encodeURIComponent(transactionId)}/note`,
    { note }
  );
}

// --- Coupons ---

export function listCoupons() {
  return request<unknown>("GET", "/coupons");
}

export function getCoupon(couponId: number) {
  return request<unknown>("GET", `/coupons/${couponId}`);
}

export function createCoupon(data: {
  code: string;
  effective_on: "cart" | "package" | "category";
  packages?: number[];
  categories?: number[];
  discount_type: "value" | "percentage";
  discount_amount: number;
  discount_percentage: number;
  redeem_unlimited: boolean;
  expire_never: boolean;
  expire_limit?: number;
  expire_date?: string;
  start_date?: string;
  basket_type: "single" | "subscription" | "both";
  minimum?: number;
  username?: string;
  note?: string;
}) {
  return request<unknown>("POST", "/coupons", data);
}

export function deleteCoupon(couponId: number) {
  return request<unknown>("DELETE", `/coupons/${couponId}`);
}

// --- Sales ---

export function listSales() {
  return request<unknown>("GET", "/sales");
}

// --- Bans ---

export function listBans() {
  return request<unknown>("GET", "/bans");
}

export function createBan(data: {
  user: string;
  ip?: string;
  reason?: string;
}) {
  return request<unknown>("POST", "/bans", data);
}

// --- Gift Cards ---

export function listGiftCards() {
  return request<unknown>("GET", "/gift-cards");
}

export function getGiftCard(giftCardId: number) {
  return request<unknown>("GET", `/gift-cards/${giftCardId}`);
}

export function createGiftCard(data: {
  expires_at: string;
  note?: string;
  amount: number;
}) {
  return request<unknown>("POST", "/gift-cards", data);
}

export function topupGiftCard(giftCardId: number, amount: number) {
  return request<unknown>("PUT", `/gift-cards/${giftCardId}`, { amount });
}

export function voidGiftCard(giftCardId: number) {
  return request<unknown>("DELETE", `/gift-cards/${giftCardId}`);
}

// --- Players ---

export function getPlayerPackages(playerIdentifier: string) {
  return request<unknown>(
    "GET",
    `/player/${encodeURIComponent(playerIdentifier)}/packages`
  );
}

// --- Packages ---

export function listPackages() {
  return request<unknown>("GET", "/listing");
}
