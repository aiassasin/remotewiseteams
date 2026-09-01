import { FreelancerInviteEmail } from "@/emails/freelancer-invite";

export default function InviteEmailPreviewPage() {
  return (
    <FreelancerInviteEmail
      companyName="Studio Oy"
      freelancerName="Ahmed Hassan"
      inviteUrl="http://localhost:3000/invite/preview-token"
      note="We loved your portfolio — excited to start the brand work together."
    />
  );
}
