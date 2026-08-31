import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type FreelancerInviteEmailProps = {
  companyName: string;
  freelancerName: string;
  inviteUrl: string;
  note?: string | null;
};

export function FreelancerInviteEmail({
  companyName,
  freelancerName,
  inviteUrl,
  note,
}: FreelancerInviteEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{companyName} invited you to join their freelance workspace</Preview>
      <Body style={{ backgroundColor: "#F8FAFC", margin: 0, padding: "32px 16px", fontFamily: "Inter, Helvetica, Arial, sans-serif" }}>
        <Container style={{ backgroundColor: "#FFFFFF", borderRadius: "8px", maxWidth: "560px", padding: "40px 32px" }}>
          <Text style={{ margin: 0, color: "#4F46E5", fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            RemoteWise
          </Text>
          <Text style={{ margin: "8px 0 0", color: "#475569", fontSize: "14px" }}>
            {companyName}
          </Text>
          <Text style={{ margin: "24px 0 0", color: "#0F172A", fontSize: "24px", fontWeight: 700, fontFamily: "Space Grotesk, Inter, sans-serif", lineHeight: "1.3" }}>
            {companyName} invited you to join their freelance workspace
          </Text>
          <Text style={{ margin: "16px 0 0", color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
            Hi {freelancerName}, you have a secure invitation waiting.
          </Text>
          {note ? (
            <Section style={{ marginTop: "20px", paddingLeft: "12px", borderLeft: "3px solid #E2E8F0" }}>
              <Text style={{ margin: 0, color: "#475569", fontSize: "14px", fontStyle: "italic", lineHeight: "1.6" }}>
                {note}
              </Text>
            </Section>
          ) : null}
          <Text style={{ margin: "20px 0 0", color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
            RemoteWise is where {companyName} manages contracts, invoices, and payments with their freelancers. You&apos;ll be able to sign contracts, submit invoices, and get paid — all in one place.
          </Text>
          <Section style={{ textAlign: "center", margin: "32px 0 8px" }}>
            <Button
              href={inviteUrl}
              style={{
                backgroundColor: "#4F46E5",
                color: "#FFFFFF",
                borderRadius: "999px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-block",
                boxSizing: "border-box",
              }}
            >
              Accept invitation
            </Button>
          </Section>
          <Hr style={{ borderColor: "#E2E8F0", margin: "32px 0 16px" }} />
          <Text style={{ margin: 0, color: "#94A3B8", fontSize: "12px" }}>
            This invite expires in 7 days · Sent via RemoteWise · Powered by RemoteWise Teams
          </Text>
          <Text style={{ margin: "16px 0 0", color: "#64748B", fontSize: "12px" }}>
            Payments secured by Stripe
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

FreelancerInviteEmail.PreviewProps = {
  companyName: "Northstar Studio",
  freelancerName: "Ahmed Hassan",
  inviteUrl: "http://localhost:3000/invite/preview",
  note: "We loved your portfolio — excited to start the brand work together.",
} satisfies FreelancerInviteEmailProps;
