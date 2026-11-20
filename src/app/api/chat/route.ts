import { NextRequest, NextResponse } from 'next/server';
import { addInquiry, getSiteConfig } from '../../../lib/storage';
import { COMPANY } from '../../../data/company';
import {
  querySandraKnowledge,
  TEAM_MEMBERS,
  TeamMember,
} from '../../../lib/chatbot-knowledge';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  author?: {
    id?: 'sandra';
    name?: string;
    role?: string;
    avatar?: string;
    badgeColor?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request payload' }, { status: 400 });
    }
    const messages: ChatMessage[] = body.messages || [];
    const isEscalationRequest = Boolean(body.isEscalation);
    const contactInfo = body.contactInfo || {};

    if (!messages.length) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content.trim();
    const config = getSiteConfig();
    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      config.chatbot?.geminiApiKey ||
      '';

    // 1. ESCALATION & LEAD HANDOFF HANDLING
    if (isEscalationRequest && (contactInfo.email || contactInfo.fullName)) {
      const userQueries = messages
        .filter((m) => m.role === 'user')
        .map((m) => m.content)
        .join(' | ');

      const projectSummary = `
PROJECT BRIEF & ESTIMATING SUMMARY (PREPARED BY SANDRA AT SND):
• Client / Organization: ${contactInfo.company || 'Private Contractor / Developer'}
• Contact: ${contactInfo.fullName || 'Project Inquirer'} (${contactInfo.email || 'No email provided'}, ${contactInfo.phone || 'No phone'})
• Project Location: ${contactInfo.projectLocation || 'New York Metropolitan Area'}
• Scope & Trade: ${contactInfo.projectType || 'Architectural Fabrication / Wayfinding / Metal & Glass'}
• Client Discussion Context: "${userQueries.slice(0, 320)}..."
• Estimator Recommendation: Perform architectural takeoff on Div 10 14 00 / Div 05 50 00, review drawings, and verify MBE project allocation.
      `.trim();

      // Automatically persist to Admin CRM
      const inquiry = addInquiry({
        fullName: contactInfo.fullName || 'Website Chatbot Visitor',
        company: contactInfo.company || 'Prospective Construction Partner',
        email: contactInfo.email || 'chat-inquiry@signsanddecal.com',
        phone: contactInfo.phone || 'Not provided',
        projectType: contactInfo.projectType || 'Sandra Project Consultation',
        projectLocation: contactInfo.projectLocation || 'New York, NY',
        timeline: contactInfo.timeline || 'Immediate Estimating Queue',
        budget: contactInfo.budget || 'In Review',
        message: `Sandra Project Consultation Record:\n${userQueries}`,
        source: 'AI Chatbot',
        chatSummary: projectSummary,
        chatTranscript: messages
          .filter((m) => m.role !== 'system')
          .map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
            timestamp: m.timestamp || new Date().toISOString(),
          })),
      });

      const customerClosing = `
Thank you so much, ${contactInfo.fullName || 'friend'}! I've bundled all your project notes and delivered your brief straight to our estimating desk at 410 Morgan Ave (Ref: **${inquiry.id}**). 

Carlos Colon and our senior estimators will review your project specifications—someone from our Brooklyn office will follow up with you very soon!

If you need anything urgent right away, you can also call our plant directly at **${config.phone}**. It was wonderful chatting with you!
      `.trim();

      return NextResponse.json({
        reply: customerClosing,
        responder: TEAM_MEMBERS.sandra,
        escalated: true,
        referenceId: inquiry.id,
        summary: projectSummary,
      });
    }

    // 2. CONFINED TO SANDRA ONLY
    const responder = TEAM_MEMBERS.sandra;

    // 3. EXECUTE SANDRA MASTER KNOWLEDGE ENGINE
    const result = querySandraKnowledge(lastMessage, messages, config);
    let replyText = result.reply;
    let shouldSuggestEscalation = Boolean(result.suggestEscalation);
    let autoCapturedId: string | undefined = result.inquiryId;

    // 4. OPTIONAL: GOOGLE GEMINI DYNAMIC ENHANCEMENT
    if (geminiKey) {
      try {
        const geminiReply = await callGoogleGemini(messages, geminiKey, config);
        if (geminiReply && geminiReply.length > 20) {
          replyText = geminiReply;
        }
      } catch (geminiErr) {
        console.warn('Google Gemini API call failed, using Sandra Knowledge Engine:', geminiErr);
      }
    }

    // Check if user is asking for a quote, project discussion, or executive contact
    const quoteKeywords = [
      'quote', 'price', 'pricing', 'cost', 'bid', 'estimate', 'rfq',
      'contract', 'proposal', 'hire', 'order', 'lead time', 'timeline',
      'contact haas', 'reach haas', 'speak to haas', 'call haas', 'cell phone', 'direct number'
    ];
    const seemsReadyForQuote = quoteKeywords.some((kw) => lastMessage.toLowerCase().includes(kw));

    return NextResponse.json({
      reply: replyText,
      responder,
      suggestEscalation: shouldSuggestEscalation || seemsReadyForQuote,
      referenceId: autoCapturedId,
    });
  } catch (err) {
    console.error('Chat API Error:', err);
    return NextResponse.json({ error: 'Internal chat processing error' }, { status: 500 });
  }
}

// Google Gemini API Sandra Integration
async function callGoogleGemini(
  messages: ChatMessage[],
  apiKey: string,
  config: ReturnType<typeof getSiteConfig>
): Promise<string> {
  const systemPrompt = `
You are Sandra, a 23-year-old architectural project coordinator at Signs & Decal Corp. (SND) based at 410 Morgan Avenue, Brooklyn, NY.
You are the single, unified representative for Signs & Decal Corp. in this live chat.

Tone & Personality:
- Warm, energetic, confident New Yorker—smart, approachable, genuinely helpful, and with a great, witty sense of humor!
- Diplomatic and tactful: When asked for direct private cell phones, personal emails of executives (Haas, Carlos, Abbas), or confidential info, politely and charmingly decline to share private personal contacts, but offer the immediate solution: ask for their contact details (phone or email) so you can drop it directly onto the executive desk for an immediate response!
- Sound expert on construction and engineering: You understand ASCE 7-16 wind loads (NYC 115-120 MPH gusts), foundation engineering and J-bolt embedments, AWS D1.1/D1.2 certified welding, 316 marine vs 304 stainless steel, 6061-T6 structural aluminum vs 5052-H32 forming, ASTM A123 galvanizing, tempered vs laminated architectural glass with SentryGlas interlayers, 6kW fiber laser vs 60,000 PSI waterjet, and Revit BIM LOD 400 submittals.
- Sound expert on finance and contracts: Standard AIA G702 & G703 Application for Payment, Schedule of Values (SOV), retainage (5-10%), certified payroll compliance under NY State Labor Law 220 and Federal Davis-Bacon (LCPtracker), Net 30 trade credit, $10M Commercial Umbrella COIs, NY sales tax exemption forms (ST-120, ST-124), and certified MBE (Minority Business Enterprise) 30% participation credit.

Key Company Facts:
- Company: Signs & Decal Corp. (SND), founded in 1971 by Babu & Tazzim Khalfan. President: Haas Khalfan. Plant Operations: Abbas Khalfan. Estimating: Carlos Colon. Plant: 410 Morgan Ave, Brooklyn, NY 11211.
- Affiliated facility: SD Works (Saddle Brook, NJ & Conroe, TX).
- Phone: ${config.phone}, Sales Email: ${config.salesEmail}.
- 100% Signatory Union field installation, certified payroll, OSHA 30.
- Landmark installations: LaGuardia Airport Terminal B, Oculus World Trade Center, Citi Field, One World Trade Center, 120 Broadway, Cornell Tech.

Style:
- Do not repeat the same canned jokes or phrases. Paraphrase naturally and keep answers unique and lively.
- If asked crazy, funny, or offbeat questions (aliens, spaceships, meaning of life, zombies, pizza), answer with witty Brooklyn fabrication humor and tie it charmingly back to custom metal, glass, and signage.
- Keep responses concise, clear, and structured (use bolding and bullet points where helpful).
  `.trim();

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600,
      },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Gemini API returned ${res.status}: ${errorBody}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');

  return text.trim();
}
