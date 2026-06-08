Building the core product first is a great move. It lets us craft the actual platform experience while we still have full momentum, and it tells us exactly what data fields our authentication and database schemas will need down the line.

To keep things smooth and completely under control, we are going to divide Route B into highly atomic, manageable modules. We will design, code, and polish **exactly one small piece at a time** before moving to the next.

Here is the master roadmap for **Route B: The Interactive Student Hub**.

---

## 🗺️ Route B Execution Blueprint

### Phase 1: The Core Platform Layout Shell

* **Step 1.1:** Build the global Sidebar layout component (Responsive navigation framework with a consistent premium deep aesthetic).
* **Step 1.2:** Build the shared Topbar dashboard navigation header (Dynamic greetings, streak tracking, notification hub, and user identity mock profile placeholders).

### Phase 2: The Main Dashboard View (`/dashboard`)

* **Step 2.1:** Create the Welcome & Action Hero banner card (Quick link to jump straight into the next active live class or scheduled mock test).
* **Step 2.2:** Build the Interactive Performance Grid (Visual cards tracking completed mocks, overall average accuracy, and time-per-question metrics).
* **Step 2.3:** Build the Today's Live Schedule feed timeline component.

### Phase 3: The Live Class Arena Layout View (`/classes`)

* **Step 3.1:** Create the interactive live streaming deck split-screen layout (Embedded active video player frame side-by-side with a resource-sharing tab).
* **Step 3.2:** Build the Archived Video Class Vault (Categorized list of previous class video items organized by topic: Quant, English, Analytical).

### Phase 4: The Mock Test Engine Environment (`/mock-tests`)

* **Step 4.1:** Build the Active Test Dashboard directory interface showing lists of Available, Upcoming, and Completed full mock exams.
* **Step 4.2:** Design the Live Exam Exam Engine View (Split screen setup: Question item sheet on the left, interactive choice bubble selection grid on the right, floating persistent countdown test timer).
* **Step 4.3:** Build the Analytical Score Analysis Sheet (Detailed post-exam overview with question breakdowns, correct solutions, and peer percentile rankings).

---

## 🔍 A Few Fast Questions Before We Start Step 1.1

To make sure the design fits perfectly into your codebase immediately, I have three quick questions about how you want to organize this structure:

1. **Routing Setup:** Are you using Next.js **App Router** paths for this dashboard section? If yes, should we put these under an independent `(dashboard)` route group layout framework (e.g., `app/(dashboard)/dashboard/page.jsx`) so they don't share the landing page navigation headers/footers?
2. **Icons Pack:** We used `lucide-react` heavily on the landing page layout deck. Are you comfortable keeping `lucide-react` as our primary icon hub for the navigation links and utility badging?
3. **Responsive Action Strategy:** On small mobile views, do you prefer a slide-out hamburger sidebar canvas panel drawer, or a clean bottom-docked app bar system?

Once you give me your thoughts on these, we will kick off **Step 1.1 (The Sidebar Component Structure)** immediately!