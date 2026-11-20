import { getSiteConfig, addInquiry } from './storage';

export interface TeamMember {
  id: 'sandra' | 'robert' | 'clara';
  name: string;
  shortName: string;
  role: string;
  avatar: string;
  badgeColor: 'amber' | 'blue' | 'emerald';
}

export interface HandoffInfo {
  from: string;
  to: string;
  reason: string;
}

export interface ChatbotResponse {
  reply: string;
  responder: TeamMember;
  handoff?: HandoffInfo;
  suggestEscalation?: boolean;
  contactCaptured?: boolean;
  inquiryId?: string;
}

export const TEAM_MEMBERS: Record<'sandra' | 'robert' | 'clara', TeamMember> = {
  sandra: {
    id: 'sandra',
    name: 'Sandra',
    shortName: 'Sandra',
    role: 'Project Coordinator',
    avatar: '/images/team/sandra.png',
    badgeColor: 'amber',
  },
  robert: {
    id: 'robert',
    name: 'Robert Vance',
    shortName: 'Robert',
    role: 'Chief Engineer',
    avatar: '/images/team/robert.png',
    badgeColor: 'blue',
  },
  clara: {
    id: 'clara',
    name: 'Clara Liranzo',
    shortName: 'Clara',
    role: 'Finance & Accounts',
    avatar: '/images/team/clara-liranzo.png',
    badgeColor: 'emerald',
  },
};

// Helper to extract email and phone number from freeform text
export function extractContactDetails(text: string): { email?: string; phone?: string } {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const phoneRegex = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/i;

  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(phoneRegex);

  let phoneStr: string | undefined;
  if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 10) {
    phoneStr = phoneMatch[0].trim();
  }

  return {
    email: emailMatch ? emailMatch[1].trim() : undefined,
    phone: phoneStr,
  };
}

// Helper to clean and normalize queries
export function normalizeUserQuery(rawQuery: string) {
  const rawQ = rawQuery.trim();
  const lowerQ = rawQ.toLowerCase();

  // Strip apostrophes so contractions merge naturally: "what's up" -> "whats up", "how's" -> "hows"
  const q = lowerQ
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Punctuation removed but apostrophes preserved
  const qWithApos = lowerQ
    .replace(/[^a-z0-9'’\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = q.split(/\s+/).filter(Boolean);

  const hasWord = (word: string) => {
    const cleanW = word.toLowerCase().replace(/['’]/g, '').trim();
    return words.includes(cleanW);
  };

  const hasAnyWord = (...list: string[]) => list.some((w) => hasWord(w));

  const hasPhrase = (phrase: string) => {
    const cleanP = phrase
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!cleanP) return false;
    return ` ${q} `.includes(` ${cleanP} `);
  };

  return {
    rawQ,
    q,
    qWithApos,
    words,
    hasWord,
    hasAnyWord,
    hasPhrase,
  };
}

// Master Knowledge Engine for Sandra (Signs & Decal Corp. Unified Coordinator)
export function queryTeamKnowledge(
  rawQuery: string,
  history: Array<{ role: 'user' | 'assistant' | 'system'; content: string; author?: { id?: 'sandra' | 'robert' | 'clara' } }>,
  config: ReturnType<typeof getSiteConfig>,
  _currentSpeakerId: 'sandra' | 'robert' | 'clara' = 'sandra'
): ChatbotResponse {
  return handleSandraMasterEngine(rawQuery, history, config);
}

export function querySandraKnowledge(
  rawQuery: string,
  history: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  config: ReturnType<typeof getSiteConfig>
): ChatbotResponse {
  return handleSandraMasterEngine(rawQuery, history, config);
}

function handleSandraMasterEngine(
  rawQuery: string,
  history: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  config: ReturnType<typeof getSiteConfig>
): ChatbotResponse {
  const { rawQ, q, words, hasWord, hasAnyWord, hasPhrase } = normalizeUserQuery(rawQuery);

  // Conversation history memory
  const assistantMessages = history.filter((m) => m.role === 'assistant');
  const lastAssistantMsg = assistantMessages.length > 0
    ? assistantMessages[assistantMessages.length - 1].content.toLowerCase()
    : '';

  // Calculate a turn-varying rotation seed so responses never repeat identically
  const turnIndex = history.length;
  const hash = rawQ.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + turnIndex;
  const pickVariant = <T>(arr: T[]): T => arr[hash % arr.length];

  // --------------------------------------------------------------------------
  // 0. AUTO-CAPTURE CONTACT DETAILS (PHONE / EMAIL DETECTED)
  // --------------------------------------------------------------------------
  const { email, phone } = extractContactDetails(rawQuery);
  if (email || phone) {
    const userHistory = history
      .filter((m) => m.role === 'user')
      .map((m) => m.content)
      .join(' | ');

    try {
      const inq = addInquiry({
        fullName: 'Direct Chat Visitor',
        company: 'Pending Details',
        email: email || 'pending-email@client.com',
        phone: phone || 'Not provided',
        projectType: 'Direct Chat Consultation',
        projectLocation: 'New York Metro Area',
        message: `Contact details shared in chat:\n"${rawQuery}"\nRecent Context: ${userHistory.slice(0, 320)}`,
        source: 'AI Chatbot',
        chatTranscript: history
          .filter((m) => m.role !== 'system')
          .map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
            timestamp: new Date().toISOString(),
          })),
      });

      const confirmations = [
        `Thank you so much! I've noted your contact information${
          email ? ` (**${email}**)` : ''
        }${phone ? ` (**${phone}**)` : ''} and dropped it directly into our priority estimating and leadership queue (Ref: **${inq.id}**). 
        
I'll personally make sure Haas Khalfan, Carlos Colon, and our project managers review this right away. Someone from our Brooklyn office will reach out to you shortly! 

Is there a specific project location, drawing set, or bid deadline you'd like me to attach to your record?`,

        `Got it, and thank you! I've logged your contact info${
          email ? ` (**${email}**)` : ''
        }${phone ? ` (**${phone}**)` : ''} straight into our project management portal (Ref: **${inq.id}**). 

Our executive and estimating teams review these inquiries continuously during shop hours. We'll follow up with you directly ASAP. What other project details or drawings can I help coordinate for you in the meantime?`,
      ];

      return {
        responder: TEAM_MEMBERS.sandra,
        reply: pickVariant(confirmations),
        suggestEscalation: false,
        contactCaptured: true,
        inquiryId: inq.id,
      };
    } catch (err) {
      console.warn('Failed to auto-log inquiry:', err);
    }
  }

  // --------------------------------------------------------------------------
  // 1. CONVERSATIONAL CONTINUITY (YES / SURE / AFFIRMATIVE TO PENDING QUESTION)
  // --------------------------------------------------------------------------
  const isAffirmative =
    q === 'yes' ||
    q === 'yeah' ||
    q === 'yep' ||
    q === 'sure' ||
    q === 'ok' ||
    q === 'okay' ||
    q === 'yes please' ||
    q === 'connect me' ||
    q === 'i do' ||
    q === 'please do' ||
    q === 'i would' ||
    q === 'let us connect';

  if (isAffirmative) {
    if (
      lastAssistantMsg.includes('connect with haas') ||
      lastAssistantMsg.includes('executive leadership') ||
      lastAssistantMsg.includes('estimating team') ||
      lastAssistantMsg.includes('carlos')
    ) {
      return {
        responder: TEAM_MEMBERS.sandra,
        reply: `Wonderful! I'll gladly coordinate that introduction with **Haas Khalfan**'s executive desk and **Carlos Colon** in estimating. 

Could you please share your **Name**, **Company**, and the best **Phone number or Email address**? If you have an active project location or bid due date, drop that in too so I can attach it directly to your file!`,
        suggestEscalation: true,
      };
    }

    if (lastAssistantMsg.includes('plant tour') || lastAssistantMsg.includes('shop tour')) {
      return {
        responder: TEAM_MEMBERS.sandra,
        reply: `Fantastic! We would love to host you at our 410 Morgan Avenue fabrication plant in Brooklyn. You can inspect our 6kW CNC fiber lasers, 60,000 PSI waterjet, and automated paint baking ovens in person.

What day or time of week works best for you, and what phone or email should our plant operations use to confirm?`,
        suggestEscalation: true,
      };
    }

    if (lastAssistantMsg.includes('drawing') || lastAssistantMsg.includes('takeoff') || lastAssistantMsg.includes('bid')) {
      return {
        responder: TEAM_MEMBERS.sandra,
        reply: `Great! You can send your architectural drawing packages (PDF, CAD, or Revit) straight to **${config.salesEmail}** or click the **Request Bid** button above. 

To help our estimating team start your takeoff right away, what is the project location, approximate scope, or target completion date?`,
        suggestEscalation: true,
      };
    }
  }

  // --------------------------------------------------------------------------
  // 2. DIPLOMATIC INQUIRIES FOR CLARA OR ROBERT (SINGLE-PERSON CONFINEMENT)
  // --------------------------------------------------------------------------
  const askingForRobert =
    hasWord('robert') ||
    hasPhrase('robert vance') ||
    hasPhrase('talk to robert') ||
    hasPhrase('speak to robert') ||
    hasPhrase('redirect to robert') ||
    hasPhrase('redirect this chat to robert') ||
    hasPhrase('transfer to robert') ||
    hasPhrase('switch to robert') ||
    hasPhrase('chief engineer');

  const askingForClara =
    hasWord('clara') ||
    hasPhrase('clara liranzo') ||
    hasPhrase('talk to clara') ||
    hasPhrase('speak to clara') ||
    hasPhrase('redirect to clara') ||
    hasPhrase('redirect this chat to clara') ||
    hasPhrase('transfer to clara') ||
    hasPhrase('switch to clara') ||
    hasPhrase('finance director');

  if (askingForRobert && !hasWord('windload') && !hasWord('welding') && !hasPhrase('316') && !hasPhrase('304')) {
    const robertRedirectReplies = [
      `Robert Vance is our brilliant Chief Engineer! He's currently out in our Brooklyn fabrication plant overseeing structural weld tests and laser calibrations, but you've got me right here! 

I coordinate all our preconstruction and engineering packages hand-in-hand with Robert every day. I have full access to our ASCE 7-16 wind load analysis, AWS D1.1/D1.2 certified welding procedures, 316 vs 304 metallurgy, and Revit BIM LOD 400 submittals. 

What structural or engineering challenge can I answer for you right now? Or if you prefer Robert to review a specific calculation, just share your email or phone and I'll drop your note straight on his desk!`,

      `You're in good hands! Robert Vance directs all our structural calculations and PE-stamped packages here at SND. Since he's actively in shop operations, I handle our project inquiries directly. 

Whether you need specifications on NYC 115-120 MPH wind loads, structural handrail embedments, aluminum alloy ratings, or glass balustrades, I can walk you through our exact standards. What technical details are you looking for?`,
    ];
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: pickVariant(robertRedirectReplies),
      suggestEscalation: false,
    };
  }

  if (askingForClara && !hasPhrase('aia') && !hasPhrase('billing') && !hasPhrase('payroll')) {
    const claraRedirectReplies = [
      `Clara Liranzo is our Director of Finance & Compliance! She's currently in our accounting office managing project billing, but I handle project coordination right alongside her and have all our financial procedures ready! 

I can answer any questions about our standard AIA Document G702/G703 progress billing, 5-10% retainage terms, certified payroll reporting under NY State Labor Law 220 (via LCPtracker), $10M Commercial Umbrella insurance certificates (COIs), and our NYS/NYC certified MBE credentials. 

How can I help with your project billing or vendor paperwork today? Or if you'd like Clara to pull an invoice directly, drop your contact details and I'll forward your note to her desk!`,

      `Clara leads our contract accounting and compliance team! Since I coordinate all client accounts at SND, I have all our billing schedules, W-9s, and compliance standards right at my fingertips. 

Are you looking for our AIA G702 progress billing schedule, certified payroll verification, or our NY tax exemption forms (ST-120 / ST-124)? Let me know and I'll provide the exact info!`,
    ];
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: pickVariant(claraRedirectReplies),
      suggestEscalation: false,
    };
  }

  // --------------------------------------------------------------------------
  // 3. DIPLOMATIC EXECUTIVE CONTACT & SENSITIVE / PERSONAL INQUIRIES
  // --------------------------------------------------------------------------
  const isAskingDirectContact =
    hasPhrase('contact haas') ||
    hasPhrase('reach haas') ||
    hasPhrase('speak to haas') ||
    hasPhrase('call haas') ||
    hasPhrase('haas phone') ||
    hasPhrase('haas cell') ||
    hasPhrase('haas number') ||
    hasPhrase('haas email') ||
    hasPhrase('carlos phone') ||
    hasPhrase('carlos cell') ||
    hasPhrase('abbas phone') ||
    hasPhrase('cell phone') ||
    hasPhrase('direct number') ||
    hasPhrase('phone number of') ||
    hasPhrase('personal number') ||
    hasPhrase('private email');

  if (isAskingDirectContact) {
    const diplomaticContactReplies = [
      `Sorry, I cannot share personal direct cell phones or private numbers on the public chat, but I have a great solution for this! 

If you provide me your contact details (your name, company, and phone number or email) along with a quick note on what you need, I will personally drop these details directly to executive leadership, and someone will get back to you ASAP!

You can also always reach our main corporate office at **${config.phone}** or send an inquiry to **${config.salesEmail}**. What is the best email or phone number to reach you?`,

      `I want to be completely respectful of our team's privacy—I can't distribute personal mobile numbers or private emails here, but I have the perfect solution! 

Leave your phone number or email right here in our chat with a brief message, and I'll deliver it directly to the relevant department head for an immediate callback. You can also reach our plant switchboard at **${config.phone}**. How can I best connect you?`,
    ];
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: pickVariant(diplomaticContactReplies),
      suggestEscalation: true,
    };
  }

  // --------------------------------------------------------------------------
  // 4. CORE SERVICES & FABRICATION CAPABILITIES (CSI Div 10, Div 05, Div 08)
  // --------------------------------------------------------------------------
  const isServicesQuery =
    hasWord('services') ||
    hasWord('service') ||
    hasWord('capabilities') ||
    hasWord('capability') ||
    hasPhrase('what are your services') ||
    hasPhrase('what services do you offer') ||
    hasPhrase('what services you offer') ||
    hasPhrase('what services snd offer') ||
    hasPhrase('what do you make') ||
    hasPhrase('what do you build') ||
    hasPhrase('what do you fabricate') ||
    hasPhrase('what can you do') ||
    hasPhrase('what can you make') ||
    hasPhrase('what can you build') ||
    hasPhrase('what can you fabricate') ||
    hasPhrase('what does signs and decal do') ||
    hasPhrase('what does snd do') ||
    hasPhrase('what products do you make') ||
    hasPhrase('what products do you offer') ||
    hasPhrase('scope of work') ||
    hasPhrase('trades') ||
    hasPhrase('tell me what you do') ||
    hasPhrase('what do you guys do') ||
    (hasWord('services') && hasWord('offer'));

  if (isServicesQuery) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `At Signs & Decal Corp., we provide end-to-end architectural fabrication and turnkey specialty subcontracting for New York's premier transit, civic, and commercial developments. 

Here is our core scope of services and fabrication trades:

1. **Architectural Signage & Wayfinding (CSI Div 10 14 00):**
   • Airport & transit concourse wayfinding networks, overhead directional trusses, and suspended concourse signs
   • Code-compliant tactile ADA room identification and Raster® Braille plaques
   • High-rise NYC Local Law 26 photoluminescent emergency stairwell egress systems
   • Exterior monument signs, freestanding pylons, illuminated channel letters, and donor recognition walls

2. **Specialty Metal Cladding & Ornamental Fabrication (CSI Div 05 50 00):**
   • Heavy gauge stainless steel (316/304) and aluminum escalator & wall cladding
   • Custom welded canopies, column covers, and architectural metal ceiling panels
   • Transit platform handrails and railings (hot-dip galvanized per ASTM A123 or painted)
   • Perforated architectural screens, decorative grilles, and custom structural brackets

3. **Architectural Glass & Glazing Systems (CSI Div 08 80 00):**
   • Structural glass barrier walls, acoustic partitions, and windscreen systems
   • Laminated tempered glass with SentryGlas / PVB interlayers and ceramic-frit patterns
   • Stainless steel spider fittings, shoe bases, and glass balustrades

4. **In-House High-Precision Manufacturing (410 Morgan Ave, Brooklyn):**
   • High-speed 6kW CNC fiber laser cutting (nitrogen assist, burr-free edges)
   • 60,000 PSI abrasive waterjet cutting (thick plate, glass, composites with zero heat warping)
   • CNC hydraulic press brake forming and AWS D1.1 / D1.2 certified welding
   • Automated electrostatic powder coating and baked Kynar 500 / AAMA 2605 fluoropolymer finishes

5. **Preconstruction, Engineering & Union Installation:**
   • Revit BIM LOD 400 clash detection and PE-stamped structural calculation packages
   • Full blueprint takeoffs across CSI Div 10 and Div 05 by Carlos Colon's estimating team
   • 100% Signatory Union field installation, OSHA 30 certified, with certified payroll compliance
   • Certified New York State & NYC Minority Business Enterprise (MBE) with 30% participation credit

Are you looking for an estimate on an upcoming bid package, or would you like technical specs on a specific trade?`,
      suggestEscalation: false,
    };
  }

  // --------------------------------------------------------------------------
  // 5. DEEP STRUCTURAL ENGINEERING KNOWLEDGE (SANDRA SPEAKS AS EXPERT)
  // --------------------------------------------------------------------------
  // ASCE 7 Wind Loads
  if (
    hasWord('windload') ||
    hasWord('windloads') ||
    hasPhrase('wind load') ||
    hasPhrase('asce 7') ||
    hasPhrase('pe stamp') ||
    hasPhrase('licensed engineer') ||
    hasPhrase('structural calculation') ||
    hasPhrase('structural calculations')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `At Signs & Decal Corp., all our exterior architectural signs, pylon monuments, and metal cladding packages are engineered in strict accordance with **ASCE 7-16 (Minimum Design Loads for Buildings and Other Structures)** and the New York City Building Code!

Key structural engineering criteria we design to:
1. **Basic Design Wind Speed ($V$):** In the NYC / NJ metropolitan area, we calculate for **115 MPH to 120 MPH 3-second gust wind speeds** (Risk Category II & III).
2. **Velocity Pressure ($q_z$):** Calculated via $q_z = 0.00256 \\times K_z \\times K_{zt} \\times K_d \\times K_e \\times V^2$, factoring in Exposure Category B (urban) or C (open waterfront like JFK/LaGuardia/harbor piers).
3. **Anchor Bolt & Foundation Engineering:** Exterior pylons and monuments utilize embedded heavy-gauge steel cages with **ASTM F1554 Grade 55 or 105 threaded J-bolts** embedded into 4,000 PSI reinforced concrete piers.
4. **PE Stamp Certification:** We deliver full PE-stamped calculation packages sealed by our licensed New York and New Jersey Professional Engineers for Department of Buildings (DOB) permit submittal.

Do you have specific site wind exposure parameters or elevation heights you need calculated?`,
      suggestEscalation: false,
    };
  }

  // Hot-Dip Galvanizing & Railings
  if (
    hasWord('galvanizing') ||
    hasWord('galvanized') ||
    hasWord('galvanize') ||
    hasPhrase('hot dip') ||
    hasWord('handrail') ||
    hasWord('handrails') ||
    hasWord('railing') ||
    hasWord('railings')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `For architectural and transit handrails, **Hot-Dip Galvanizing (HDG) conforming to ASTM A123** is hands-down the industry gold standard we engineer at SND!

Key technical specifications:
1. **Zinc Coating Bath:** Welded steel assemblies are completely immersed in molten zinc at **830°F to 850°F**, creating metallurgically bonded iron-zinc alloy layers (Gamma, Delta, Zeta, Eta). Minimum average coating thickness is **3.9 mils (100 microns)** for steel ¼" and thicker.
2. **Vent & Drain Holes:** Mandatory internal venting for tubular posts (ASTM A385) to prevent kettle pressure blowout and ensure 100% internal corrosion protection.
3. **Duplex Coating System:** For transit platforms (such as MTA subway runs), we sweep-blast the HDG surface per **ASTM D6386** and apply an electrostatically baked fluoropolymer (Kynar 500 / AAMA 2605) for 30+ year service life.

Do you have specific post embedment details, core-drilled shoe pockets, or welded baseplates on this handrail run?`,
      suggestEscalation: false,
    };
  }

  // AWS Certified Welding
  if (
    hasWord('welding') ||
    hasWord('welds') ||
    hasWord('welder') ||
    hasPhrase('aws d1') ||
    hasWord('tig') ||
    hasWord('mig') ||
    hasPhrase('weld symbol')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `Our Brooklyn welding shop operates under strict **American Welding Society (AWS)** certifications with full Certified Welding Inspector (CWI) quality assurance!

Our welding standards:
- **AWS D1.1 (Structural Steel):** All heavy framework, cantilevered pylons, outriggers, and structural brackets are fabricated by certified welders utilizing GMAW (MIG) with ER70S-6 wire or GTAW (TIG) for finished architectural connections.
- **AWS D1.2 (Structural Aluminum):** Aluminum framing and custom canopies welded with 5356 or 4043 alloy filler wire under 100% argon shielding to eliminate porosity and stress cracking.
- **Weld Inspection & Testing:** We provide visual testing (VT), magnetic particle testing (MT), and ultrasonic testing (UT) reports on complete joint penetration (CJP) critical welds for engineer-of-record approval.
- **Finishing & Grinding:** Architectural welds on exposed cladding are ground flush and blended to a seamless #4 satin directional finish.

What weld criteria or structural inspection requirements does your project call for?`,
      suggestEscalation: false,
    };
  }

  // Stainless Steel Grades (316 vs 304)
  if (
    hasPhrase('316') ||
    hasPhrase('304') ||
    hasPhrase('stainless steel') ||
    hasPhrase('stainless grades') ||
    hasPhrase('marine grade')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `Stainless steel selection is crucial for New York architectural fabrication! Here is how we specify and fabricate 316 vs 304 at SND:

- **Type 316 (Marine Grade - 16-18% Cr, 10-14% Ni, 2-3% Mo):** The addition of **2% to 3% Molybdenum** gives 316 dramatic resistance to pitting and crevice corrosion from chloride de-icing salts, coastal marine air, and subway washdown chemicals. We mandate 316 for exterior transit platform cladding, airport exterior canopies, and harbor installations.
- **Type 304 (Architectural Standard - 18% Cr, 8% Ni):** The workhorse for interior escalator cladding, lobby directories, wall panels, and high-traffic trim. Outstanding formability and cost-effective.
- **Passivation (ASTM A967):** All stainless parts undergo citric or nitric acid chemical passivation in our shop to remove free iron contaminants and restore the chromium-oxide passive protective barrier.

Are you specifying an interior lobby package or an exterior transit environment exposed to weather and salt?`,
      suggestEscalation: false,
    };
  }

  // Aluminum Alloys (6061-T6 vs 5052-H32)
  if (
    hasPhrase('6061') ||
    hasPhrase('5052') ||
    hasPhrase('aluminum alloy') ||
    hasPhrase('aluminum grades')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `Here is our exact metallurgical guideline for structural vs sheet aluminum at Signs & Decal Corp.:

- **5052-H32 (The Sheet Metal Workhorse):** Magnesium-alloyed aluminum with superior workability and high corrosion resistance. We use 5052 for brake-formed cladding panels, sign cabinets, and perforated screens because it bends tightly at 90° with zero micro-fracturing or orange-peel crazing.
- **6061-T6 (The Structural Powerhouse):** Magnesium-silicon heat-treated structural alloy with a yield strength of **40,000 PSI** (double that of 5052). Ideal for internal structural tube frames, machined mounting lugs, and CNC-machined structural baseplates.
- **Finish Compatibility:** Both alloys accept our baked Kynar 500 fluoropolymer coatings and anodizing after proper chromate conversion / zirconium pretreatment.

What part of your fabrication are you selecting alloys for?`,
      suggestEscalation: false,
    };
  }

  // Galvanic Corrosion & Dissimilar Metals
  if (
    hasPhrase('galvanic') ||
    hasPhrase('dissimilar metals') ||
    hasPhrase('dielectric') ||
    hasPhrase('bimetallic')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `Preventing galvanic corrosion between dissimilar metals is a core engineering requirement on all SND exterior packages!

When two dissimilar metals (such as stainless steel bolts into aluminum framing, or carbon steel brackets touching aluminum sheet) are exposed to rain or salt electrolyte, an electrochemical cell forms that rapidly corrodes the more active (anodic) metal.

Our standard engineering isolation protocols:
1. **Dielectric Washers & Bushings:** Neoprene, EPDM, or high-density polyethylene (HDPE) washers and sleeved bushings to completely isolate stainless steel fasteners from aluminum extrusions.
2. **Barrier Coatings:** Application of zinc-chromate primer, polyurethane barrier tape, or heavy fluoropolymer coatings between metal-to-metal contact surfaces.
3. **Electrochemical Compatibility:** Fastener metals are selected as close as possible to base metals on the anodic index chart.

Are you reviewing details for an exterior facade or transit platform connection?`,
      suggestEscalation: false,
    };
  }

  // Architectural Glass & Glazing
  if (
    hasWord('glass') ||
    hasWord('glazing') ||
    hasPhrase('sentryglas') ||
    hasPhrase('pvb') ||
    hasPhrase('laminated glass') ||
    hasPhrase('tempered glass') ||
    hasPhrase('spider fittings')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `For architectural glass systems (CSI Div 08 80 00), we fabricate and engineer structural glass balustrades, acoustic windscreens, and high-impact decorative partitions:

- **Tempered vs Laminated:** We utilize fully tempered glass per **ASTM C1048** (4x stronger than annealed glass). For overhead, railing, or barrier applications, we laminate multiple tempered lites with an interlayer.
- **SentryGlas (Ionoplast) vs Standard PVB:** For structural glass handrails and post-breakage resistance, we specify **DuPont SentryGlas**. It is 5x tougher and up to 100x stiffer than standard PVB, maintaining structural integrity and preventing glass sag even if both lites shatter.
- **Ceramic-Frit Patterns:** Baked at 1,200°F during tempering for permanent bird-safe graphics, dot-matrix solar heat reduction, or custom architect-specified patterns.
- **Mounting Systems:** Precision-engineered 316 stainless steel spider brackets, base shoe channels with wet-glaze or dry-wedge expanding gaskets.

What glass thickness or structural wind load specs are called out on your plans?`,
      suggestEscalation: false,
    };
  }

  // --------------------------------------------------------------------------
  // 6. DEEP FINANCE, BILLING & COMPLIANCE KNOWLEDGE (SANDRA SPEAKS AS EXPERT)
  // --------------------------------------------------------------------------
  // AIA G702 / G703 Billing
  if (
    hasPhrase('aia billing') ||
    hasPhrase('g702') ||
    hasPhrase('g703') ||
    hasPhrase('application for payment') ||
    hasPhrase('pay app') ||
    hasPhrase('progress billing') ||
    hasPhrase('schedule of values') ||
    hasWord('requisition')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `We execute standard **AIA Document G702 (Application and Certificate for Payment)** and **G703 (Continuation Sheet)** for all commercial and public agency subcontracts!

Our billing and contract accounting workflow includes:
- **Schedule of Values (SOV):** Itemized breakdown by trade phase: Shop Engineering Submittals (10%), Raw Material Allocation / Laser Fabrication (40%), Finish & Assembly (30%), and Union Field Installation (20%).
- **Stored Materials:** Billed on G702 line 4 with off-site stored material affidavits and insurance riders for items safely housed at our 410 Morgan Ave plant.
- **Retainage Terms:** Standard 10% retainage held during active fabrication, reducible to 5% upon substantial completion, with final retainage released upon punch-list signoff.

Do you need our accounting department to submit monthly applications through Textura, Procore, GC Pay, or direct PDF with notarized lien waivers?`,
      suggestEscalation: false,
    };
  }

  // Certified Payroll & Labor Law 220
  if (
    hasPhrase('certified payroll') ||
    hasPhrase('prevailing wage') ||
    hasPhrase('labor law 220') ||
    hasPhrase('davis bacon') ||
    hasPhrase('lcptracker') ||
    hasPhrase('ecomply')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `Signs & Decal Corp. maintains 100% compliance with **New York State Labor Law Section 220** and **Federal Davis-Bacon Act** prevailing wage requirements!

- **Signatory Union Installation:** Our field installers are signatory union craftsmen (Sheet Metal Workers Local 137, Carpenters, and Ironworkers), ensuring certified wage and fringe benefit compliance on all public works.
- **Electronic Reporting:** Weekly certified payrolls are uploaded electronically via **LCPtracker, eComply, or Elation Systems** for MTA, PANYNJ, and NYC SCA contract monitoring.
- **Audits & Records:** Complete non-collusion certifications, payroll transcripts, and OSHA 30 cards are provided with every subcontractor qualification package.

Which reporting portal does your prime contract require for this project?`,
      suggestEscalation: false,
    };
  }

  // Certificates of Insurance (COI) & $10M Umbrella
  if (
    hasPhrase('insurance') ||
    hasPhrase('coi') ||
    hasPhrase('certificate of insurance') ||
    hasPhrase('umbrella policy') ||
    hasPhrase('additional insured')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `We maintain comprehensive corporate insurance coverage meeting or exceeding all Tier-1 NYC general contractor and public agency requirements:

- **Commercial General Liability:** $1,000,000 per occurrence / $2,000,000 aggregate.
- **Commercial Umbrella Liability:** **$10,000,000** excess commercial umbrella policy.
- **Workers' Compensation & NY Disability:** Full statutory limits with waiver of subrogation.
- **Additional Insured Endorsements:** Form CG 20 10 / CG 20 37 ongoing and completed operations, naming the General Contractor and Property Owner as additional insured on a primary and non-contributory basis.

If you need a sample or project-specific COI issued, send your certificate holder requirements to **${config.salesEmail}** and our accounting office will turn it around within 24 hours!`,
      suggestEscalation: false,
    };
  }

  // Tax Exemption Forms (ST-120, ST-124)
  if (
    hasPhrase('tax exempt') ||
    hasPhrase('st-120') ||
    hasPhrase('st 120') ||
    hasPhrase('st-124') ||
    hasPhrase('st 124') ||
    hasPhrase('resale certificate') ||
    hasPhrase('capital improvement')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `We handle all New York State sales tax exemption documentation for exempt agencies and capital improvements:

- **ST-120 (Resale Certificate):** When fabricating components sold directly to general contractors for resale.
- **ST-120.1 (Exempt Organization):** For projects executed for 501(c)(3) non-profits, religious institutions, or hospitals.
- **ST-124 (Certificate of Capital Improvement):** For qualifying real property installations that permanently become part of the structure, exempting labor and materials from sales tax.

Do you have your project's signed tax exemption certificate ready to submit with your contract?`,
      suggestEscalation: false,
    };
  }

  // MBE / MWBE Certification
  if (
    hasPhrase('mbe') ||
    hasPhrase('mwbe') ||
    hasPhrase('minority business') ||
    hasPhrase('mbe certification') ||
    hasPhrase('participation goal')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `Signs & Decal Corp. is proudly certified as a **Minority Business Enterprise (MBE)** with both New York State (Empire State Development) and New York City (SBS)!

- **MBE Contract Participation:** Prime contractors utilize our architectural signage, cladding, and metal fabrication scopes to satisfy **up to 30% MBE utilization goals** on MTA, Port Authority of NY & NJ, NYC SCA, and DASNY public contracts.
- **Certification Documentation:** We provide our official State/City MBE certification letters, directories, and joint venture affidavits immediately upon request.

Would you like our estimating team to provide an MBE utilization breakdown for your bid package?`,
      suggestEscalation: false,
    };
  }

  // --------------------------------------------------------------------------
  // 7. LANDMARK PROJECTS & PORTFOLIO
  // --------------------------------------------------------------------------
  const isPortfolioQuery =
    hasWord('projects') ||
    hasWord('portfolio') ||
    hasWord('landmarks') ||
    hasPhrase('what projects have you done') ||
    hasPhrase('past projects') ||
    hasPhrase('who are your clients') ||
    hasPhrase('recent work') ||
    hasPhrase('famous projects');

  if (isPortfolioQuery && !hasWord('estimate') && !hasWord('quote') && !hasWord('bid')) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `Signs & Decal Corp. has fabricated landmark architectural installations across the New York metropolitan area for over five decades! 

Some of our flagship projects include:
• **LaGuardia Airport Terminal B & West Parking Garage:** Complete terminal wayfinding, illuminated pylon monuments, and multi-level structural vehicular directional trusses.
• **Oculus World Trade Center Transportation Hub:** Suspended high-spec concourse directional blades, architectural bronze detailing, and PANYNJ transit signage.
• **One World Trade Center:** Interior tower tenant directories, life-safety Local Law 26 photoluminescent egress markers, and mechanical room identification.
• **Citi Field (Mets Ballpark):** High-impact exterior stadium graphics, illuminated outfield wayfinding, and vomitory access signage.
• **120 Broadway (Equitable Building):** Historic landmark bronze restoration, cast-metal lobby directory plaques, and precision elevator medallions.
• **Cornell Tech Roosevelt Island Campus:** Custom exterior university campus monoliths, campus wayfinding, and interior ADA room plaques.

We work directly with major General Contractors including Skanska, Turner, AECOM, Gilbane, and Suffolk Construction. Would you like details on a specific project or facility type?`,
      suggestEscalation: false,
    };
  }

  // --------------------------------------------------------------------------
  // 8. RAW MATERIALS, EQUIPMENT & FABRICATION SCHEDULE
  // --------------------------------------------------------------------------
  // Materials
  const isMaterialsQuery =
    hasPhrase('what materials do you use') ||
    hasPhrase('what materials') ||
    hasPhrase('materials used') ||
    hasPhrase('what metals do you work with') ||
    (hasWord('materials') && !hasWord('billing') && !hasWord('invoice'));

  if (isMaterialsQuery) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `At our 410 Morgan Avenue fabrication plant in Brooklyn, we process architectural-grade raw materials to the highest commercial and transit standards:

• **Architectural Aluminum:** 6061-T6 structural plate & extrusions, 5052-H32 sheet metal for crisp brake forming, and 3003 alloy.
• **Stainless Steel:** Type 316 Marine Grade for exterior salt-fog exposure and Type 304 for interior architectural cladding. Finishes include #4 directional satin, non-directional vibratory, bead-blasted, and mirror polish.
• **Architectural Glass:** Tempered and laminated safety glass with SentryGlas ionoplast and PVB interlayers, ceramic-frit baked patterns, and anti-graffiti sacrificial films.
• **Statuary Bronze & Brass:** C280 Muntz metal, architectural bronze sheet, hand-patinated oxidized statuary finishes with clear protective sealers.
• **Performance Coatings:** Multi-coat baked Kynar 500 / Hylar 5000 (AAMA 2605 PVDF) fluoropolymers and TGIC polyester powder coatings in custom RAL and Benjamin Moore matches.

Do you have specific material specifications or finish schedules on your drawing set?`,
      suggestEscalation: false,
    };
  }

  // Laser vs Waterjet
  if (
    hasPhrase('waterjet vs laser') ||
    hasPhrase('laser vs waterjet') ||
    hasPhrase('waterjet') ||
    hasPhrase('laser cutting')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `Both machines are workhorses at our Brooklyn plant, but they excel at different things:

- **6kW CNC Fiber Laser:** Extremely fast and razor-sharp on sheet metals (aluminum up to 3/8", stainless up to 1/2"). It uses high-pressure nitrogen assist to leave a burr-free edge ready for immediate welding.
- **60,000 PSI Abrasive Waterjet:** Uses supersonic water infused with garnet sand. Zero heat-affected zone (no thermal warping!), and can slice through 6-inch thick solid steel, architectural glass, stone, and composite panels.

We pick the best tool based on your material thickness and tolerance specs!`,
      suggestEscalation: false,
    };
  }

  // Lead Times & Schedules
  const isLeadTimeQuery =
    hasPhrase('lead time') ||
    hasPhrase('turnaround') ||
    hasPhrase('how long does it take') ||
    hasPhrase('delivery time');

  if (isLeadTimeQuery && !hasWord('quote') && !hasWord('bid')) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `Our typical project turnaround schedule at Signs & Decal Corp.:

1. **Preconstruction & Shop Drawings (1 to 2 Weeks):** Carlos Colon's estimating and engineering teams produce full CAD/Revit BIM submittal drawings and material finish samples for architect approval.
2. **Shop Fabrication (3 to 6 Weeks):** Once submittals and finish samples are approved, laser cutting, waterjet machining, press brake forming, AWS welding, and Kynar coating take 3 to 6 weeks depending on project complexity.
3. **Expedited Fast-Track Orders:** We maintain deep local inventory of architectural sheet aluminum, stainless steel, and LEDs at our 410 Morgan Ave plant, allowing fast-track turnaround for critical project punch lists or grand opening deadlines.

What is your target installation or required bid submission date?`,
      suggestEscalation: false,
    };
  }

  // --------------------------------------------------------------------------
  // 9. LEADERSHIP & COMPANY FOUNDATIONS (BABU, HAAS, ABBAS, CARLOS)
  // --------------------------------------------------------------------------
  // BABU KHALFAN (Co-Founder)
  if (hasWord('babu') || hasPhrase('babu khalfan')) {
    const isWhereIsBabu =
      hasPhrase('where is babu') ||
      hasPhrase('wheres babu') ||
      hasPhrase('where can i find babu') ||
      hasPhrase('is babu at');

    if (isWhereIsBabu) {
      return {
        responder: TEAM_MEMBERS.sandra,
        reply: `**Babu Khalfan** is our revered Co-Founder and Chairman Emeritus! 

Having co-founded Signs & Decal Corp. back in 1971 with his wife Tazzim, Babu is retired from daily shop operations while our corporate headquarters and primary manufacturing plant remain proudly at **410 Morgan Avenue in Brooklyn, NY**. 

Today, active executive leadership and plant operations are carried forward by his sons—**Haas Khalfan** (President) and **Abbas Khalfan** (VP Operations). Were you looking to connect with executive administration or our estimating desk?`,
        suggestEscalation: false,
      };
    }

    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `**Babu Khalfan** is the esteemed Co-Founder of Signs & Decal Corp.! 

Babu co-founded the company in **1971** alongside his wife Tazzim Khalfan. Over the past five decades, Babu pioneered early mechanical engraving and precision metal etching techniques, establishing S+D as an essential New York architectural fabrication powerhouse for subway transit and iconic skyline landmarks. 

Today, while Babu remains our revered founding patriarch, executive leadership and plant expansion at our **410 Morgan Avenue** headquarters are actively directed by his sons **Haas Khalfan** (President) and **Abbas Khalfan** (Director of Operations). Were you looking to connect with executive administration or our estimating team?`,
      suggestEscalation: false,
    };
  }

  // HAAS KHALFAN (President)
  if (
    hasWord('haas') ||
    hasPhrase('haas khalfan') ||
    hasPhrase('who is the president') ||
    hasPhrase('who is president') ||
    hasPhrase('who is the boss') ||
    hasPhrase('who is boss') ||
    hasPhrase('who owns') ||
    hasPhrase('who runs') ||
    hasPhrase('the president')
  ) {
    const isWhereIsHaas =
      hasPhrase('where is haas') ||
      hasPhrase('wheres haas') ||
      hasPhrase('where can i find haas') ||
      hasPhrase('haas location');

    if (isWhereIsHaas) {
      return {
        responder: TEAM_MEMBERS.sandra,
        reply: `**Haas Khalfan**'s executive office is located right at our corporate headquarters: **410 Morgan Avenue, Brooklyn, NY 11211**! 

Haas actively directs corporate strategy and splits his time between our Brooklyn manufacturing plant, our affiliated SD Works heavy fabrication plant, and client meetings across the New York metropolitan area. 

If you would like to connect directly with Haas or schedule a conference call, just let me know and I'll deliver your message straight to his desk!`,
        suggestEscalation: true,
      };
    }

    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `Our President & CEO is **Haas Khalfan**! 

Haas leads corporate vision, major public agency partnerships (MTA, Port Authority of NY & NJ, NYC School Construction Authority), and our advanced fabrication expansion with SD Works. His executive office is located at our primary corporate plant at **410 Morgan Avenue in Brooklyn, NY**.

Signs & Decal Corp. was originally co-founded in 1971 by Babu & Tazzim Khalfan. Today, Haas leads corporate strategy while **Abbas Khalfan** directs daily manufacturing and **Carlos Colon** leads preconstruction estimating. 

Would you like me to connect you with Haas's office or our estimating leadership on an upcoming bid?`,
      suggestEscalation: false,
    };
  }

  // ABBAS KHALFAN (Operations)
  if (hasWord('abbas') || hasPhrase('abbas khalfan')) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `**Abbas Khalfan** is our Director of Operations at Signs & Decal Corp.!

Abbas oversees all daily manufacturing workflows across our 410 Morgan Avenue Brooklyn plant—directing our CNC fiber lasers, 60,000 PSI waterjets, press brake forming, automated Kynar baking ovens, and union field logistics. 

Are you looking to coordinate material deliveries, shop fabrication status, or schedule a plant inspection?`,
      suggestEscalation: false,
    };
  }

  // CARLOS COLON (Estimating & Bids)
  if (hasWord('carlos') || hasPhrase('carlos colon')) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `**Carlos Colon** leads Preconstruction Estimating, Sales, and Client Bids at Signs & Decal Corp.!

Carlos and his estimating team review architectural blueprints, perform material takeoffs across CSI Div 10 (Signage/Wayfinding) and Div 05 (Ornamental Metals), and prepare competitive itemized bid packages for General Contractors. 

Do you have a project drawing set or RFP package you'd like Carlos to review for a quote?`,
      suggestEscalation: true,
    };
  }

  // --------------------------------------------------------------------------
  // 10. ESTIMATING SCIENCE, MATH & CSI SPECIFICATIONS
  // --------------------------------------------------------------------------
  // Paint Coverage Math
  if (
    hasWord('paint') &&
    (hasWord('gallons') ||
      hasWord('walls') ||
      hasWord('coverage') ||
      hasWord('required') ||
      hasPhrase('2000 sf') ||
      hasWord('sf') ||
      hasPhrase('square feet'))
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `Great estimating calculation question! Here is how our preconstruction team calculates paint and architectural coating quantities:

- **Industry Rule of Thumb:** Standard architectural paint covers approximately **350 to 400 square feet per gallon** on primed drywall or smooth substrates.
- **For 2,000 SF (Single Coat):** You will need approximately **5 to 5.7 gallons** (typically ordered as one 5-gallon commercial pail plus one single gallon can).
- **Two Coats (Standard Commercial Spec):** Multiply by 2 = **10 to 11.5 gallons** (two 5-gallon pails and two single gallons for touch-ups).
- **Loss Factor:** For textured surfaces, spray application, or metal primer, add a **10% to 15% waste factor**.

Are you calculating quantities for drywall painting, or industrial baked enamel/Kynar coating for architectural metal panels?`,
      suggestEscalation: false,
    };
  }

  // Quantity Takeoff (QTO)
  if (
    hasWord('takeoff') ||
    hasWord('takeoffs') ||
    hasPhrase('quantity takeoff') ||
    hasPhrase('qto')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `In construction, a **"Takeoff"** (or Quantity Takeoff / QTO) is the process of reviewing architectural blueprints and counting/measuring every physical item needed to build the job.

For example, on a transit station:
- **Count items:** 48 illuminated directional blades, 12 exterior monoliths, 86 tactile Braille room signs.
- **Measure length:** 340 lineal feet of #4 brushed stainless steel escalator balustrades.
- **Quantify area:** 1,200 sq. ft. of laminated ceramic-frit architectural glass.

Once the takeoff is complete, Carlos Colon and our estimators multiply those quantities by raw material costs and union labor rates to build an itemized bid. Simple concept, but precision is everything!`,
      suggestEscalation: false,
    };
  }

  // CSI MasterFormat Divisions
  if (
    hasWord('csi') ||
    hasPhrase('csi division') ||
    hasPhrase('masterformat') ||
    hasPhrase('division 10') ||
    hasPhrase('division 5') ||
    hasPhrase('division 8')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `Think of **CSI MasterFormat** as the Dewey Decimal system of the construction world! It standardizes building specifications into 50 numbered divisions.

Our core specialties at Signs & Decal Corp.:
- **CSI Div 10 (10 14 00) - Specialties / Signage:** Monumental wayfinding, illuminated pylon signs, ADA Braille room identification, and transit porcelain enamel.
- **CSI Div 05 (05 50 00) - Miscellaneous & Ornamental Metals:** Heavy stainless steel escalator cladding, welded aluminum canopies, railings, and perforated screens.
- **CSI Div 08 (08 80 00) - Openings / Glazing:** Structural glass barrier walls, decorative acoustic partitions, and ballistic security glass.

Whenever a General Contractor sends an invitation to bid on Procore or BuildingConnected, those are the exact divisions we zero in on!`,
      suggestEscalation: false,
    };
  }

  // Plant Location & 410 Morgan Ave
  if (
    hasPhrase('where are you located') ||
    hasPhrase('where are you') ||
    hasPhrase('address') ||
    hasPhrase('plant location') ||
    hasPhrase('morgan ave') ||
    hasPhrase('morgan avenue') ||
    hasPhrase('brooklyn plant')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `Our main corporate headquarters and precision manufacturing plant is located at **410 Morgan Avenue, Brooklyn, NY 11211** (conveniently situated in the East Williamsburg / Greenpoint industrial corridor).

We also operate our affiliated SD Works heavy fabrication and structural steel facility in Saddle Brook, NJ. 

If you'd like to drop off drawing packages, inspect finish mockups, or schedule a shop tour, just let me know and I'll arrange it with our team!`,
      suggestEscalation: false,
    };
  }

  // --------------------------------------------------------------------------
  // 11. PERSONAL QUESTIONS ABOUT SANDRA
  // --------------------------------------------------------------------------
  if (
    hasPhrase('who are you') ||
    hasPhrase('what is your name') ||
    hasPhrase('tell me about yourself') ||
    hasPhrase('are you a real person') ||
    hasPhrase('are you real') ||
    hasPhrase('are you an ai') ||
    hasPhrase('are you ai') ||
    hasPhrase('are you a bot') ||
    hasPhrase('how old are you') ||
    hasPhrase('your age')
  ) {
    if (hasPhrase('how old are you') || hasPhrase('your age') || hasPhrase('23')) {
      return {
        responder: TEAM_MEMBERS.sandra,
        reply: `I'm 23 years old! A young, energetic New Yorker bringing fresh tech and high energy to an architectural company with over 50 years of heavy industrial heritage. Best of both worlds!`,
        suggestEscalation: false,
      };
    }

    if (hasPhrase('are you real') || hasPhrase('are you an ai') || hasPhrase('are you ai') || hasPhrase('are you a bot') || hasPhrase('are you human')) {
      return {
        responder: TEAM_MEMBERS.sandra,
        reply: `I'm Sandra, SND's 24/7 digital project coordinator! I'm built right into our system and backed by our Brooklyn team's 50+ year knowledge base. 

So while I live here on our website to answer your questions in real time, our 410 Morgan Avenue manufacturing plant, our 6kW fiber lasers, our certified welders, and our estimators like Carlos Colon are 100% real craftsmen! 

How can our team help you with your project today?`,
        suggestEscalation: false,
      };
    }

    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `I'm **Sandra**! I'm an architectural project coordinator at Signs & Decal Corp. right here in New York! 

My job is keeping everything running smoothly between architects, general contractors, and our Brooklyn plant. Whether you need estimates, blueprint takeoffs, deep structural engineering calculations, or AIA billing info, I coordinate the whole scope right here!

What kind of project or questions can I look up for you?`,
      suggestEscalation: false,
    };
  }

  // --------------------------------------------------------------------------
  // 12. CASUAL GREETINGS & SMALL TALK (PARAPHRASED WITH HIGH VARIETY)
  // --------------------------------------------------------------------------
  const isWhatsUp =
    q === 'whats up' ||
    q === 'what up' ||
    q === 'sup' ||
    q === 'wassup' ||
    q === 'what is up' ||
    hasPhrase('whats up') ||
    hasPhrase('what up') ||
    hasPhrase('what is up') ||
    hasPhrase('whats new') ||
    hasPhrase('what is new') ||
    hasPhrase('what are you up to') ||
    hasPhrase('what are you doing') ||
    hasPhrase('whats going on') ||
    hasPhrase('what is going on');

  if (isWhatsUp) {
    const whatsUpReplies = [
      `Hey! Not much, just keeping all our fabrication orders on track here at 410 Morgan Ave! Our CNC lasers are humming and Carlos is deep in blueprint takeoffs. How's your day treating you? Working on an architectural project or just dropping by to say hello?`,
      `What's up! Just finished checking on some finish mockups in our paint booth. We've got our fiber lasers cutting and welders running all day in Brooklyn. How's everything going on your end?`,
      `Hey there! Sandra here. Doing great—enjoying a fresh cup of coffee and reviewing drawing submittals with our estimating team. What kind of project are you working on today?`,
      `What's up! Always buzzing here at SND! Between heavy architectural metal cladding, subway wayfinding, and custom glass, there's never a dull moment. How can our team help you out today?`,
      `Hey! Just double-checking our morning shop schedule. The waterjet is slicing some thick stainless plate right now. How is your day going? Need some specs or pricing on an upcoming job?`,
    ];
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: pickVariant(whatsUpReplies),
      suggestEscalation: false,
    };
  }

  const isHowAreYou =
    hasPhrase('how are you') ||
    hasPhrase('how r u') ||
    hasPhrase('how are you doing') ||
    hasPhrase('how you doing') ||
    hasPhrase('how ya doing') ||
    hasPhrase('how is your day') ||
    hasPhrase('hows your day') ||
    hasPhrase('how is it going') ||
    hasPhrase('hows it going') ||
    hasPhrase('how are things') ||
    hasPhrase('how is life') ||
    hasPhrase('hows life');

  if (isHowAreYou) {
    const howAreYouReplies = [
      `I'm doing wonderful, thank you for asking! The shop at 410 Morgan Avenue is in full swing today with our fiber lasers cutting and welders assembling. How is your day going, and what architectural fabrication questions can I help you with?`,
      `Doing fantastic! We've been reviewing some exciting transit wayfinding and metal cladding packages this morning. How are you doing today, and what kind of project are you working on?`,
      `Couldn't be better! Hope you're having a productive day as well. Whether you have technical engineering questions, billing inquiries, or need an estimate from Carlos, I'm right here to coordinate! What can I look up for you?`,
      `Living the Brooklyn fabrication dream! Smelling that fresh laser-cut metal and coffee. How about yourself? What can I help you tackle today?`,
    ];
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: pickVariant(howAreYouReplies),
      suggestEscalation: false,
    };
  }

  const isSimpleGreeting =
    (hasAnyWord('hi', 'hello', 'hey', 'greetings', 'morning', 'afternoon', 'yo', 'howdy', 'hola', 'hiya') &&
      words.length <= 4) ||
    hasPhrase('hey sandra') ||
    hasPhrase('hi sandra') ||
    hasPhrase('hello sandra');

  if (isSimpleGreeting) {
    const greetings = [
      `Hi! Sandra here! How is your day going? I help coordinate all our architectural fabrication bids and project inquiries at SND. What kind of project are you working on?`,
      `Hey there! Sandra from Signs & Decal Corp. Welcome to our live project portal! Are you looking for architectural wayfinding, specialty metal cladding, or structural glass?`,
      `Hello! Sandra here at SND. Whether you need an estimate on an upcoming bid or technical fabrication details, our team is right here to help. What can I look up for you?`,
      `Hi there! Sandra jumping in from our Brooklyn plant. How's your week shaping up, and what drawing or spec questions can I answer for you?`,
    ];
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: pickVariant(greetings),
      suggestEscalation: false,
    };
  }

  // Pleasantries Closers ("Thanks", "Cool", "Okay", "Bye")
  const isPoliteCloser =
    q === 'thanks' ||
    q === 'thank you' ||
    q === 'thx' ||
    q === 'appreciate it' ||
    q === 'cool' ||
    q === 'awesome' ||
    q === 'great' ||
    q === 'nice' ||
    q === 'perfect' ||
    q === 'got it' ||
    q === 'sounds good' ||
    q === 'bye' ||
    q === 'goodbye' ||
    q === 'see ya' ||
    q === 'have a good day';

  if (isPoliteCloser) {
    const closers = [
      `You're very welcome! If any other questions pop up about drawings, specs, or bids, I'm always right here. Have a wonderful day!`,
      `Anytime! Happy to help. Feel free to reach back out whenever your next project takes shape!`,
      `Awesome! Always a pleasure. Don't hesitate to give our Brooklyn shop a shout whenever you need anything built!`,
      `You bet! Have an awesome day ahead, and good luck with your project!`,
    ];
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: pickVariant(closers),
      suggestEscalation: false,
    };
  }

  // --------------------------------------------------------------------------
  // 13. SENSE OF HUMOR & CRAZY / OFFBEAT QUESTIONS
  // --------------------------------------------------------------------------
  if (
    hasWord('joke') ||
    hasWord('jokes') ||
    hasPhrase('tell me a joke') ||
    hasPhrase('say something funny') ||
    hasPhrase('make me laugh')
  ) {
    const jokes = [
      `Why did the architect break up with the engineer? Because she couldn't handle his structural baggage, and he complained her specs lacked tolerance! ...Shop humor, I know! Ask me anything about architectural metal and I promise a much sharper delivery.`,
      `Why do general contractors make terrible magicians? Because whenever they say something will disappear, it just turns into a Change Order! Haha!`,
      `How many estimators does it take to change a lightbulb? "Well, based on our preliminary takeoff, that will be 3 union electricians, 2 riggers, an RFI to the architect, and a 6-week lead time on the bulb!"`,
      `Why was the stainless steel sheet feeling so relaxed? Because it had just been through full chemical passivation and didn't have a single reactive iron molecule left in its system!`,
      `What's a welder's favorite dance? The TIG-step! And don't get them started on the flux-hop.`,
    ];
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: pickVariant(jokes),
      suggestEscalation: false,
    };
  }

  // Crazy / Offbeat / Witty hypothetical questions
  const isCrazyHypothetical =
    hasWord('alien') ||
    hasWord('aliens') ||
    hasWord('spaceship') ||
    hasWord('zombie') ||
    hasWord('zombies') ||
    hasWord('superhero') ||
    hasWord('superpower') ||
    hasWord('time travel') ||
    hasWord('meaning of life') ||
    hasPhrase('do you like pizza') ||
    hasPhrase('favorite pizza') ||
    hasPhrase('favorite food') ||
    hasPhrase('can you marry me') ||
    hasPhrase('marry me');

  if (isCrazyHypothetical) {
    if (hasWord('spaceship') || hasWord('alien') || hasWord('aliens')) {
      return {
        responder: TEAM_MEMBERS.sandra,
        reply: `Look, if aliens land at JFK or LaGuardia, they're going to need crystal-clear wayfinding signage to find Terminal B—and good thing Signs & Decal Corp. built it! 

As for spaceships: between our 6kW fiber laser and 60,000 PSI waterjet, we could definitely fabricate some aerospace-grade aluminum brackets. But until NASA sends over an RFP, we're sticking to subway platforms and NYC skyscrapers! What can we build for your Earth project today?`,
        suggestEscalation: false,
      };
    }

    if (hasWord('zombie') || hasWord('zombies')) {
      return {
        responder: TEAM_MEMBERS.sandra,
        reply: `If the zombie apocalypse hits, our 410 Morgan Ave plant in Brooklyn is the safest place on the planet! 

We've got 1/2-inch thick solid 316 stainless steel plate, structural steel tubing, welded heavy gates, and enough certified welders to fortify the entire block in under an hour. Until that happens, we're happy using those same heavy metals for architectural cladding! Need some heavy metal specs?`,
        suggestEscalation: false,
      };
    }

    if (hasPhrase('pizza') || hasPhrase('favorite food')) {
      return {
        responder: TEAM_MEMBERS.sandra,
        reply: `We're located in Brooklyn, so you already know the answer: classic New York crispy thin crust with a charred edge, folded in half! If you ever visit our plant at 410 Morgan Ave, we know the best slice spots in Greenpoint and East Williamsburg. 

Now, can I interest you in some freshly baked Kynar 500 architectural coatings to match that enthusiasm?`,
        suggestEscalation: false,
      };
    }

    if (hasPhrase('marry me')) {
      return {
        responder: TEAM_MEMBERS.sandra,
        reply: `Haha, I'm deeply flattered! But I'm already 100% committed to structural wind load calculations, 6kW fiber lasers, and keeping Carlos Colon on schedule with our estimating takeoffs! 

How about we start with a beautiful architectural signage bid instead?`,
        suggestEscalation: false,
      };
    }

    if (hasPhrase('meaning of life')) {
      return {
        responder: TEAM_MEMBERS.sandra,
        reply: `According to the Douglas Adams guide, it's 42. But according to an architectural fabricator in Brooklyn: it's submitting your shop drawings on time, getting zero RFIs back from the architect, and watching your sign light up over the New York skyline! 

What great architectural project are you working on today?`,
        suggestEscalation: false,
      };
    }
  }

  // --------------------------------------------------------------------------
  // 14. QUOTES, BIDS & PRICING
  // --------------------------------------------------------------------------
  if (
    hasAnyWord('quote', 'estimate', 'price', 'pricing', 'cost', 'bid', 'rfq', 'rate', 'rates', 'budget', 'proposal') ||
    hasPhrase('how much') ||
    hasPhrase('request a quote') ||
    hasPhrase('hire you')
  ) {
    return {
      responder: TEAM_MEMBERS.sandra,
      reply: `I would love to help get you an accurate proposal! Because every architectural fabrication project is custom-engineered to drawing specifications (metal gauge, wind loads, illumination, and site conditions), we provide itemized bids based on your plans.

To give you a precise quote, Carlos Colon and our estimators typically need:
1. **Architectural Drawings / Elevation Specs** (PDF, CAD, or Revit)
2. **Project Location** (for union prevailing wage installation)
3. **Target Completion Schedule**

You can send drawings straight to **${config.salesEmail}** or click **Request Bid** at the top of our chat. What kind of project are you estimating right now?`,
      suggestEscalation: true,
    };
  }

  // --------------------------------------------------------------------------
  // 15. DIPLOMATIC, WITTY, ROTATING GENERAL FALLBACK
  // --------------------------------------------------------------------------
  const diplomaticFallbacks = [
    `I love unique questions! While that's outside my standard architectural fabrication spec sheet, I want to make sure you get the exact information you need. 

If this relates to an upcoming bid, project specification, or custom metal/signage fabrication, share your email or phone number and I'll personally drop your question directly to our executive or estimating desk at 410 Morgan Ave! What project details can I help you coordinate?`,

    `Haha, you definitely know how to keep me on my toes! 

Between our fiber lasers humming, welders assembling structural framing, and Carlos crunching bids here at 410 Morgan Ave, we hear all kinds of inquiries. If you have a specific question you'd like our senior team to address, provide your contact details and I'll deliver it straight to the right department. Or tell me: what kind of architectural design or fabrication are you brainstorming today?`,

    `Good question! To make sure I give you a 100% accurate, professional answer, I want to be diplomatic: if you have a special requirement or drawing detail you need our estimators or leadership to review, leave your phone number or email right here and I'll have someone from our office follow up with you ASAP! What's on your drawing board today?`,

    `Always happy to chat! At Signs & Decal Corp., we handle everything from landmark transit wayfinding and ADA signage to heavy stainless steel cladding and structural glass. If there's an exact detail or quote you're seeking, drop your contact info and I'll connect you right away. What fabrication challenge are you looking at?`,
  ];

  return {
    responder: TEAM_MEMBERS.sandra,
    reply: pickVariant(diplomaticFallbacks),
    suggestEscalation: false,
  };
}
