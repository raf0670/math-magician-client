import PolicyPage from "@/components/legal/PolicyPage";
import { policies } from "@/components/legal/policyContent";

export const metadata = {
  title: "Return & Refund Policy | Magician's School",
  description: "Return and refund policy for Magician's School enrollment and admission preparation services.",
};

export default function ReturnRefundPolicyPage() {
  return <PolicyPage policy={policies.refund} />;
}
