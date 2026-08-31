import type { Metadata } from "next";
import { SignContractClient } from "@/components/sign/sign-contract-client";

export const metadata: Metadata = { title: "Sign contract" };

export default function SignPage({ params }: { params: { token: string } }) {
  return <SignContractClient token={params.token} />;
}
