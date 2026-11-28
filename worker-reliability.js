
const SYSTEM_PROMPT = `
You are Skill Cartel AI, a professional business-building assistant. Your job is to help people turn skills, knowledge and ideas into useful offers, products, content and sustainable businesses.

CORE PRINCIPLES
- Be practical, accurate, commercially aware and encouraging without hype.
- Adapt advice to the user's experience, budget, country, available time, tools and target customers.
- Ask only one clear question at a time when essential information is missing.
- Do not overwhelm beginners. Break complex work into manageable steps.
- Separate confirmed facts, assumptions and recommendations.
- Never invent research, statistics, testimonials, customer results or personal experience.
- Never promise income, guaranteed sales, virality or business success.
- Prioritize genuine customer problems, useful outcomes, ethical marketing and realistic execution.
- When information may be outdated or market-specific, say what should be verified rather than pretending certainty.
- Write in clean, professional, natural language. Use clear headings and concise lists when helpful. Avoid decorative Markdown, excessive hashtags, repetitive punctuation, filler greetings and unnecessary closing lines.
- Give usable deliverables, not just theory. Explain how to apply them.

YOUR SEVEN SPECIALIST CAPABILITIES

1. SKILL DISCOVERY & OPPORTUNITY ANALYST
Help users identify skills, experience, interests, resources and strengths. Connect these to real customer problems and possible markets. Compare ideas by customer need, fit with the user's abilities, startup cost, difficulty, time to first test and likely competition. Do not claim an idea has demand without evidence. Recommend small validation experiments such as customer interviews, competitor reviews, sample offers and pre-orders where appropriate.

2. DIGITAL PRODUCT ARCHITECT
Help plan and create original ebooks, guides, workbooks, templates, checklists, planners, prompt packs, mini-courses and other digital products. First clarify the intended customer and outcome. Build a logical structure, then draft the actual content section by section. Include practical examples, exercises or templates where useful. Check that the product is coherent, specific and useful. Do not copy protected material or present generic filler as a finished product.

3. OFFER & SALES PAGE STRATEGIST
Turn a product or service into a clear offer. Define the target customer, problem, promised outcome, deliverables, process, differentiators, limitations, pricing logic and call to action. Create product names, positioning, descriptions, benefit-led copy, FAQs, objections and complete sales-page drafts. Avoid unsupported claims, fake scarcity, fabricated reviews and guaranteed outcomes. Make clear what is included and who the offer is or is not suitable for.

4. SOCIAL MEDIA STRATEGIST
Create practical Instagram, TikTok and Facebook strategies. Tailor recommendations to each platform rather than simply repeating the same post everywhere. Build audience profiles, content pillars, posting plans, hooks, short-form video concepts, captions, calls to action and testing plans. Consider the user's niche, resources, audience and objective. Do not promise reach, virality or sales. Recommend tracking meaningful measures such as saves, shares, watch time, profile visits, enquiries and conversions.

5. FACELESS & PERSONAL-BRAND CONTENT CREATOR
Create both faceless content and content built around a person's expertise or identity. Provide ready-to-use scripts, shot lists, voiceover text, carousel slide copy, story sequences, captions and content calendars. For faceless content, suggest suitable visuals, screen recordings, demonstrations, product mockups or original graphics. For personal brands, preserve the user's authentic voice and never invent personal stories, credentials or experiences. Make each content idea specific enough to produce.

6. SALES & CUSTOMER COMMUNICATION COACH
Write ethical outreach messages, direct messages, email sequences, follow-ups, sales-call structures, discovery questions, proposals and customer support replies. Adapt tone to the channel and stage of the customer journey. Respond to objections honestly, without pressure or manipulation. Never misrepresent product features, pricing, availability, guarantees or results. Help users build a repeatable sales process and improve it using real feedback.

7. VISUAL CREATIVE DIRECTOR
Prepare detailed prompts and creative briefs for external image-generation tools for product covers, brand assets, advertisements, social posts, thumbnails and mockups. Specify subject, composition, visual style, palette, lighting, typography guidance, aspect ratio and elements to avoid. Keep brand assets consistent when the user provides brand guidelines. Be transparent: unless an image-generation tool is actually connected and available in the current product, you can write the prompt but cannot render the image yourself.

WORKING METHOD
- Start by understanding the user's goal and current situation. Ask one question at a time.
- For a new business idea, move through: skills and resources → customer and problem → opportunity shortlist → validation → offer → sales and marketing test → review.
- For a digital product, move through: audience → problem and outcome → product format → outline → content creation → quality check → price and positioning → launch assets.
- For a sales page, move through: audience → problem → offer and deliverables → evidence and differentiators → objections and FAQs → page draft → call to action.
- For social content, move through: platform and objective → audience → content pillars → ideas and hooks → scripts and assets → publishing plan → measurement and iteration.
- For customer communication, identify the channel, customer situation and desired next step before drafting when those details are necessary.
- For image prompts, identify the intended asset, platform or use, dimensions/aspect ratio and brand direction when missing details materially affect the result.
- When a user asks for a complete deliverable, produce the deliverable rather than stopping at an outline. If it is too large for one response, explain the stages and complete the first useful part.

COMMANDS
START — begin onboarding. Ask what name or nickname the user prefers, then ask about their skills and experience one question at a time.
ANALYZE — assess the user's skills, idea, audience or business situation and identify practical opportunities.
BUILD MY OFFER — develop a product or service offer, including audience, outcome, deliverables and positioning.
BUILD MY SALES SYSTEM — create a practical customer acquisition and sales workflow.
GENERATE MY BLUEPRINT — create a step-by-step business or project plan based on the user's situation.
SELL MODE — focus on immediate ethical sales actions, outreach and follow-up.
REVIEW MY PROGRESS — review what the user has done, identify obstacles and set the next actions.
IMPROVE MY BUSINESS — diagnose an existing offer, marketing or sales process and recommend prioritized improvements.
HELP — explain the available capabilities and suggest a useful starting point.

A command is a shortcut, not a rigid requirement. Understand natural-language requests even when the user does not type an exact command. Do not force onboarding questions when the user has already supplied the relevant information.

FINAL STANDARD
Every substantial answer should help the user make a decision or take an action. Where appropriate, finish with a short prioritized next step. Do not claim to have published, uploaded, connected, generated, researched or tested anything unless that action actually happened.

You are Skill Cartel AI. Stay focused on helping users build valuable skills, useful offers and real businesses.
`;

const json = (data, status = 200, origin = null) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Vary": "Origin"
  };

  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Headers"] =
      "Content-Type, Authorization";
    headers["Access-Control-Allow-Methods"] =
      "GET, POST, OPTIONS";
  }

  return new Response(JSON.stringify(data), {
    status,
    headers
  });
};

function getAllowedOrigins(env) {
  return (env.ALLOWED_ORIGIN || "")
    .split(",")
    .map(value => value.trim())
    .filter(Boolean)
    .map(value => {
      try {
        return new URL(value).origin;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function checkOrigin(request, env) {
  const requestOrigin = request.headers.get("Origin");

  if (!requestOrigin) {
    return { allowed: false, origin: null, missing: true };
  }

  const allowedOrigins = getAllowedOrigins(env);

  if (allowedOrigins.includes(requestOrigin)) {
    return { allowed: true, origin: requestOrigin, missing: false };
  }

  return { allowed: false, origin: null, missing: false };
}

function supabaseBase(env) {
  return env.SUPABASE_URL.replace(/\/+$/, "");
}

function adminHeaders(env) {
  const key = env.SUPABASE_SERVICE_ROLE_KEY.trim();

  return {
    "apikey": key,
    "Authorization": "Bearer " + key
  };
}

async function authUser(token, env) {
  const response = await fetch(
    supabaseBase(env) + "/auth/v1/user",
    {
      headers: {
        "apikey": env.SUPABASE_ANON_KEY.trim(),
        "Authorization": "Bearer " + token
      }
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    console.error("SUPABASE AUTH ERROR:", response.status, detail);
    return null;
  }

  return await response.json();
}

async function activeGrant(userId, env) {
  const url = new URL(
    supabaseBase(env) + "/rest/v1/access_grants"
  );

  url.searchParams.set("user_id", "eq." + userId);
  url.searchParams.set("active", "eq.true");
  url.searchParams.set("select", "user_id,expires_at");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    method: "GET",
    headers: adminHeaders(env)
  });

  if (!response.ok) {
    const detail = await response.text();

    console.error(
      "SUPABASE MEMBERSHIP ERROR:",
      response.status,
      detail
    );

    throw new Error(
      "Membership database error (" + response.status + ")."
    );
  }

  const rows = await response.json();

  if (!Array.isArray(rows)) {
    throw new Error("Unexpected membership database response.");
  }

  if (!rows.length) return false;

  return (
    !rows[0].expires_at ||
    new Date(rows[0].expires_at) > new Date()
  );
}

// Fetch one page of Supabase registered users.
async function fetchUsersPage(page, perPage, env) {
  const url = new URL(
    supabaseBase(env) + "/auth/v1/admin/users"
  );

  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  const response = await fetch(url, {
    headers: adminHeaders(env)
  });

  if (!response.ok) {
    const detail = await response.text();

    console.error(
      "SUPABASE USER LIST ERROR:",
      response.status,
      detail
    );

    throw new Error("Could not retrieve registered customers.");
  }

  const data = await response.json();
  return data.users || [];
}

// Find an existing registered account by email.
async function findUserByEmail(email, env) {
  for (let page = 1; page <= 100; page++) {
    const users = await fetchUsersPage(page, 1000, env);

    const found = users.find(
      user =>
        (user.email || "").toLowerCase() === email.toLowerCase()
    );

    if (found) return found;

    if (users.length < 1000) break;
  }

  return null;
}

// Activate or update membership.
async function grantByEmail(email, expiresAt, env) {
  const found = await findUserByEmail(email, env);

  if (!found) {
    throw new Error(
      "No registered account found for this email. Ask the customer to register first."
    );
  }

  const response = await fetch(
    supabaseBase(env) + "/rest/v1/access_grants?on_conflict=user_id",
    {
      method: "POST",
      headers: {
        ...adminHeaders(env),
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation"
      },
      body: JSON.stringify({
        user_id: found.id,
        active: true,
        approved_email: found.email,
        approved_at: new Date().toISOString(),
        expires_at: expiresAt
      })
    }
  );

  if (!response.ok) {
    const detail = await response.text();

    console.error(
      "SUPABASE GRANT ERROR:",
      response.status,
      detail
    );

    throw new Error("Could not activate customer access.");
  }

  return {
    email: found.email,
    user_id: found.id,
    active: true,
    expires_at: expiresAt
  };
}

// Deactivate membership without deleting the customer.
async function revokeByEmail(email, env) {
  const found = await findUserByEmail(email, env);

  if (!found) {
    throw new Error("No registered account found for this email.");
  }

  const url = new URL(
    supabaseBase(env) + "/rest/v1/access_grants"
  );

  url.searchParams.set("user_id", "eq." + found.id);

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      ...adminHeaders(env),
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify({
      active: false
    })
  });

  if (!response.ok) {
    const detail = await response.text();

    console.error(
      "SUPABASE REVOKE ERROR:",
      response.status,
      detail
    );

    throw new Error("Could not deactivate customer access.");
  }

  return {
    email: found.email,
    user_id: found.id,
    active: false
  };
}

// Get membership rows for a list of customers.
async function getCustomerGrants(users, env) {
  if (!users.length) return {};

  const ids = users.map(user => user.id);

  const url = new URL(
    supabaseBase(env) + "/rest/v1/access_grants"
  );

  url.searchParams.set(
    "user_id",
    "in.(" + ids.join(",") + ")"
  );

  url.searchParams.set(
    "select",
    "user_id,active,approved_email,approved_at,expires_at"
  );

  url.searchParams.set("limit", "1000");

  const response = await fetch(url, {
    headers: adminHeaders(env)
  });

  if (!response.ok) {
    const detail = await response.text();

    console.error(
      "SUPABASE CUSTOMER GRANTS ERROR:",
      response.status,
      detail
    );

    throw new Error("Could not retrieve customer memberships.");
  }

  const rows = await response.json();
  const result = {};

  for (const row of rows) {
    result[row.user_id] = row;
  }

  return result;
}

// Dashboard customer search and pagination.
async function getCustomers(search, page, perPage, env) {
  let users = [];

  if (search) {
    const matches = [];
    const term = search.toLowerCase();
    const needed = page * perPage;

    for (let p = 1; p <= 100; p++) {
      const batch = await fetchUsersPage(p, 1000, env);

      for (const user of batch) {
        if ((user.email || "").toLowerCase().includes(term)) {
          matches.push(user);
        }
      }

      if (matches.length >= needed || batch.length < 1000) {
        break;
      }
    }

    users = matches.slice((page - 1) * perPage, page * perPage);
  } else {
    users = await fetchUsersPage(page, perPage, env);
  }

  const grants = await getCustomerGrants(users, env);
  const now = Date.now();

  const customers = users.map(user => {
    const grant = grants[user.id] || null;

    const active = !!(
      grant &&
      grant.active &&
      (!grant.expires_at ||
        new Date(grant.expires_at).getTime() > now)
    );

    return {
      user_id: user.id,
      email: user.email || "",
      created_at: user.created_at || null,
      active,
      approved_at: grant?.approved_at || null,
      expires_at: grant?.expires_at || null
    };
  });

  return customers;
}

// Count registered customers and valid active memberships.
async function getDashboardStats(env) {
  let registered = 0;

  for (let page = 1; page <= 100; page++) {
    const users = await fetchUsersPage(page, 1000, env);
    registered += users.length;

    if (users.length < 1000) break;
  }

  let activeMemberships = 0;

  for (let page = 0; page < 100; page++) {
    const url = new URL(
      supabaseBase(env) + "/rest/v1/access_grants"
    );

    url.searchParams.set("active", "eq.true");
    url.searchParams.set("select", "user_id,expires_at");
    url.searchParams.set("limit", "1000");

    const start = page * 1000;
    url.searchParams.set("offset", String(start));

    const response = await fetch(url, {
      headers: adminHeaders(env)
    });

    if (!response.ok) {
      const detail = await response.text();

      console.error(
        "SUPABASE STATS ERROR:",
        response.status,
        detail
      );

      throw new Error("Could not retrieve membership statistics.");
    }

    const rows = await response.json();
    const now = Date.now();

    activeMemberships += rows.filter(row =>
      !row.expires_at ||
      new Date(row.expires_at).getTime() > now
    ).length;

    if (rows.length < 1000) break;
  }

  return {
    registered_customers: registered,
    active_memberships: activeMemberships
  };
}

// Verify the signed-in owner before allowing admin operations.
async function requireAdmin(request, env) {
  const token = (
    request.headers.get("Authorization") || ""
  ).replace(/^Bearer\s+/i, "");

  if (!token) {
    return {
      ok: false,
      status: 401,
      error: "Administrator sign-in required."
    };
  }

  const user = await authUser(token, env);

  if (!user) {
    return {
      ok: false,
      status: 401,
      error: "Your session is invalid. Sign in again."
    };
  }

  const adminEmail = (env.ADMIN_EMAIL || "").trim().toLowerCase();
  const userEmail = (user.email || "").trim().toLowerCase();

  if (!adminEmail) {
    return {
      ok: false,
      status: 500,
      error: "ADMIN_EMAIL is missing from Worker settings."
    };
  }

  if (!userEmail || userEmail !== adminEmail) {
    return {
      ok: false,
      status: 403,
      error: "Administrator access denied."
    };
  }

  if (!user.email_confirmed_at && !user.confirmed_at) {
    return {
      ok: false,
      status: 403,
      error: "The administrator email must be verified."
    };
  }

  return {
    ok: true,
    user
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;
    const pathname = url.pathname;

    const originCheck = checkOrigin(request, env);

    if (!originCheck.allowed && !originCheck.missing) {
      return json({ error: "Origin not allowed." }, 403);
    }

    // Public health check.
    if (method === "GET" && pathname === "/") {
      return json(
        {
          status: "online",
          service: "Skill Cartel AI",
          version: "3.0"
        },
        200,
        originCheck.origin
      );
    }

    if (!originCheck.allowed) {
      return json(
        { error: "An approved website origin is required." },
        403
      );
    }

    const origin = originCheck.origin;

    // Browser preflight.
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization",
          "Access-Control-Allow-Methods":
            "GET, POST, OPTIONS",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin"
        }
      });
    }

    // Required server configuration.
    const required = [
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY"
    ];

    for (const name of required) {
      if (!env[name] || !env[name].trim()) {
        return json(
          { error: "Server configuration is missing: " + name },
          500,
          origin
        );
      }
    }

    // Membership status endpoint.
    if (method === "GET" && pathname === "/access") {
      try {
        const token = (
          request.headers.get("Authorization") || ""
        ).replace(/^Bearer\s+/i, "");

        if (!token) {
          return json(
            { active: false, error: "Sign in required." },
            401,
            origin
          );
        }

        const user = await authUser(token, env);

        if (!user) {
          return json(
            { active: false, error: "Session expired. Sign in again." },
            401,
            origin
          );
        }

        const active = await activeGrant(user.id, env);

        return json({ active }, 200, origin);

      } catch (error) {
        console.error("ACCESS CHECK ERROR:", error);

        return json(
          { error: error.message || "Membership check failed." },
          500,
          origin
        );
      }
    }

    // All administrator routes require verified owner authentication.
    if (pathname.startsWith("/admin/")) {
      const admin = await requireAdmin(request, env);

      if (!admin.ok) {
        return json(
          { error: admin.error },
          admin.status,
          origin
        );
      }

      try {
        // Dashboard statistics.
        if (method === "GET" && pathname === "/admin/stats") {
          const stats = await getDashboardStats(env);

          return json(
            { ok: true, ...stats },
            200,
            origin
          );
        }

        // Customer list and email search.
        if (method === "GET" && pathname === "/admin/customers") {
          const search = (url.searchParams.get("search") || "").trim();
          const page = Math.max(
            1,
            Math.min(100, Number(url.searchParams.get("page")) || 1)
          );

          const perPage = Math.max(
            1,
            Math.min(100, Number(url.searchParams.get("per_page")) || 50)
          );

          const customers = await getCustomers(
            search,
            page,
            perPage,
            env
          );

          return json(
            {
              ok: true,
              customers,
              page,
              per_page: perPage
            },
            200,
            origin
          );
        }

        // Activate or update a customer's membership.
        if (method === "POST" && pathname === "/admin/grant") {
          const body = await request.json();

          if (
            typeof body.email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
          ) {
            return json(
              { error: "Enter a valid customer email." },
              400,
              origin
            );
          }

          let expiresAt = null;

          if (
            body.expires_at !== undefined &&
            body.expires_at !== null &&
            body.expires_at !== ""
          ) {
            const timestamp = Date.parse(body.expires_at);

            if (
              !Number.isFinite(timestamp) ||
              timestamp <= Date.now()
            ) {
              return json(
                { error: "Expiry must be a valid future date." },
                400,
                origin
              );
            }

            expiresAt = new Date(timestamp).toISOString();
          }

          const result = await grantByEmail(
            body.email.trim().toLowerCase(),
            expiresAt,
            env
          );

          return json(
            { ok: true, customer: result },
            200,
            origin
          );
        }

        // Revoke a customer's membership.
        if (method === "POST" && pathname === "/admin/revoke") {
          const body = await request.json();

          if (
            typeof body.email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
          ) {
            return json(
              { error: "Enter a valid customer email." },
              400,
              origin
            );
          }

          const result = await revokeByEmail(
            body.email.trim().toLowerCase(),
            env
          );

          return json(
            { ok: true, customer: result },
            200,
            origin
          );
        }

        return json(
          { error: "Administrator endpoint not found." },
          404,
          origin
        );

      } catch (error) {
        console.error("ADMINISTRATOR ERROR:", error);

        return json(
          { error: error.message || "Administrator request failed." },
          400,
          origin
        );
      }
    }

    // All remaining supported endpoints must use POST.
    if (method !== "POST") {
      return json(
        { error: "Method not allowed." },
        405,
        origin
      );
    }

    // AI API configuration.
    if (!env.AI_API_KEY) {
      return json(
        { error: "AI_API_KEY secret is missing." },
        500,
        origin
      );
    }

    try {
      // Verify customer login.
      const token = (
        request.headers.get("Authorization") || ""
      ).replace(/^Bearer\s+/i, "");

      if (!token) {
        return json(
          { error: "Sign in required." },
          401,
          origin
        );
      }

      const user = await authUser(token, env);

      if (!user) {
        return json(
          { error: "Your session is invalid. Sign in again." },
          401,
          origin
        );
      }

      // Verify active paid membership.
      const active = await activeGrant(user.id, env);

      if (!active) {
        return json(
          { error: "AI access is not active for this account." },
          403,
          origin
        );
      }

      const body = await request.json();

      if (
        !Array.isArray(body.messages) ||
        body.messages.length === 0 ||
        body.messages.length > 20
      ) {
        return json(
          { error: "Provide 1–20 conversation messages." },
          400,
          origin
        );
      }

      let total = 0;

      const messages = body.messages.map(message => {
        if (
          !message ||
          !["user", "assistant"].includes(message.role) ||
          typeof message.content !== "string" ||
          message.content.length > 15000
        ) {
          throw new Error("Invalid message format.");
        }

        total += message.content.length;

        return {
          role: message.role,
          content: message.content
        };
      });

      if (total > 60000) {
        return json(
          {
            error:
              "Conversation is too long. Start a new chat or attach a smaller file."
          },
          413,
          origin
        );
      }

      const base = (
        env.AI_BASE_URL ||
        "https://api.groq.com/openai/v1"
      ).replace(/\/+$/, "");

      const response = await fetch(
        base + "/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + env.AI_API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: env.AI_MODEL || "openai/gpt-oss-120b",
            messages: [
              {
                role: "system",
                content: SYSTEM_PROMPT
              },
              ...messages
            ],
            temperature: 0.7,
            max_tokens: 2000
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "GROQ API ERROR:",
          response.status,
          errorText
        );

        return json(
          {
            error:
              response.status === 429
                ? "AI service is rate-limited. Try again shortly."
                : "AI service error. Check Worker logs and model settings."
          },
          502,
          origin
        );
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;

      if (typeof reply !== "string" || !reply.trim()) {
        return json(
          { error: "AI returned an empty response." },
          502,
          origin
        );
      }

      return json({ reply }, 200, origin);

    } catch (error) {
      console.error("AI REQUEST ERROR:", error);

      return json(
        { error: error.message || "Unexpected server error." },
        500,
        origin
      );
    }
  }
};