import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();

function secret() {
  const value =
    process.env.INVITE_JWT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "remotewise-dev-invite-secret-change-me";
  return encoder.encode(value);
}

export type InviteTokenPayload = {
  typ: "invite";
  inviteId: string;
  email: string;
  name: string;
  companyName: string;
};

export type SignTokenPayload = {
  typ: "sign";
  contractId: string;
};

export async function signInviteToken(payload: Omit<InviteTokenPayload, "typ">) {
  return new SignJWT({ ...payload, typ: "invite" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function signContractToken(payload: Omit<SignTokenPayload, "typ">) {
  return new SignJWT({ ...payload, typ: "sign" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function verifyInviteToken(token: string): Promise<InviteTokenPayload> {
  const { payload } = await jwtVerify(token, secret());
  if (
    payload.typ !== "invite" ||
    typeof payload.inviteId !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.name !== "string" ||
    typeof payload.companyName !== "string"
  ) {
    throw new Error("Invalid token type");
  }
  return {
    typ: "invite",
    inviteId: payload.inviteId,
    email: payload.email,
    name: payload.name,
    companyName: payload.companyName,
  };
}

export async function verifySignToken(token: string): Promise<SignTokenPayload> {
  const { payload } = await jwtVerify(token, secret());
  if (payload.typ !== "sign" || typeof payload.contractId !== "string") {
    throw new Error("Invalid token type");
  }
  return { typ: "sign", contractId: payload.contractId };
}
