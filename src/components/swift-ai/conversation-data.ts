export const wiserKnowledgeBase = {
  whatIsWiser: {
    title: "What is WISER?",
    answer: "I'm your AI guide for VMS transformation. I can help with implementation, change, risk, readiness, reporting, hypercare, and transformation playbooks.",
    nextSteps: ["Show me what you can do", "Where should I start?"],
  },
  gettingStarted: {
    title: "Where should I start with my VMS transformation?",
    answer: "Start by understanding your current state, target state, key gaps, and transformation priorities.",
    nextSteps: ["Assess my readiness", "Show transformation roadmap"],
  },
  whatIsVMSTransformation: {
    title: "What is VMS transformation?",
    answer: "It's the modernization of your contingent workforce program through better people, process, technology, data, and governance.",
    nextSteps: ["What are the benefits?", "Show transformation journey"],
  },
  benefits: {
    title: "What are the benefits of VMS transformation?",
    answer: "Greater visibility, stronger compliance, better user experience, improved efficiency, and better control of workforce spend.",
    nextSteps: ["How do we measure success?", "Show key benefits"],
  },
} as const;

export const transformationStrategy = {
  successfulTransformation: {
    title: "What does a successful VMS transformation look like?",
    answer: "A successful transformation connects strategy, process, technology, people, and data to measurable business outcomes.",
    nextSteps: ["Show success factors", "Show maturity model"],
  },
  strategy: {
    title: "What should our transformation strategy include?",
    answer: "Your strategy should align the business case, operating model, technology, processes, stakeholders, governance, and outcomes.",
    nextSteps: ["Show strategy framework", "Build transformation roadmap"],
  },
  maturity: {
    title: "What does a mature VMS program look like?",
    answer: "A mature program has standardized processes, strong governance, clean data, measurable performance, and high user adoption.",
    nextSteps: ["Show maturity model", "Assess our current state"],
  },
} as const;

export const implementationKnowledge = {
  stages: {
    title: "What are the key stages of a VMS implementation?",
    answer: "Assess → Design → Build → Test → Deploy → Hypercare → Sustain.",
    nextSteps: ["Show implementation playbook", "Show stage checklist"],
  },
  assess: {
    title: "What should we assess before implementation?",
    answer: "Look at process, technology, data, integrations, governance, stakeholders, and readiness.",
    nextSteps: ["Start readiness assessment", "Show checklist"],
  },
  timeline: {
    title: "How long does a VMS implementation take?",
    answer: "It depends on scope, geography, integrations, data complexity, and organizational readiness.",
    nextSteps: ["Build sample timeline", "Identify critical path"],
  },
  challenges: {
    title: "What are the biggest implementation challenges?",
    answer: "The most common are unclear processes, data issues, integration complexity, adoption gaps, and weak governance.",
    nextSteps: ["Show risk framework", "Show implementation checklist"],
  },
  governance: {
    title: "What should our implementation governance look like?",
    answer: "Establish clear decision rights, workstream ownership, escalation paths, steering governance, and regular progress reviews.",
    nextSteps: ["Show governance model", "Create governance framework"],
  },
} as const;

export const changeManagement = {
  adoption: {
    title: "How do we drive adoption?",
    answer: "Make the change easy to understand, train users early, communicate consistently, and track adoption throughout the journey.",
    nextSteps: ["Show adoption framework", "How do we measure adoption?"],
  },
  resistance: {
    title: "How do we manage resistance to change?",
    answer: "Understand who is resisting, why they are resisting, and address the underlying process, communication, or training gap.",
    nextSteps: ["Show resistance framework", "Create action plan"],
  },
  plan: {
    title: "What should our change management plan include?",
    answer: "Stakeholders, change impacts, communications, training, readiness, adoption, and reinforcement.",
    nextSteps: ["Show change playbook", "Create change plan"],
  },
  stakeholderReadiness: {
    title: "How do we assess stakeholder readiness?",
    answer: "Measure awareness, understanding, willingness, capability, and confidence across key stakeholder groups.",
    nextSteps: ["Start readiness assessment", "Show stakeholder framework"],
  },
  measureAdoption: {
    title: "How do we measure adoption?",
    answer: "Track usage, training, process compliance, support demand, user feedback, and adoption by stakeholder group.",
    nextSteps: ["Show adoption dashboard", "Show KPIs"],
  },
} as const;

export const riskKnowledge = {
  biggestRisks: {
    title: "What are the biggest VMS transformation risks?",
    answer: "The biggest risks are data, integrations, process gaps, adoption, testing, and go-live readiness.",
    nextSteps: ["Show risk framework", "Create risk register"],
  },
  riskRegister: {
    title: "What should a risk register contain?",
    answer: "Risk, impact, probability, owner, mitigation, trigger, contingency, and status.",
    nextSteps: ["Create risk register"],
  },
  prioritize: {
    title: "How do we prioritize transformation risks?",
    answer: "Prioritize based on business impact, likelihood, urgency, and proximity to critical milestones.",
    nextSteps: ["Show risk matrix", "Assess my risks"],
  },
  issueManagement: {
    title: "How should transformation issues be managed?",
    answer: "Capture, prioritize, assign ownership, define resolution actions, and escalate issues that threaten milestones or business outcomes.",
    nextSteps: ["Show issue framework", "Create issue tracker"],
  },
} as const;

export const goLiveReadiness = {
  ready: {
    title: "How do we know if we're ready for go-live?",
    answer: "Validate technology, data, process, integrations, people, training, support, and critical issues.",
    nextSteps: ["Start readiness assessment", "Show go-live checklist"],
  },
  risks: {
    title: "What are common go-live risks?",
    answer: "Integration failures, data issues, unresolved defects, training gaps, low adoption, and insufficient support.",
    nextSteps: ["Show go-live risk checklist", "Create mitigation plan"],
  },
  monitor: {
    title: "What should we monitor before go-live?",
    answer: "Track testing, defects, data readiness, training, communications, adoption, and unresolved risks.",
    nextSteps: ["Show readiness dashboard"],
  },
  cutover: {
    title: "What should our cutover plan include?",
    answer: "Data, integrations, configuration, communications, user readiness, support, and clear rollback or contingency plans.",
    nextSteps: ["Show cutover checklist"],
  },
} as const;

export const reportingAnalytics = {
  kpis: {
    title: "What KPIs should we track?",
    answer: "Track spend, savings, adoption, time-to-fill, compliance, SOW visibility, supplier performance, and operational efficiency.",
    nextSteps: ["Show KPI framework", "Show executive dashboard"],
  },
  cpo: {
    title: "What should the CPO see?",
    answer: "Transformation health, spend, savings, adoption, risks, compliance, workforce insights, and decisions requiring attention.",
    nextSteps: ["Show CPO cockpit", "Show executive KPIs"],
  },
  finance: {
    title: "What should Finance see?",
    answer: "Spend, savings, rate compliance, forecasts, SOW visibility, exceptions, and opportunities for cost improvement.",
    nextSteps: ["Show Finance dashboard", "Show savings KPIs"],
  },
  roi: {
    title: "How do we measure VMS ROI?",
    answer: "Compare your baseline with savings, productivity, compliance, process efficiency, and improved visibility after transformation.",
    nextSteps: ["Build ROI framework", "Show ROI metrics"],
  },
  execDashboard: {
    title: "What should an executive dashboard include?",
    answer: "A concise view of progress, outcomes, risks, adoption, financial impact, and decisions needed.",
    nextSteps: ["Show executive dashboard"],
  },
} as const;

export const hypercareKnowledge = {
  what: {
    title: "What is hypercare?",
    answer: "Hypercare is the enhanced support period after go-live focused on stabilizing the platform, resolving issues, and accelerating adoption.",
    nextSteps: ["Show hypercare playbook"],
  },
  monitor: {
    title: "What should we monitor during hypercare?",
    answer: "Monitor system issues, process exceptions, adoption, data quality, support demand, and business performance.",
    nextSteps: ["Show hypercare dashboard", "Create tracker"],
  },
  duration: {
    title: "How long should hypercare last?",
    answer: "Until critical issues are resolved, adoption stabilizes, support demand declines, and the business is ready to operate independently.",
    nextSteps: ["Show exit criteria", "Create hypercare plan"],
  },
  commandCenter: {
    title: "What should a hypercare command center include?",
    answer: "Issue tracking, severity, ownership, escalation, resolution trends, adoption metrics, and daily decision-making.",
    nextSteps: ["Show command center"],
  },
} as const;

export const playbooks = {
  implementation: {
    title: "Do you have a VMS implementation playbook?",
    answer: "Yes. It guides teams through Assess → Design → Build → Test → Deploy → Hypercare → Sustain.",
    nextSteps: ["Open implementation playbook"],
  },
  change: {
    title: "Do you have a change management playbook?",
    answer: "Yes. It covers stakeholder engagement, change impacts, communications, training, readiness, and adoption.",
    nextSteps: ["Open change playbook"],
  },
  goLive: {
    title: "Can you create a go-live playbook?",
    answer: "Absolutely. I can structure readiness, cutover, communications, launch, issue management, and hypercare.",
    nextSteps: ["Create go-live playbook"],
  },
  readiness: {
    title: "Can you create a readiness assessment?",
    answer: "Yes. I can assess technology, process, data, people, integrations, governance, and support readiness.",
    nextSteps: ["Start assessment"],
  },
  riskRegister: {
    title: "Can you create a risk register?",
    answer: "Yes. I can organize risks by impact, probability, owner, mitigation, and status.",
    nextSteps: ["Create risk register"],
  },
  templates: {
    title: "What templates should we have?",
    answer: "I recommend a readiness assessment, risk register, stakeholder map, change plan, test plan, cutover plan, hypercare tracker, and KPI dashboard.",
    nextSteps: ["Show transformation toolkit"],
  },
} as const;

export const diagnosisScenarios = [
  {
    trigger: "behind schedule",
    response: "Let's find the blocker. Is it: Technology, Data, Process, People, or Dependencies?",
    options: ["Technology", "Data", "Process", "People", "Dependencies"],
  },
  {
    trigger: "adoption is low",
    response: "Let's diagnose it. Which area is the biggest challenge?",
    options: ["Awareness", "Training", "Process", "User Experience", "Resistance"],
  },
  {
    trigger: "too many issues",
    response: "Let's prioritize them by severity, business impact, and go-live dependency.",
    options: ["Show Risk Matrix", "Prioritize Issues"],
  },
  {
    trigger: "leadership wants an update",
    response: "I can turn your program status into a concise executive view.",
    options: ["Create Executive Summary", "Build CPO Dashboard"],
  },
] as const;
