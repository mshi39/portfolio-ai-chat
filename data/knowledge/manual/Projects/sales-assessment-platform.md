
Project Name: Sales Assessment Platform AI Integration
Source URL: https://www.melissashi.com/work/sales-assessment-platform-ai-integration
Source Type: Portfolio
Access: Password protected
Tags:
- AI Product Design
- Sales
- Design Consultancy
- Rapid Prototyping
- Professional Work
Last updated: 2023-07-09

---

# Sales Assessment Platform AI Integration

## Reimagining an Internal Sales Platform from AI-Assisted Automation to AI-Guided Collaboration

> **Project at a Glance**

| | |
|---|---|
| **Role** | Design Consultant (UX Strategy, AI Interaction Design, Prototyping) |
| **Timeline** | 40 hours over 3 weeks |
| **Client** | 3 Business Value Advisors |
| **Goal** | Transform a legacy sales assessment platform into an AI-powered experience that accelerates assessment creation while keeping sales representatives in control. |

### Outcome

- Reframed the product vision from **AI as an optional feature** to **AI as an integrated workflow partner**.
- Influenced AI interaction patterns across multiple assessment workflows.
- Helped shape the long-term AI product strategy.
- Multiple concepts were adopted into the team's working prototype.

---

# Introduction

## Background

The **Splunk Value Platform (SVP)** is an internal sales enablement platform used to create customer-facing artifacts such as value stacks, business cases, and sell decks.

Following the Cisco–Splunk merger, the original product team was disbanded, leaving the platform unsupported for nearly two years.

When Sales leadership decided to revive the product, a small team of Business Value Advisors began rebuilding it using AI-assisted prototyping.

While reviewing their early vision, I noticed something important:

> **The platform contained AI—but it wasn't truly designed around AI.**

Instead of changing how sales representatives worked, AI had simply been layered onto an existing manual workflow.

That became the opportunity.

# The Challenge

The current SVP workflow followed a waterfall process.

```
Customer Information
        ↓
Manual Assessment
        ↓
AI Generate
        ↓
PowerPoint
```

## Current Issues

- AI appeared as an optional feature instead of a workflow partner.
- AI generated outputs without guiding user thinking.
- Generated content became a dead end.
- PowerPoint outputs still required extensive manual cleanup.
- The prototype UI wasn't aligned with the Cisco Design System.

## Design Opportunities

1. Move AI from optional feature to workflow driver.
2. Design AI as a collaborator instead of a generator.
3. Blend AI generation with human review.
4. Expand outputs beyond PowerPoint.
5. Align with the Cisco Design System.

# My Design Principles

Rather than asking: Where can we add AI? I reframed the problem as:

> **How can AI collaborate with sales representatives throughout the assessment process?**

- 🤝 AI should guide—not replace—users.
- 🧠 Collect context once and reuse it.
- ✏️ AI outputs should remain editable.
- 💬 Use conversation only where it creates value.
- 📈 Outputs should continue creating value after generation.

# Selling a New Vision: AI Collaboration Model

The business team already had a working prototype and a clear vision.

Instead of writing a proposal, I built a high-fidelity interactive prototype to demonstrate a different future.


## Lead with AI

Before: 
AI appeared as another button users could optionally click.

After:
AI appeared at the front of the workflow to make AI feel like the primary way to begin an assessment and encourage users to leverage the efficiency of AI assistance. 

Opportunity:
Not every assessment type is best suited for a chat-first experience. In some contexts, manual controls may be more efficient than open-ended conversation.
This feedback helped refine the strategy: AI should not replace structured workflows. It should appear where conversation, guidance, or synthesis creates real value.

## Human Review Before Generation

Before:
AI generated final PowerPoint slides immediately after receiving meeting notes. 

After:
AI first produced editable recommendations that sales representatives could review, refine, and approve before generating customer-facing deliverables.
This kept humans accountable while letting AI remove repetitive work.

## Cisco Design System

Before:
The original prototype relied heavily on AI-generated styling.

After:
I redesigned the experience using the Cisco IT Design System to create:
- familiar internal experiences
- development consistency
- reduced implementation effort
- enterprise credibility

## Early Impact

The discussion shifted from:

> "How should we add AI?"

to

> "Where else can this interaction model be applied?"

The team invited me to continue supporting the project as an AI design consultant.

---

# Expanding the Experience Across the Platform

## Customer Context as the Foundation

Sales representatives repeatedly entered customer information throughout different assessments.
I redesigned the home experience around reusable customer context.
The platform could now:
- verify customer information once
- reuse it across assessments
- provide AI with richer context
- reduce repetitive work


## Native Gong Integration for Meeting Intelligence

```text
Gong → Transcript → AI Analysis → Assessment
```

Instead of manually downloading transcripts and uploading files, the platform could pull customer conversations directly from Gong.
This eliminated unnecessary work while improving AI's understanding of customer needs.


## AI Co-pilot at Decision Points

Rather than displaying a permanent chat window, AI appeared only when users needed help making strategic decisions. Such as shaping the sales narrative and refining talking points. 
The interaction became purposeful instead of distracting.

## Clarifying Before Generating

Instead of confidently generating weak outputs from incomplete information, AI proactively asked follow-up questions and clarifications.
These clarification moments increased trust while improving output quality.

## Web-Based Assessment Outputs

Instead of producing another PowerPoint deck, I explored generating branded web experiences.
This unlocked new possibilities:
- flexible layouts
- richer storytelling
- easier sharing
- customer engagement analytics
- visibility into what customers actually viewed

The concept also aligned with emerging industry practices for personalized customer experiences.

## Additional Enhancements

Beyond the core AI workflow, I also proposed 
- Linking assessments directly with sales opportunities 
- Placing business case results on the same level as business case configuration

This would ensure that 
- Each assessment is connected to the right opportunity context, making the platform easier to organize, track, and analyze over time.
- User can see in real-time how configuration affects business case annual value.

# Defining the Long-Term Product Vision

The first prototype changed how AI interacted with users. The second expanded AI throughout the platform. During the next design review, I shifted my attention from individual workflows to the long-term architecture of the product.
SVP should not only help sales representatives generate assessments. It should help them create tailored, reusable, and customer-accessible sales experiences.

## Layered Customer Context

Through discussion with stakeholders, we concluded that not all customer context belongs at the same level.

Instead of maintaining a single context model, we aligned on separating information into:
• Account Context
• Assessment Context
On the account level, the context includes information fundamental to all assessments, such as customer priorities, pain points, and technical maturity, which are further differentiated based on product category. 
Assessment context holds context that’s only relevant to a particular assessment, such as usage rate of Splunk products. 
By making profile-based context the foundation, the platform could generate assessment outputs that are more relevant to the specific customer audience.

## Web Becomes the Product

In earlier iterations, I explored HTML as an alternative output format. In the final iteration, I pushed that idea further by treating the branded website as the ultimate delivery destination for assessment outcomes.
Instead of generating isolated files, SVP could create a single customer-facing web experience that serves as the source of truth for final sales content.

This direction creates several advantages:
- customers can access all final assessment content in one place
- sales teams can avoid version-control issues across multiple decks and files
- outputs can support richer storytelling than PowerPoint
- content can be updated more easily after follow-up conversations
- engagement tracking can help sales representatives understand what customers reviewed

This shifted the output strategy from: Generate a deck to: Create a living customer-facing assessment experience

## Onboarding as AI Enablement

Because the redesigned SVP experience depends heavily on customer context, onboarding became an important part of the AI strategy.
If users skip or poorly complete context setup, AI output quality suffers.

I designed a step-by-step product tour to teach users how to generate quality inputs. The tour would:
- introduce major platform capabilities
- explain why customer context matters
- show how better context improves AI-generated assessments
- encourage users to complete setup before starting assessment workflows
- expose new capabilities that users might otherwise miss

This was not just a usability enhancement. It was a quality-control mechanism for the AI experience.
The better the onboarding, the better the inputs. The better the inputs, the better the AI outputs.

## Final Product Vision

Account Context
        ↓
Assessment Context
        ↓
Meeting Intelligence
        ↓
AI Collaboration
        ↓
Human Review
        ↓
Assessment Creation
        ↓
Branded Customer Website
        ↓
Customer Engagement Insights

---

# Outcome

## From Vision to Adoption

During subsequent reviews, the team began incorporating several concepts into their vibe-coded product:

- ✅ Context side navigation
- ✅ Embedded AI chat workflow
- ✅ Opportunity linking
- ✅ Results website
- ✅ Cisco Design System

## Product

Reframed SVP from AI-assisted automation to AI-guided collaboration.

## AI Strategy

Grounded AI in reusable customer context, meeting intelligence, and collaborative workflows.

## Business

Expanded outputs into branded, measurable customer experiences.

## Stakeholder Impact

The final design review produced an important architectural decision: foundational customer information belongs at the account level, while assessment-specific inputs should be configured within each assessment. This refinement strengthened the long-term product model.

# Reflection

This project reinforced an important lesson about designing AI products:
The value of AI is not determined by how visible it is. It is determined by whether it appears at the right moment, with the right context, to help users make better decisions.
Designing for AI is not about adding a chatbot to every screen. It is about understanding the workflow, identifying where people need guidance, and deciding when AI should lead, when it should support, and when humans should remain fully in control.
The third iteration also helped clarify another principle:
AI output quality starts before generation.
If the system does not help users provide the right context, the AI cannot produce truly useful outputs. That is why profile-based customer context, onboarding, and web-centered delivery became critical parts of the product vision.
The shift—from designing AI features to designing an AI collaboration platform—became the foundation for every recommendation I made throughout this project.
