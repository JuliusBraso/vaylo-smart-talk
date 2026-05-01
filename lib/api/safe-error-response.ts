import { NextResponse } from "next/server";

export function createRequestId(): string {
  return crypto.randomUUID();
}

export function logRouteError(
  scope: string,
  requestId: string,
  error: unknown,
): void {
  console.error(scope, { requestId, error });
}

export function internalErrorResponse(params: {
  requestId: string;
  status?: number;
  debugError?: unknown;
}) {
  const status = params.status ?? 500;

  if (process.env.NODE_ENV !== "production") {
    return NextResponse.json(
      {
        ok: false,
        error: "internal_error",
        requestId: params.requestId,
        debug: params.debugError ?? null,
      },
      { status },
    );
  }

  return NextResponse.json(
    {
      ok: false,
      error: "internal_error",
      requestId: params.requestId,
    },
    { status },
  );
}

export function toErrorLike(error: unknown): {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
} {
  if (!error || typeof error !== "object") {
    return { message: typeof error === "string" ? error : "Unknown error" };
  }

  const record = error as Record<string, unknown>;

  return {
    code: typeof record.code === "string" ? record.code : undefined,
    message: typeof record.message === "string" ? record.message : undefined,
    details: typeof record.details === "string" ? record.details : undefined,
    hint: typeof record.hint === "string" ? record.hint : undefined,
  };
}
