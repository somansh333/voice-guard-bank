# SentinelPay

A voice-first AI banking assistant that protects users from scams, deepfake voice fraud, and coerced transactions. Built with React, Vite, TypeScript, Supabase Edge Functions, and shadcn/ui.

---

## What it does

SentinelPay lets users interact with a banking assistant through voice or text, while a three-signal fraud detection engine evaluates every interaction in real time:

| Signal | How it works |
|--------|-------------|
| **Scam phrase detection** | NLP keyword matching flags common social-engineering phrases (OTP requests, KYC urgency, account-blocked threats) and instantly raises the risk level to HIGH |
| **Voice liveness / anti-deepfake** | A challenge-response system asks the user to repeat a random phrase; a liveness score < 50 blocks the transaction and triggers a guardian alert |
| **Transaction risk scoring** | Transfer requests are automatically elevated to MEDIUM risk and require OTP verification before proceeding |

When HIGH risk is detected, the **Guardian Mode** notifies a trusted contact and pauses sensitive actions.

---

## Tech stack

- **Frontend** — React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Radix UI
- **Routing** — React Router v6
- **Backend** — Supabase (Auth, Edge Functions)
- **State / data** — TanStack Query
- **Voice** — Web MediaRecorder API → Supabase Edge Functions

---

## Project structure

```
src/
  pages/
    Index.tsx          # Landing page
    Auth.tsx           # Login / sign-up
    Assistant.tsx      # Main chat UI and risk orchestration
  components/
    VoiceButton.tsx    # MediaRecorder, transcription, liveness upload
    RiskScoreCard.tsx  # Live LOW / MEDIUM / HIGH status indicator
    GuardianAlert.tsx  # High-risk modal with guardian contact details
    OTPModal.tsx       # OTP verification step for MEDIUM-risk actions
supabase/functions/
  voice-transcribe/    # Speech-to-text (mock / Whisper-ready)
  voice-liveness/      # Challenge-response liveness scoring
  nlu-intent/          # Intent classification
  risk-evaluate/       # Risk score aggregation
  transaction-execute/ # Transaction execution with risk gate
  mock-banking/        # Mock balance and transaction data
```

---

## Quick start

### Prerequisites
- Node.js 18+
- A Supabase project (free tier works)

### 1. Clone and install

```bash
git clone <repo-url>
cd voice-guard-bank
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Set to false to skip ML calls and use hardcoded fallback menu
VITE_USE_ML=true
```

### 3. Run the dev server

```bash
npm run dev
```

### 4. (Optional) Run Edge Functions locally

```bash
# Requires Supabase CLI: https://supabase.com/docs/guides/cli
supabase start
supabase functions serve
```

### Windows (PowerShell)

```powershell
cp .env.example .env.local
notepad .env.local
npm install
npm run dev
```

---

## ML-free / offline mode

Set `VITE_USE_ML=false` in `.env.local` to bypass all model calls. The assistant switches to a fixed menu of actions (Check Balance, Recent Transactions, Transfer Money, Report Scam) backed by the mock-banking Edge Function. Basic functionality also works offline via service worker.

---

## Fraud detection — signal details

### 1. Scam phrase detection (`Assistant.tsx`)
Keyword scan on every message. Triggers on: `otp`, `kyc`, `blocked`.  
Result: risk → HIGH, guardian alert shown, transaction paused.

### 2. Voice liveness (`VoiceButton.tsx` + `voice-liveness` function)
On every voice input the user is given a random challenge phrase (e.g. "green mango"). The recording is sent to `voice-liveness` which returns a `score` (0–100). Score < 50 blocks the action.  
Result: risk → HIGH, toast warning, guardian alert shown.

### 3. Transaction pattern (`Assistant.tsx`)
Any transfer intent raises risk to MEDIUM and triggers OTP verification before the action executes.

---

## Supabase Edge Functions

| Function | Purpose |
|----------|---------|
| `voice-transcribe` | Converts audio to text (mock; drop-in for Whisper) |
| `voice-liveness` | Scores liveness from challenge + transcript |
| `nlu-intent` | Classifies user intent from transcript |
| `risk-evaluate` | Aggregates all signals into a final risk score |
| `transaction-execute` | Executes a transfer after risk gate passes |
| `mock-banking` | Returns fake balance and transaction history |

---

## Security notes

- Never commit secret keys. All sensitive operations go through server-side Edge Functions using the Supabase service role key (never exposed to the client).
- The liveness and stress detection implementations are mocked scaffolds — replace with a real speaker-verification model before production use.
- OTP flow is a UI prototype only; wire it to a real SMS/TOTP provider before deploying.

---

## Roadmap

- [ ] Replace mock liveness with a real speaker-verification model (e.g. Resemblyzer, Azure Speaker Recognition)
- [ ] Add stress / coercion detection from voice prosody
- [ ] IndexedDB queue for offline transaction requests
- [ ] Real ASR integration (OpenAI Whisper, AssemblyAI, or on-prem)
- [ ] Guardian SMS/WhatsApp notifications via Twilio
- [ ] Hinglish / Indian-English accent fine-tuning

---

## License

Prototype code for demonstration purposes. Not production-ready without proper security hardening, model validation, and compliance review.
