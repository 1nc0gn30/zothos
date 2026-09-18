const FIXED_PACKAGES = [40, 100] as const;

const DEPAY_LINKS: Record<number, string> = {
  40: "https://link.depay.com/5GQUJPqh74C73RcTJxCGKi",
  100: "https://link.depay.com/1EdlpJvblIBqN9c0PHHSBF",
};

export interface CreditPackage {
  amount: number;
  href: string;
  isPlaceholder: boolean;
  type: "stripe" | "depay";
}

function buildPackageUrl(amount: number, userId?: string): string {
  const baseUrl = DEPAY_LINKS[amount];
  const url = new URL(baseUrl);
  if (baseUrl.includes("integrate.depay.com")) {
    url.searchParams.set("amount", amount.toString());
    url.searchParams.set("currency", "USDC");
  }
  if (userId) {
    url.searchParams.set("reference", `user_${userId}_${Date.now()}`);
  }
  return url.toString();
}

/**
 * Synchronous fallback for initial state.
 * Builds real DePay URLs so links remain clickable even if the API is unreachable.
 */
export function getLocalPackages(userId?: string): CreditPackage[] {
  return FIXED_PACKAGES.map((amount) => ({
    amount,
    href: buildPackageUrl(amount, userId),
    isPlaceholder: !userId,
    type: "depay" as const,
  }));
}

/**
 * Gets credit packages from the Netlify function
 */
export async function getCreditPackages(userId?: string): Promise<CreditPackage[]> {
  try {
    const response = await fetch(
      `/api/depay-packages${userId ? `?userId=${encodeURIComponent(userId)}` : ""}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch credit packages");
    }

    const data = await response.json();
    return data.packages || [];
  } catch (error) {
    console.error("Error fetching credit packages:", error);

    // Fallback to locally-built DePay URLs so links still work
    return getLocalPackages(userId);
  }
}
