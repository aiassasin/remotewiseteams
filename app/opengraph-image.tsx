import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "RemoteWise Teams — contracts, invoices, payouts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(135deg, #0B1A33 0%, #1E3A5F 60%, #2563EB 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", opacity: 0.8 }}>RemoteWise</div>
        <div style={{ marginTop: 16, fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>
          Contracts, invoices, payouts.
        </div>
        <div style={{ marginTop: 20, fontSize: 28, opacity: 0.9 }}>5.5% all-in. Shield included. 24h free payout.</div>
      </div>
    ),
    size,
  );
}
