# Personal finance decisions, household debt, lending and credit risk in India: inadequately addressed problems and project directions

**Compiled:** 6 November 2026. All "latest" figures below are the latest I could find, not necessarily the latest published.

**How to read the labels**
- **[Fact]**: read in a primary official or company document (RBI, CFPB, CRIF, NCFE, MoSPI, product docs).
- **[Reported]**: secondary coverage of a primary source (press, law firm, blog). Treat as weaker.
- **[Research]**: a paper's finding, not settled fact. Most arXiv items are preprints.
- **Inferences** sections are my own reasoning, not sourced claims.

**Limits of this research (these affect how far you can trust "not found")**
- The session's web search budget ran out before several planned searches ran: RBI mis-selling and dark patterns rules, the RBI FREE-AI report, sequence datasets, financial digital twin papers, household microsimulation, credit-active population, and Indian consumer app features. I then used only URLs already surfaced, plus PDFs already saved. So "I did not find X" here often means "the search for X could not run". It does not mean X does not exist.
- Several press sites returned HTTP 403 (Business Standard, Moneylife, Deccan Herald, MDPI, congress.gov, the TransUnion CIBIL PDF). Items from those pages rest on search snippets and are marked as such.
- WebFetch answers come through a summarising model. I checked CRIF, CFPB, NCFE and Palta et al. against locally extracted PDF text. RBI FSR figures were read through the summariser from RBI's HTML pages, so check exact wording before quoting.
- One press figure failed verification: see the 8.2% note in the first section.

---

## 1. Household over-indebtedness and bureau data gaps

### Takeaway
At system level, RBI's data shows rising household debt but improving borrower quality, so this is not a headline crisis. The inadequately addressed problem is concentrated: very small personal loans, young and NBFC or fintech borrowers, and borrowers with many live loans. Bureau refresh has shortened to weekly, but a window of roughly 11 to 13 days remains (my calculation), which is long compared with digital loans that can disburse quickly.

### Cited Findings

**Evidence: system level**
- [Fact] Household debt reached 45.5% of GDP by end-September 2025. Non-housing retail loans were 58.4% of household borrowings at March 2026. Consumption loans were nearly half of household borrowings. — [RBI FSR June 2026, Ch. I, paras 1.64-1.65](https://www.rbi.org.in/Scripts/PublicationReportDetails.aspx?UrlPage=&ID=1324)
- [Fact] The previous FSR gave 41.3% of GDP at end-March 2025, against a five-year average of 38.3%. — [RBI FSR December 2025](https://rbi.org.in/scripts/PublicationReportDetails.aspx?ID=1313)
- **Conflict:** a Deccan Herald opinion piece was summarised in search results as saying 47.8% by December 2025. I could not open it (403) and found no RBI confirmation. — [Deccan Herald](https://www.deccanherald.com/amp/story/opinion/the-limits-of-borrowed-growth-4082266)
- [Fact] RBI says borrower profiles keep improving: the prime-and-above share rose by both amount and borrower count. — [RBI FSR June 2026, para 1.68](https://www.rbi.org.in/Scripts/PublicationReportDetails.aspx?UrlPage=&ID=1324)
- [Fact] Box 1.2 surveyed ten large banks (89% of personal loans) over nine quarters. The one-year default rate fell from 0.51% (Dec 2024) to 0.35% (Dec 2025), and sub-prime fell from 1.85% to 1.01%. Originations and impairments are concentrated below ₹10 lakh income. — [RBI FSR June 2026, Box 1.2](https://www.rbi.org.in/Scripts/PublicationReportDetails.aspx?UrlPage=&ID=1324)
- [Reported] Gross NPAs were 1.7% on unsecured retail and 0.7% on secured retail at March 2026, per coverage of the FSR. — [Policy Circle](https://www.policycircle.org/economy/rbi-financial-stability-report-loans/)
- [Fact] Personal loans at June 2026: ₹17.0 lakh crore outstanding (+13.8% YoY), 12.7 crore active loans, PAR 31-90 1.5%, PAR 91-180 0.8%, PAR 180+ 5.3%. — [CRIF High Mark, How India Lends, Sept 2026](https://www.crifhighmark.com/media/7548/how-india-lends-september-2026.pdf)

**Evidence: small-ticket and fintech**
- [Fact] Fintechs held 56.8% of personal loans under ₹50,000 by March 2026. Their credit grew 41.6%, against 20.1% for the segment, with delinquencies of 6.4%. Unsecured loans are 70.5% of their book, and around half of those borrowers are under 35. — [RBI FSR June 2026, para 1.58](https://www.rbi.org.in/Scripts/PublicationReportDetails.aspx?UrlPage=&ID=1324)
- [Reported] Same segment by lender: delinquency 6.4% fintech, 5.7% NBFC, 4.1% banks. Market share 30.7% NBFC and HFC, 10.1% banks. — [Kotak Neo](https://www.kotakneo.com/news/regulations/rbi-financial-stability-report-bank-npas-below-2-percent-fy28/)
- [Reported] Fintech small-ticket default was just over 4% in March 2024 and 6.4% in March 2026. — [Jeeto Bharat, a UPSC notes site, so weak](https://www.jeetobharat.com/upsc-current-affairs/rising-fintech-personal-loan-defaults-rbi-warns-of-asset-quality-risks-gs3-2026-07-01)
- [Fact] In Q1 FY27, loans under ₹1 lakh were 21.6% of personal loan originations by value (16.4% in Q4 FY25) and 89.4% by count. NBFCs were 46% by value and 92.3% by count. Average ticket was ₹61,112. Originations were 489.5 lakh loans worth about ₹2.99 lakh crore, value up 34% YoY. — [CRIF, Sept 2026, pp. 19-21](https://www.crifhighmark.com/media/7548/how-india-lends-september-2026.pdf)
- [Fact] Personal loans under ₹1 lakh had PAR 31-90 of 2.38% at June 2026, up from 2.04% at March 2026 by my reading of chart text. CRIF calls NBFCs and the under-₹1 lakh segment elevated relative to other segments, while saying delinquency improved YoY across lender types. — [CRIF, Sept 2026, pp. 7, 22](https://www.crifhighmark.com/media/7548/how-india-lends-september-2026.pdf)
- [Fact] Consumer durable loans are the top entry product for new-to-credit borrowers (45.5% share), followed by gold loans (18.3%). Durables above ₹50,000 show rising stress, with PAR 31-90 at 1.26%. — [CRIF, Sept 2026](https://www.crifhighmark.com/media/7548/how-india-lends-september-2026.pdf)

**Evidence: multiple loans**
- [Fact] Nearly three-fifths of personal loan customers in Q2 FY25 had more than three live loans at origination. Of borrowers taking a personal loan under ₹50,000, 11.0% already had an overdue personal loan, and over 60% of them had taken more than three loans so far that year. — [RBI FSR December 2024, para 1.96](https://www.rbi.org.in/Scripts/PublicationReportDetails.aspx?UrlPage=&ID=1284)
- [Fact] Impairment is elevated among borrowers with unsecured loans from five or more lenders. RBI gives no number in the text I read. Small-ticket fintech impairment is higher than at other NBFCs. — [RBI FSR December 2025](https://rbi.org.in/scripts/PublicationReportDetails.aspx?ID=1313)
- **Microfinance, not retail.** The "3+ lenders fell to 9.7%" (March 2026) and "4+ lenders 3.6% to 5.8%" (Sept 2021 to Sept 2024) figures both refer to microfinance borrowers. Press often omits this. — [FSR June 2026, para 1.51](https://www.rbi.org.in/Scripts/PublicationReportDetails.aspx?UrlPage=&ID=1324); [FSR December 2024, para 1.90](https://www.rbi.org.in/Scripts/PublicationReportDetails.aspx?UrlPage=&ID=1284)
- **Failed check:** [Deccan Chronicle](https://www.deccanchronicle.com/amp/business/rbi-flags-risks-as-share-of-borrowers-availing-multiple-loans-rise-1850782) was summarised as giving 8.2% delinquency for small personal loans. In the first 100,000 characters of the FSR, 8.2% appears only as a GDP growth figure. The last 12,000 characters were not read. Do not use this number.

**Evidence: young borrowers**
- [Reported] CRIF: unpaid loans of 2.6% for under-25s and 2.7% for ages 26-30 (Nov 2025), the highest of any age group. — [Free Press Journal, 15 Jan 2026](https://www.freepressjournal.in/business/borrowers-under-30-show-highest-loan-default-rates-on-unsecured-vehicle-loans-crif-report)
- [Reported] TransUnion CIBIL: over 60% of fintech borrowers are under 30, and small-ticket personal loans were 92% of fintech originations (Dec 2024). Vintage defaults among repeat borrowers rose to 4.7% by mid-2024. — [Angel One, 30 May 2025](https://www.angelone.in/news/over-60-of-fintech-borrowers-in-india-are-under-30-says-transunion-cibil)
- [Reported, snippet only] TransUnion CIBIL: gold-loan delinquencies nearly doubled between March and August 2026 but stayed below year-ago levels. Stress is concentrated among borrowers with multiple gold loans, smaller tickets and past missed payments. Gen Z is about one in five originations. — [Business Standard](https://www.business-standard.com/finance/news/india-gold-loan-delinquencies-transunion-cibil-portfolio-august-2026-126110501124_1.html)
- [Fact] Gold loans grew at 42.4% CAGR since March 2024, driven mainly by existing borrowers taking larger loans and rolling over debt. — [FSR June 2026, paras 1.71-1.72](https://www.rbi.org.in/Scripts/PublicationReportDetails.aspx?UrlPage=&ID=1324)
- **Definition conflict:** CRIF shows gold loans at ₹21.7 lakh crore (June 2026, including priority sector); the FSR coverage gives ₹5.14 trillion (₹5.14 lakh crore, May 2026). These are clearly different scopes. — [CRIF](https://www.crifhighmark.com/media/7548/how-india-lends-september-2026.pdf); [Policy Circle](https://www.policycircle.org/economy/rbi-financial-stability-report-loans/)

**Evidence: bureau reporting**
- [Reported] Fortnightly reporting began 1 January 2025 (15th and last day of month, submission within 7 calendar days). — [XBRL International](https://www.xbrl.org/news/rbi-mandates-fortnightly-credit-information-reporting-to-boost-transparency/); [Mehta & Mehta](https://www.mehta-mehta.com/rbi-update-frequency-of-reporting-of-credit-information-by-credit-institutions-to-credit-information-companies/)
- [Reported] Amendment Directions of 4 Dec 2025 moved to weekly reporting from 1 July 2026: reference dates on the 9th, 16th, 23rd and last day, incremental files within 4 days, full file by the 5th of next month, plus CKYC numbers where available. — [OneFin](https://www.onefin.in/post/rbi-s-credit-reporting-overhaul-what-the-weekly-mandate-means-for-nbfcs); [Business Standard, date only](https://www.business-standard.com/amp/finance/news/rbi-extends-credit-information-reporting-norms-july-1-2026-125120401312_1.html)
- [Fact] Regulated entities must report lending through digital lending apps to CICs "irrespective of its nature/ tenor". — [RBI Digital Lending Directions 2025, para 16](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12848)
- [Fact] US comparison (pay-in-four BNPL at six firms): about 63% of borrowers held simultaneous loans and 33% (Table 4: 32.6%) across firms in 2022. Most of these loans did not appear in credit records, and stacking across firms is "a particular blind spot". Simultaneous means a further loan within 42 days. — [CFPB, Jan 2025](https://files.consumerfinance.gov/f/documents/cfpb_BNPL_Report_2025_01.pdf)
- [Reported] BNPL in India: RBI's 2022 bar on loading non-bank PPIs through credit lines hit the PPI-based pay-later model. A law review said the resulting loans would need KYC and bureau reporting. — [Kapronasia](https://kapronasia.com/insight/blogs/payments-research/india-payments-research/assessing-the-implications-of-india-s-ban-on-fintechs-firms-using-ppis-to-provide-loans-to-customers); [RMLNLU Law Review](https://rmlnlulawreview.com/2023/11/07/the-changing-face-of-credit-bnpl-financial-inclusion-and-the-rbis-regulatory-dilemma-part-i/)
- [Reported] UK deferred payment credit came under FCA regulation from 15 July 2026, with proportionate affordability checks. EU CCD2 applies from 20 November 2026 and covers BNPL, with limited exemptions. The CFPB withdrew its 2024 BNPL interpretive rule. — [MMG](https://mmgcorporation.com/blog/bnpl-is-getting-regulated/); [Qwist](https://qwist.com/en/resources/blog/open-banking/ccd2-for-bnpl-and-lenders/); [American Banker](https://www.americanbanker.com/news/amid-deregulation-us-bnpl-firms-look-to-europe-for-guidance)

**Who suffers**
- Young, NBFC and fintech borrowers of very small loans, and households below ₹10 lakh income, per the figures above.
- [Reported, snippet] Dvara's CPHS analysis: households with outstanding debt rose from 48% (2021) to 52% (2023). The lowest-decile consumption-to-income ratio rose from 0.99 (2019) to 1.11 (2023). — [Dvara Research](https://dvararesearch.com/how-have-household-balance-sheets-changed-post-the-pandemic-a-descriptive-analysis-of-household-portfolios-using-cmies-consumer-pyramid-household-survey-dataset/)

**Existing solutions**
- Weekly bureau reporting, CKYC linking, tenor-agnostic reporting and bureau dispute compensation of ₹100 per day after 30 days. That compensation excludes credit score calculation disputes. — [RBI circular, Oct 2023](https://www.pdicai.org/Docs/RBI-2023-24-72_3010202312055997.PDF)

### Inferences
- **Check the 45.5% jump.** RBI's figures imply a rise from 41.3% (March 2025) to 45.5% (September 2025), 4.2 points in six months. That is large enough that a revised series or changed GDP base may be involved. I could not confirm which, so do not present it as six-month growth without checking.
- **Remaining lag.** On the reported dates, a loan can wait up to about 9 days for the next reference date, then up to 4 more to be submitted: roughly 11-13 days, before CIC processing. That is down from about 22 days under the fortnightly rule (15 + 7).
- **Why the lag matters more for small loans.** CRIF's quarterly originations equal about 39% of active loan count (489.5 / 1,270 lakh). So the book turns over quickly, and each lender's bureau view of recent loans is more often stale.
- **Representation gap.** Box 1.2's reassuring default rate covers ten large banks, while the 6.4% small-ticket figure sits in fintechs. They are different metrics and populations and should not be compared directly. Still, the system average does not tell you about the segment where stress is.
- **The problem is real but bounded.** PAR is improving YoY. A project should not claim India has a debt crisis. "Concentrated, rapidly changing, poorly observed" is defensible.
- **India differs from the US on reporting.** Para 16 mandates what the US largely lacks, so India's gap is timing and matching across lenders, more than absence.

### Gaps
- I could not read TransUnion CIBIL's CMI March 2026 PDF (403). Only a snippet was seen: CMI 102 for the December 2025 quarter, against 97. — [TransUnion CIBIL newsroom](https://newsroom.transunioncibil.com/uptick-in-consumer-credit-market-indicator-signals-improving-credit-market-ecosystem/)
- I did not read RBI's December 2025 Amendment Directions directly. Weekly dates come from secondary sources. I found no evidence on actual compliance or disbursal-to-visibility times.
- I found no public figure for stacking between refreshes in India, and no under-30 and sub-₹50,000 cross-tab.
- I found no reliable India BNPL delinquency figure. A web page's 8.4% attributed to TransUnion CIBIL is unverified and should not be used.
- I did not collect a BIS or other cross-country debt-to-GDP comparison. RBI's section heading calls India's household debt relatively low (seen in a search snippet).

---

## 2. Affordability: how it is assessed, what is missed, and whether simulation tools exist

### Takeaway
Affordability in Indian lending and consumer tools appears to be mostly a point estimate: FOIR, imputed income, an EMI recommendation. The probabilistic planners I found are mainly retirement tools built around market uncertainty. I found no Indian consumer tool doing probabilistic cashflow simulation for a loan decision, but I could not inspect Indian app features, so this remains unverified.

### Cited Findings

**Evidence**
- [Reported, snippet] Lender-marketing pages put FOIR at around 40-50% of net monthly income, with more caution for self-employed applicants. These are not RBI rules. — [Lendingkart](https://www.lendingkart.com/blog/what-is-foir/)
- [Fact] The Digital Lending Directions require an economic profile covering, at minimum, age, occupation and income, kept on record for audit, and bar automatic limit increases without explicit request. — [RBI Directions 2025, para 7](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12848)
- [Research] Palta, Sane and Thomas use a 150,000-household Indian panel. First-time borrowers are poorer, younger, less educated and have higher income volatility than never-borrowers. Borrowing is often preceded by an income or consumption change in either direction. Borrowing raises both the level and the volatility of consumption. — [XKDR working paper](https://papers.xkdr.org/papers/2025Paltaetal_newtocredit.pdf)
  - The abstract says credit does not smooth consumption, while the introduction says it can, at the cost of persistently more volatile food and utility spending. Some short-window results show smoothing, so read it fully before citing.
- [Reported] CMIE CPHS runs about 170,000 panel households, three waves a year, with monthly income series from January 2014. — [IIMB Library](https://library.iimb.ac.in/datasets_db/cmie-cp)

**Who suffers**
- Gig, self-employed and variable-income earners, and first-time borrowers (Palta et al. above). Self-employed applicants are the ones FOIR handles conservatively.

**Existing solutions and what they actually do**
- [Fact] FinBox BankConnect classifies salaried or non-salaried by keywords, ranks the top five credit sources, imputes income for non-salaried borrowers, compares obligations to net income, recommends an EMI, and gives a 50-100% classification confidence score. The page describes no forecasting or simulation. — [FinBox](https://finbox.in/blog/how-finbox-bankconnect-powers-advanced-income-analytics)
- [Reported] FinBox's own research says UPI history is often the most granular signal for gig workers and small merchants (seen as a search snippet). — [FinBox Research](https://research.finbox.in/blog/income-verification-apis-india-vendor-guide/)
- [Fact] ProjectionLab Monte Carlo tests plans against market conditions, with historical returns, dividends and inflation for backtesting. The focus is mainly FIRE and retirement, though it also covers rent-or-buy and big purchases. The page does not say income or expenses are varied. — [ProjectionLab](https://projectionlab.com/monte-carlo)
- [Reported, snippet] Financial Decision Studio claims local-first household modelling with scenario comparison, Monte Carlo and life events. Adoption and India fit are unknown. — [AlternativeTo](https://alternativeto.net/software/financial-decision-studio/about/)
- [Reported, snippet] Origin mentions Monte Carlo-style planning. An Excel template applies Monte Carlo to investment returns only. — [Origin](https://useorigin.com/resources/blog/what-is-monte-carlo-simulation-in-financial-planning); [eFinancialModels](https://www.efinancialmodels.com/downloads/personal-financial-planning-model-with-monte-carlo-simulation-316058/)
- [Reported] A US patent describes household scenario projection with life events and Monte Carlo plus ML. So parts of this idea are already claimed. — [US 11468384](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11468384)
- Car affordability tools found in search were deterministic rule-of-thumb calculators, for example 15% of gross income. — [CalcPlanet](https://www.calcplanet.com/finance/car-affordability-calculator/)

### Inferences
- **What FOIR misses, by construction.** It is one ratio at one time, so it cannot represent income variance, seasonality, future obligations (school fees, a maturing EMI, a planned car), correlation between shocks (job loss raising both income loss and medical costs), or two earners in one household.
- **Remaining technical gap.** A calibrated estimate of P(missed payment or shortfall within H months | this decision, this household) with stated uncertainty. The hard parts are short histories, correlated shocks, and validating without true household panels. Monte Carlo itself is the easy part.

### Gaps
- **Not verified:** what CRED, Fi, Jupiter, Paisabazaar, Moneyview and KreditBee actually provide. Search results only showed marketing-level listings, and the follow-up search could not run. Do not claim that no Indian app does this until someone has checked the apps by hand.
- The planned search on financial digital twins, stochastic household modelling and counterfactual planning could not run. The one earlier search found no peer-reviewed household digital twin paper, mostly construction and collections work, such as [arXiv:2201.03367](https://arxiv.org/pdf/2201.03367) (title and snippet only). This is weak negative evidence.
- I did not find lenders' actual FOIR policies or RBI rules on a numeric limit.
- Lead from prior knowledge, not checked: central bank household stress-test microsimulation is an established method and should be reviewed before claiming novelty.

---

## 3. Early warning for default and debt spirals

### Takeaway
RBI's EWS framework, as written in the 2024 Directions, targets fraud. It is not a framework for spotting borrower distress. Default prediction from transactions and survival models is well studied. What looks less addressed is alert usefulness: lead time at a fixed alert budget, modelling of rollover chains, and whether an intervention helps.

### Cited Findings

**Evidence and existing solutions**
- [Fact] RBI's EWS frames red-flagging as "suspicion of fraudulent activity", leading to investigation "from potential fraud angle". Reporting of red-flagged accounts applies at ₹3 crore aggregate exposure and above. Alerts should be examined preferably within 30 days, and classification decided within 180 days. The text has no AI or ML reference and does not explicitly address retail accounts. — [RBI Master Directions on Fraud Risk Management, July 2024](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12702)
- [Reported, snippet] RBI's site also lists 2026 versions for payments banks, small finance banks and AIFIs with the same structure. I did not confirm whether commercial bank text changed. — [RBI Master Directions](https://rbi.org.in/ScriptS/BS_ViewMasDirections.aspx?id=13623)
- [Fact] RBI tracks SMA-2 slippages and upgrades in consumer lending at aggregate level. — [FSR June 2026, para 1.70](https://www.rbi.org.in/Scripts/PublicationReportDetails.aspx?UrlPage=&ID=1324)
- [Research] A CNN on transaction data predicting mortgage default reported ROC AUC of 0.918, or 0.926 with a random forest. This came through a search snippet. I recall it as Kvamme et al. (2018), but that attribution is not verified and I have no confirmed URL.
- [Research] Albanesi and Vamossy: a deep model outperforms standard credit scoring on the same kind of data. — [arXiv:1908.11498](https://arxiv.org/abs/1908.11498)
- [Research] PDx (Dec 2025): an MLOps champion-challenger with out-of-time validation. Tree ensembles are strongest but need frequent updates. It reports reduced value erosion especially for short-term small-ticket loans. Validated on P2P, business and auto loan data, with no Indian setting stated on the abstract page. — [arXiv:2512.22305](https://arxiv.org/abs/2512.22305)
- [Research] Survival-style models: gradient boosting survival trees for credit scoring ([arXiv:1908.03385](https://arxiv.org/pdf/1908.03385)); a penalised DNN for default over time on Lending Club data ([PMC9476445](https://pmc.ncbi.nlm.nih.gov/articles/PMC9476445/)); a deep cure model ([arXiv:2305.11575](https://arxiv.org/pdf/2305.11575)). Titles and snippets only for the first and third.
- [Reported, snippet] A survey lists a 2024 deep discrete-time survival model with age-period-cohort decomposition and a 2024 transformer for loan default. — [MDPI Information 17(4):395, page returned 403](https://www.mdpi.com/2078-2489/17/4/395)

**Who suffers**
- Borrowers who get collections contact rather than early help, and lenders whose small-ticket portfolios drift quickly. Evidence for the first half is inferential; I did not collect data on collections experience.

### Inferences
- Treating EWS as an unbuilt idea would be wrong. Banks very likely run internal behavioural scorecards beyond the fraud EWS; these are not public, so a project cannot claim to beat them.
- **Remaining technical gap.** Published work mostly reports AUC at a point in time. The more useful questions are lead time at a fixed alert budget, competing risks (default, prepayment, rollover into a new loan), and uplift from an intervention, which needs treatment data that public datasets lack.
- "Debt spiral" has no standard operational definition in anything I read. Defining and measuring one, for example as a refinance chain with rising obligations, is itself a contribution.

### Gaps
- The follow-up search for 2023-2026 transaction-sequence and survival papers could not run, so recent coverage here is thin and this list should not be treated as a literature review.
- I found no public evidence of an Indian consumer-side distress alert, and no retail-specific RBI early warning rule, though I did not search further after the budget ended.

---

## 4. Thin-file and alternative credit scoring: ULI, AA, OCEN, fairness, Digital Lending Directions, recourse

### Takeaway
AA is now large enough to matter, at 8.4% of retail and MSME lending by value in FY26. Thin-file access still has no official population figure I could find. Rejected applicants are owed written "main reasons", but research shows that reasons like these can point to features a person cannot act on. Recourse that stays valid across time and across equally good models is an active research area that public data can test.

### Cited Findings

**Evidence: size of the population**
- [Reported] No official RBI or Finance Ministry count found. Estimates conflict and differ in definition: about 480 million "credit unserved" adults, excluding those newly acquired in the last two years ([CIBIL via Business Standard, 2022](https://www.business-standard.com/amp/article/finance/despite-policy-efforts-half-of-indian-adults-credit-unserved-report-122042500837_1.html)); over 160 million or 20% underserved ([TaxGuru summary of a 2021 CIBIL study](https://taxguru.in/?p=689065)); 300-400 million "credit invisible" ([blog, weak](https://www.siliconindia.com/viewpoint/ceo-insights/targeting-the-next-exclusion-the-credit-invisible-indians-nwid-24223.html)). The attributions above come from search snippets, and the pairing of URL to figure should be checked.
- [Reported] Gen Z forms 41% of new-to-credit consumers (CIBIL via FinBox). TransUnion CIBIL's and FinBox's Gen Z definitions differ. — [FinBox Research](https://research.finbox.in/newsletter/the-pattern/the-pattern-148-why-indian-gen-z-is-lowkey-credit-starved/)

**Existing solutions and what they actually do**
- [Reported] AA in FY26: about ₹3.82 lakh crore across 3.68 crore loans, 8.4% of retail and MSME lending by value and 11.8% by volume. New-to-credit was 18.2% of AA originations by volume, among participating institutions. Women were 19.8% of volume. Banks were 47.3% by value in H2. AA home and LAP loans: 1.09 lakh loans, ₹20,777 crore, up 624%. These are Sahamati's own estimates, and Sahamati is the sector's SRO. — [IANS, 27 Aug 2026](https://ianslive.in/indias-account-aggregator-ecosystem-drives-rs-382-lakh-crore-loans-in-fy26--20260827133606)
- [Reported] H1 FY26: ₹1.47 lakh crore, about 1.5 crore loans, 7.7% and 10.8% penetration. — [Sahamati H1 FY26 abridged report (PDF, not read in full)](https://sahamati.org.in/wp-content/uploads/2026/01/Credit-Reimagined-H1-FY26-Abridged-1.pdf)
- [Reported] CRIF and Sahamati "Consent to Credit" (12 months to June 2026): new-to-credit share 28.5% vs 8.6% for ₹10-25 lakh business loans, and 9% vs 3.8% for personal loans (AA-enabled vs non-AA). The article gives no delinquency comparison. It also says RBI announced an AA interoperability plan on 7 October with a December 2026 target. — [New Kerala, 18 Oct 2026](https://www.newkerala.com/news/a/account-aggregator-expands-credit-access-first-time-borrowers-smaller-352.htm)
- [Reported] ULI at 12 Dec 2025: 64 lenders (41 banks, 23 NBFCs), 136+ data services, 12 loan journeys, per RBI's Trend and Progress report. RBI's RTI response says ULI stores neither customer data nor consent, lenders are responsible for consent and grievances, and no platform-level standards exist. — [MediaNama, 5 Jan 2026](https://www.medianama.com/2026/01/223-unified-lending-interface-64-lenders-136-data-services/)
- [Reported, conflict] At 31 Aug 2026: 136 lenders, 64 service providers, 143 services, 13 states' land records, 2.50 crore API requests that month, citing RBIH. The 64 and 136 reappear in swapped roles against MediaNama, so this may be real growth or an error. RBIH's page returned no body text when fetched. — [Unpay](https://www.unpay.co/blog/unified-lending-interface-uli-explained); [RBIH](https://rbihub.in/projects/unified-lending-interface)
- [Fact] RBIH docs: ULI fetches data from multiple sources in parallel, including income verification from AAs (seen through a search snippet). — [RBIH Docs](https://docs.rbihub.in/unified-lending-interface)
- [Research/Reported, snippet] FinRegLab: in a six-lender study, cash-flow variables predicted risk. A later paper found a model combining bureau and cash-flow data the most predictive overall and across subgroups. — [FinRegLab](https://finreglab.org/research/advancing-the-credit-ecosystem-machine-learning-cash-flow-data-in-consumer-underwriting/). These are US data. The direct findings page returned 404.

**RBI Digital Lending Directions 2025 (8 May 2025; multi-lender provisions from 1 Nov 2025 as reported by [Mondaq](https://www.mondaq.com/india/financial-services/1629916/rbi-digital-lending-directions-2025-an-overview))**
- [Fact] LSPs working with multiple lenders must show a digital view of all matching offers, must name unmatched lenders, and must use "a consistent approach for similarly placed borrowers" with a documented mechanism. Each offer shows lender, amount, tenor, APR, monthly repayment and penal charges, with a KFS link. Ranking is allowed only on a pre-disclosed metric. — [RBI Directions, para 6](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12848)
- [Fact] Apps may not access files and media, contact lists, call logs or telephony functions. One-time access to camera, microphone or location is allowed only for onboarding or KYC, with consent. — [para 12](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12848)
- [Fact] Default loss guarantee is defined as a contractual arrangement compensating for default losses up to a certain percentage of the portfolio. — [RBI Directions](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12848). Law-firm summaries add a 120-day invocation limit: [Mondaq](https://www.mondaq.com/india/financial-services/1629916/rbi-digital-lending-directions-2025-an-overview).

**What rejected borrowers are told**
- [Fact] Since 2007, banks must give the main reasons for rejection in writing for all loan categories including credit cards. — [RBI Fair Practices Code circular, 6 March 2007](https://rbi.org.in/commonman/english/scripts/Notification.aspx?Id=238). NBFC codes echo this, for example [IIFL](https://www.iifl.com/finance/fair-practices-code).
- [Fact] The fetched text of the Digital Lending Directions had no separate provision on reasons for rejected loans. Para 6 names unmatched lenders but does not require reasons. — [RBI Directions](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12848)
- [Reported] Claims that 2025 reforms made specific rejection reasons mandatory appear on blogs. I could not confirm this in a primary source.

**Research: recourse and stability (2023-2026)**
- [Research] Cheon, Wernerfelt, Friedler and Ustun (ICLR 2025): on HELOC with logistic regression, 92.7% of LIME and 77.3% of SHAP explanations did not highlight even one responsive feature. 22.2% of denied individuals could not be approved under any intervention (fixed predictions), under the paper's actionability assumptions. Rates vary by dataset and model, for example Give Me Some Credit with LR: 65.5% (LIME), 46.8% (SHAP), and 15.6% fixed. — [arXiv:2410.22598](https://arxiv.org/html/2410.22598)
- [Research] De Toni et al. (FAccT 2025): recourse, including robust causal methods, can become invalid over time unless the process is stationary. They propose a temporal recourse algorithm assuming access to an estimator of the stochastic process. Tested on synthetic and realistic data. — [arXiv:2410.08007](https://arxiv.org/html/2410.08007v3)
- [Research] ElliCE (listed as NeurIPS 2025): counterfactuals provably valid over an ellipsoidal approximation of the Rashomon set of near-optimal models, with claimed speed advantage. — [arXiv:2602.07674](https://arxiv.org/abs/2602.07674)
- [Research] Jiang et al. (2025 preprint): aggregates predictions and recourse together using argumentation, with guaranteed robustness under model multiplicity per its abstract. — [arXiv:2506.20260](https://arxiv.org/abs/2506.20260)
- [Research] Budde et al. (April 2026): individual actionability constraints, especially hard constraints, can reduce validity and plausibility of recourse and reveal group disparities. — [arXiv:2604.08030](https://arxiv.org/abs/2604.08030)
- [Research] Fang, Chen and Ansell (July 2026): effort-based fairness in mortgage data. Rejected women needed more effort even when predictive parity held. Regularising cut the gap by over 50%, and causal regularisation by over 90% at larger risk-return cost. — [arXiv:2607.28847](https://arxiv.org/abs/2607.28847)
- [Research] RecourseBench (June 2026): 27 recourse methods in a reproducibility-graded framework. No code repository was linked on the abstract page. — [arXiv:2606.16113](https://arxiv.org/abs/2606.16113)
- Related, title or snippet only: [arXiv:2309.06969](https://arxiv.org/pdf/2309.06969), [arXiv:2410.02273](https://arxiv.org/pdf/2410.02273), [arXiv:2311.11349](https://arxiv.org/pdf/2311.11349), [arXiv:2501.14959](https://arxiv.org/html/2501.14959v2).

**Who suffers**
- First-time borrowers, gig workers and women. Women's AA share of 19.8% is low, though no benchmark was collected, and rejected applicants generally.

### Inferences
- **Selection, not causation.** Higher new-to-credit shares in AA cohorts could reflect lender type or product rather than AA itself. No repayment comparison was reported.
- **The directions narrow alternative data.** Para 12 limits device scraping, so cash-flow data through AA looks like the more defensible source for Indian thin-file scoring.
- **Remaining technical gap.** I did not see one work combining temporal validity, model multiplicity and credit-specific actionability on a time-stamped lending dataset. This was not a systematic review.
- **Fairness in India.** Public datasets lack caste and religion, and often income proxies relevant to India, so a student project can test gender and age at most, and only on foreign data. This is my reading from memory of those datasets, not something I verified.

### Gaps
- **OCEN and Aadhaar eKYC:** I collected no evidence. The searches did not run. Do not cite status from these notes.
- **RBI FREE-AI report (August 2025, from memory):** I could not read it. It is likely relevant to explainability expectations and should be checked.
- Whether the EU AI Act classes credit scoring as high risk was not confirmed in this session (I recall that it does, but this is unverified here).
- No Indian evidence was found on whether explanations given to rejected borrowers are specific or useful.
- Sahamati's H2 FY26 report itself was not read.
- I found no India-specific fair lending empirical study.

---

## 5. Consumer protection and financial literacy

### Takeaway
The rules now address dark patterns on multi-lender loan pages, and RBI publishes an app directory, but enforcement evidence is limited to a small official count of blocked apps and few public complaint statistics. The most recent literacy figure I could verify dates from fieldwork in 2018-19: 27% of Indians qualified as financially literate. A newer national survey exists but I found no published results.

### Cited Findings

**Evidence and existing solutions**
- [Fact] LSP content must be unbiased and must not use "dark patterns/deceptive patterns designed to mislead borrowers into choosing a particular loan offer". The definition refers to the CCPA's 2023 Guidelines. — [RBI Directions, para 6(iv), fn. 4](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12848)
- [Fact] Key Fact Statement required. A cooling-off exit of at least one day, paying principal and proportionate APR without penalty. A reasonable one-time processing fee can be retained if disclosed. — [RBI Directions, paras 8, 10](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12848)
- [Fact] All deployed apps must be reported on CIMS with compliance officer certification, but RBI states that it does not verify or validate that data. — [RBI Directions, para 17](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12848)
- [Reported] MeitY has blocked 87 illegal loan apps under Section 69A, per a Lok Sabha reply in December 2025. — [MediaNama](https://www.medianama.com/2025/12/223-meity-87-illegal-lending-apps-it-act/); [Inc42](https://inc42.com/buzz/87-illegal-lending-apps-blocked-so-far-govt/)
- [Reported] A Lok Sabha reply (Unstarred Q.3803, 16 March 2026) gave no counts of blocked apps, complaints or money lost, and left case data to the States. It lists the RBI app directory (operational since 1 July 2025), the SRO-FT framework, SACHET, cybercrime.gov.in and helpline 1930. — [TaxGuru](https://taxguru.in/rbi/illegal-loan-apps-under-watch-as-government-strengthens-digital-lending-rules.html)
- Unverified and conflicting: "47 apps removed in March 2026", "4,700+ removed", "2,200+ removed by Google". These come from blogs without primary sources. — [GoCredit](https://gocredit.money/news/digital-lending-apps-rbi-compliance-march-2026); [Bharatnama](https://bharatnama.com/rbi-banned-loan-apps-india-2026/)

**Literacy**
- [Fact] NCFE-FLIS 2019: 27% All India qualified as financially literate, read from the table in the report. Rural 24%, urban 33%, female 21%, male 29%. A person qualifies only by passing each of attitude, behaviour and knowledge. Fieldwork June 2018 to October 2019. — [NCFE-FLIS 2019 Final Report, s.5.2](https://ncfe.org.in/wp-content/uploads/2023/12/NCFE-2019_Final_Report.pdf)
- [Fact] NCFE's newsletter (Q4 FY26) describes a National Survey on Financial Literacy and Financial Inclusion that will inform the next national strategy. I saw no results in it. — [NCFE newsletter, March 2026](https://ncfe.org.in/wp-content/uploads/2026/05/e-newsletter-edition_23_final.pdf)
- [Research] RBI Bulletin (June 2023): OECD-based score 12.4/19 and attitude only 39.3% normalised, but it is a non-random sample of 584 mostly male, salaried respondents from Hyderabad and online. It is not a national estimate. — [RBI Bulletin](https://www.rbi.org.in/Scripts/BS_ViewBulletin.aspx?Id=21865)

**Who suffers**
- Users of illegal apps, reported to face harassment and data misuse (press accounts of the December 2025 reply), and low-literacy borrowers who need to compare APR and penal charges.

### Inferences
- **Technical gap.** Para 6 creates checkable properties: consistent treatment of similar borrowers, ranking on a pre-disclosed metric, KFS and APR matching what is shown. I did not find an independent audit tool for these. This is a candidate rather than an established gap.
- **Literacy is mostly not an engineering problem.** A chatbot does not address a 27% figure on its own. Evidence of behaviour change would need field trials, beyond a student project.
- Age data in NCFE's report says 18-29-year-olds are the most literate group, while under-30s have the highest delinquency in CRIF's data. Definitions differ, but this suggests literacy alone does not explain repayment stress. It is a suggestive contrast, not a tested relationship.

### Gaps
- RBI guidance on dark patterns beyond the Digital Lending Directions, and any 2026 mis-selling directions, could not be searched.
- CCPA's 2023 Guidelines were not read directly.
- I found no official count of unauthorised loan app complaints or losses, no SACHET volumes, and no newer count of blocked apps.
- I did not verify India's OECD/INFE comparison score.

---

## 6. What is truly open technically vs. merely a product or data-access gap?

### Takeaway
All verdicts here are my inference from the sources above. The best project territory is where the difficulty stays even with perfect data access: time-valid recourse, calibrated decision-level risk, and measuring what a lagged bureau hides. Real-time cross-lender visibility and AA-based scoring are mostly data, access and regulatory problems.

### Cited Findings
The evidence for each row is cited in sections 1-5. No external source makes this classification.

### Inferences

| Problem | My classification | Why |
|---|---|---|
| Recourse valid across time and model refresh | Technically open (active research) | De Toni 2025 and ElliCE 2025 each address part. Evaluating the combination on real time-stamped credit data looks thin. |
| Principal reasons that a person can act on | Partly open | Responsiveness methods exist (Cheon 2025). Adoption and Indian actionability constraints remain. |
| Calibrated P(shortfall) for a specific decision | Partly open | Simulation is easy. Calibration without household panels is hard. |
| Correlated household shocks, joint earners | Technically open, data-limited | CPHS could inform it but is licensed. |
| Inferring hidden obligations under reporting lag | Partly open | Nowcasting methods exist in other fields. Applying them here seems new, and validation data is limited. |
| Real-time cross-lender loan visibility | Mostly regulatory and infrastructure | RBI already shortened cycles. A student team cannot add a data feed. |
| Default prediction on tabular data | Not a good target | Crowded: long-running Kaggle work and many papers. |
| Consumer distress alerts | Product and data gap, with some research on lead time | Needs transaction panels and intervention data. |
| Cash-flow scoring with AA data | Mostly data access | Production needs FIU onboarding and consented data. Sandbox data is mock. |
| Loan-page compliance audit | Mostly engineering, with an open measurement angle | Rules are specific, but access to real offers is limited. |
| Financial literacy | Behavioural, not technical | Needs field evaluation. |

### Gaps
- This classification is not based on a systematic literature review. Check novelty claims with a proper Google Scholar and arXiv search before committing.

---

## 7. Realistic data for student prototypes

### Takeaway
No public dataset gives Indian household transaction histories with loan outcomes. A workable plan is to use Home Credit for time-stamped loan and bureau behaviour, AIDIS for Indian debt structure, AA sandbox for schemas only, and a clearly labelled synthetic generator for transactions.

### Cited Findings
- [Fact] **AIDIS 2019 (NSS 77th round):** unit-level data on the MoSPI portal. Fieldwork in two visits, January to December 2019. Incidence of indebtedness about 35% rural and 22.4% urban, as on 30.06.2018. Access terms were not stated on the catalog page. — [MoSPI press note](https://www.mospi.gov.in/sites/default/files/press_release/press_note-AIDIS-240821.pdf); [Microdata catalog 156](https://microdata.gov.in/NADA/index.php/catalog/156). I found no newer round.
- [Fact] **CMIE CPHS:** licensed. IIMB's copy is "for use by the IIMB Community only". Students need institutional access. — [IIMB Library](https://library.iimb.ac.in/datasets_db/cmie-cp); [CMIE](https://register.cmie.com/lib/cphsdx.pdf)
- [Fact] **AA sandbox (Setu):** sign up on The Bridge, create an FIU product, and get mock data for all 23 FI types. Production needs KYC and FIU onboarding with Sahamati. Cost is not stated. — [Setu docs](https://docs.setu.co/data/account-aggregator/quickstart)
- [Reported, snippet] **OneMoney** offers test mode with a test FIU ID, with sandbox servers up 7 AM to 1 AM. **Sahamati** lists sandboxes from Protean, Saafe, Setu and NADL, and tells testers to use dummy data. — [OneMoney](https://docs.onemoney.in/api); [Sahamati](https://sahamati.org.in/?p=3007). Hackathon FAQ from 2020, possibly dated: [Sahamati FAQ](https://sahamati.org.in/account-aggregator-hackathon-tech-faq/)
- [Research] **HELOC (n=5,842), German (n=1,000), Give Me Some Credit (n=120,268):** used with these sizes in recourse benchmarks. — [Cheon et al.](https://arxiv.org/html/2410.22598)
- [Reported, snippet] **Home Credit Credit Risk Model Stability:** the competition scores mean Gini across time and penalises instability, so it directly supports temporal testing. — [Erdos Institute project](https://www.erdosinstitute.org/project-database/spring-2024/home-credit---credit-risk-model-stability-iii)
- [Research] **Synthetic transactions:** a benchmark of CTGAN, DoppelGANger, WGAN, FinDiff and TVAE found none reproduces the real data's graph structure. FinDiff and TVAE were best for replication, and CTGAN most balanced. — [arXiv:2412.14730](https://arxiv.org/abs/2412.14730)
- [Research, snippet] A Central Bank of Paraguay study evaluates synthetic banking microdata, including a credit risk use on 700,000 credit cards. — [arXiv:2410.22519](https://arxiv.org/pdf/2410.22519)
- [Reported, snippet] Synthetic data inherits biases of its source. — [CDO Magazine](https://www.cdomagazine.tech/opinion-analysis/synthetic-data-for-financial-ai-key-concepts-use-cases-and-risks)
- [Fact] **RBI and CRIF aggregates** can calibrate a simulator's marginal distributions, for example ticket size, lender share and delinquency by bucket. See section 1.

### Inferences
- **Prior-knowledge items, not opened this session. Verify licence and availability before planning around them:**
  - Home Credit Default Risk: https://www.kaggle.com/c/home-credit-default-risk (I recall tables for bureau, bureau_balance, previous_application, installments_payments)
  - Home Credit Credit Risk Model Stability: https://www.kaggle.com/competitions/home-credit-credit-risk-model-stability (I recall a week-number field)
  - Give Me Some Credit: https://www.kaggle.com/c/GiveMeSomeCredit
  - Lending Club: official downloads were, as I recall, withdrawn, and Kaggle mirrors circulate.
  - Multimodal Banking Dataset (MBD), pytorch-lifestream, and the Berka Czech bank dataset: possible sources for real event sequences. URLs not given because I could not confirm them.
  - PLFS (MoSPI) may help with Indian employment transitions.
- **None of these is Indian lending data with outcomes.** Results will carry a transferability limit, and reports must say so.
- **Synthetic data cannot validate a model of real behaviour.** It can test whether a method recovers known ground truth. Do not report synthetic AUC as evidence of real-world performance.
- **Ethics.** Do not scrape real borrowers' data or submit fake loan applications to lenders. Check app terms and get faculty sign-off for any audit work.

### Gaps
- I did not verify current licence terms for any Kaggle dataset, or whether AIDIS has loan-level variables (the data dictionary was not read).
- I found no Indian open dataset with loan outcomes.

---

## 8. Candidate technical mechanisms (beyond a dashboard, EMI calculator or chatbot)

### Takeaway
My suggested order is A, then B, then C, with D and E as narrower alternatives. A is the most testable on public data and closest to current research. B best matches the "buying a car" question but is hardest to validate. All novelty statements are my inference and provisional because the literature search was cut short.

### Cited Findings
Evidence behind each mechanism is cited in sections 1-7. The closest prior work is named under each mechanism below.

### Inferences

**A. Time- and multiplicity-robust recourse for loan rejections**
- *Mechanism:* given a rejection, produce an action plan with a stated probability of still leading to approval after k months and after a model refresh. Rank features by responsiveness, and use Indian-relevant action constraints (for example, cannot add income instantly; can close a small loan).
- *What is new:* De Toni handles time, ElliCE and Jiang handle multiplicity, and Cheon handles responsiveness. I did not see them combined and tested on a time-stamped credit dataset.
- *Evaluation:* Home Credit Stability. Train on early periods, generate recourse, and test in later periods across a set of near-optimal models. Metrics: validity decay over time, cost, share with no recourse, group effort gap (Fang et al.), with RecourseBench-style baselines.
- *Limit:* user actions are simulated, so real follow-through is not measured.

**B. Decision-level household cashflow simulator with calibrated uncertainty**
- *Mechanism:* for a decision like buying a car, simulate joint paths for income, spending and obligations, including correlated shocks and two earners, to output P(shortfall within H months) with an interval, and search for the smallest change that keeps risk acceptable (tenor, down payment, timing).
- *What is new:* replaces point FOIR with a calibrated, decision-specific probability. Tools I read focus on market returns. The patent above shows that adjacent ideas exist, and a check for Indian apps is still needed.
- *Evaluation:* (1) Recovery tests on a synthetic generator with known parameters. (2) Using Home Credit, test whether a simulated risk feature built from instalment history adds out-of-time lift beyond an annuity-to-income ratio. (3) If institutional access exists, CPHS for calibrating income volatility. Metrics: Brier score, calibration error, coverage.
- *Limit:* public data has no full income paths, so test (2) is an indirect proxy. Say so clearly.

**C. Hidden-obligation nowcasting under bureau reporting lag**
- *Mechanism:* treat recent loans as partially observed because of reporting delay. Estimate the distribution of unseen obligations at decision time, borrowing reporting-delay correction ideas from other fields. Use weekly RBI reference dates as the delay structure.
- *What is new:* frames stacking between refreshes as an estimation problem rather than a demand for more data. I found no public paper doing this, but this was not specifically searched.
- *Evaluation:* on Home Credit bureau and previous-application history, mask loans opened inside a simulated 7, 11 and 22-day window. Measure recovery of the hidden count and amount, and default-prediction lift at each window, to estimate what weekly reporting actually gained.
- *Limit:* foreign data and simulated delay. It cannot measure actual Indian stacking, and enquiry data may be a real-world shortcut that changes the result.

**D. Survival-based alerting at a fixed alert budget, with rollover chains**
- *Mechanism:* competing-risks model of default, prepayment and rollover into a new loan. Define a debt spiral as a measurable chain, and optimise for lead time when only a fixed share of accounts can be contacted.
- *What is new:* the evaluation target (lead time and alert budget, spiral definition), rather than the model class, which is crowded.
- *Evaluation:* Home Credit instalments and previous applications; Lending Club for a second dataset. Metrics: C-index, integrated Brier score, median lead time at 1%, 5% and 10% alert budgets, and drift across time.
- *Limit:* no cross-lender view and no intervention data, so it cannot show that alerts help borrowers.

**E. Automated audit of multi-lender loan offer pages against RBI para 6**
- *Mechanism:* parse offer screens and KFS documents, recompute APR from the fee schedule, flag mismatches and deceptive patterns, and test whether ranking follows the disclosed metric.
- *What is new:* turns specific regulatory text into checkable tests. I did not find an independent tool, but did not search specifically.
- *Evaluation:* a hand-labelled corpus of public screenshots and KFS samples, plus seeded synthetic violations. Metrics: precision and recall by violation type, APR error. Testing consistency across similar borrowers would need real applications, which is an ethical and legal barrier, so leave it out or limit it to mock pages.
- *Limit:* less "research", and data must be collected by the team. Public access to real offers is limited.

### Gaps
- Before choosing, the team should run the blocked searches: digital twin and household microsimulation literature, recent event-sequence credit models, FREE-AI, OCEN status, and hands-on checks of the Indian apps named in the brief.
- I have not tested any of these mechanisms for feasibility within a project timeline.
