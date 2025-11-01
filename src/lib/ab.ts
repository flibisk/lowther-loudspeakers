import { cookies } from "next/headers";

export type Variant = "a" | "b";

export async function getABVariant(testName: string = "default"): Promise<Variant> {
  const cookieStore = await cookies();
  const cookieName = `ab-test-${testName}`;
  const existingVariant = cookieStore.get(cookieName);

  if (existingVariant?.value && (existingVariant.value === "a" || existingVariant.value === "b")) {
    return existingVariant.value as Variant;
  }

  // 50/50 split
  const variant = Math.random() < 0.5 ? "a" : "b";
  return variant;
}

export function getABVariantFromSearchParams(searchParams: { [key: string]: string | string[] | undefined }): Variant | null {
  const variant = searchParams.v;
  if (typeof variant === "string" && (variant === "a" || variant === "b")) {
    return variant as Variant;
  }
  return null;
}

export function setABVariantCookie(variant: Variant, testName: string = "default") {
  const cookieName = `ab-test-${testName}`;
  return `${cookieName}=${variant}; Path=/; Max-Age=2592000; SameSite=Lax`; // 30 days
}

export function getABRedirectPath(basePath: string, variant: Variant): string {
  return `${basePath}-${variant}`;
}
