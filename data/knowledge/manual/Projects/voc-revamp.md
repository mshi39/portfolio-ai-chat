
Project Name: Voice of the Customer (VOC) Admin Portal Revamp
Source URL: https://www.melissashi.com/work/voc-revamp
Source Type: Portfolio
Access: Password protected
Tags:
- SaaS
- Enterprise UX 
- User Research 
- Professional Work
Last updated: 2026-07-02

---

# Voice of the Customer (VOC) Admin Portal Revamp

---

## Overview

### Problem

Over time, the Voice of the Customer (VOC) Admin Portal evolved into a "Frankenstein" system. It was never designed for scale, and years of incremental feature additions without a cohesive information architecture resulted in:

- High customer support dependency
- Complex and fragmented user workflows
- Confusing information architecture
- Poor program tracking experience
- Limited scalability for future growth

### Solution

Completely modernize and restructure the Admin Portal with a scalable architecture and user-centered experience by:

- Aligning system setup with Product organization terminology
- Separating customer recruitment from "public previews"
- Providing visual previews throughout program creation
- Setting clear expectations for how customer-facing content will appear
- Communicating next steps and system status
- Guiding users through navigation, program states, and recommended actions
- Creating a scalable foundation aligned with UX best practices
- Enabling long-term product growth through a flexible system architecture

---

## My Role

**Lead UX Designer & UX Researcher**

- Decomposed the legacy system and redesigned its information architecture from the ground up.
- Conducted research to identify usability issues and opportunities.
- Established the platform architecture and end-to-end user flows.
- Delivered foundational interaction design before handing off to another designer for final visual refinement.

**Timeline:** August 2024 – December 2024 (5 months)

---

## What is Voice of the Customer?

Voice of the Customer (VOC) is a self-service platform that enables Program Owners to launch and manage customer testing programs, accelerating customer feedback and product innovation across Splunk Product & Technology teams.

### Platform Components

#### Internal Admin Portal

- **2,000+ internal users**
- Used by Program Owners to create and manage customer testing programs

#### External Customer Portal

- **12,000+ external users**
- Used by customers to discover testing opportunities and submit feedback

---

## MVP Scope

After aligning with the Product Manager, we focused the redesign on the **Admin Portal**, specifically the **Private Program workflow**, since it represented the most complex user journey and contained nearly every capability required by other program types.

---

## Primary Users

### Primary

- Product Managers
- Technical Program Managers

(Collectively referred to as **Program Owners**)

### Secondary

- Team members collaborating on shared programs

Programs created in the Admin Portal are ultimately surfaced to customers through the external Customer Portal.

---

## Design Process

1. Onboarded and gathered requirements
2. Refined scope across **8 design iterations**
3. Conducted **7 usability tests**
4. Facilitated **10+ stakeholder reviews**
5. Completed **3 engineering feasibility reviews**
6. Handed off mid-fidelity designs for final UI refinement

---

## Phase 1 — Understanding the System

### Research Activities

- Engineering walkthrough
- Product audit
- SME interviews
- User interviews

### Key Pain Points

#### 1. Mismatched Definitions

The system's definition of **Public Preview** differed from the Product organization's terminology.

**Impact**

- User confusion
- Time wasted seeking clarification
- Heavy SME dependency

---

#### 2. No Visibility Into Outcomes

Program Owners couldn't preview how programs would appear to customers.

**Impact**

- Hesitation to publish
- Low confidence
- Frequent support requests

---

#### 3. Poor Expectation Setting

Users weren't informed upfront about required materials.

**Impact**

- Bottlenecks
- Longer program creation time
- Interrupted workflows

---

#### 4. Poor Scalability

The legacy architecture couldn't support modern feature requirements.

**Impact**

- Poor usability
- Performance issues
- Increasing technical debt

---

### Design Principles

Based on research findings and usability testing, I established five guiding principles:

- Enable complete self-service
- Align platform terminology with Product teams
- Structure creation flow around the customer journey
- Always clarify next steps
- Build for long-term scalability

---

## Phase 2 — Provide Guardrails During Program Creation

### The Problem

The legacy experience provided little guidance.

Users were presented with every option simultaneously, without helping them understand:

- Which program type to choose
- What information was required
- How to build a successful testing program

Even worse, the program types available in the system didn't match real Product organization workflows.

---

### The Solution

I collaborated with SMEs and mapped Product & Technology lifecycle stages against testing needs.

The redesigned experience dynamically changes required content based on the selected program type.

**Benefits**

- Removes guesswork
- Reduces cognitive load
- Guides users through the appropriate workflow

---

## Phase 3 — Restructuring Public Programs vs. Recruitment

### The Problem

The legacy system conflated two completely different concepts.

#### Product Organization Definition

- Public Program = customer-facing testing program
- Recruitment = recruiting participants for either public or private programs

#### Legacy VOC Definition

Public Program represented both customer-facing programs **and** recruitment.

---

### Resulting Issues

#### Issue 1

All programs followed the same workflow regardless of purpose.

**Result**

Program Owners couldn't independently create public programs and instead had to submit requests to SMEs.

---

#### Issue 2

Recruitment existed as an entirely separate program.

**Result**

One testing initiative became two disconnected programs.

Consequences included:

- Fragmented tracking
- Duplicate effort
- No holistic project view

---

### Design Exploration

#### Option 1

Recruitment, Private Programs, and Public Programs are independent.

❌ Increased tracking complexity.

---

#### Option 2

Recruitment and Private Programs are sibling components.

❌ Introduced unnecessary complexity and difficult status management.

---

#### Option 3

Recruitment is a prerequisite for Private Programs.

❌ Too rigid for phased testing strategies.

---

#### Option 4 (Chosen)

Recruitment becomes an **optional step** within Private Program creation.

✅ Benefits

- Eliminated SME dependency
- Enabled true self-service
- Supported phased launches
- Unified initiative tracking
- Aligned terminology with users
- Accelerated testing cycles

---

## Phase 4 — Help Program Owners Think Like Customers

### The Problem

Creating programs felt like a black box.

Program Owners couldn't see how their inputs would appear in the customer-facing portal until launch.

This resulted in:

- Low confidence
- Frequent support requests
- Trial-and-error workflows

---

### The Solution

#### Visual Preview

Added previews throughout program creation so users could immediately understand how customers would experience their content.

---

#### Customer-Journey-Based Workflow

Reorganized the creation process to mirror the customer's experience.

This helped Program Owners naturally think from the customer's perspective while building programs.

---

#### User Feedback

> "This is great! I like this a lot. Even though it's not reflecting real-time, it gives me a good idea what shows and how it shows up… this is a great feature."

— Splunk Product Manager

---

## Phase 5 — Reducing Bottlenecks

### Initial Approach

Initially, users could only proceed after completing every required field in the current step.

Usability testing quickly revealed this created unnecessary friction.

---

### Research Findings

Program Owners rarely had every required asset available upfront.

Dependencies included:

- Legal approval
- Engineering deliverables
- Installation packages
- Custom agreements

Users wanted to begin work while waiting on external teams.

---

### The Solution

#### Preparation Checklist

Introduced an upfront information model listing materials users should prepare before beginning.

---

#### Step Introductions

Added informational pages before each major stage to explain:

- Purpose
- Required assets
- Expectations

---

#### Flexible Navigation

Users can freely move between sections.

Only launching a program requires all mandatory fields to be completed.

---

## Phase 6 — Designing for Scalability

### Legacy Problems

#### Modal-Based Workflow

Program creation occurred inside popup dialogs.

This caused:

- Limited working space
- Poor readability
- Difficult data entry

---

#### Horizontal Tabs

The creation flow relied on horizontal tabs.

Problems included:

- Limited scalability
- Navigation issues
- Poor information density

---

#### Additional Issues

- Creation organized by file type rather than customer journey
- No draft-saving capability
- Inconsistent UX patterns
- High learning curve

---

### The Solution

#### Full-Page Stepper

Created a guided, full-page experience better suited for complex content creation.

---

#### Collapsible Side Navigation

Replaced horizontal tabs with a scalable side navigation that:

- Maximizes workspace
- Improves navigation
- Supports future expansion

---

#### Consistent Design Patterns

Standardized interactions across the platform to improve predictability and reduce training needs.

---

#### Draft Saving

Partnered with engineering to redesign the database structure so users could save draft programs.

This better reflected real-world workflows.

---

## Results

### Business Impact

- **24% increase** in program creation
  - 25 → 31 programs over six months

- **52% increase** in user satisfaction
  - 2.9 → 4.4

- **77.1 SUS score** in first-round usability testing

- Established the foundation for the final polished experience, which achieved an **84.2 SUS score**

---

### User Testimonials

> "This (visual snapshot) is awesome. It's really helpful for the person doing it to envision it."

— Splunk Product Manager

> "I was looking at the new portal and it looks amazing."

— Splunk Stakeholder
```
