# Emerging FinTech Problem Areas in India and Free-Resource Feasibility for a Student Team

Research date: 6 November 2026. Team assumption: 3-4 students, about 8 months, little or no budget, building on Stockify (Next.js 15, TypeScript, PostgreSQL, Prisma, NextAuth, 4 Genkit flows).

**Evidence labels used throughout**
- **[LIVE]** I requested the URL or file on 6 Nov 2026 and looked at the response.
- **[READ]** I fetched the page and extracted the claim from it. Extraction used a summarising fetch tool, so check exact wording before quoting it in a report.
- **[SNIPPET]** The claim comes from a search-result summary and the page itself was not opened. Treat it as a lead.
- **[UNVERIFIED]** My own background knowledge, or a claim with no source I could open. Never cite these as fact.

**Method limit:** the WebSearch budget ran out partway through. Later checks used direct fetches of known URLs only, so some topics have thin coverage. Each section lists them under Gaps.

**On the word "unsolved":** I did not verify any problem below as unsolved. "Gap" means I did not find the capability in the sources I checked, and I checked only a few sources per area.

---

## 1. Which further problem areas have evidence, and what could be demonstrated?

### Takeaway
Six areas have usable evidence. Insurance clause comprehension and regulator-complaint routing have the strongest official numbers. ESG label verification and tax-aware decisions have the best free data for a real evaluation. GST invoice fraud and gig-worker volatility are well motivated, but no real labelled data is publicly available, so any results there come from synthetic data.

### Cited Findings

#### Area 1: Insurance mis-selling and policy-clause comprehension

**Evidence**
- IRDAI's 2024-25 annual report records 2,57,790 grievances on Bima Bharosa: 1,20,429 life (15.72 per lakh policies and lives) and 1,37,361 non-life (5.29 per lakh). 10,160 were pending at 31 March 2025. — [Outlook Money, 2 Jan 2026](https://www.outlookmoney.com/insurance/insurance-claims-mis-selling-account-for-most-insurance-complaints-in-fy25-reveals-irdai-annual-report) [READ, secondary]
- Unfair business practice complaints against life insurers rose from 23,335 to 26,667, taking their share from 19.33% to 22.14%. IRDAI urged root cause analysis, suitability assessment and channel-specific controls. — [Insurance Business, 27 Feb 2026](https://www.insurancebusinessmag.com/asia/news/breaking-news/india-regulator-challenges-insurers-on-costs-and-misselling-566738.aspx) [READ]
- Corporate agents, including bancassurance, accounted for nearly 53% of private life insurers' individual new business premium in FY25, and banks alone for over 49%. — [Insurance Business](https://www.insurancebusinessmag.com/asia/news/breaking-news/india-regulator-challenges-insurers-on-costs-and-misselling-566738.aspx) [READ]
- Claim-related grievances numbered 33,280 in life and 88,841 in general and health. — [Outlook Money](https://www.outlookmoney.com/insurance/insurance-claims-mis-selling-account-for-most-insurance-complaints-in-fy25-reveals-irdai-annual-report) [READ]
- **Strongest single finding for clause comprehension:** the Insurance Ombudsman's FY24 report says most life complaints fell under Rule 13(1)(d), "Misrepresentation of policy terms and conditions", accounting for 59% of the total entertainable complaints disposed in the life sector that year. — [CIO Annual Report 2023-24, PDF p. 86](https://cioins.co.in/annualreports/AnnualReport2023-2024.pdf) [READ, primary, local text extraction]
- The same report recommends that the 15-day free-look period and verification calls be "effectively implemented" to reduce mis-selling, and that agents be trained periodically. Across all lines, 36,850 entertainable complaints were disposed. It publishes nature-wise complaint tables by rule clause (Statements L7G7H7, L8, G8, H8). — [CIO Annual Report 2023-24, PDF pp. 7, 67-71, 86](https://cioins.co.in/annualreports/AnnualReport2023-2024.pdf) [READ, primary, local text extraction]
- FY25 ombudsman health figures: 37,431 complaints received and 29,017 disposed; 6,126 decided for complainants and 9,417 sent to mutual settlement. The article reports the policyholder-favourable share falling from 55% to 41%. — [Cafemutual, 2 Jan 2026](https://cafemutual.com/news/industry/36635-41-of-health-insurance-complaints-were-resolved-in-favour-of-policyholders-in-fy25) [READ, secondary]
- **Conflict:** FY24 health complaints appear as 34,203 in [Cafemutual](https://cafemutual.com/news/industry/36635-41-of-health-insurance-complaints-were-resolved-in-favour-of-policyholders-in-fy25) and as 31,490 in other summaries such as [BasuNivesh](https://www.basunivesh.com/top-5-health-insurance-companies-by-complaints-cio-report/) [SNIPPET]. About 95% of health complaints were reported as claim repudiation under Rule 13(1)(b) [SNIPPET]. Check both figures against Statement H7 in the [CIO PDF](https://cioins.co.in/annualreports/AnnualReport2023-2024.pdf).

**What exists**
- Ditto is an IRDAI-registered corporate agent with free advisor calls, comparison pages and an "Understand Your Policy" tool that explains terms in plain English. Its site does not mention AI. — [joinditto.in](https://joinditto.in/) [READ]
- Insurance Samadhan handles complaints, including mis-selling, for ₹999 registration plus a 20% success fee (22% at legal level), and offers a "Know Your Policy" review. — [insurancesamadhan.com](https://www.insurancesamadhan.com/) [READ]
- Bima Bharosa, the official grievance portal, is up. — [bimabharosa.irdai.gov.in](https://bimabharosa.irdai.gov.in/) [LIVE]
- Bima Sugam's information hub launched on 17 September 2025. Full transactional go-live is "reportedly" expected around November 2026, and the article advises treating this as guidance. It confirms no public data feeds or APIs; health data APIs appear only as a Phase 2 plan. — [IPO Market, 28 Sep 2026](https://www.ipomarket.in/news/bima-sugam-upi-moment-insurance-irdai-not-ipo) [READ, low-authority source]
- I could not confirm go-live on an official site. `bimasugam.irdai.gov.in` did not resolve, and `bimasugam.org` only redirects to a `/lander` page. [LIVE]

#### Area 2: Regulator complaint routing and regulatory-change tracking

**Evidence**
- RBI's Integrated Ombudsman Scheme received 13,34,244 complaints in FY25, up 13.55%. The Offices of the RBI Ombudsman (ORBIOs) received 2,96,321. — [RBI Annual Report of Ombudsman Scheme 2024-25, Ch. 1, Table 1.1](https://rbi.org.in/scripts/PublicationsView.aspx?id=23441) [READ, primary]; [PDF](https://rbidocs.rbi.org.in/rdocs/Publications/PDFs/OMBUDSMANSCHEME0112256FF61F650D4945CFAD6C822B3EF3481F.PDF)
- Of 2,90,567 ORBIO disposals, 37.84% (1,09,946) were non-maintainable. The largest ground was "First Resort Complaints" at 33.01%, meaning the complainant had not gone to the entity first. At the central receipt centre (CRPC), First Resort made up 47.34% of 7,84,176 closures, and another 27.57% were addressed to other authorities. — [RBI, Ch. 1 §1.17-1.18, Ch. 2 §2.6](https://rbi.org.in/scripts/PublicationsView.aspx?id=23441) [READ, primary]
- Of maintainable complaints, 51.91% were settled by mutual settlement, conciliation or mediation, and 43.36% were rejected. Average handling cost at ORBIOs was ₹1,582 per complaint. — [RBI, Ch. 1 §1.21, §1.25](https://rbi.org.in/scripts/PublicationsView.aspx?id=23441) [READ, primary]
- Loans and advances made up 29.25% of complaints. RBI states that credit card complaints "increased by 20.04 per cent and has become the second highest contributor", so **20.04% is a growth rate, not a share**. Summaries such as [Bank Exams Today](https://currentaffairs.bankexamstoday.com/2025/12/rbi-ombudsman-report-202425-complaints.html) appear to misreport it as a share [SNIPPET]. Credit cards are 17.16% of complaints against banks (Appendix 1.6). That appendix's bank counts (33,198 to 41,457) imply about 24.9% growth, possibly because it covers banks only; the report does not explain the difference. — [RBI, §1.13, Appendix 1.6](https://rbi.org.in/scripts/PublicationsView.aspx?id=23441) [READ, primary]
- SEBI SCORES 2.0: since 1 April 2024 complaints can be lodged only on the new portal. It has a 21-day timeline, auto-routing and auto-escalation, and two review levels. Average resolution was reported as 35 days in March 2024 against about 45 days on SCORES 1.0, though the article is internally inconsistent (45 vs 40 days). — [Outlook Money, Apr 2024](https://www.outlookmoney.com/invest/sebi-resolves-twice-number-of-complaints-after-launching-scores-20) [READ]
- Recent SCORES volume is about 4,000-5,000 fresh complaints a month: 4,959 received, 4,415 resolved and 5,107 unresolved in June 2025 — [Business Standard](https://www.business-standard.com/markets/news/sebi-resolves-4415-complaints-june-scores-portal-125072000579_1.html) [SNIPPET]
- SEBI's mutual fund format document footnotes each requirement to a chain of circulars (for example, monthly portfolio format to circulars of 2012, 2017 and 2020). This shows regulation accumulating by amendment. — [SEBI Formats for Master Circular, March 2023, pp. 83-89](https://www.sebi.gov.in/sebi_data/commondocs/may-2023/Formats%20for%20Master%20Circular%20for%20Mutual%20Funds%20as%20on%20March%2031,%202023_p.pdf) [READ, primary]
- A newer SEBI Master Circular for Mutual Funds dated 20 March 2026 and an MCR format change of 19 May 2026 are reported. — [Corpseed](https://www.corpseed.com/law-update/sebi-revises-monthly-cumulative-report-mcr-format-for-mutual-funds-2026) [SNIPPET]

**What exists**
- Official portals are up: [cms.rbi.org.in](https://cms.rbi.org.in/) and [scores.sebi.gov.in](https://scores.sebi.gov.in/) [LIVE].
- Commercial compliance vendors appeared in search results (for example [Lexplosion](https://lexplosion.in/?p=127144)), but I did not evaluate what their products do.
- [IndiaFinBench](https://arxiv.org/abs/2604.19298) is a 406-item benchmark on SEBI and RBI text. Model rankings changed with the scoring rule: Spearman rho = -0.273 between the two primary regimes, and one model went from last under strict scoring to joint first under composite scoring. [READ]

#### Area 3: Tax-aware decisions and retirement adequacy

**Evidence**
- The Income Tax Act 2025 replaced the 1961 Act from 1 April 2026, restructuring without changing rates. The new regime remains the default for FY 2026-27. Buybacks are now taxed as capital gains. Equity LTCG is 12.5% above ₹1.25 lakh and STCG is 20%. SGB maturity gains stay exempt only for original-issue buyers. — [JM Financial Services](https://www.jmfinancialservices.in/blogs-and-articles/new-income-tax-rules-from-april-1-2026) [READ, single broker blog; confirm with CBDT text]
- Capital gains provisions moved from Sections 111A, 112 and 112A into a consolidated Schedule VII. — [Study Cafe](https://studycafe.in/overview-of-new-capital-gains-tax-structure-under-income-tax-act-2025-416536.html) [SNIPPET]
- Mercer CFA Institute Global Pension Index 2026 (18th edition, October 2026, 55 systems): India scores 46.8, grade D, marked as improving. — [Mercer](https://www.mercer.com/globalpensionindex) [READ, primary]
- The 2025 index had India at 43.8, and the adequacy sub-index at 34.7, grade E — [Business Standard](https://www.business-standard.com/amp/finance/personal-finance/what-numbers-reveal-why-india-s-pension-system-is-among-bottom-3-globally-125101600462_1.html) [SNIPPET]. **Conflict on 2025 rank:** 45th of 47 in [Business Today](https://www.businesstoday.in/personal-finance/retirement-planning/story/epfo-nps-atal-pension-yojana-covers-less-than-25-of-workers-mercer-report-on-systemic-flaws-in-retirement-schemes-498879-2025-10-18) [READ] against 52nd of 52 in [Bank Exams Today](https://currentaffairs.bankexamstoday.com/2025/10/mercer-cfa-global-pension-index-2025.html) [SNIPPET]. Cite the score, not the rank.
- EPFO, NPS and Atal Pension Yojana together reach "less than 25% of the workforce". Stated problems include early EPF withdrawals and split regulation, with informal and gig workers at particular risk. — [Business Today, Oct 2025](https://www.businesstoday.in/personal-finance/retirement-planning/story/epfo-nps-atal-pension-yojana-covers-less-than-25-of-workers-mercer-report-on-systemic-flaws-in-retirement-schemes-498879-2025-10-18) [READ]

**What exists**
- Rules-as-code tools are available: [Catala](https://github.com/CatalaLang/catala) (Apache-2.0) and [OpenFisca](https://github.com/openfisca/openfisca-core) (AGPL-3.0, note the copyleft). [LIVE, GitHub API]
- I did not verify which Indian consumer products offer lot-level tax harvesting or stochastic retirement planning. See Gaps.

#### Area 4: Gig-worker income volatility, with vernacular and voice access

**Evidence**
- NITI Aayog (June 2022) estimated 7.7 million gig workers in 2020-21 and projected 23.5 million by 2029-30. — [IndBiz](https://indbiz.gov.in/indias-gig-economy-to-have-23-5-million-workers-by-2029-30-niti-aayog/) [SNIPPET]. The primary PDF returned HTTP 403 to my fetch tool and was not read: [niti.gov.in](https://www.niti.gov.in/sites/default/files/2022-06/25th_June_Final_Report_27062022.pdf).
- Voice banking: ThePrint (1 May 2025) reports that Ujjivan found a text-based vernacular app unsuitable and that users preferred voice notes, audio and icons. Hello Ujjivan supports nine languages, and customer logins rose from about once in six months to one or two a month. Bhashini's CEO names extensive testing as the main obstacle to adoption. The article's evidence is company claims and anecdotes, with no independent evaluation. — [ThePrint](https://theprint.in/ground-reports/voice-based-banking-for-low-literate-indians/2610584) [READ]
- UPI 123Pay offers feature-phone payments without internet, including through IVR and missed call. — [RBI press release](https://rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=53385) [SNIPPET]
- FABRIC tests 204 Indian finance questions in 6 languages (1,224 pairs). Hallucination affected 11-31% of responses. Indian-origin models scored 62-64% against 78-83% for non-Indian models. Hinglish beat pure Hindi by 7-12 points. Web retrieval raised date-sensitive accuracy from 20% to 86-90%. The author is a single-company creator and I found no peer review, so treat this as indicative. — [FABRIC dataset card](https://huggingface.co/datasets/agenticclass/fabric/blob/main/README.md) [READ]

**What exists**
- Voice stack: [Sarvam API](https://www.sarvam.ai/api-pricing) (₹100 free signup credit; STT ₹0.49/min, translation ₹2 per 1,000 characters) [READ]; AI4Bharat models with open licence tags ([IndicConformer Hindi](https://huggingface.co/ai4bharat/indicconformer_stt_hi_hybrid_ctc_rnnt_large), MIT, gated access) [LIVE]; [Bhashini](https://bhashini.gov.in/) (site up, API terms not read) [LIVE].

#### Area 5: MSME credit and GST invoice fraud

**Evidence**
- SIDBI's 2025 analysis estimates an MSME credit shortfall of nearly ₹30 lakh crore. MSME loans are about 17-18% of bank credit, with outstanding MSME credit of ₹35.2 lakh crore at March 2025. — [Upstox Originals, Dec 2025](https://upstox.com/news/upstox-originals/latest-updates/why-can-t-msm-es-escape-the-credit-crunch/article-185718) [READ, secondary]. A Crisil-attributed figure of ₹20-25 lakh crore also circulates — [M1xchange](https://www.m1xchange.com/?p=13711) [READ, an interested party]. The estimates differ, and I read neither original report.
- TReDS "meets less than 5% of the credit demand" (a Deloitte partner's opinion). Financing passed ₹2.35 lakh crore in FY25 per a platform executive. It is buyer-dependent by design, and buyers are reported as reluctant because it exposes their payment practices. The turnover threshold for mandatory onboarding fell from ₹500 crore to ₹250 crore. — [SMEConnect, May 2025, republishing Economic Times](https://www.smeconnect.in/?p=5214) [READ]. That article has internally inconsistent numbers, so verify before citing.
- Fake ITC detected: ₹24,140 crore (FY23), ₹36,374 crore (FY24), ₹58,772 crore (FY25). Cumulative FY21-25 fake ITC was about ₹1.79 lakh crore within about ₹7.08 lakh crore total evasion, per a Lok Sabha reply of August 2025. Circular trading is described as inflating turnover and generating e-way bills with no goods moving. — [Business Today, 8 Feb 2026](https://www.businesstoday.in/india/story/shell-firms-circular-trading-fake-gst-invoice-frauds-continue-despite-safeguards-515130-2026-02-08) [READ, secondary to a parliamentary reply]

**What exists**
- TReDS platforms ([RXIL](https://www.rxil.in/) up [LIVE]; M1xchange and others).
- [OCEN 4.0](https://ocen.dev/), which cites a ₹20-25 trillion gap and fewer than 11% of MSMEs with formal credit. [READ]
- ULI: my guessed page returned 404, and only the [RBIH home page](https://rbihub.in/) is confirmed up.
- **GSTN already runs analytics at scale.** The GST Analytics Hackathon used about 9 lakh anonymised, labelled records with 21 attributes, but under NDA for registered participants. — [event.data.gov.in](https://event.data.gov.in/event/gst-analytics-hackathon/) [READ, primary]

#### Area 6: ESG and climate label verification in Indian funds

**Evidence**
- A 2023 SEBI consultation proposed that 65% of ESG fund AUM be in companies with BRSR assurance through BRSR Core, plus stewardship reporting and comply-or-explain assurance that portfolios follow the stated strategy. These are proposals, and the final form must be read from the circular. — [JD Supra, Mar 2023](https://jdsupra.com/legalnews/indian-securities-regulator-consults-on-7369348) [READ]
- SEBI's later rules are reported as requiring 80% of assets aligned with strategy and monthly ESG score disclosure. — [fintech.global, Jul 2023](https://fintech.global/2023/07/24/sebi-unveils-robust-disclosure-rules-to-boost-green-financing-in-india/) [SNIPPET]
- Further changes in March 2025 and a committee focused on mis-selling and greenwashing are reported. — [Managing IP](https://www.managingip.com/article/2f9yczbyr1vr8ncpckzcw/sponsored-content/greenwashing-in-india-key-rules-and-regulatory-insights) [SNIPPET, sponsored content]
- Holdings data is accessible. PPFAS publishes monthly portfolios as .xls/.xlsx, latest September 2026. — [PPFAS](https://amc.ppfas.com/downloads/portfolio-disclosure/) [READ]. [AMFI](https://www.amfiindia.com/online-center/portfolio-disclosure) has a portfolio disclosure page with MF, SIF and Total Industry AUM options. [READ]

**What exists**
- Regulatory disclosures and academic performance studies. One search found no study checking Indian ESG scheme holdings against their labels. That is weak evidence from a single query and does not show that no such work exists.

### Inferences

**Assessment by area (my judgement, not sourced fact)**

| Area | Remaining gap (as far as I checked) | Technically interesting? | Credible demo | Main risk |
|---|---|---|---|---|
| 1. Insurance clauses | Plain-English explanation exists. I saw no product deriving a checkable coverage decision with a clause-level trace | Yes: PDF extraction to executable rules | Upload a policy and a claim scenario, get covered / not covered / uncertain, with the clause trace and minimal fact change that flips the result | Hand-labelling needed, and it must not read as legal advice |
| 2. Complaint routing and regulatory change | Official portals take complaints but the numbers suggest many are misdirected or premature | Moderate alone; better with versioned regulation retrieval | Free-text complaint in, then forum, eligibility, missing steps and clock dates out | No public complaint text found, so test cases must be hand-written |
| 3. Tax and retirement | Calculators are common. Unverified whether lot-level tax optimisation plus retirement simulation exists for India | High: optimisation with verified rules | Same portfolio, naive vs tax-aware plan, with after-tax difference over backtests | Tax law errors; the rules changed in 2026 |
| 4. Gig and voice | Low-literacy evidence is anecdotal; no public gig cash-flow data found | Moderate to high | Probabilistic income forecast with calibrated intervals, spoken Hindi explanation | Synthetic data limits conclusions; hard to recruit users ethically in time |
| 5. MSME and GST fraud | GSTN already does this with data students cannot get | High on graphs | Injected circular-trading motifs detected on a synthetic invoice graph | Results only show detection of your own generator's patterns |
| 6. ESG labels | Holdings-versus-label checks appear uncommon but this is unconfirmed | Moderate; messy data engineering is the real work | Divergence score across all ESG schemes vs matched peers, over time | Must word findings carefully: a low score is not proof of greenwashing |

**Reasoning worth keeping**
- The RBI data suggests a real routing problem: 47.34% of 7,84,176 CRPC closures were First Resort, about 3.7 lakh complaints by my arithmetic. A filing assistant could plausibly help, but the data does not show that users would use one or that closures would fall.
- The FY25 ombudsman "41%" figure looks like a denominator effect. (6,126 + 9,417) / 37,431 received = 41.5%, matching the article, but on the 29,017 disposed it is 53.6%, close to the FY24 55%. Do not repeat "fell from 55% to 41%" without checking which denominator FY24 used. The same article's "outstanding 4,928" also does not reconcile (37,431 - 29,017 = 8,414).
- The 59% Rule 13(1)(d) share supports the clause-comprehension direction, but it covers complaints that reached the ombudsman and were entertainable, not all policyholders. It records a complaint category, not a finding that each policy was misrepresented.
- Mis-selling evidence is about sales conduct at the point of sale. A clause-comprehension tool addresses only part of this and does not show that mis-selling would decline.
- Vernacular access works better as a layer on another area than as a standalone project, given FABRIC's language gaps and ThePrint's point about testing. This is a judgement call.
- Best fit with existing Stockify assets: Area 6 and Area 3 reuse the market data, charts and backtester directly. Area 1 is the most distinct from "chatbot + UI" if the rule engine, not the LLM, makes the final decision.

### Gaps
- **Surrender rules:** not verified. My background recollection is that IRDAI's 2024 product regulations changed surrender value norms, but I opened no source. [UNVERIFIED] Read the IRDAI regulation directly.
- IRDAI annual report and SEBI annual report 2024-25: primary documents not read. IRDAI figures are secondary; SEBI annual totals not obtained.
- CIO FY25 report: the [PDF](https://cioins.co.in/annualreports/AnnualReport2024-2025.pdf) downloads (98 pages), but it has almost no text layer (25 characters in the first 30 pages), so it needs OCR or manual reading. FY25 ombudsman numbers stay secondary until then.
- RBI ombudsman [PDF](https://rbidocs.rbi.org.in/rdocs/Publications/PDFs/OMBUDSMANSCHEME0112256FF61F650D4945CFAD6C822B3EF3481F.PDF): my client received an HTML page instead of the file, so RBI figures come from the [report's HTML version](https://rbi.org.in/scripts/PublicationsView.aspx?id=23441).
- Whether ombudsman award text, as opposed to aggregate tables, is publicly downloadable: not verified. This decides whether Area 1 can have real validation cases.
- Gig income volatility and credit access: no quantitative source found. The NITI PDF was blocked and the Fairwork URL I tried returned 404. Do not claim specific volatility figures yet.
- NCFE financial literacy survey: my URL returned 404, so no figure is available. Hindi and low-literacy adoption rates are unsourced.
- FY26 fake ITC totals: search summaries gave about ₹74,782 crore across 30,162 cases and ₹41,664 crore to October 2025, from secondary sources I did not open. Find the parliamentary reply.
- TReDS mandate notification, its date and final threshold: official text not found.
- Existing Indian tax-harvesting and retirement products: not surveyed, because search was exhausted. Do a manual competitor check before claiming novelty.

---

## 2. Which free data, tools and compute are actually available, and on what terms?

### Takeaway
Most listed resources exist and are reachable, but "reachable" is often not the same as "licensed". The main findings: NSE's terms ban automated collection; Yahoo's endpoints are unofficial and rate-limit bare clients; the Gemini model Stockify uses has an earliest shutdown date of 1 December 2026; and Gemini's free tier uses submitted content to improve Google's products. AA sandboxes offer mock data only, and production requires regulated status.

### Cited Findings

#### Urgent findings for the existing codebase
- **Model retirement:** `src/ai/genkit.ts` sets `googleai/gemini-2.5-flash`. Google lists `gemini-2.5-flash` with an earliest shutdown of **1 December 2026**, after which requests auto-route to `gemini-3.5-flash-lite`. — [Gemini deprecations](https://aistudio.google.com/docs/deprecations) [READ, primary]. All 4 Genkit flows are affected. Re-test them and pin a model deliberately.
- **Free-tier privacy:** content on the free tier is marked as used to improve Google's products, and paid-tier content is not. — [Gemini pricing](https://aistudio.google.com/docs/pricing) [READ, primary]. Do not send real personal financial data from test users through the free tier.
- **Yahoo:** seven source files reference Yahoo, including `src/lib/yahoo-finance.ts` and five API routes. `package.json` has no Yahoo library dependency, so calls appear to be direct to unofficial endpoints. [local grep]

#### Indian market and fund data

| Resource | URL | Check on 6 Nov 2026 | Licence / terms | Limits and notes |
|---|---|---|---|---|
| AMFI NAV (latest) | https://portal.amfiindia.com/spages/NAVAll.txt | [LIVE] 200, about 1.5 MB. The `www` URL redirects here | No licence seen on the download page; site terms not read | Plain text, all schemes |
| AMFI NAV history | https://www.amfiindia.com/net-asset-value/nav-download | [READ] | Not stated | Maximum 90 days per request |
| AMC monthly portfolios | https://amc.ppfas.com/downloads/portfolio-disclosure/ (example) | [READ] xls/xlsx, latest Sept 2026 | Not checked | Each AMC has its own site and layout. Only PPFAS verified. Expect format variation |
| AMFI portfolio page | https://www.amfiindia.com/online-center/portfolio-disclosure | [READ] selector only | Not stated | Scope of files not verified |
| SEBI portfolio format | https://www.sebi.gov.in/sebi_data/commondocs/may-2023/Formats%20for%20Master%20Circular%20for%20Mutual%20Funds%20as%20on%20March%2031,%202023_p.pdf | [READ] pp. 83-89 | Regulatory document | Dated 2023. Newer Master Circular reported for March 2026 |
| mfapi.in | https://www.mfapi.in/ | [LIVE] returned SBI Small Cap NAV dated 05-11-2026 | Says free, no key, no rate limiting. ToS page not read | Third-party service, no SLA seen. Refreshes 6 times daily. Cache locally |
| NSE bhavcopy | https://nsearchives.nseindia.com/content/cm/BhavCopy_NSE_CM_0_0_0_20261105_F_0000.csv.zip | [LIVE] one test download, 3,726 rows | **ToU bans systematic or automated collection, scraping and harvesting** — https://www.nseindia.com/static/nse-terms-of-use [READ, primary] | Requested with a browser User-Agent. Availability is not permission |
| NSE index constituents | https://nsearchives.nseindia.com/content/indices/ind_nifty50list.csv | [LIVE] 200 | Same ToU; niftyindices has its own terms — https://niftyindices.com/terms-of-use (not read) | One index checked |
| NSE data policy | https://www.nseindia.com/static/market-data/nse-data-policy | **Not read**, timed out twice | Licensed feeds run by contract [SNIPPET] | Academic use terms unknown. Email NSE Data |
| BSE bhavcopy | https://www.bseindia.com/download/BhavCopy/Equity/BhavCopy_BSE_CM_0_0_0_20261105_F_0000.CSV | [LIVE] 200, 872 KB | BSE terms not read | Treat as restricted until read |
| Shareholding and promoter data | https://www.bseindia.com/corporates/List_Scrips.html (listing only) | **Not verified** | Unknown | Could not confirm a bulk route on NSE or BSE. Manual filing download is the safe assumption |
| MCA portal | https://www.mca.gov.in/ | **403 to my client**, which is not evidence of downtime | Not read | Try in a browser |
| Company Master Data (MCA via OGD) | https://www.data.gov.in/catalog/company-master-data | [READ] updated 13/10/2026 | Government Open Data License-India, under NDSAP | CIN, status, class, capital, registration date, state. API and zip offered. **Best verified legal source for company graphs** |
| SEBI data | https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=4&ssid=38&smid=35 | [LIVE] reports listing up; `statistics.html` returned 404 | Not read | Mostly documents, not bulk data |
| Kaggle Nifty data | https://www.kaggle.com/datasets/rohanrao/nifty50-stock-market-data ; https://www.kaggle.com/datasets/debashis74017/nifty-50-minute-data | [LIVE] metadata: CC0; last updated 2021 and May 2026 | Uploader-declared CC0, which **may not reflect the underlying data rights** | 54 MB; 4.2 GB. Useful for experiments, weak for licence claims |

#### Yahoo Finance risk and alternatives
- Yahoo's API terms: revocable licence, no deriving income without permission, no competing products, no exceeding reasonable request volume, rate limits at Yahoo's sole discretion. — [Yahoo APIs terms](https://legal.yahoo.com/us/en/yahoo/terms/product-atos/apiforydn/index.html) [READ, primary]. Whether these terms govern undocumented `query1` endpoints is a legal question I cannot settle.
- yfinance's maintainers state that it is not affiliated with Yahoo, is for research and education, and that "the Yahoo! finance API is intended for personal use only". — [yfinance README](https://github.com/ranaroussi/yfinance) [READ]
- Live test: `query1.finance.yahoo.com/v8/finance/chart/RELIANCE.NS` returned **200 with a browser User-Agent and 429 without one**. [LIVE] It works today, but a viva demo should not depend on it.

| Alternative | URL | Free offer | Caveat |
|---|---|---|---|
| Zerodha Kite Connect | https://zerodha.com/products/api/ | Personal tier free; Connect ₹500/month includes historical candles and streaming [READ] | Historical data not listed for the free tier. Account requirement not stated on the page |
| Alpha Vantage | https://www.alphavantage.co/premium/ | 25 requests/day [READ] | NSE/BSE coverage not stated |
| Twelve Data | https://twelvedata.com/pricing | 8 credits/min, 800/day [READ] | NSE/BSE on free plan not stated; check exchange list |
| Angel One SmartAPI | https://smartapi.angelone.in/ | Site up [LIVE] | Terms and price not read |
| Upstox API | https://upstox.com/developer/api-documentation/open-api/ | Docs up [LIVE] | Terms and price not read |

#### Personal finance and credit data

| Resource | URL | Check | Licence / terms | Limits and notes |
|---|---|---|---|---|
| AIDIS 2019 (NSS 77th round) | https://microdata.gov.in/NADA/index.php/catalog/156/get-microdata | [READ] | Free account login required; no explicit licence on page; policy page not read | Household debt and assets. 2019 data |
| PLFS | https://microdata.gov.in/NADA/index.php/catalog/PLFS | [READ] 14 datasets, 2017-18 to 2025 | Listed as "Public use data files" | Includes monthly and quarterly unit-level data. Survey data, not transaction data |
| Home Credit | https://www.kaggle.com/c/home-credit-default-risk | Page shell 200 only | **Rules not verified** | Kaggle login and rules acceptance likely. Not Indian |
| Give Me Some Credit | https://www.kaggle.com/c/GiveMeSomeCredit | Page shell 200 only | **Rules not verified** | Not Indian |
| LendingClub (official) | https://www.lendingclub.com/info/statistics.action | [READ] redirects to Happen Bank, "formerly LendingClub", with **no data download** | n/a | Official source appears gone |
| LendingClub (mirror) | https://www.kaggle.com/datasets/wordsforthewise/lending-club | [LIVE] 648 MB, last updated Apr 2019 | Uploader-declared CC0; provenance rests on the uploader | US lender; frozen since 2019, so it will not update |

#### Fraud data

| Dataset | URL | Check | Licence | Limits and notes |
|---|---|---|---|---|
| PaySim | https://www.kaggle.com/datasets/ealaxi/paysim1 | [LIVE] 494 MB, updated 2017 | CC BY-SA 4.0 | Simulated mobile money |
| IEEE-CIS | https://www.kaggle.com/c/ieee-fraud-detection | Page shell 200 only | **Rules not verified** | Competition terms may restrict use |
| Elliptic | https://www.kaggle.com/datasets/ellipticco/elliptic-data-set | [LIVE] 697 MB | **CC BY-NC-ND 4.0**: no sharing of derivatives | 203,769 nodes, 234,355 edges, 165 features; 4,545 illicit and 42,019 licit, the rest unknown — [PyG docs](https://pytorch-geometric.readthedocs.io/en/latest/generated/torch_geometric.datasets.EllipticBitcoinDataset.html) [READ] |
| IBM AMLworld | https://www.kaggle.com/datasets/ealtman2019/ibm-transactions-for-anti-money-laundering-aml | [LIVE] 41.6 GB total, updated Jul 2025 | CDLA-Sharing-1.0 | Synthetic with complete labels — [arXiv 2306.16424](https://arxiv.org/abs/2306.16424) [READ]. Size may strain free notebook disks; use a smaller subset |

#### LLM benchmarks and models

| Resource | URL | Check | Licence | Notes |
|---|---|---|---|---|
| FinanceBench | https://github.com/patronus-ai/financebench | [LIVE] 150 open of 10,231; last pushed Dec 2024 | **No LICENSE file in the repo root and no licence detected.** A secondary MIT claim is not supported by the repo | US filings; GPT-4-Turbo with retrieval wrong or refused on 81% in the paper |
| FABRIC | https://huggingface.co/datasets/agenticclass/fabric | [LIVE] | CC BY 4.0 | 204 questions × 6 languages; rules as of early 2026 |
| BhashaBench-Finance | https://huggingface.co/datasets/bharatgenai/BhashaBench-Finance ; https://aikosh.indiaai.gov.in/home/datasets/details/bhashabench_finance.html | [LIVE/READ] | CC BY 4.0, gated (auto) | 19,433 exam questions; English and Hindi |
| IndiaFinBench | https://github.com/Rajveer-code/IndiaFinBench ; https://arxiv.org/abs/2604.19298 | [LIVE/READ] | Repo MIT; paper CC BY 4.0 | 406 SEBI and RBI items |
| IndFin-Bench | https://huggingface.co/datasets/cofacto/IndFin-Bench | [LIVE] moved from CompoundingAI | CC BY-NC 4.0 | Under 1K items; Indian filings |
| FinQA / TAT-QA | https://github.com/czyssrs/FinQA ; https://github.com/NExTplusplus/TAT-QA | [LIVE] | Repo MIT; dataset terms may differ | Numeric reasoning QA |
| CUAD | https://huggingface.co/datasets/theatticusproject/cuad-qa | [LIVE] | CC BY 4.0 | Commercial contracts, not insurance; useful for clause-extraction pretraining |
| FinanceParam | https://huggingface.co/bharatgenai/FinanceParam | [LIVE] | Apache-2.0 tag | Indian finance model; quality not evaluated |

**Gemini API free tier** — [pricing](https://aistudio.google.com/docs/pricing), [rate limits](https://aistudio.google.com/docs/rate-limits), [deprecations](https://aistudio.google.com/docs/deprecations) [READ, primary]
- Free tier listed for Gemini 3.8 Flash, 3.6 Flash, 3.5 Flash-Lite, 3.1 Flash-Lite, 2.5 Flash-Lite, Gemini Embedding, Gemma 4 and others. Not listed for Gemini 3.1 Pro Preview or Gemini Omni.
- **Exact free RPM and RPD are not on the docs page.** Google directs users to [AI Studio's rate-limit page](https://aistudio.google.com/rate-limit) for their own project. Each student should read and record it there.
- Blog figures conflict sharply (for example 2.5 Flash at 250 RPD against 20 RPD after a December 2025 cut), and they concern older models: [yingtu.ai](https://yingtu.ai/en/blog/google-gemini-api-free-tier-limits-2026), [laozhang.ai](https://blog.laozhang.ai/en/posts/gemini-api-free-tier) [SNIPPET]. Do not cite them.

**Ollama and local models**
- [Ollama](https://github.com/ollama/ollama) is MIT licensed. [LIVE] Its [library](https://ollama.com/library) lists small tags including `gemma3:1b`, `gemma4:e2b`, `qwen3:0.6b`, `llama3.2:1b`, `phi4-mini`, and embedding models such as `all-minilm`. [READ]
- Hardware guidance from secondary, partly vendor sources [SNIPPET]: 8 GB RAM runs 1-3B models; 16 GB or an 8 GB GPU suits 7-8B models; 27-32B needs about 32 GB RAM or 24 GB VRAM; rule of thumb about 0.6 GB per billion parameters at 4-bit, plus overhead — [LumaDock](https://lumadock.com/tutorials/ollama-hardware-requirements?currency=4), [SitePoint](https://www.sitepoint.com/ollama-setup-guide-2026/). CPU-only speed is single digits to low teens tokens per second. Measure on your own laptops with `ollama run --verbose`.

#### Account Aggregator sandboxes

| Provider | URL | What I could verify | Not verified |
|---|---|---|---|
| Setu | https://docs.setu.co/data/account-aggregator/quickstart | Register on The Bridge, create FIU and product, get sandbox credentials. **Mock data for all 23 FI types.** Production requires Sahamati onboarding, KYC and review [READ] | Price not mentioned; student eligibility not stated |
| Finvu | https://finvu.github.io/sandbox/get_started | Hosted FIU sandbox, simulated FIPs, ReBIT schemas [READ] | Cost, limits, sign-up. Some sections are placeholders |
| Sahamati | https://developer.sahamati.org.in/ | SahamatiNet limited to verified AAs, FIPs and FIUs [READ] | The open sandbox I found was for the 2024 hackathon, under a path named `no-longer-relevent` [SNIPPET] |

Only entities regulated by RBI, SEBI, IRDAI or PFRDA may be FIPs or FIUs. — [Sahamati](https://sahamati.org.in/?p=3007) [SNIPPET]

#### Open-source libraries (all GitHub API checks on 6 Nov 2026 unless noted)

| Library | URL | Licence | Last push | Note |
|---|---|---|---|---|
| Riskfolio-Lib | https://github.com/dcajasn/Riskfolio-Lib | BSD-3-Clause | Nov 2026 | |
| PyPortfolioOpt | https://github.com/PyPortfolio/PyPortfolioOpt | MIT | Jul 2026 | Moved from robertmartin8 |
| QuantLib | https://github.com/lballabio/QuantLib | BSD-style, from LICENSE.TXT | Nov 2026 | API reports NOASSERTION |
| PyTorch Geometric | https://github.com/pyg-team/pytorch_geometric | MIT | Nov 2026 | |
| Flower | https://github.com/flwrlabs/flower | Apache-2.0 | Nov 2026 | Moved from adap |
| Opacus | https://github.com/meta-pytorch/opacus | Apache-2.0 | Sep 2026 | Moved from pytorch |
| Z3 | https://github.com/Z3Prover/z3 | MIT, from LICENSE.txt | Nov 2026 | |
| CVXPY | https://github.com/cvxpy/cvxpy | Apache-2.0 | Nov 2026 | |
| Circom / snarkjs | https://github.com/iden3/circom ; https://github.com/iden3/snarkjs | GPL-3.0 | Nov / Oct 2026 | Copyleft if distributed |
| Noir | https://github.com/noir-lang/noir | MIT / Apache dual | Nov 2026 | README: early development, unaudited, not for production |
| Neo4j Community | https://github.com/neo4j/neo4j ; https://neo4j.com/licensing/ | GPL v3 | Oct 2026 | Licensing page calls developer offerings "generally provided for free and internal, non-production use". A student project fits, but read the licence for later hosting |
| Apache AGE | https://github.com/apache/age | Apache-2.0 | Nov 2026 | README: PostgreSQL 11-18. **Not in Neon's extension list** — [Neon](https://neon.com/docs/extensions/pg-extensions) [READ]. Likely means self-hosting |
| pgvector | https://github.com/pgvector/pgvector | PostgreSQL-style | Nov 2026 | Neon lists it |
| Prisma extensions | https://www.prisma.io/docs/orm/prisma-schema/postgresql-extensions | n/a | n/a | Installed by raw SQL in migrations; unsupported types use `Unsupported` [READ]. Expect raw queries for vector and Cypher |
| Docling | https://github.com/docling-project/docling | MIT | Nov 2026 | PDF parsing for policies and regulations |
| Catala | https://github.com/CatalaLang/catala | Apache-2.0 | Nov 2026 | Law-as-code language |
| MAPIE | https://github.com/scikit-learn-contrib/MAPIE | BSD-3-Clause | Nov 2026 | Conformal prediction |
| statsforecast | https://github.com/Nixtla/statsforecast | Apache-2.0 | Nov 2026 | |
| Mesa | https://github.com/mesa/mesa | Apache-2.0 | Nov 2026 | Agent-based simulation for synthetic data |

#### Free compute
- **Colab:** free-tier limits are dynamic and unpublished. Sessions run up to 12 hours depending on availability, with idle timeouts and GPU types subject to change. — [Colab FAQ](https://research.google.com/colaboratory/faq.html) [READ, primary]
- **Kaggle:** the [official docs](https://www.kaggle.com/docs/notebooks) came back with no readable body, so **limits are not verified from a primary source**. Secondary sources say about 30 GPU hours a week, and sessions of 9 or 12 hours (they disagree), with T4 ×2 or P100. — [AIMultiple](https://aimultiple.com/free-cloud-gpu), [Thunder Compute](https://www.thundercompute.com/blog/colab-alternatives-for-cheap-deep-learning-in-2025) [SNIPPET]. Check your account's settings panel.

### Inferences
- **Recommended data posture:** use public files in a one-time, documented research snapshot, and keep the demo running on cached data. AMFI, AMC portfolios, the Company Master Data set, PLFS and AIDIS are the safest core. Ask NSE by email about academic use of bhavcopy rather than assuming it is allowed.
- **Replacing Yahoo:** for a university project the near-term risk is more likely availability than enforcement. Put a data-provider interface in front of `src/lib/yahoo-finance.ts`, cache results in Postgres, and make the demo work offline. Kite Connect at ₹500/month is the cheapest clearly documented Indian route found, but one team member would need access and the cost is not zero.
- **Account Aggregator:** build against the ReBIT schemas with mock data and state plainly that it is a sandbox simulation. A student team should not plan on production access.
- **Licences affect the report:** Elliptic's NC-ND term and FinanceBench's missing licence affect what can be redistributed, so publish code and download instructions rather than data.
- **Stack complexity:** pgvector fits the existing Postgres. AGE and Neo4j each add operational work. Prefer plain SQL plus an in-memory graph (for example NetworkX or PyG) unless graph queries are the core contribution.

### Gaps
- NSE data policy, BSE terms, SmartAPI, Upstox, AMFI and mfapi terms of use: not read.
- Kaggle competition rules for IEEE-CIS, Home Credit and Give Me Some Credit: not readable by my tools. A 200 status there proves only that the page shell loads.
- Kaggle GPU limits and Gemini per-model free limits: no primary figures obtained.
- SEBI's current statutory timing and spreadsheet requirement for monthly portfolios, and any fortnightly debt portfolio rule: not confirmed. The format document confirms that a monthly format exists and cites circulars, including SEBI/HO/IMD/DF2/CIR/P/2017/109 and SEBI/HO/IMD/DF3/CIR/P/2020/130. Read the March 2026 Master Circular.
- BRSR bulk availability: not verified, and it decides how strong Area 6 can be.
- NSE and BSE shareholding pattern and promoter group data: no verified bulk route. MCA portal terms: not read.
- Further Kaggle datasets of Indian mutual funds: not surveyed because search was exhausted.

---

## 3. Which technical mechanisms go beyond a dashboard or chatbot, and how would each be evaluated?

### Takeaway
Five mechanisms follow, ranked by my estimate of evidence, data access and feasibility. In each, the LLM is at most a component and the output can be measured against something other than opinion. Novelty claims are provisional until the team runs a literature check, which I could not complete.

### Cited Findings
Each mechanism relies on findings and resources cited in Sections 1 and 2. This section adds no new external facts.

### Inferences

**M1. Neuro-symbolic policy-clause verifier (Area 1)**
- **Mechanism:** Docling parses a policy PDF, the LLM extracts clauses into a typed rule schema, Catala or Z3 evaluates a claim scenario, and the system returns a decision, clause trace and minimal counterfactual ("this claim flips if the waiting period is complete"). Where extraction confidence is low, it abstains.
- **What may be new:** a checkable decision with a proof trace rather than an LLM summary, applied to Indian health policies. I have not verified that no one has done this.
- **Evaluation:** hand-annotate 30-50 policies from about 5 insurers with two annotators and report inter-annotator agreement. Measure clause-extraction F1. Measure decision accuracy on 200+ scenarios against LLM-only and RAG baselines. Report abstention coverage against accuracy. Add ombudsman cases if award text proves available.
- **Risk:** annotation effort. Limit scope to health hospitalisation exclusions and waiting periods.

**M2. Holdings-versus-label divergence engine (Area 6)**
- **Mechanism:** ingest monthly AMC portfolios, resolve instruments by ISIN, build a panel across time, and compute label consistency: overlap with non-ESG peers, sector tilt, turnover, and share of holdings with assured BRSR disclosure.
- **What may be new:** a public, repeatable, holdings-level measure across all Indian ESG schemes. My one search found none, which is weak evidence.
- **Evaluation:** matched-peer comparison with bootstrap confidence intervals and placebo tests on non-ESG funds relabelled at random. Check sensitivity across at least two score definitions. Measure parser accuracy on sampled files against manual reading.
- **Risk:** files vary across AMCs. Present results as "divergence", never as an accusation of greenwashing.

**M3. Verified tax-aware rebalancing and retirement planner (Area 3)**
- **Mechanism:** a lot-level optimiser (CVXPY or mixed-integer) minimises tax and tracking error under Indian rules, with the rules encoded in a verifiable form and tested with Z3 or property tests. A Monte Carlo layer reports probability of meeting a retirement target.
- **What may be new:** the combination of Income Tax Act 2025 rules, lot-level optimisation and verified encoding. Competitors were not surveyed, so this claim is the least secure of the five.
- **Evaluation:** after-tax return gap against buy-and-hold and calendar-based harvesting, using Stockify's backtester over rolling windows. Test rule accuracy against 100+ worked cases checked by a CA or faculty member. Check calibration of the Monte Carlo on held-out periods.
- **Risk:** tax interpretation. Validate lot-matching and set-off rules against the statute, and do not rely on my summary.

**M4. Calibrated income-shortfall forecaster for irregular earners (Area 4)**
- **Mechanism:** probabilistic cash-flow forecasts (statsforecast with MAPIE conformal intervals) on AA-schema synthetic data, calibrated where possible to PLFS, drive a savings and repayment rule. An optional Hindi voice explanation uses open speech models.
- **What may be new:** interval guarantees applied to thin-file income, assessed by downstream decisions, not only forecast error.
- **Evaluation:** interval coverage, pinball loss, shortfall-event recall, and simulated missed-payment reduction compared with a fixed-budget rule. Hindi comprehension test with a small consenting group, with faculty guidance on ethics.
- **Risk:** no real gig cash-flow data, so results describe the simulator. State this up front.

**M5. Circular-trading detection on synthetic GST graphs (Area 5)**
- **Mechanism:** an agent-based invoice generator (Mesa) with injected motifs such as cycles and shell chains, using real company attributes from Company Master Data, compared across graph neural networks (PyG) and rule baselines.
- **What may be new:** an open, documented benchmark generator for Indian invoice fraud. The AMLworld paper's argument for synthetic data with complete labels gives a methodological precedent.
- **Evaluation:** PR-AUC by motif and by fraud prevalence; generalisation to motifs held out of training; pretest on AMLworld for external comparison.
- **Risk:** weakest external validity. GSTN holds the real data, so a guide may reasonably ask what this adds. Pitch it as a benchmark, not a fraud system.

**Suggested add-on for any of these:** run FABRIC and BhashaBench-Finance as regression tests for the LLM components. Report more than one scoring rule, since IndiaFinBench shows that rankings can change with the rule.

**Fit with the guide's objection:** M1 and M2 are the clearest answers to "chatbot + UI". M1 has the strongest fit with the official complaint evidence; M2 is the most feasible with free data and reuses Stockify most directly.

### Gaps
- No systematic literature review was possible once search ran out. Before committing, run Google Scholar, arXiv and IEEE Xplore queries for each mechanism and record close prior work. The novelty statements above are hypotheses until then.
- Whether a CA, lawyer or insurance practitioner can validate M1 or M3 is a team-specific question.

---

## 4. What timeline, evaluation pattern and failure modes should the team plan for?

### Takeaway
I could not verify any Indian university's scoring scheme. All university and AICTE documents I tried failed to load, and search was exhausted. The timeline and failure modes below are my planning judgement, tied to verified technical facts where possible. The team's own syllabus and guide override them.

### Cited Findings
- AICTE Examination Reforms document: **could not be retrieved** (connection reset) — https://www.aicte-india.org/sites/default/files/ExaminationReforms.pdf
- Anna University curriculum URL tried: 404. — https://cac.annauniv.edu/PhpProject1/aidetails/afug_2021_fu/Revised/IandC/B.E.CSE.pdf
- UGC-CARE: neither the [UGC home page](https://www.ugc.gov.in/) nor the [CARE site's redirect page](https://ugccare.unipune.ac.in/) gave any status information. [READ]
- There is no cited source for mark distributions in this section.

### Inferences

**Suggested 8-month plan (assumes November 2026 to June 2027; adjust to your calendar)**

| Month | Goal | Exit check |
|---|---|---|
| 1 | Literature check, data licence check, pick one mechanism, migrate off `gemini-2.5-flash`, add data-provider interface and cache | Written problem statement with baseline; guide sign-off |
| 2 | Data pipeline and annotation guideline; pilot on a small sample | One end-to-end run on 5 documents or schemes |
| 3 | Baselines (LLM-only, rules-only or naive) | Baseline numbers in a table |
| 4 | Core mechanism v1 | Mechanism beats or ties a baseline on the pilot, or the failure is understood |
| 5 | Full annotation or full dataset, evaluation harness | Reproducible script produces every result |
| 6 | Integrate in Stockify/FinPilot UI; add explanation and abstention | Mid-term demo runs offline |
| 7 | Final evaluation, error analysis, paper draft | Draft reviewed by guide; conference shortlist checked |
| 8 | Report, viva preparation, demo hardening, buffer | Full rehearsal with network disabled |

**How evaluation usually works** — [UNVERIFIED, general background only; confirm against your university's scheme]
- Typically staged reviews (proposal, mid-term, final), a report, a live demo and a viva with internal and often external examiners. Exact weights vary widely.
- Publication may be encouraged or required locally, but an IEEE-branded conference does not guarantee indexing in IEEE Xplore. Check the proceedings of earlier editions.
- My recollection is that UGC changed its CARE list arrangements in 2025. I could not confirm this. Ask the department which indexing it accepts.
- Likely viva questions: why this method beats the baseline, where the data came from and on what licence, what each team member built, and what happens when the model is wrong. Prepare evidence for each.

**Common failure modes, with mitigations**

| Failure mode | Verified reason it applies here | Mitigation |
|---|---|---|
| Live demo fails on a data source | Yahoo returned 429 to a bare client | Cache; run the demo offline |
| LLM behaviour changes mid-project | `gemini-2.5-flash` earliest shutdown 1 Dec 2026, auto-routes to a different model | Pin the model, keep a regression test set, keep a local Ollama fallback |
| Free quota runs out during evaluation | Per-project limits with no published figures; dynamic Colab limits | Cache LLM responses; batch early; start evaluation weeks before the deadline |
| Real personal data leaks to a free API | Free tier content is used to improve Google products | Synthetic or consenting-test data only, with PII stripped |
| Promising what regulated access can't deliver | AA FIU status requires a financial regulator; sandbox uses mock data | State "sandbox simulation" from the first slide |
| Terms-of-use breach through scraping | NSE ToU bans automated collection | Record the source and permission for each dataset |
| Inflated fraud or credit metrics | Elliptic has mostly unknown labels; PaySim and AMLworld are synthetic | Use PR-AUC, temporal splits and leakage checks; do not extrapolate to production |
| Over-claiming novelty | The literature and product checks in these notes are partial | Include a prior-work table and say "to our knowledge" |
| Advice liability | Investment and insurance advice is regulated (specific rules not reviewed here) | Add a disclaimer, label it decision support, take specific legal questions to faculty |
| Stack drag | AGE not on Neon; Prisma needs raw SQL for extensions; Noir not production-ready | Avoid adding a database or a ZK layer unless it is the contribution |
| Scope sprawl | Six areas and five mechanisms are all tempting | One mechanism, one evaluation, one integrated demo |
| Unequal contribution | [UNVERIFIED, common experience] | Assign each member a named module and metric |

### Gaps
- Actual weightings for viva, demo, report and publication at any Indian university: **not verified**. The team should get the department's rubric first.
- IEEE conference selection, predatory-venue checks and current UGC-CARE status: not verified. Follow-up searches are needed once search is available again.
- Empirical data on why student fintech projects fail: none found. The table is reasoning from verified technical constraints, not a study.
