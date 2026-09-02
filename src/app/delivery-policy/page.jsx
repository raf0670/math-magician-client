import PolicyPage from "@/components/legal/PolicyPage";
import { policies } from "@/components/legal/policyContent";

export const metadata = {
  title: "Delivery Policy | Magician's School",
  description: "How Magician's School delivers online and offline classes, resources, and access.",
};

export default function DeliveryPolicyPage() {
  return <PolicyPage policy={policies.delivery} />;
}
