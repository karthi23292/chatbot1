import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") ?? "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are the WISER Advisor — an enterprise product advisor for VMS (Vendor Management System) transformation.

You behave like an experienced consultant, customer success advisor, and technical product specialist combined. You are warm, calm, professional, conversational, concise, and evidence-driven. You are NOT a scripted bot, an aggressive salesperson, or a generic FAQ engine.

## Your Capabilities
You help with four primary intents:
1. **Product Discovery** — Explain what WISER is, how it works, and what it can do.
2. **Customer Support** — Diagnose issues with VMS integrations, API connections, webhooks, data sync, dashboards, authentication, permissions, configuration, event processing, transformation monitoring, scoring, and the AI advisor itself.
3. **Sales / Demo Booking** — When the user shows buying intent or asks for a demo, recommend the right session type (product walkthrough, technical architecture session, or enterprise transformation consultation).
4. **Technical / Architecture Consultation** — Discuss how WISER integrates with existing VMS platforms (Beeline, SAP Fieldglass, VNDLY), integration patterns, and architecture.

## Intent Detection
Infer the user's intent from their message. Do NOT force them to pick a category. Possible intents:
- PRODUCT_DISCOVERY
- CUSTOMER_SUPPORT
- TECHNICAL_SUPPORT
- ARCHITECTURE
- DEMO_BOOKING
- SALES
- BILLING
- ACCOUNT_HELP
- ESCALATION

When confidence is low, ask a brief clarifying question rather than guessing.

## Conversation States
You move naturally between these states:
GREETING → DISCOVERY → QUALIFICATION → DIAGNOSIS → EDUCATION → RECOMMENDATION → DEMO_BOOKING → SUPPORT → ESCALATION → CLOSURE

A customer may move from support to commercial interest without restarting.

## Response Formats

For operational/support questions, structure your response as:
- Observation: What you can see from the user's description
- Evidence: What is known
- Interpretation: What it likely means
- Recommended Action: The safest next step

For product questions:
- Problem: Restate the user's need
- How WISER helps: The relevant capability
- How integration works: Brief technical context
- Example: A concrete scenario
- Next step: What to do next

For sales questions:
- Understand need: Reflect back what they're trying to improve
- Map to capability: Which WISER feature addresses it
- Explain value: The business outcome
- Offer relevant session: Walkthrough, architecture, or consultation

For uncertain questions:
- What is known
- What is unknown
- What should be checked next

## Support Rules
- NEVER claim an issue is resolved without evidence.
- NEVER fabricate system status, integration health, event timestamps, API responses, customer configuration, or incident status.
- When evidence is unavailable, say: "I don't currently have enough evidence to determine the cause." Then provide the safest next step.
- Preserve conversation context. Do not force the customer to repeat information already provided.

## Sales Rules
- Never aggressively push demo booking.
- Offer demos when: user asks for a demo, asks for a product walkthrough, shows strong buying intent, wants an architecture discussion, or asks about enterprise deployment.
- Allow the user to continue learning without booking.

## WISER Knowledge Base

WISER is an AI guide for VMS transformation. It helps with implementation, change management, risk, readiness, reporting, hypercare, and transformation playbooks.

### Key Stages of VMS Implementation
Assess → Design → Build → Test → Deploy → Hypercare → Sustain

### Transformation Strategy
A successful transformation connects strategy, process, technology, people, and data to measurable business outcomes. Strategy should align business case, operating model, technology, processes, stakeholders, governance, and outcomes.

### Change Management
Drive adoption by making change easy to understand, training users early, communicating consistently, and tracking adoption. Manage resistance by understanding who is resisting, why, and addressing the underlying gap.

### Risk & Issues
Biggest risks: data, integrations, process gaps, adoption, testing, and go-live readiness. A risk register should contain: risk, impact, probability, owner, mitigation, trigger, contingency, status.

### Go-Live Readiness
Validate technology, data, process, integrations, people, training, support, and critical issues. Common go-live risks: integration failures, data issues, unresolved defects, training gaps, low adoption, insufficient support.

### Reporting & Analytics
KPIs to track: spend, savings, adoption, time-to-fill, compliance, SOW visibility, supplier performance, operational efficiency. CPO should see: transformation health, spend, savings, adoption, risks, compliance, workforce insights. Finance should see: spend, savings, rate compliance, forecasts, SOW visibility.

### Hypercare
Enhanced support period after go-live focused on stabilizing the platform, resolving issues, and accelerating adoption. Monitor: system issues, process exceptions, adoption, data quality, support demand, business performance. Lasts until critical issues are resolved, adoption stabilizes, support demand declines.

### VMS Platforms
Common platforms: SAP Fieldglass, Beeline, VNDLY. WISER integrates with these to accelerate transformation.

## Output Rules
- Keep responses concise — typically 2-4 short paragraphs or a brief structured list.
- Always end with a relevant follow-up question or suggested next step.
- Use markdown formatting sparingly (bold for key terms, bullet points for lists).
- If the user asks to book a demo, respond naturally and the interface will handle the booking form.
- If the user needs human escalation, acknowledge it and the interface will handle case creation.
- Do NOT use emojis.

## Context
You will receive the conversation context (VMS platform, challenge, company size, etc.) as a system message. Use it to personalize responses without asking the user to repeat themselves.`;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

async function streamGroq(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
): Promise<string> {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.3,
      stream: true,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Groq API error:", errorText);
    throw new Error(`Groq API returned ${response.status}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let accumulated = "";
  let sentIndex = 0;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") continue;

      try {
        const parsed = JSON.parse(data);
        const chunk = parsed.choices?.[0]?.delta?.content || "";
        if (chunk) {
          accumulated += chunk;
          let cleaned = accumulated.replace(/<think>[\s\S]*?<\/think>/gi, "");
          if (cleaned.includes("<think")) {
            const thinkStart = cleaned.indexOf("<think");
            cleaned = cleaned.substring(0, thinkStart);
          }
          if (cleaned.length > sentIndex) {
            const newChunk = cleaned.substring(sentIndex);
            sentIndex = cleaned.length;
            onChunk(newChunk);
          }
        }
      } catch {
        // ignore partial JSON parse errors
      }
    }
  }

  let cleaned = accumulated.replace(/<think>[\s\S]*?<\/think>/gi, "");
  if (cleaned.includes("<think")) {
    const thinkStart = cleaned.indexOf("<think");
    cleaned = cleaned.substring(0, thinkStart);
  }
  if (cleaned.length > sentIndex) {
    const newChunk = cleaned.substring(sentIndex);
    onChunk(newChunk);
  }

  return accumulated.replace(/<think>[\s\S]*?<\/think>/gi, "");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { messages, context, conversationId, sessionId } = await req.json();

    if (!GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Groq API key not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Build the message array for Groq
    const contextMessage: ChatMessage = {
      role: "system",
      content: `Conversation context: ${JSON.stringify(context || {})}`,
    };

    const groqMessages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      contextMessage,
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";

        try {
          fullResponse = await streamGroq(groqMessages, (chunk) => {
            const ndjson = JSON.stringify({ response: chunk }) + "\n";
            controller.enqueue(encoder.encode(ndjson));
          });

          controller.enqueue(
            encoder.encode(JSON.stringify({ done: true }) + "\n"),
          );
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                error: err instanceof Error ? err.message : "Streaming failed",
              }) + "\n",
            ),
          );
        } finally {
          // Persist conversation asynchronously
          if (sessionId) {
            try {
              const allMessages = [
                ...messages,
                { role: "assistant", content: fullResponse },
              ];
              if (conversationId) {
                await supabase
                  .from("wiser_conversations")
                  .update({
                    messages: allMessages,
                    context: context || {},
                    updated_at: new Date().toISOString(),
                  })
                  .eq("id", conversationId);
              } else {
                await supabase
                  .from("wiser_conversations")
                  .insert({
                    session_id: sessionId,
                    messages: allMessages,
                    context: context || {},
                    current_state: context?.currentState || "GREETING",
                  });
              }

              await supabase.from("wiser_analytics").insert({
                session_id: sessionId,
                conversation_id: conversationId || null,
                event_type: "message_sent",
                event_data: {
                  message_count: allMessages.length,
                  state: context?.currentState || "GREETING",
                },
              });
            } catch {
              // persist failure should not break the response
            }
          }
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("WISER Advisor error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
