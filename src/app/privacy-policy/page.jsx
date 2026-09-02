import PolicyPage from "@/components/legal/PolicyPage";
import { policies } from "@/components/legal/policyContent";

export const metadata = {
  title: "Privacy Policy | Magician's School",
  description: "How Magician's School collects, uses, protects, and shares student information.",
};

export default function PrivacyPolicyPage() {
  return <PolicyPage policy={policies.privacy} />;
}
