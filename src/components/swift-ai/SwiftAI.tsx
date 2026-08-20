import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  AlertTriangle,
  ArrowRight,
  Book,
  Calendar,
  ChartBar,
  Check,
  ChevronRight,
  CircleHelp,
  Compass,
  Minimize2,
  RefreshCw,
  Rocket,
  Send,
  Sparkles,
  Target,
  Wrench,
  X,
} from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type {
  BookingStatus,
  ChatMessage,
  ConversationContext,
  Intent,
  Lead,
  SessionType,
  SupportCase,
  WiserAdvisorProps,
} from './types';
import {
  companySizes,
  sessionTypes,
  supportCategories,
  vmsPlatforms,
  welcomePrompts,
} from './types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wiser-advisor`;
const lottieSrc = '/Ai_Robot_Vector_Art.lottie';

function getSessionId(): string {
  let id = sessionStorage.getItem('wiser_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('wiser_session_id', id);
  }
  return id;
}

function Robot({ size = 38 }: { size?: number }) {
  return (
    <span className="swift-robot" style={{ width: size, height: size }} aria-hidden="true">
      <DotLottieReact src={lottieSrc} autoplay loop style={{ width: '100%', height: '100%' }} />
    </span>
  );
}

function Typing() {
  return (
    <div className="swift-typing" aria-label="WISER Advisor is typing">
      <span /><span /><span />
    </div>
  );
}

const promptIcons: Record<string, typeof Rocket> = {
  rocket: Rocket,
  refresh: RefreshCw,
  alert: AlertTriangle,
  target: Target,
  chart: ChartBar,
  wrench: Wrench,
  book: Book,
  compass: Compass,
};

function WelcomePrompts({ onPrompt }: { onPrompt: (text: string) => void }) {
  return (
    <div className="swift-prompts">
      {welcomePrompts.map((prompt, i) => {
        const Icon = promptIcons[prompt.icon] ?? Sparkles;
        return (
          <button
            key={prompt.label}
            className="swift-prompt-btn"
            style={{ animationDelay: `${i * 60}ms` }}
            onClick={() => onPrompt(prompt.label)}
          >
            <Icon size={14} />
            <span>{prompt.label}</span>
            <ChevronRight size={13} className="swift-prompt-arrow" />
          </button>
        );
      })}
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="swift-message-row user">
        <div className="swift-message user-msg">{message.content}</div>
      </div>
    );
  }
  return (
    <div className="swift-message-row">
      <Robot size={28} />
      <div>
        <div className="swift-message meta">WISER Advisor</div>
        <div className="swift-message assistant-msg">{message.content}</div>
      </div>
    </div>
  );
}

function BookingForm({
  lead,
  setLead,
  onSubmit,
  status,
}: {
  lead: Lead;
  setLead: (updater: (prev: Lead) => Lead) => void;
  onSubmit: () => void;
  status: BookingStatus;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!lead.name.trim()) nextErrors.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(lead.email)) nextErrors.email = "Please enter a valid work email.";
    if (!lead.company.trim()) nextErrors.company = "Please enter your company.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="swift-booking">
      <h3>Let's connect you with our team.</h3>
      <p>Share a few details and we'll arrange a personalized session.</p>

      <label className="swift-label">
        Full Name *
        <input
          value={lead.name}
          onChange={(e) => setLead((prev) => ({ ...prev, name: e.target.value }))}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <small>{errors.name}</small>}
      </label>

      <label className="swift-label">
        Work Email *
        <input
          value={lead.email}
          onChange={(e) => setLead((prev) => ({ ...prev, email: e.target.value }))}
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <small>{errors.email}</small>}
      </label>

      <label className="swift-label">
        Company *
        <input
          value={lead.company}
          onChange={(e) => setLead((prev) => ({ ...prev, company: e.target.value }))}
          aria-invalid={Boolean(errors.company)}
        />
        {errors.company && <small>{errors.company}</small>}
      </label>

      <label className="swift-label">
        Job Title
        <input
          value={lead.jobTitle}
          onChange={(e) => setLead((prev) => ({ ...prev, jobTitle: e.target.value }))}
        />
      </label>

      <label className="swift-label">
        Company Size
        <select
          value={lead.companySize}
          onChange={(e) => setLead((prev) => ({ ...prev, companySize: e.target.value }))}
        >
          <option value="">Select...</option>
          {companySizes.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>

      <label className="swift-label">
        Current VMS Platform
        <select
          value={lead.vmsPlatform}
          onChange={(e) => setLead((prev) => ({ ...prev, vmsPlatform: e.target.value }))}
        >
          <option value="">Select...</option>
          {vmsPlatforms.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </label>

      <label className="swift-label">
        Session Type
        <select
          value={lead.sessionType}
          onChange={(e) => setLead((prev) => ({ ...prev, sessionType: e.target.value as SessionType }))}
        >
          {sessionTypes.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </label>

      <label className="swift-label">
        Preferred Time
        <input
          value={lead.preferredTime}
          onChange={(e) => setLead((prev) => ({ ...prev, preferredTime: e.target.value }))}
          placeholder="e.g. Next Tuesday morning"
        />
      </label>

      <label className="swift-label">
        Timezone
        <input
          value={lead.timezone}
          onChange={(e) => setLead((prev) => ({ ...prev, timezone: e.target.value }))}
          placeholder="e.g. EST, PST, GMT"
        />
      </label>

      {status === "error" && (
        <div className="swift-error">We couldn't submit that just now. Please try again.</div>
      )}

      <button className="swift-primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting..." : <>Book My Session <ArrowRight size={15} /></>}
      </button>
    </form>
  );
}

function SupportForm({
  supportCase,
  setSupportCase,
  onSubmit,
}: {
  supportCase: SupportCase;
  setSupportCase: (updater: (prev: SupportCase) => SupportCase) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="swift-booking">
      <h3>Create a Support Case</h3>
      <p>We'll route this to our support team with full conversation context.</p>

      <label className="swift-label">
        Your Name
        <input
          value={supportCase.customerName}
          onChange={(e) => setSupportCase((prev) => ({ ...prev, customerName: e.target.value }))}
        />
      </label>

      <label className="swift-label">
        Organization
        <input
          value={supportCase.organization}
          onChange={(e) => setSupportCase((prev) => ({ ...prev, organization: e.target.value }))}
        />
      </label>

      <label className="swift-label">
        System
        <select
          value={supportCase.system}
          onChange={(e) => setSupportCase((prev) => ({ ...prev, system: e.target.value }))}
        >
          <option value="">Select...</option>
          {supportCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>

      <label className="swift-label">
        Issue Summary
        <textarea
          value={supportCase.issue}
          onChange={(e) => setSupportCase((prev) => ({ ...prev, issue: e.target.value }))}
          placeholder="Briefly describe the issue..."
          maxLength={500}
        />
      </label>

      <label className="swift-label">
        Severity
        <select
          value={supportCase.severity}
          onChange={(e) => setSupportCase((prev) => ({ ...prev, severity: e.target.value as SupportCase["severity"] }))}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </label>

      <label className="swift-label">
        Impact
        <input
          value={supportCase.impact}
          onChange={(e) => setSupportCase((prev) => ({ ...prev, impact: e.target.value }))}
          placeholder="Who or what is affected?"
        />
      </label>

      <button className="swift-primary" onClick={onSubmit}>
        Submit Case <ArrowRight size={15} />
      </button>
    </div>
  );
}

const initialLead: Lead = {
  name: "", email: "", company: "", jobTitle: "", companySize: "", vmsPlatform: "",
  primaryChallenge: "", sessionType: "walkthrough", preferredTime: "", timezone: "",
  source: "WISER Advisor",
};

const initialSupportCase: SupportCase = {
  customerName: "", organization: "", system: "", issue: "", severity: "medium",
  impact: "", symptoms: "", recommendedNextAction: "",
};

type View = "chat" | "booking" | "support" | "success";

export function SwiftAI({ onBookDemo, onSupportCase }: WiserAdvisorProps) {
  void onSupportCase;
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<View>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [context, setContext] = useState<ConversationContext>({ currentState: "GREETING" });
  const [lead, setLead] = useState<Lead>(initialLead);
  const [supportCase, setSupportCase] = useState<SupportCase>(initialSupportCase);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>("idle");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sessionId = useRef(getSessionId());

  // Auto-open: launcher appears at 900ms, chat opens immediately after
  useEffect(() => {
    const alreadyOpened = sessionStorage.getItem("wiser_auto_opened");
    const timer = window.setTimeout(() => {
      setVisible(true);
      if (!alreadyOpened) {
        sessionStorage.setItem("wiser_auto_opened", "true");
        setIsOpen(true);
      }
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, view]);

  // Escape to close
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  // Track analytics
  const trackEvent = useCallback(async (eventType: string, eventData: Record<string, unknown>) => {
    try {
      await supabase.from("wiser_analytics").insert({
        session_id: sessionId.current,
        conversation_id: conversationId,
        event_type: eventType,
        event_data: eventData,
      });
    } catch {
      // analytics failure should not break the UX
    }
  }, [conversationId]);

  // Send initial greeting when chat first opens
  useEffect(() => {
    if (isOpen && messages.length === 0 && !streaming) {
      setMessages([{
        role: "assistant",
        content: "Hi, I'm the WISER Advisor.\n\nI can help you understand WISER, explore how it works with your existing systems, troubleshoot product questions, or connect you with our team.\n\nWhat would you like to explore?",
        timestamp: new Date().toISOString(),
      }]);
      trackEvent("conversation_started", {});
    }
  }, [isOpen, messages.length, streaming, trackEvent]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setStreaming(true);
    setStreamingText("");

    // Detect intent from keywords for analytics
    const lowerText = text.toLowerCase();
    let detectedIntent: Intent = "UNKNOWN";
    if (/demo|walkthrough|session|show me|book|schedule/.test(lowerText)) detectedIntent = "DEMO_BOOKING";
    else if (/issue|problem|error|broken|fail|not working|support|help with/.test(lowerText)) detectedIntent = "CUSTOMER_SUPPORT";
    else if (/integrate|integration|api|webhook|architecture|technical/.test(lowerText)) detectedIntent = "ARCHITECTURE";
    else if (/price|pricing|cost|buy|purchase|plan/.test(lowerText)) detectedIntent = "SALES";
    else if (/what is|what can you do|how does|explain|tell me about/.test(lowerText)) detectedIntent = "PRODUCT_DISCOVERY";

    trackEvent("intent_detected", { intent: detectedIntent, message: text });

    // Check if user wants to book a demo
    if (detectedIntent === "DEMO_BOOKING" && /book|demo|schedule|session/.test(lowerText)) {
      setStreaming(false);
      setView("booking");
      setContext((prev) => ({ ...prev, currentState: "DEMO_BOOKING" }));
      return;
    }

    // Check if user needs support escalation
    if (/escalate|human|agent|talk to someone|support case/.test(lowerText)) {
      setStreaming(false);
      setView("support");
      setContext((prev) => ({ ...prev, currentState: "ESCALATION" }));
      trackEvent("escalation", { message: text });
      return;
    }

    // Build messages for Groq
    const groqMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role, content: m.content }))
      .concat([{ role: "user" as const, content: text }]);

    try {
      const response = await fetch(EDGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: groqMessages,
          context,
          conversationId,
          sessionId: sessionId.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              fullText += parsed.response;
              setStreamingText(fullText);
            }
            if (parsed.error) {
              fullText += "\n\nI apologize, I'm having trouble connecting right now. Please try again or reach out to our team directly.";
              setStreamingText(fullText);
            }
            if (parsed.done) {
              // Stream complete
            }
          } catch {
            // ignore parse errors for partial chunks
          }
        }
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: fullText || "I'm here to help. Could you tell me more about what you're looking for?",
        timestamp: new Date().toISOString(),
        intent: detectedIntent,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingText("");
      setContext((prev) => ({
        ...prev,
        lastIntent: detectedIntent,
        currentState: detectedIntent === "CUSTOMER_SUPPORT" ? "SUPPORT" : "DISCOVERY",
      }));
    } catch {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment, or you can book a demo and our team will reach out directly.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setStreaming(false);
    }
  }, [streaming, messages, context, conversationId, trackEvent]);

  const handlePromptClick = (text: string) => {
    sendMessage(text);
  };

  const handleBookingSubmit = async () => {
    setBookingStatus("submitting");
    try {
      await onBookDemo?.(lead);
      const { data } = await supabase.from("wiser_leads").insert({
        conversation_id: conversationId,
        name: lead.name,
        email: lead.email,
        company: lead.company,
        job_title: lead.jobTitle,
        company_size: lead.companySize,
        vms_platform: lead.vmsPlatform,
        primary_challenge: lead.primaryChallenge,
        session_type: lead.sessionType,
        preferred_time: lead.preferredTime,
        timezone: lead.timezone,
        status: "new",
      }).select("id").maybeSingle();

      trackEvent("demo_booked", {
        lead_id: data?.id,
        session_type: lead.sessionType,
        company: lead.company,
      });

      setBookingStatus("success");
      setView("success");
    } catch {
      setBookingStatus("error");
    }
  };

  const handleSupportSubmit = async () => {
    try {
      const { data } = await supabase.from("wiser_support_cases").insert({
        conversation_id: conversationId,
        customer_name: supportCase.customerName,
        organization: supportCase.organization,
        system: supportCase.system,
        issue: supportCase.issue,
        severity: supportCase.severity,
        impact: supportCase.impact,
        symptoms: supportCase.symptoms,
        troubleshooting_steps: messages.map((m) => ({ role: m.role, content: m.content })),
        recommended_next_action: supportCase.recommendedNextAction,
        status: "open",
      }).select("id").maybeSingle();

      trackEvent("support_case_created", {
        case_id: data?.id,
        system: supportCase.system,
        severity: supportCase.severity,
      });

      setView("success");
    } catch {
      // show error inline
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetToChat = () => {
    setView("chat");
    setBookingStatus("idle");
  };

  const startOver = () => {
    setMessages([]);
    setView("chat");
    setLead(initialLead);
    setSupportCase(initialSupportCase);
    setBookingStatus("idle");
    setContext({ currentState: "GREETING" });
    setConversationId(null);
  };

  return (
    <>
      <button
        className={`swift-launcher ${visible ? "is-visible" : ""}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open WISER Advisor"
      >
        <Robot size={46} />
        <Sparkles className="swift-sparkle" size={14} />
      </button>

      {isOpen && (
        <div className="swift-window" role="dialog" aria-modal="false" aria-label="WISER Advisor">
          <header className="swift-header">
            <Robot size={38} />
            <div>
              <strong>WISER Advisor</strong>
              <small>Enterprise Transformation Advisor</small>
              <span><i /> Online</span>
            </div>
            <div className="swift-header-actions">
              <button onClick={() => { setIsOpen(false); }} aria-label="Minimize WISER Advisor">
                <Minimize2 size={16} />
              </button>
              <button onClick={() => { setIsOpen(false); }} aria-label="Close WISER Advisor">
                <X size={17} />
              </button>
            </div>
          </header>

          <main className="swift-conversation" aria-live="polite">
            {view === "chat" && (
              <>
                {messages.map((msg, i) => (
                  <MessageBubble key={i} message={msg} />
                ))}

                {streaming && (
                  <div className="swift-message-row">
                    <Robot size={28} />
                    <div>
                      <div className="swift-message meta">WISER Advisor</div>
                      {streamingText ? (
                        <div className="swift-message assistant-msg">{streamingText}</div>
                      ) : (
                        <Typing />
                      )}
                    </div>
                  </div>
                )}

                {messages.length <= 1 && !streaming && (
                  <WelcomePrompts onPrompt={handlePromptClick} />
                )}

                <div ref={endRef} />
              </>
            )}

            {view === "booking" && (
              <BookingForm
                lead={lead}
                setLead={(updater) => setLead((prev) => updater(prev))}
                onSubmit={handleBookingSubmit}
                status={bookingStatus}
              />
            )}

            {view === "support" && (
              <SupportForm
                supportCase={supportCase}
                setSupportCase={(updater) => setSupportCase((prev) => updater(prev))}
                onSubmit={handleSupportSubmit}
              />
            )}

            {view === "success" && (
              <div className="swift-success">
                <span><Check size={30} /></span>
                <h3>You're all set!</h3>
                <p>
                  {view === "success" && bookingStatus === "success"
                    ? `Thanks, ${lead.name.trim().split(" ")[0] || "there"}. A member of our team will reach out to ${lead.email} within one business day.`
                    : "Your support case has been created. Our team will review the full conversation context and respond shortly."}
                </p>
                <div className="swift-options">
                  <button className="swift-action" onClick={resetToChat}>
                    Continue Chatting <ArrowRight size={15} />
                  </button>
                  <button className="swift-action secondary" onClick={startOver}>
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </main>

          {view === "chat" && (
            <footer className="swift-footer">
              <div className="swift-input-area">
                <textarea
                  ref={inputRef}
                  placeholder="Ask WISER anything about your VMS transformation..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={streaming}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || streaming}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="swift-footer-meta">
                <button onClick={() => setView("booking")}>
                  <Calendar size={13} /> Book a Demo
                </button>
                <button onClick={() => setView("support")}>
                  <CircleHelp size={13} /> Get Support
                </button>
                <span>Powered by WISER <Sparkles size={11} /></span>
              </div>
            </footer>
          )}
        </div>
      )}
    </>
  );
}
