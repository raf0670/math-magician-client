import PolicyPage from "@/components/legal/PolicyPage";
import { policies } from "@/components/legal/policyContent";

export const metadata = {
  title: "Terms & Conditions | Magician's School",
  description: "Terms for enrollment, payment, course access, and acceptable use at Magician's School.",
};

export default function TermsAndConditionsPage() {
  return <PolicyPage policy={policies.terms} />;
}
