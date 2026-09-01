import { Body, Button, Container, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";

export function EmailShell({
  preview,
  eyebrow,
  heading,
  children,
  actionLabel,
  actionUrl,
}: {
  preview: string;
  eyebrow: string;
  heading: string;
  children: ReactNode;
  actionLabel?: string;
  actionUrl?: string;
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#F8FAFC", margin: 0, padding: "32px 16px", fontFamily: "Inter, Helvetica, Arial, sans-serif" }}>
        <Container style={{ backgroundColor: "#FFFFFF", borderRadius: "8px", maxWidth: "560px", padding: "40px 32px" }}>
          <Text style={{ margin: 0, color: "#4F46E5", fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            RemoteWise
          </Text>
          <Text style={{ margin: "8px 0 0", color: "#475569", fontSize: "14px" }}>{eyebrow}</Text>
          <Text style={{ margin: "24px 0 0", color: "#0F172A", fontSize: "24px", fontWeight: 700, fontFamily: "Space Grotesk, Inter, sans-serif", lineHeight: "1.3" }}>
            {heading}
          </Text>
          {children}
          {actionLabel && actionUrl ? (
            <Section style={{ textAlign: "center", margin: "32px 0 8px" }}>
              <Button
                href={actionUrl}
                style={{
                  backgroundColor: "#4F46E5",
                  color: "#FFFFFF",
                  borderRadius: "999px",
                  padding: "12px 24px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                {actionLabel}
              </Button>
            </Section>
          ) : null}
          <Hr style={{ borderColor: "#E2E8F0", margin: "32px 0 16px" }} />
          <Text style={{ margin: 0, color: "#94A3B8", fontSize: "12px" }}>
            Sent via RemoteWise · We reply within 24 hours
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
