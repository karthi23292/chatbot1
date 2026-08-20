export type ConversationState =
  | "GREETING"
  | "DISCOVERY"
  | "QUALIFICATION"
  | "DIAGNOSIS"
  | "EDUCATION"
  | "RECOMMENDATION"
  | "DEMO_BOOKING"
  | "SUPPORT"
  | "ESCALATION"
  | "CLOSURE";

export type Intent =
  | "PRODUCT_DISCOVERY"
  | "CUSTOMER_SUPPORT"
  | "TECHNICAL_SUPPORT"
  | "ARCHITECTURE"
  | "DEMO_BOOKING"
  | "SALES"
  | "BILLING"
  | "ACCOUNT_HELP"
  | "ESCALATION"
  | "UNKNOWN";

export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  role: ChatRole;
  content: string;
  timestamp?: string;
  intent?: Intent;
};

export type ConversationContext = {
  vmsPlatform?: string;
  challenge?: string;
  companySize?: string;
  company?: string;
  name?: string;
  currentState?: ConversationState;
  lastIntent?: Intent;
};

export type Lead = {
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  companySize: string;
  vmsPlatform: string;
  primaryChallenge: string;
  sessionType: SessionType;
  preferredTime: string;
  timezone: string;
  source: "WISER Advisor";
};

export type SessionType = "walkthrough" | "architecture" | "transformation";

export type BookingStatus = "idle" | "submitting" | "success" | "error";

export type SupportCase = {
  customerName: string;
  organization: string;
  system: string;
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
  impact: string;
  symptoms: string;
  recommendedNextAction: string;
};

export type WiserAdvisorProps = {
  onBookDemo?: (lead: Lead) => void | Promise<void>;
  onSupportCase?: (supportCase: SupportCase) => void | Promise<void>;
};

export const sessionTypeLabels: Record<SessionType, string> = {
  walkthrough: "Product Walkthrough",
  architecture: "Technical Architecture Session",
  transformation: "Enterprise Transformation Consultation",
};

export const welcomePrompts = [
  { icon: "rocket", label: "What are the key stages of VMS implementation?" },
  { icon: "refresh", label: "How do we improve adoption?" },
  { icon: "alert", label: "What are the biggest transformation risks?" },
  { icon: "target", label: "Are we ready for go-live?" },
  { icon: "chart", label: "What should the CPO dashboard show?" },
  { icon: "wrench", label: "What should we monitor during hypercare?" },
  { icon: "book", label: "Show me the VMS implementation playbook." },
  { icon: "compass", label: "I don't know where to start." },
] as const;

export const supportCategories = [
  "VMS Integration",
  "API Connection",
  "Webhook Processing",
  "Data Synchronization",
  "Change Management System",
  "Dashboard Data",
  "Authentication",
  "Permissions",
  "Configuration",
  "Event Processing",
  "Transformation Monitoring",
  "Scoring",
  "AI Advisor",
  "Account Issues",
] as const;

export const vmsPlatforms = ["SAP Fieldglass", "Beeline", "VNDLY", "Other", "No Platform Yet"] as const;
export const companySizes = ["Under 1,000", "1,000-5,000", "5,000-10,000", "10,000+"] as const;
export const implementationTimelines = ["Immediate", "3-6 Months", "6-12 Months", "12+ Months"] as const;
export const sessionTypes: { value: SessionType; label: string; description: string }[] = [
  { value: "walkthrough", label: "Product Walkthrough", description: "See WISER in action with a guided tour of key capabilities" },
  { value: "architecture", label: "Technical Architecture Session", description: "Deep dive into integration patterns and technical design" },
  { value: "transformation", label: "Enterprise Transformation Consultation", description: "Strategic discussion about your transformation journey" },
];
