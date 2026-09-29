# Magician's School - Frontend

Magician's School is a full-stack IBA admission-preparation platform for students in Bangladesh. This repository contains the public website and the student and administrator interfaces. It connects to the [Magician's School backend](https://github.com/raf0670/math-magician-server) for authentication, enrollment, classes, examinations, analytics, competition data, and payments.

## Product overview

The platform combines the main parts of an admission-preparation workflow in one responsive application:

- Public landing pages for the general programs and the dedicated Math Course
- Registration, login, password recovery, and profile management
- General and Math-specific student workspaces
- Live classes, protected recordings, and learning resources
- Topic-based practice papers and difficulty-based quizzes
- Scheduled assignments, assessments, and competitive live exams
- Timed exam sessions with locally persisted answers and deadlines
- Scorecards, answer reviews, analytics, ranks, badges, and leaderboards
- House competition for Gryffindor, Hufflepuff, Ravenclaw, and Slytherin
- Enrollment, discount, installment, upgrade, and PayStation checkout flows
- Administrative tools for classes, exams, assignments, submissions, and enrollments

Math membership is independent from general website membership. A student may have general access, Math access, or both, and the navigation adapts to the permissions returned by the API.

## Technology

- [Next.js 16](https://nextjs.org/) with the App Router and Turbopack
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/) and [DaisyUI 5](https://daisyui.com/)
- [Framer Motion](https://www.framer.com/motion/) for interaction and animation
- [Recharts](https://recharts.org/) for performance visualization
- Lucide and React Icons
- Native `fetch` through a shared API client

## Main application areas

| Area | Routes | Purpose |
| --- | --- | --- |
| Public website | `/`, `/about`, `/more-faqs`, `/math-course` | Product information, programs, instructor details, FAQs, and Math Course marketing |
| Authentication | `/login`, `/register`, `/forgot-password`, `/reset-password` | Account creation and recovery |
| Enrollment | `/enroll`, `/payment/details`, `/payment/checkout`, `/payment/success`, `/payment/failed` | Student details, plan selection, pricing, and payment status |
| General dashboard | `/dashboard/*` | Classes, recordings, resources, exams, practice, analytics, leaderboard, and profile |
| Math dashboard | `/dashboard/math/*` | Math classes, recordings, live exams, results, and leaderboard |
| Administration | `/dashboard/admin/*` | Enrollment review, class scheduling, exam publishing, assignments, and moderation |

The dashboard uses a desktop sidebar and a horizontally scrollable mobile navigation bar. Full-screen exam routes remove the standard dashboard spacing to give the question interface more room.

## Local development

### Prerequisites

- Node.js 20 or newer
- npm
- A running instance of the backend API

### Installation

```bash
git clone https://github.com/raf0670/math-magician-client.git
cd math-magician-client
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_PROFILE_IMAGE_MAX_MB=5
```

`NEXT_PUBLIC_API_URL` may point to the backend origin with or without a trailing `/api`; the shared client normalizes both forms.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint across the project |
| `node scripts/mathBrowserSmoke.cjs` | Run the Math Course browser smoke checks after a build |

The smoke script uses an installed Microsoft Edge browser and mocked API responses. It checks important desktop and mobile enrollment, authentication, dashboard, and administration journeys. Set `MATH_TEST_BROWSER` when Edge is installed in a non-standard location. Screenshots are written to the ignored `.math-browser/` directory.

## API and session behavior

The shared client in `src/lib/api.js`:

- Adds the JWT bearer token to protected requests
- Stores the token and current user snapshot in browser local storage
- Clears the local session when the API returns `401`
- Applies request timeouts and limited submission retries
- Generates idempotency identifiers for retake submissions
- Preserves pending enrollment context across login and registration

The server remains authoritative for access, exam timing, scoring, prices, discounts, and payment status. Browser values are presentation and continuity aids only.

## Exam experience

The exam engine supports two-to-five-option questions, subject navigation, option elimination, unanswered-question tracking, and automatic submission. Answers and the attempt deadline are persisted locally so a refresh does not restart a timed attempt. Official scheduled results and solutions remain unavailable until the backend releases them.

Practice and retake attempts support learning but remain separate from official competition results. Leaving an active exam tab can submit the attempt with a `tab_switch` reason, while timer completion submits with `timer_expired`.

## Validation

Run the standard checks before opening a pull request:

```bash
npm run lint
npm run build
```

The production build downloads Google Sans and Geist Mono through `next/font`, so the first build requires access to Google Fonts.

## Known external dependencies

- Protected recording and resource links are supplied by the backend catalog.
- Empty Math recording links intentionally appear as **Coming soon**.
- PayStation checkout requires a correctly configured backend and valid gateway credentials.
- Live classes open administrator-provided Zoom links.

## Related repository

- Backend API: [raf0670/math-magician-server](https://github.com/raf0670/math-magician-server)
