# SPENDGUARD AI 🛡️
> **"Intelligent Expense Management & Explainable Anomaly Detection"**  
> *Prototype developed for the IEEE Vibe-Coding Hackathon*

---

## 🚀 Live Demo Quickstart

SPENDGUARD AI is built with a **100% local-first architecture**. It requires **zero external cloud APIs**, **zero OpenAI API keys**, and has **no external runtime dependencies**. All statistical baseline calculations and anomaly classifications run client-side.

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Then open your browser to **`http://localhost:3000/`** (or the port Vite outputs).

---

## 🌟 How This Differs From Standard Expense Trackers

| Dimension | Traditional Expense Apps | SPENDGUARD AI |
| :--- | :--- | :--- |
| **Core Question** | *"Where did my money go?"* | *"Is this spending normal for me, why, and how risky is it?"* |
| **Transaction Analysis** | Static ledger record: *"₹8,750 spent at TechZone"* | Behavioral intelligence: *"₹8,750 is 3.4× above your personal electronics baseline (Score 89/100, Critical)"* |
| **Baselines** | Generic hardcoded rules or arbitrary category caps | Adaptive **personal baselines** learned dynamically from user historical frequency, mean, median, and stdDev |
| **Explainability** | Opaque black box or binary flag | **8-Factor decomposition** (Amount, Merchant novelty, Category spike, Frequency, Time/day, Duplicates, Velocity, Budget impact) |
| **Duplicate & Velocity** | None or discovered days later | Real-time identical charge detection (<15 mins) and 45-minute burst velocity surge alerts |
| **Forecasting** | Passive alerts after you've already overspent | **"What-If?" Simulation sandbox** to forecast budget impact before spending |
| **Privacy** | Cloud sync & remote server dependence | **Local-first browser sandbox** with zero external API data transmission |

---

## 🎯 2–3 Minute IEEE Hackathon Judge Walkthrough

1. **Step 1: Executive Dashboard**
   - Review executive KPIs: Total Outflow, Budget Utilization, and Savings Trend.
   - Inspect the **Monthly Spending Trajectory** SVG chart showing the Oct 7 velocity surge.
   - Check the **AI Behavioral Insights** panel highlighting shopping escalation and weekend spending shifts.

2. **Step 2: Anomaly Center & Flagship Case**
   - Click **Anomaly Center** in the sidebar.
   - Click the flagship case: **TechZone Electronics — ₹8,750 (Score 89/100 • Critical)**.
   - Review the **Multi-Factor Decomposition**:
     - *Amount Deviation:* 30/30 (3.4× above your personal electronics baseline of ₹2,570)
     - *Merchant Novelty:* 15/15 (Merchant has never appeared in user history)
     - *Category Spike:* 12/15 (Electronics spending is 78% above typical monthly pattern)
     - *Time & Velocity:* Off-hour transaction detected
   - Review the **Recommended Action** and test the interactive resolution buttons (*Mark as Normal*, *Add Merchant to Trusted*).

3. **Step 3: Interactive Real-Time Evaluation**
   - Click **"+ New Expense"** in the top navigation bar.
   - Click one of the judge demo scenario presets (e.g., **"Duplicate Check: ₹1,450 Starbucks"** or **"Outlier: ₹9,499 Electronics"**).
   - Click **"Analyze & Record Expense"** and observe the instant real-time anomaly score and decomposition card!

4. **Step 4: Predictive What-If Simulation**
   - Navigate to **"What-If Simulation"** in the sidebar.
   - Slide the amount to ₹5,000 in Shopping or click **"Shopping ₹5,000"**.
   - See the real-time forecast: New budget utilization, projected month-end spend, and predicted anomaly score.

5. **Step 5: Evaluator Briefing**
   - Click **"Why SpendGuard?"** or the IEEE Hackathon banner to view the side-by-side architectural differentiation matrix.

---

## 📐 Technology Architecture

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (custom fintech dark palette, glassmorphism cards, glowing indicator tokens)
- **Icons:** Lucide React
- **Anomaly Engine:** Deterministic multi-factor scoring algorithm (`src/engine/anomalyEngine.ts`)
- **Personal Baseline Engine:** Dynamic rolling distribution model (`src/engine/baseline.ts`)
- **Velocity & Duplicate Detection:** Sliding time-window velocity tracker (`src/engine/velocity.ts`)
- **Simulation Sandbox:** Predictive category budget overrun forecaster (`src/engine/simulations.ts`)
- **Persistence:** LocalStorage with instant reset and demo data re-hydration
