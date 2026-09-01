import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { parseStoredDocument } from "@/lib/contracts/document";
import type { StoredContract } from "@/lib/store";

const styles = StyleSheet.create({
  page: {
    paddingTop: 71,
    paddingBottom: 71,
    paddingHorizontal: 57,
    fontFamily: "Times-Roman",
    fontSize: 10,
    lineHeight: 1.8,
    color: "#0F172A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  brand: { fontSize: 9, color: "#2563EB", fontFamily: "Helvetica" },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  id: { fontSize: 9, fontFamily: "Courier", color: "#475569" },
  rule: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 12 },
  heading: { fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 10, marginBottom: 2 },
  summary: { fontSize: 9, fontFamily: "Times-Italic", color: "#475569", marginBottom: 4 },
  body: { fontSize: 10, textAlign: "justify" },
  disclaimer: { fontSize: 8, fontFamily: "Helvetica", color: "#64748B", marginTop: 16 },
  sigRow: { flexDirection: "row", gap: 16, marginTop: 24 },
  sigBox: { flex: 1, borderWidth: 1, borderColor: "#E2E8F0", padding: 10 },
  sigName: { fontSize: 16, fontFamily: "Times-Italic", marginBottom: 8 },
  audit: { marginTop: 16, padding: 10, backgroundColor: "#F8FAFC", fontFamily: "Courier", fontSize: 8, color: "#475569" },
  footer: { position: "absolute", bottom: 32, left: 57, right: 57, fontSize: 8, color: "#94A3B8", fontFamily: "Helvetica" },
});

export function ContractPdf({
  contract,
  freelancerName,
  signerName,
  signerIp,
  signedAt,
}: {
  contract: StoredContract;
  freelancerName: string;
  signerName: string;
  signerIp: string;
  signedAt: string;
}) {
  const shortId = `RW-${contract.id.replaceAll("-", "").slice(0, 8).toUpperCase()}`;
  const model = parseStoredDocument(contract.bodyHtml);
  const companyLabel = model?.companyName || contract.companyName;
  const startLabel = model?.startDateLabel || new Date(contract.createdAt).toLocaleDateString();
  const lawLabel = model?.governingLaw || "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>RemoteWise Teams</Text>
          <Text style={styles.id}>{shortId}</Text>
        </View>
        <Text style={styles.title}>{model?.title || contract.title}</Text>
        <Text style={styles.id}>
          {startLabel}
          {lawLabel ? ` · ${lawLabel}` : ""}
        </Text>
        <View style={styles.rule} />
        {model ? (
          <>
            {model.sections.map((section, index) => (
              <View key={`${section.heading}-${index}`}>
                <Text style={styles.heading}>
                  {index + 1}. {section.heading}
                </Text>
                <Text style={styles.summary}>{section.summary}</Text>
                <Text style={styles.body}>{section.body}</Text>
              </View>
            ))}
            <Text style={styles.disclaimer}>{model.disclaimer}</Text>
          </>
        ) : (
          <Text style={styles.body}>{contract.bodyHtml}</Text>
        )}
        <View style={styles.sigRow}>
          <View style={styles.sigBox}>
            <Text style={styles.sigName}>{companyLabel}</Text>
            <Text>Signed by: {contract.createdBy}</Text>
            <Text>Date: {new Date(contract.sentAt || contract.createdAt).toLocaleString()}</Text>
          </View>
          <View style={styles.sigBox}>
            <Text style={styles.sigName}>{signerName}</Text>
            <Text>Signed by: {freelancerName}</Text>
            <Text>Date: {new Date(signedAt).toLocaleString()}</Text>
            <Text>IP: {signerIp}</Text>
          </View>
        </View>
        <View style={styles.audit}>
          <Text>Contract sent: {contract.sentAt}</Text>
          <Text>Viewed by freelancer: {contract.viewedAt}</Text>
          <Text>Signed by freelancer: {signedAt}</Text>
          <Text>Freelancer IP: {signerIp}</Text>
          <Text>Signer name entered: {signerName}</Text>
          <Text>Document hash: {contract.documentHash}</Text>
        </View>
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `RemoteWise Teams · Confidential · Page ${pageNumber} of ${totalPages} · Contract ID: ${shortId}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
