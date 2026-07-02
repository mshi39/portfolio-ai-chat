
Project Name: Operations Information Hub Design
Source URL: https://www.melissashi.com/work/operations-information-hub
Source Type: Portfolio
Access: Not password protected
Tags:
- Web App 
- UX Design 
- UX Research
- Professional Work
Last updated: 2023-07-02

---

# Operations Information Hub

---

## Overview

**Timeline:** May 2021 – December 2022

A web-based operations information hub for an oil production site that centralized data from **10+ operational systems**, streamlined workflows, and increased operator time spent on productive work instead of searching across disconnected tools.

---

## My Role

**UX Design Lead**

### Team

- Senior UX Designer
- Senior Service Designer
- UX Designer

---

## Employer

**ExxonMobil Information Technology**

---

## Problem

Operations teams relied on **30+ applications** to perform daily work, often requiring multiple tools to complete a single workflow.

Because these systems were siloed, operators frequently had to manually transfer information between applications, resulting in:

- Inefficient workflows
- Duplicate work
- Time lost searching for information
- Less time available for well surveillance and production optimization

---

## Solution

We designed a web-based operations hub that centralized information from multiple operational systems into a single experience.

The platform provided role-based interfaces so operators only saw information relevant to their responsibilities.

After the MVP launched in **March 2023**, the product:

- Reduced training time from **days to hours**
- Consolidated information from **10+ systems**
- Replaced an existing in-house application
- Established a foundation for replacing additional operational tools

---

# Background

The project aimed to create a true **single-pane-of-glass** for operational data.

Because different operational roles had distinct responsibilities, the MVP focused specifically on **field operators**, with a mobile-first design optimized for tablets.

Although the vision was compelling, several significant challenges emerged:

- Business stakeholders lacked confidence in the project
- The team did not yet understand operators' mental models
- Critical offline inefficiencies had been overlooked

---

# Obstacle 1 — Building Stakeholder Confidence

## Step 1 — Visualize the Vision

Business stakeholders served as both project sponsors and subject matter experts.

Many questioned whether the team could successfully deliver a usable product.

To build confidence, my colleague and I created a series of storyboards illustrating how a unified operations hub could improve operators' daily work.

I:

- Co-created the story concepts
- Illustrated the storyboards
- Helped align the project's long-term vision

To make the concept even more tangible, I also created an early mockup showing what a centralized operations dashboard might look like.

---

## Step 2 — Research Operators' Daily Work

To gather requirements, my colleague and I conducted **seven operator interviews**.

Our goals were to:

- Understand operators' daily workflows
- Identify pain points
- Catalog required operational data
- Document the tools supporting each workflow

We alternated between interviewing and note-taking throughout the sessions.

Afterward, I led the qualitative analysis.

### Key Findings

#### Workflow Complexity

Multiple tools performed similar functions, making workflows unnecessarily complicated.

#### Data Silos

Many workflows required switching between applications because data wasn't shared.

#### Unstable Infrastructure

Poor internet connectivity reduced the reliability of digital tools.

#### Poor Software Experience

Many third-party applications were:

- Slow
- Required frequent logins
- Difficult to use

To build empathy across the project team, we presented these findings alongside a prioritization of operational tools.

We also created a simple **Day-in-the-Life** journey map to illustrate a typical operator's workday.

---

## Step 3 — Validate with Mockups

Using research findings, we designed mockups that:

- Validated requirements
- Facilitated conversations with stakeholders
- Bridged communication between Operations and IT

---

## Outcome

### Turning Skeptics into Supporters

Our research-driven prototypes demonstrated a deep understanding of operator needs.

Business stakeholders became enthusiastic supporters of the project.

One stakeholder remarked:

> "I haven't been this happy since my first child was born."

They explained they had dreamed of a solution like this for more than ten years.

Their renewed confidence resulted in continued sponsorship and active participation throughout the project.

---

# Obstacle 2 — Understanding the Operator Mental Model

## Step 1 — Test Information Architecture

Operators interact with large amounts of operational data every day.

The key question became:

> Do operators think in terms of tasks, data types, or something else?

We tested multiple information architectures through usability studies.

### Round One

We explored organizing information by:

- Task
- Data type
- Other conceptual structures

Research showed these approaches didn't match operator expectations.

Instead, operators naturally organized work around **pads**, since nearly every task was pad-centric.

---

### Round Two

We tested two new approaches:

- Selecting a work phase first
- Selecting an operational entity (pad, well, etc.) first

### Key Findings

Operators preferred:

- Viewing critical information together in context
- Seeing information organized around operational runs
- Prioritizing context over discoverability

---

## Step 2 — Redefine "Single Pane of Glass"

We explored multiple integration strategies, including:

- Embedded applications
- Opening source tools in new tabs
- Replacing legacy applications
- Virtual embedded windows

Initially, the platform was expected to be **read-only**.

Our proposed solution launched source applications within a virtual window whenever operators needed to complete actions.

Although technically feasible, usability testing revealed major problems.

### Research Findings

Operators expected to complete work directly inside the new application.

Launching external tools:

- Interrupted workflows
- Recreated existing frustrations
- Failed to deliver the promised single-pane experience

Using research findings, we successfully convinced stakeholders to support **read-and-write integrations** whenever APIs were available.

---

## Step 3 — Restructure Around Action

Once write capabilities became possible, I redesigned the experience to support operational actions directly inside the application.

One opportunity involved redefining the concept of a **task**.

Historically, action items were scattered across multiple systems under different names.

I explored whether these could all be unified into a single task model.

After testing multiple interaction patterns, operators preferred:

- Slide-out panels for responding to tasks
- Organizing tasks by task type instead of source application

---

## Outcome

### Aligning with Operator Mental Models

Through multiple rounds of usability testing, we established the platform's foundational information architecture.

Making these decisions before development helped:

- Reduce development effort
- Create a more consistent experience
- Lower long-term maintenance costs
- Replace four existing operational applications

Training outcomes demonstrated the success of the design.

Where previous applications often required **weeks** to learn, operators reported needing only **30 minutes** of walkthrough before becoming productive.

Many described the product as **"very easy to use."**

---

# Obstacle 3 — Uncovering Offline Inefficiencies

## Step 1 — Contextual Inquiry

As the project expanded into well-testing workflows, I proposed conducting contextual inquiry at an operational site.

Together with another researcher, I spent **two weeks** observing operators and specialists performing their daily work.

In addition to digital pain points, we uncovered several overlooked offline inefficiencies.

### Major Discovery

Operators still tracked well-test results manually using pen and paper.

This created several issues:

- Duplicate work
- Human error
- Poor visibility into historical trends

Although results already existed digitally, operators couldn't access them during their workflows.

---

## Step 2 — Expand Product Scope

Recognizing the opportunity, I designed an early concept showing historical well-test trends inside the platform.

Although outside the original project scope, the visualization demonstrated significant value.

Stakeholders quickly supported expanding the MVP to include historical well-test data.

They also suggested additional improvements, including:

- Displaying test types
- Adding supporting production metrics
- Providing both chart and table views

---

## Step 3 — Iterate the Experience

Working closely with my colleague, we refined the visualization through multiple design iterations.

Final improvements included:

- Colorblind-friendly visualizations
- Additional operational metrics
- Optional data layers
- Tabular data view
- Tooltips for precise readings
- Shape and shading distinctions for accepted versus rejected tests

---

## Outcome

The research uncovered inefficiencies that operators had simply accepted as part of their daily work.

By visualizing these hidden opportunities, we successfully expanded the project's scope.

During usability testing, operators praised:

- Having historical well-test data immediately available
- Visual trend analysis
- Easier identification of problematic wells

The well-test visualization became an officially approved roadmap feature and was incorporated into future development plans.