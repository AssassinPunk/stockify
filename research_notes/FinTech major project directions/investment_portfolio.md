# Inadequately Addressed Problems in Retail Investment and Portfolio Management: India First, With Global Comparison

Research date: 6 November 2026.

**Evidence tags used throughout**
- **[FACT]** Regulator or primary document, read directly in this session.
- **[REPORTED]** Regulator or legal fact, read only through news, law-firm or vendor coverage. Check the primary text before quoting it.
- **[RESEARCH]** Academic or working-paper finding. Peer-review status is noted where known.
- **[PRODUCT]** A product's own page or help article, read directly. It shows what the page states, and silence on a page does not prove a feature is absent.
- **[PRODUCT-2ND]** A product claim from a third party or search snippet only.
- **Inferences** sections hold my own reasoning.

**Limits of this research (read first)**
- The session's web-search budget ran out part-way through. No searching was done for 2023-2026 risk-questionnaire papers, the finfluencer and education circular, the November 2025 IA/RA amendments, or Indian factor-model data. These areas are thinner than the rest, and "not found" there is especially weak evidence.
- Sites that blocked direct reading (HTTP 403, 404, 429 or 503): Value Research, Moneylife, Business Standard, SSRN, the Ontario Securities Commission, ResearchGate, regalert, mfxray, Dezerv, Jupiter, and the smallcase help centre. Claims about them rest on search snippets and are tagged accordingly.
- "Not modelled" below always means "not described in the documentation I could reach". It is not proof of absence, and I could not test any app while logged in.

## Key Question 1: How serious is hidden concentration, and what do products actually model?

### Takeaway
No regulator or academic measurement of investor-level look-through concentration across Indian funds, ETFs, stocks, ESOPs, ULIPs and NPS was found, so its severity is **not established**. Equity-only fund overlap is well served and direct-plus-fund overlap now exists in at least one app. I found no documentation of issuer roll-up across equity and debt, promoter-group or supply-chain links, or joint modelling of employer income, ESOPs and loans.

### Cited Findings

**Regulatory context and evidence of severity**
- [REPORTED] SEBI's 26 February 2026 categorisation circular caps overlap at 50% between sectoral or thematic schemes and other equity schemes of the same AMC, measured at ISIN level. Commentators note the cap applies only within one AMC, so cross-AMC holders can still end up with near-identical portfolios, and that scheme-level rules do little for investor-level concentration — [RFMLR](https://www.rfmlr.com/post/calibrated-liberalisation-in-sebi-s-2026-mutual-fund-reforms)
- [REPORTED] Overlap is computed quarterly using daily portfolio values, existing schemes get three years to comply or face merger, large-cap funds are excluded, and AMCs must publish overlap monthly — [INDmoney summary](https://www.indmoney.com/blog/mutual-funds/sebi-new-mutual-fund-rules-2026-explained)
- [REPORTED, CONFLICT] The start date of monthly overlap disclosure is disputed in search-result coverage: August 2026 versus 1 April 2026. Candidate sources are [Belong](https://getbelong.com/blog/mutual-fund-portfolio-overlap/) and [OnFinance](https://onfinanceainewsletter.beehiiv.com/p/sebi-s-mutual-fund-overhaul-is-final), but I did not pin each date to a page or reach the primary circular.
- [SECONDARY, weak] Quoted overlap thresholds conflict and rest on no cited study. Kuvera says below 25% is healthy and above 40% significantly reduces diversification ([Kuvera](https://kuvera.in/blog/how-much-two-mutual-funds-overlap-in-their-holdings/), read directly).
- [SECONDARY, snippets, source per claim not pinned] Other overlap guides claim large-cap pairs typically overlap 35-55%, that SEBI and AMFI define no official threshold, and, as an anecdote rather than a sample, that retail investors hold 12-20 schemes. See [Univest](https://univest.in/blogs/mutual-fund-portfolio-overlap-india), [Midfin360](https://midfin360.com/blogs/what-is-portfolio-overlap-in-mutual-funds), [Rupee Guide](https://rupeeguide.in/blog/mutual-fund-portfolio-overlap/).
- [RESEARCH, peer-reviewed] Balasubramaniam, Campbell, Ramadorai and Ranish (*Journal of Finance*, 2023) model direct holdings across almost 10 million Indian retail accounts. Account traits, including extreme underdiversification such as single-stock holding, link to characteristic preferences, and coheld stocks have higher return covariance — [RePEc record](https://ideas.repec.org/p/nbr/nberwo/29065.html). This covers direct stocks only and does not include funds, ESOPs or debt.

**What products document** (verification level is shown for each)

| Product | What the source says | Level | Not described in the source |
|---|---|---|---|
| INDmoney Mutual Fund Scan | Stock-level holdings across funds, allocation and concentration across funds, sector versus benchmark, over-exposure flags, XIRR versus benchmark. [Feature page](https://www.indmoney.com/features/mutual-fund-portfolio-scan). Fund-level X-ray with top-five weight: [article](https://www.indmoney.com/articles/mutual-funds/mutual-fund-analysis-what-should-you-know-before-buying-any-mutual-fund) | PRODUCT | Pairwise overlap as such, volatility or Sharpe, ULIP, NPS, ESOP |
| Kuvera | Blog explains overlap but names third-party tools, not its own ([post](https://kuvera.in/blog/how-much-two-mutual-funds-overlap-in-their-holdings/)). A second post describes goal planning, tax harvesting and portfolio-level allocation ([post](https://kuvera.in/blog/?p=42041)). Third-party guides claim Kuvera has an overlap feature (likely [this blog](https://investindia.blog/portfolio-overlap-the-silent-wealth-killer-destroying-your-returns-in-2025-complete-investor-guide/); snippet) | PRODUCT plus PRODUCT-2ND, **unresolved** | Own overlap tool not confirmed |
| Value Research Portfolio Manager | Snippets: fund and stock overlap detection, exact stock-level exposure across funds, allocation by geography, sector and type, CAMS statement import, analysis tied to Premium. [Tool article](https://www.valueresearchonline.com/stories/224343/track-analyse-investments-value-research-portfolio-manager-tool/), [Analysis article](https://www.valueresearchonline.com/stories/52557/using-the-analysis-feature-for-smart-investment-decisions/) | PRODUCT-2ND (pages returned 403, snippets only) | Debt-issuer roll-up, group links |
| Morningstar India Instant X-Ray | Up to ten funds: asset allocation, sector versus benchmark, style, top-ten underlying holdings, holding overlap, correlation matrix, R-squared, beta, alpha, Sharpe, standard deviation. Article dated 2 Sep 2021 — [Morningstar India](https://morningstar.in/posts/64689/get-instant-x-ray-fund-holdings.aspx) | PRODUCT, may be dated | Stress test, direct-stock merging, personal balance sheet |
| Morningstar US and Canada | X-Ray and Stock Intersection, which shows a stock's combined weight when two or more holdings hold it. [US](https://www.morningstar.com/mm/investor/portfolio-management-tools?utm_id=n), [Canada](https://morningstar.ca/ca/news/185439/caution-beware-of-dangerous-(portfolio)-intersections.aspx). Whether India has Stock Intersection is unconfirmed. | PRODUCT | Stress test not listed on that page |
| Groww | "Basic overlap check" described only by third-party guides; per-claim source not pinned. Candidates: [Grip Invest](https://www.gripinvest.in/blog/fund-overlap-analysis), [Appreciate](https://appreciatewealth.com/blog/what-is-mutual-fund-overlap) | PRODUCT-2ND | Everything else, no Groww documentation read |
| Zerodha Console | Portfolio XIRR versus indices, dividends, "Risk Probe" red flags from Tijori (governance, accounting, financial, regulatory, operational, each traceable to a filing), 5-year revenue estimates with bear, base and bull cases, return contributors, event timeline — [Support](https://support.zerodha.com/category/console/portfolio/console-holdings/articles/console-analytics) | PRODUCT | The page does not mention fund or ETF look-through, overlap, stress testing, volatility or beta |
| Zerodha Coin | No documentation read | Not verified | Unknown |
| smallcase | Homepage: free "investment score", self-rebalancing stock baskets, Wealth Office net-worth tracking with AI insights — [smallcase](https://www.smallcase.com/) | PRODUCT | Volatility label and risk profile not on that page; help article not reachable |
| Dezerv | Named as a free overlap tool by [INDmoney's blog](https://www.indmoney.com/blog/mutual-funds/how-to-avoid-mutual-fund-overlap) and as a two-fund comparator by [Kuvera's blog](https://kuvera.in/blog/?p=42041). A third-party guide also describes a fuller Portfolio Analyzer (snippet, source not pinned) | PRODUCT-2ND | Own pages not reachable |
| Fi Money (Fi MCP, beta) | Exposes net-worth data to AI clients: mutual funds, Indian and US stocks, FDs, real estate, **ESOPs**, **loans**, cards, bank balances, **EPF, NPS** — [Fi](https://fi.money/features/getting-started-with-fi-mcp) | PRODUCT | The page describes data access only; no risk or overlap analytics are described |
| Jupiter | Page returned 503 | Not verified | Unknown |
| PhonePe Share.Market Portfolio Analyser (not on the original list, but important) | Asset, market-cap and sector split; each stock's contribution through **direct holdings and through funds or ETFs**; flags single-stock concentration and direct-plus-fund overlap with a "reduce overlap" nudge. Uses "standard portfolio thresholds", not personal goals or risk profile — [Support](https://www.phonepeinvest.com/support/home/account-management/portfolio-analyser/how-does-the-app-check-if-my-portfolio-is-diversified) | PRODUCT | Issuer or group roll-up, debt credit, stress |
| MutualFundOverlap.in (CAS-based) | 2-20 equity funds matched by ISIN, CAMS/KFintech statement read in the browser, 1,500+ schemes, 40+ AMCs, monthly AMC disclosures and AMFI NAVs. NSDL and CDSL statements unsupported. Non-listed-stock remainder shown as "Not in listed stocks" — [X-Ray](https://mutualfundoverlap.in/portfolio-x-ray), [home](https://mutualfundoverlap.in/) | PRODUCT | Direct stocks and debt issuers not addressed |
| MF Profiler | Pairwise min-weight overlap that **includes debt instruments** (T-bills, CDs), stated as "facts" and not advice. CAS import in a separate adviser product. Shows negative overlap values on stock-futures legs, unexplained — [MF Profiler](https://www.mfprofiler.com/) | PRODUCT | Issuer roll-up, group links, credit-risk view |
| Vanguard (advisers, US) | Stress tests on historical events and hypothetical shocks. Built for advisers, not retail — [Vanguard](https://advisors.vanguard.com/strategies/portfolio-strategies/portfolio-analysis/stress-testing) | PRODUCT | Factor model not mentioned |

**Your listed exposure types, checked against documentation**
- Promoter-group or conglomerate links: not described by any product above. Zerodha's Risk Probe is the nearest thing, and it is per-stock governance flagging.
- Supply-chain links: not described by any product above.
- Debt credit exposure to the same issuer: MF Profiler shows instrument-level debt overlap; none describes equity-plus-debt roll-up to one issuer.
- Employer-correlated income and ESOP risk: Fi exposes ESOPs as data; none describes correlating them with income or holdings.
- Loans tied to the same risk factor: Fi exposes loans as data; none describes factor-linked loan modelling.
- ULIP and NPS look-through: Fi lists NPS and EPF as balances; Morningstar India's site navigation lists insurance-fund ratings ([page](https://www.morningstar.in/tools/portfolio-x-ray.aspx), a 404 page whose navigation shows this). None describes look-through to underlying holdings.

### Inferences
- Pairwise overlap (the sum of the smaller weights) answers "are these two funds similar?", not "what does my money depend on?". It cannot see that two different tickers share a promoter, a lender or a customer.
- Who suffers most is plausibly salaried investors whose employer, ESOPs, home loan and funds load on the same sector. That is reasoning, and I found no Indian measurement of how common it is.
- Holdings data has a structural staleness of about one month. Tools state this openly, which makes uncertainty-aware look-through a legitimate technical angle.
- Negative futures legs in MF Profiler's output show that arbitrage and hybrid funds will break naive look-through. Any serious engine must handle derivative positions.
- If AMC overlap disclosures are really being published monthly, they give a public validation target for an overlap engine.

### Gaps
- No Indian study of investor-level look-through concentration was found, and the search stopped early. A study may exist.
- ESOP, ULIP and NPS prevalence in retail portfolios: no data found.
- Group exposure limits for mutual funds, and evidence from past credit and group events (I recall IL&FS, DHFL, Franklin Templeton's 2020 wind-ups and the 2023 Adani episode), were **not verified this session**. Check these before using them.
- Whether ULIP and NPS portfolios are published in a machine-readable form: not verified.
- AMFI and NSE aggregate figures (AUM, SIP flows, retail ownership) were not obtained, because the AMFI page returned 404.
- Logged-in app behaviour for all products was not tested.

## Key Question 2: Mismatch between stated risk profile and actual exposure

### Takeaway
SEBI requires risk profiling and suitability for adviser clients, built on client-provided information, and the riskometer labels schemes rather than investors. Research supports the validity of stated measures but also shows weak translation into portfolios and into robo recommendations. A portfolio-level reconciliation of stated profile against actual risk is not something I found required or documented.

### Cited Findings
- [FACT] An IA may advise only after completing the client's risk profile "based on information provided by the client" and getting consent on it. Criteria named include income, age and securities market experience. Risk profiling and suitability apply to all client categories — [SEBI IA FAQs, Aug 2025](https://www.sebi.gov.in/sebi_data/faqfiles/aug-2025/1755174193178.pdf)
- [REPORTED] The June 2023 master circular says the same at clauses 2.1 and 2.2, and says IAs shall not provide free trials — [TaxGuru copy](https://taxguru.in/sebi/sebi-master-circular-investment-advisers.html). A consolidated master circular dated 27 June 2025 reportedly replaced it — [Veritect](https://veritect.ai/legal-news/sebi-master-circular-investment-advisers-2025)
- [FACT] The riskometer has six levels, is evaluated monthly per scheme, and is disclosed on AMC and AMFI websites within 10 days of month-end. A change is not a fundamental attribute change — [SEBI circular, 5 Oct 2020](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2020/1602580413614.pdf)
- [FACT] Its method (Annexure A) is an AUM-weighted score. Debt uses a credit-rating value, Macaulay duration and a liquidity value. Equity uses market-cap bucket, daily volatility over two years of prices and impact cost. "Issuer" appears only in mapping short-term ratings to the issuer's long-term rating. In the sections I read there is no issuer or group concentration term — [same circular](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2020/1602580413614.pdf)
- [REPORTED] A 5 November 2024 circular changed colours and disclosure format — [TaxManagementIndia](https://www.taxmanagementindia.com/visitor/detail_circular.asp?ID=67892)
- [RESEARCH, peer-reviewed practitioner journal] Grable and Chatterjee (*Journal of Financial Planning*, Jan 2026): a single stated risk item plus demographics explains about 14% of variance in allocation composition (R² = .147, F(18, 2016) = 16.81). Mean asset types held rise from about 1.25 to above 3.00 across risk-tolerance groups. Sample is US, skewed to high income, and the outcome counts asset types rather than measuring risk — [FPA](https://www.financialplanningassociation.org/learning/publications/journal/JAN26-risk-tolerance-portfolio-choice-insights-targeted-high-income-sample-OPEN)
- [RESEARCH] Lai and Chow (2023) reviewed questionnaires from 30 robo-advisors in seven Asia-Pacific economies. Tolerance questions outnumbered capacity questions, and most advisers did not use all questionnaire answers in their recommendations. India's inclusion was not confirmed — [Tra Vinh University Journal](https://pdfs.semanticscholar.org/39c1/c33c65b76933b2a5fa59c11e66cb63d35585.pdf)
- [RESEARCH, snippet only] A 2020 study found behavioural (revealed) measures underperform stated measures on reliability, retest stability and criterion validity, and convergence between the two is low. Read as a snippet because the page blocked access — [PMC7505965](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7505965/). **This cuts against assuming "revealed is truer".** Note that those are mainly lab tasks, not portfolio behaviour.
- [RESEARCH, pre-2023] Thompson et al. (arXiv 2021) compared KYC risk with portfolio VaR across 50,000+ accounts of a Canadian dealership to identify over- and under-risked clients — [arXiv](https://arxiv.org/abs/2105.11892)
- [RESEARCH, pre-2023] Alsabah et al. propose a reinforcement-learning robo-adviser that infers risk aversion from observed choices and converges to an omniscient adviser's value — [arXiv](https://arxiv.org/abs/1911.02067)
- [RESEARCH, preprint] Ross and Lo (MIT, April 2026) tested GPT models on 1,000 synthetic clients. Allocation is largely determined by self-reported risk tolerance ("heuristic collapse"), for example GPT-4o on equities (FC = 0.780, R² = 0.882; the degree varies by model and asset class), and web search only partly reduces it — [arXiv 2604.23837](https://arxiv.org/abs/2604.23837)
- [FACT, India behaviour] Stated preference is not observed in SEBI's data, but behaviour is: among traders active throughout FY22-FY26, 65.6% lost in every year, and traders with over ₹10 lakh cumulative loss continued at about 88% — [SEBI behaviour study](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233601328.pdf)

### Inferences
- Three separate things get blurred: risk tolerance (attitude), risk capacity (ability to absorb loss) and actual exposure. A scheme label speaks to none of them at investor level.
- An investor holding only "Moderate" schemes could still hold concentrated group exposure, because the riskometer is a weighted average with no concentration term in what I read. This is a testable hypothesis, not a finding.
- "Revealed preference" from a retail portfolio is confounded by inertia, distributor influence and inattention, so a holdings gap should be reported as divergence, not as true preference.
- The most buildable test here needs no private data: does a riskometer label rank realised drawdown and expected shortfall across schemes?

### Gaps
- **The specific 2023-2026 literature search on questionnaire validity was not completed**, because the budget ran out. Coverage here is a partial sample. Start with Google Scholar for "risk tolerance questionnaire" plus "revealed", and the journals named by the search results.
- No Indian study comparing stated profile against actual holdings was found.
- Whether SEBI requires periodic reconciliation of profile against actual portfolio: not verified.
- The rules for distributors and execution-only platforms on suitability were not checked.
- Riskometer tables lost some column alignment in text extraction. Use the PDF for exact thresholds.

## Key Question 3: Retail F&O losses, SEBI measures and behavioural guardrails

### Takeaway
Losses remain very large and well documented: 87.7% of individual traders lost in FY26, about ₹91,685 crore, after ₹3.85 lakh crore cumulatively over FY22-FY26. Regulation has acted on product structure, and I found no regulatory investor-eligibility test. Broker guardrails I could verify are user-initiated, and no published evidence of their effect was found.

### Cited Findings

**SEBI series**

| Year | Net loss, individuals (₹ crore) | Traders in sample (lakh) | Loss-makers | Average P&L per trader | Source |
|---|---|---|---|---|---|
| FY22 | 40,824 | 42.7 | 90.2% | -95,517 | [SEBI Jul 2025](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2025/1751900271726.pdf) |
| FY23 | 65,747 | 58.4 | 91.7% | -1,12,677 | same |
| FY24 | 74,812 | 86.3 | 91.1% | -86,728 | same |
| FY25 (13 brokers) | 1,05,603 | 96.0 | 91.0% | -1,10,069 | same |
| FY25 (15 brokers, later study) | 1,11,788 | 98.1 | about 90.9% | about -1.14 lakh | Sample size: [SEBI behaviour study](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233601328.pdf) (FACT). Loss: [Business Today](https://www.businesstoday.in/markets/story/rs91685-cr-lost-88-of-individual-traders-lost-money-in-fy26-options-drove-92-of-losses-550474-2026-08-21). Share: [Pulse Signal](https://thepulsesignal.com/updates/sebi-fo-retail-trader-losses-2026/) (REPORTED) |
| FY26 | 91,685 | 78.6 | 87.7% | about -1.17 lakh | Loss-maker share and sample: [SEBI behaviour study](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233601328.pdf) (FACT). Rupee figures: [Business Today](https://www.businesstoday.in/markets/story/rs91685-cr-lost-88-of-individual-traders-lost-money-in-fy26-options-drove-92-of-losses-550474-2026-08-21) (REPORTED) |

- [REPORTED] The January 2023 study found 89% lost in FY22 — [Business Standard](https://www.business-standard.com/amp/article/markets/sebi-study-suggests-89-retail-traders-in-equity-f-o-suffered-losses-123012501466_1.html). The later table shows 90.2% on a different sample.
- [REPORTED] September 2024 study: 93% of 1.13 crore traders lost over FY22-FY24, ₹1.81 lakh crore aggregate, about ₹2 lakh average, 75%+ of loss-makers kept trading after consecutive loss years, and 75%+ of traders declared income below ₹5 lakh — [SEBI press release headline](https://www.sebi.gov.in/media-and-notifications/press-releases/sep-2024/updated-sebi-study-reveals-93-of-individual-traders-incurred-losses-in-equity-fando-between-fy22-and-fy24-aggregate-losses-exceed-1-8-lakh-crores-over-three-years_86906.html), [Taxmann](https://www.taxmann.com/post/blog/93-of-1-crore-fo-traders-saw-rs-2l-avg-loss-while-top-3-5-faced-rs-28l-avg-loss-incl-costs-sebi/), [Outlook Business](https://www.outlookbusiness.com/markets/fo-frenzy-over-93-retail-investors-lost-average-rs-2-lakh-in-three-years-says-sebi)
- [REPORTED] FY26 detail: options were 92% of individual losses; transaction costs about ₹24,800 crore, or ₹31,628 per trader; costs were 35% of loss-makers' gross losses; under-30s were 43% of traders and 89% of them lost; about three-fourths earned below ₹5 lakh; that group had 43% of turnover and 53% of losses; 0DTE share of index options turnover fell from 70% to 59%; SEBI found no causal link from measures to changes — [Business Today](https://www.businesstoday.in/markets/story/rs91685-cr-lost-88-of-individual-traders-lost-money-in-fy26-options-drove-92-of-losses-550474-2026-08-21)
- [REPORTED] Gross trading P&L in FY26: prop traders about +₹44,000 crore, FPIs about +₹14,000 crore, individuals about -₹72,000 crore; 99% of FPI and prop profits came from algo entities; 35% of traders hold no equity; loss rate 93% with no equity holdings versus 58% above ₹10 crore — [Corplaw Updates](https://www.corplawupdates.in/updates/sebi-equity-derivatives-retail-trader-study-fy26)

**SEBI behaviour study, August 2026** — all [FACT] from the [SEBI PDF](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233601328.pdf). SEBI calls the analysis descriptive and associational, not causal. Strategy and capital results use a random sample of 5,050 traders.
- 97% are predominantly options buyers (93% "only options buyers"), and their loss incidence is about 90%. "Majorly options sellers" have 44% loss-makers but average loss of ₹51.7 lakh per loss-maker.
- Peak margin below ₹1 lakh: 77% of traders, 8% of turnover, 14% of losses. The other 23%: 92% of turnover, 86% of losses.
- Experience does not help: loss-makers rise from about 91% among first-year traders to above 95% at four or more years.
- Active over 100 days: 42% of traders, 94% of turnover, 87% of losses.
- Only 15% of client-quarters are profitable. Median losing quarter is ₹10,525 against a median winning quarter of ₹4,366. Of traders with both, 78.7% have a larger average loss than average gain.
- 90-92% of traders who lost in each of the prior two years lost again the next year. Of those active throughout FY22-FY26, 0.5% were profitable all five years and 65.6% lost every year.
- About 57% of the FY25 cohort continued in FY26, against about 65% long-term. Quarterly exit is 28-40%, and 86-89% of those who stop had a loss in the prior quarter.
- For 16.2 lakh traders who stopped after a loss, the median final-quarter loss was 2.2 times their average profit in earlier profitable quarters.
- Of 1.10 crore FY22-FY24 loss-makers, 77% had an FY26 equity portfolio below 25% of their cumulative losses. SEBI notes this does not establish causation or measure household wealth.

**SEBI measures**
- [FACT] From the 1 October 2024 circular: weekly index rationalisation and tail-risk coverage from 20 Nov 2024, higher contract size from Jan 2025, upfront premium collection and removal of expiry-day calendar-spread treatment from Feb 2025, intraday position monitoring from Apr 2025. SEBI notes causality is difficult to establish — [SEBI Jul 2025](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2025/1751900271726.pdf)
- [FACT] Post-measure window (Dec 2024-May 2025): individual premium turnover -11% year on year but +36% over two years; unique individuals -20% year on year but +24% over two years — [same](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2025/1751900271726.pdf)
- [REPORTED] Further: a 29 May 2025 risk-metrics circular ([ICICI Direct](https://www.icicidirect.com/futures-and-options/articles/sebi-on-enhancing-trading-convenience-and-strengthening-risk-monitoring-in-equity-derivatives)); a 1 April 2026 STT rise and 50% cash margin rule, from a broker marketing page containing internal errors ([Alice Blue](https://aliceblueonline.com/blog/sebi-new-fo-rules-2024-to-2026)).
- [REPORTED] SEBI is reportedly reviewing whether weekly expiry should continue, unconfirmed, while its May 2026 draft still allows one weekly benchmark per exchange — [Market Insiders](https://marketinsiders.in/2026/08/31/sebi-may-end-weekly-options-expiry-to-curb-risk/)
- [REPORTED] The May 2026 derivatives consultation, per one summary, covers operations and does not mention retail suitability — [Kotak Neo](https://www.kotakneo.com/news/market-news/sebi-derivatives-market-overhaul-commodity-norms-simplified-2026/)

**Research**
- [RESEARCH, working paper, AEA 2026 programme] Agarwal, Ghosh, Prabhala and Zhao, "Animal Spirits on Steroids" (Nov 2025) — [paper](https://www.aeaweb.org/conference/2026/program/paper/StD8aadb), [SSRN link given in the paper](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5430635). NSE data, 2007-2021:
  - Losses of INR 506 billion. Median position life of 0 days and mean of 2.4 days. Day trading at 90% of volume by the end of the sample. 87% of a contract's lifetime volume falls in its last five days.
  - **Higher participation costs backfired:** in natural experiments, lot-size and margin shocks moved traders to cheaper out-of-the-money options, with shorter horizons and bigger losses.
  - **Fintech effects:** volume rises 55% on switching to a fintech broker, and traders using both types do 31% more there. With trader fixed effects, fintech trades mean ₹5,146 more loss per month for switchers. Treat this as an association with stronger controls, not proof of app causation.
  - **Disposition pattern:** in March 2020, short-put holders about 5.9% of the population reduced but did not fully close, which the authors read as loss-realisation aversion lengthening horizons until expiry forces closure.
- [RESEARCH, snippet, survey-based] A 250-respondent NSE options survey reports a disposition effect — [ResearchGate](https://www.researchgate.net/publication/380334750_Does_the_Disposition_Effect_Justify_the_Options_Traders'_Irrationality). Page blocked, and self-report is a weak design.

**Broker guardrails**
- [PRODUCT] Zerodha Kill Switch is manual: the user disables a segment, must have no open orders or positions, and can re-enable only after 12 hours by OTP. No loss-based trigger is described — [Support](https://support.zerodha.com/category/trading-and-markets/nudge/killswitch/articles/what-is-the-kill-switch)
- [PRODUCT] In June 2021 Zerodha's CEO described automatic loss or drawdown triggers and position limits as planned, and gave no effectiveness data — [Z-Connect](https://zerodha.com/z-connect/nudge/introducing-kill-switch). In the Nudge v2 forum thread, staff say P&L-based exit "will come" and an optional trade-count limit is planned, with no ETA. The latest post, 6 Nov 2026, is an unanswered request for an update — [TradingQnA](https://tradingqna.com/t/nudge-v2-coming-soon-on-kite/198339.md)
- [PRODUCT-2ND, titles and snippets only] Zerodha's 2024 Privacy Mode hides real-time P&L, framed as reducing overtrading — [YourStory](https://yourstory.com/2024/08/zerodha-privacy-mode-hide-real-time-pl-changes-overtrading), [Z-Connect](https://zerodha.com/z-connect/kite/introducing-privacy-mode-on-kite)
- [RESEARCH/REGULATOR, snippet] The Ontario Securities Commission's 2024 report notes push notifications raise retail trades, using US evidence — [OSC](https://www.osc.ca/sites/default/files/2024-02/inv-research_20240223_dark-patterns.pdf)

**Global comparison**
- [FACT] ESMA found 74-89% of retail CFD accounts lose money, with average losses of €1,600-29,000. It imposed leverage caps of 30:1 to 2:1, per-account negative balance protection and a standardised warning showing the provider's own loss percentage — [ESMA](https://www.esma.europa.eu/press-news/esma-news/esma-agrees-prohibit-binary-options-and-restrict-cfds-protect-retail-investors). This is an older measure (I recall 2018; the date was not confirmed on the page read) on a different product.
- [FACT] An Indian exchange ranked first by contracts traded in March 2025, at over 4.3 times the second-ranked exchange — [SEBI Jul 2025](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2025/1751900271726.pdf)

### Inferences
- FY26 has the lowest loss-maker share in the FY22-FY26 series, but the average loss per trader rose, so remaining traders are not obviously better off. Attributing the fall to regulation is unsupported; SEBI itself disclaims causality.
- **Reconciling a reported discrepancy:** outlets quote FY26 traders as both 78.6 lakh and 87.5 lakh. SEBI's Table 1 explains it: 78.60 lakh is the 15-broker sample and 87.71 lakh the estimated total. My arithmetic: ₹91,685 crore / 78.6 lakh = ₹1.17 lakh, so the rupee aggregates are on the sample. SEBI says this covers about 90% of traders and about three-fourths of individual turnover, so the true market total is likely higher.
- Cumulative check: 40,824 + 65,747 + 74,812 + 1,11,788 + 91,685 = ₹3,84,856 crore, matching the reported ₹3.85 lakh crore.
- A guardrail project must beat SEBI's simple features (turnover to capital, days active, prior-loss streak). Those already separate outcomes, so a complex detector with no lift over them adds little.
- The "experience does not help" figure has a survivorship issue in both directions, since winners may stop or switch segment.
- A friction that raises costs can shift behaviour to worse contracts, per Agarwal et al. So guardrails need an evaluation of substitution, not only of volume.
- A broker's revenue incentive runs against friction. Brokerage is 44% of FY26 transaction costs as reported, so this gap is partly incentive, not technology.

### Gaps
- The SEBI profitability study PDF itself was not reached. Rupee figures are from coverage. Press release number conflicts: the SEBI page shows 69/2026, a law blog shows 50/2026.
- Options-trader loss share in FY26 conflicts: 91.0% in search-result coverage (source not pinned) versus 87.7% in [Business Today](https://www.businesstoday.in/markets/story/rs91685-cr-lost-88-of-individual-traders-lost-money-in-fy26-options-drove-92-of-losses-550474-2026-08-21). Futures: 68.4% versus about 66%. Use the SEBI profitability PDF to settle this.
- **Not verified:** a reported 15 October 2026 circular moving expiry settlement to a 30-minute VWAP from 7 December 2026, seen in search summaries only.
- Groww, Upstox, Dhan and Angel One guardrails were not checked, so "manual only" is verified for Zerodha alone. SEBI's mandated F&O risk-disclosure screen (I recall 2023) was not verified.
- No study was found that detects loss-chasing from Indian broker data, and no Indian field experiment on nudges. No published effect size was found for any broker's nudge.
- I recall US 0DTE and retail-options literature but did not verify it.

## Key Question 4: Portfolio resilience and stress testing for retail

### Takeaway
Indian retail tools I could verify offer backward-looking statistics, concentration flags and allocation views, not forward-looking scenario stress tests on an investor's whole portfolio. Comparable global stress tools are often adviser-facing. The India-specific tail-dependence research I found is thin and mostly recent or low-tier, and it covers indices rather than retail portfolios.

### Cited Findings
- [PRODUCT] Morningstar India shows historical R-squared, beta, alpha, Sharpe, standard deviation and a correlation matrix over about three years, per a 2021 article. Stress testing is not described — [Morningstar India](https://morningstar.in/posts/64689/get-instant-x-ray-fund-holdings.aspx)
- [PRODUCT] Zerodha's bear, base and bull view is five-year revenue and EBITDA per company, not a portfolio shock — [Support](https://support.zerodha.com/category/console/portfolio/console-holdings/articles/console-analytics)
- [PRODUCT] PhonePe's analyser applies standard thresholds, with no scenario feature described — [Support](https://www.phonepeinvest.com/support/home/account-management/portfolio-analyser/how-does-the-app-check-if-my-portfolio-is-diversified)
- [PRODUCT] MutualFundOverlap.in's backtest is hypothetical, gross of costs and taxes, and "ranks no portfolio above another" — [X-Ray](https://mutualfundoverlap.in/portfolio-x-ray)
- [PRODUCT] Vanguard's adviser tool offers historical events (2008, Fed tightening, tariffs) and hypothetical shocks to equities, rates and inflation, at portfolio and sleeve level. Full use requires sign-in — [Vanguard](https://advisors.vanguard.com/strategies/portfolio-strategies/portfolio-analysis/stress-testing)
- [RESEARCH, working paper, snippet only] Grover (SSRN, May 2026) applies GARCH(1,1)-EVT with a Student-t copula to Nifty 50, gold in INR and USD/INR, and reports EVT-copula expected shortfall bounds actual losses more tightly than Normal VaR in backtests. Three indices, not portfolios. The page blocked direct reading, and peer review is not confirmed — [SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6921359)
- [RESEARCH, low-tier, snippet only] A 2026 paper fits a skew-t copula with time-varying correlation across Indian government bonds, corporate bonds, equities and REITs — [ISAR](https://isarpublisher.com/backend/public/assets/articles/1778337589-ISARJST-2862026FT-GP.pdf)
- [RESEARCH, preprint] Zhou and Nolde (2024) propose vine-copula reverse stress testing, applied to a bank's currency portfolio, so not equity and not India — [arXiv 2404.00109](https://arxiv.org/abs/2404.00109)
- [RESEARCH, snippet, source not firmly pinned] Student-t copulas capture tail dependence that Gaussian copulas cannot, across nine international equity indices — likely [this KIT paper](https://methods.stat.kit.edu/download/doc_secure1/Comovement-JAE.pdf)
- [RESEARCH, peer-reviewed] Coheld Indian stocks show higher return covariance, a hint that retail clienteles matter for co-movement — [RePEc](https://ideas.repec.org/p/nbr/nberwo/29065.html)
- [REPORTED] AMC-level MF stress tests exist and have been criticised, per the title of a Moneylife article I could not read — [Moneylife](https://www.moneylife.in/article/the-four-fallacies-of-mf-stress-test/74003.html)

### Inferences
- The missing step is not fitting a copula. It is propagating a scenario through uncertain, month-old look-through holdings, debt issuers and personal liabilities to one investor's outcome, in a way they can read.
- Reverse stress ("what combination breaks your goal?") is a better retail question than a menu of historic crashes, and nearly every approach I found starts from the institutional side.
- Tail estimation rests on few independent crises, so evaluation must be honest about this, with block-based uncertainty and held-out crises.

### Gaps
- Indian factor data was not verified. I recall the IIMA Fama-French-style data library for India, but my search returned nothing on it. Check before relying on it.
- Portfolio Visualizer, Interactive Brokers and similar retail-facing global tools were not checked, so "global tools are adviser-facing" rests on a small sample.
- A proper search for India-specific factor models and scenario generators (2023-2026) could not be run. Treat "thin" as provisional.
- The SEBI/AMFI MF stress-test disclosure rules were not read.

## Key Question 5: Explainable recommendations and regulatory boundaries; what this means for a student prototype

### Takeaway
Personalised advice for consideration sits under the IA framework, with risk profiling first, and AI use must be disclosed while responsibility stays with the registered entity. SEBI's wider AI/ML guidelines appear still forthcoming. A student prototype is safest as a free, descriptive, research-evaluated exposure analyser using synthetic or self-consented data, and legal specifics need checking with a qualified person.

### Cited Findings

**IA and RA rules**
- [REPORTED] Amendments dated 16 December 2024 reduced the minimum qualification to a graduate degree, removed the five-year experience requirement and allowed part-time registration with conditions. People making unapproved advice or return claims do not qualify. Implementing circulars followed on 8 January 2025 — [TaxGuru](https://taxguru.in/sebi/sebi-eases-rules-investment-advisers-research-analysts-2024-overhaul.html)
- [REPORTED] Fee caps: 2.5% of assets under advice per annum per client family, or ₹1,51,000 per annum per family under fixed fee — [Sansa Legal](https://www.sansalegal.com/post/sebi-investment-advisers-second-amendment-regulations-2025-deposit-system-fee-caps-and-ai-disclos)
- [REPORTED] AI: extent of use must be disclosed at the advisory agreement for IAs, and existing IA clients were to be told by 30 April 2025 — [Sansa Legal](https://www.sansalegal.com/post/sebi-investment-advisers-second-amendment-regulations-2025-deposit-system-fee-caps-and-ai-disclos). The circular is reported as SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2025/003 — [Zytra](https://zytratechnologies.com/post-sebi-investment-adviser-research-analyst-ai-disclosure-governance-2025.html), a vendor blog.
- [REPORTED, snippet, source not pinned] Disclosure for RAs comes with research service terms, and IAs and RAs are "solely responsible" for client data security and for advice based on AI output. Another result gives circular 2025/004 for RAs. Check the circular text before quoting either.
- [FACT] IAs cannot give "trading calls", defined as intraday, ultra-short, non-delivery recommendations (other than hedging) or any non-personalised recommendation on securities — [SEBI IA FAQs](https://www.sebi.gov.in/sebi_data/faqfiles/aug-2025/1755174193178.pdf)
- [FACT] Exemptions are limited to incidental advice by insurance agents, pension advisers, AMFI-registered distributors, brokers and others, subject to conditions. A distributor's incidental advice is "basic advice" limited to mutual fund products — [same](https://www.sebi.gov.in/sebi_data/faqfiles/aug-2025/1755174193178.pdf)
- [REPORTED] RA FAQs (23 July 2025): research via any method, including technical analysis, is not exempt, except on demand and supply in sectors or indices. Recommendations need a documented basis and reasoning. Non-paying clients still count as clients — [LKS](https://www.lkslaw.com/insights/articles/key-clarifications-under-the-sebi-issued-faqs-2025)

**AI/ML framework**
- [REPORTED] June 2025 draft: senior oversight, model validation, documentation and interpretability, with a lighter track for internal non-customer uses — [Business Standard](https://www.business-standard.com/markets/news/sebi-proposes-ai-ml-guidelines-for-market-participants-125062001137_1.html) (snippet)
- [REPORTED] On 19 August 2026 the SEBI chairman said a tiered framework would require "Kill Switch" and "Humans in the Loop" controls and data controls, with regulated entities fully responsible for in-house or third-party tools. No timeline given — [Outlook Money](https://www.outlookmoney.com/invest/sebi-to-issue-aiml-guidelines-for-capital-markets-mandatory-kill-switch-and-human-oversight-framework-explained)
- [CONFLICT] A compliance vendor's marketing page (likely [Zytra](https://zytratechnologies.com/solutions-sebi.html); snippet) says an AI/ML circular was already issued in August 2026. Treat this as unverified, since it conflicts with the chairman's forward-looking statement. Search-result coverage also dates similar remarks to 10 October 2026, which I could not confirm.

**Explainability research**
- [RESEARCH, preprint] Ross and Lo define "heuristic collapse" and argue advisory LLMs need auditing of input sensitivity, not just output quality. Their method fits interpretable surrogates and reports R² and feature concentration. Weighted Jaccard similarity measures how personalised portfolios are. Tool access can push portfolios toward common products in some models — [arXiv 2604.23837](https://arxiv.org/abs/2604.23837)
- [RESEARCH, preprint] VeriFin retrieves filing evidence, grounds values in XBRL facts and uses the Z3 solver to accept, reject or abstain on numeric claims. It uses US-style filing data — [arXiv 2608.10213](https://arxiv.org/abs/2608.10213)
- [REPORTED, unverified] One vendor describes a February 2026 RA master circular requiring human review attestation for AI-assisted reports, and I could not verify this — [Zytra](https://zytratechnologies.com/post-sebi-investment-adviser-research-analyst-ai-disclosure-governance-2025.html)

**Precedents in how Indian tools position themselves**
- [PRODUCT] MutualFundOverlap.in states it is not investment advice and not SEBI-registered — [X-Ray](https://mutualfundoverlap.in/portfolio-x-ray). MF Profiler says it states "facts about disclosed holdings" and does not rank or recommend — [MF Profiler](https://www.mfprofiler.com/). A disclaimer is their positioning, not a legal ruling.

### Inferences (not legal advice; confirm with your faculty adviser or a lawyer)
For a student prototype, a defensible boundary is:
- **Do:** describe exposures, scenarios and sensitivities. Present outcomes as "if X, your estimated loss is Y, with this uncertainty". Publish methods and limits.
- **Avoid:** buy, sell or switch instructions for named securities, payment of any kind, performance claims, intraday or F&O calls, and marketing to real clients.
- **Data:** use synthetic profiles, or the team's own statements with written consent, processed locally. Treat DPDP Act compliance as a design requirement; I did not read the Act this session.
- **Design for the coming rules:** a suspend control, a human checkpoint before any action, audit logs and a model card. These are cheap and match the announced direction.
- **If commercialised:** a registered IA or partner is needed for personalised advice. That entity must profile first and carries the liability.
- A nudge such as "reduce overlap" sits closer to advice than a plain statement of overlap. Prefer neutral statements in the prototype.

### Gaps
- The regulation text defining "investment advice" and "investment adviser" was not read. I recall a proviso on widely available public media, but **this is unverified**. Read Regulation 2 of the IA Regulations 2013 directly, since the whole boundary turns on it.
- The later history is unresolved: one source mentions 25 November 2025 amendments and 6 February 2026 master circulars, and another gives a 27 June 2025 consolidation. I reached neither in primary form.
- SEBI's rules on finfluencers and on education using price data (I recall May 2024 and January 2025 circulars) could not be searched. Check them, since they affect any public demo using recent prices.
- The master circular's SaaS section appears to concern IA systems and compliance reporting; only parts were read.
- Whether academic or non-commercial tools get any carve-out: not found. SEBI sandbox routes not checked.
- Account Aggregator access for a student project was not checked.

## Key Question 6: Product gaps versus true technical research gaps

### Takeaway
Most of the visible gaps are product, data or incentive gaps. The strongest research-grade openings are uncertain multi-layer exposure inference, joint household risk modelling, causal evaluation of guardrails, and auditing advice systems for genuine personalisation.

### Cited Findings
This section is a synthesis. Evidence is cited in Key Questions 1-5 above.

### Inferences

| Problem | Classification (my judgement) | Why |
|---|---|---|
| Equity-fund pairwise overlap | **Largely served** | Many tools; ISIN-based and simple |
| Direct-plus-fund overlap | **Served by at least one app**, otherwise a product gap | PhonePe documents it |
| Debt-issuer roll-up across funds | **Data-engineering gap** | Instrument data is shown, but mapping to issuers takes work |
| Equity-plus-debt-plus-group graph | **Product gap with a research core** | Entity resolution, and group-contagion weights are unsettled |
| Supply-chain linkage | **Research and data gap** | Indian relationship data is likely sparse and needs extraction with uncertainty; availability unverified |
| Employer, ESOP and loan joint risk | **Measurement research gap** | Data can be aggregated, as Fi shows, but correlation of income with markets is hard to estimate without private data |
| Riskometer versus realised tail risk | **Empirical gap, testable with public data** | No evaluation found; limited search |
| Stated versus revealed risk in India | **Research gap** | No Indian dataset found; validity of "revealed" is contested |
| Loss-chasing detection | **Data-access gap more than a method gap** | Methods exist in general; trader-level Indian data is private |
| Whether guardrails work | **Causal research and incentive gap** | No published effects found; costs can backfire |
| Retail stress testing | **Product gap**; **research gap** in propagating through stale, uncertain holdings | Copula methods exist |
| LLM advice personalisation | **Active research gap** | April 2026 preprint with no India-specific version found |
| Regulatory-grade explanation | **Open and evolving** | SEBI framework not final |

"Unsolved" is not claimed for any row. Each is "inadequately addressed, per the sources reachable in this session."

### Gaps
- These labels would change with a full literature review or logged-in product testing.

## Key Question 7: Candidate technical mechanisms beyond a dashboard or chatbot

### Takeaway
My recommended option is **Mechanism A**, with **Mechanism B** as its extension: public data supports it, the novelty is demonstrable and a clear baseline exists. All novelty claims below are provisional until the team runs a proper literature search.

### Cited Findings
Public-data sources confirmed to exist in this session:
- Monthly AMC scheme portfolios and AMFI daily NAVs, as used by [MutualFundOverlap.in](https://mutualfundoverlap.in/portfolio-x-ray)
- Monthly scheme riskometer levels on AMC and AMFI websites — [SEBI circular](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2020/1602580413614.pdf)
- SEBI's published distribution statistics for calibration — [SEBI behaviour study](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233601328.pdf)
- A published audit protocol — [Ross and Lo](https://arxiv.org/abs/2604.23837)
- Personal aggregated data through Fi's beta MCP, for consenting users only — [Fi](https://fi.money/features/getting-started-with-fi-mcp)

### Inferences (everything below is my proposal)

**A. Issuer- and group-aware exposure graph with uncertainty**
- **Mechanism:** resolve ISINs to issuers and business groups, merge equity, debt and direct holdings into one graph, then compute concentration by issuer, group and shared factor. Model month-old holdings as a distribution using a returns-based update, rather than as a fixed snapshot. Handle negative derivative legs correctly.
- **What is new:** joint equity-plus-debt-plus-group roll-up with uncertainty bounds for one retail portfolio. No documentation I reached describes it.
- **Evaluation with public data:**
  1. Entity-resolution precision, recall and F1 on a hand-labelled sample.
  2. Agreement with AMC-published overlap disclosures, if available.
  3. Event study: do group-adjusted concentration scores explain drawdowns in stress windows better than stock-level HHI and pairwise overlap? Use out-of-sample tests and synthetic portfolios built from real schemes.
- **Main risk:** group mapping is manual and judgement-based. Verify shareholding-pattern data access early.
- **Kill test:** if group-adjusted scores add no explanatory power over stock-level HHI in pre-registered windows, the novelty claim fails.

**B. Household reverse stress test**
- **Mechanism:** extend A with income, ESOP and floating-rate loan nodes. Search for the most plausible scenario that breaches a user-set limit, such as a liquidity shortfall, using a tail-dependent generator such as a vine copula on Indian market factors.
- **What is new:** reverse stress at household level with employer-correlated income, compared with institutional work like [Zhou and Nolde](https://arxiv.org/abs/2404.00109), which uses a bank's currency book.
- **Evaluation:**
  1. Rolling backtests of VaR and expected shortfall (Kupiec, Christoffersen, Acerbi-Szekely) against Gaussian and historical baselines.
  2. Held-out crisis periods, including March 2020.
  3. Scenario plausibility, measured by likelihood under the model.
  4. Persona-based sensitivity across synthetic households. Income correlation **cannot be validated on public data at individual level**, and that limit must be stated.
- **Main risk:** the income part stays assumption-driven.

**C. Risk-label audit and portfolio-implied risk divergence**
- **Mechanism:** first, test how well the six riskometer levels rank realised drawdown and expected shortfall across schemes over time, and what a concentration term would add. Second, estimate a portfolio-implied risk aversion by inverse optimisation, with a credible interval, and report divergence from the stated profile.
- **What is new:** an empirical audit of an Indian regulatory label, and uncertainty-aware divergence that avoids labelling it "true preference", given the [contested validity](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7505965/) of revealed measures.
- **Evaluation:**
  1. Rank correlation by category and period, out of sample, against a simple volatility baseline.
  2. Parameter-recovery tests on simulated investors with known risk aversion.
  3. Optional: a small consented study comparing questionnaire answers with CAS holdings, with ethics approval.
- **Main risk:** this is more of an analysis project unless the estimator is developed well. It is the cheapest and safest of the five.

**D. Sequential loss-chasing detector with off-policy guardrail evaluation**
- **Mechanism:** model each trader's sequence (size, moneyness, time to expiry, time since last loss) using a self-exciting point process or change-point model. Replay candidate cool-off rules offline and estimate effects, including substitution into cheaper out-of-the-money contracts as seen in [Agarwal et al.](https://www.aeaweb.org/conference/2026/program/paper/StD8aadb). It runs on the device.
- **What is new:** behavioural-state detection tied to a counterfactual evaluation of friction, where the [Zerodha documentation](https://support.zerodha.com/category/trading-and-markets/nudge/killswitch/articles/what-is-the-kill-switch) describes user-initiated controls.
- **Evaluation:**
  1. Lift over SEBI-style baselines (turnover to capital, days active, prior-loss streak) in predicting next-period loss.
  2. Simulator calibrated to [SEBI's published statistics](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233601328.pdf), such as 85% losing quarters and median ₹10,525 loss versus ₹4,366 gain.
  3. Public on-chain perpetuals trader data may be a surrogate. **I have not verified this**, and it differs from Indian retail.
- **Main risk:** the highest data risk. Without real Indian trader data, claims stay at the level of simulation, and calibrating to aggregates does not validate individual-level detection. Also, off-policy estimates cannot show true causal effects without randomisation.

**E. Input-sensitivity audit and constraint-verified explanations for advice systems**
- **Mechanism:** build an Indian test suite of synthetic clients, including ESOP concentration, repo-linked loans and dependants. Measure heuristic collapse using [Ross and Lo's metrics](https://arxiv.org/abs/2604.23837). Then add a verification layer in the style of [VeriFin](https://arxiv.org/abs/2608.10213), which checks each numeric or rule-based claim in an explanation against the exposure data with an SMT solver, and abstains when it cannot.
- **What is new:** an India-specific audit with balance-sheet features that a plain questionnaire misses, plus verified claims about a user's own portfolio. I found no India-specific version.
- **Evaluation:**
  1. Feature concentration and surrogate R² before and after, across model families.
  2. Metamorphic tests: changing a relevant input must change the output, and an irrelevant one must not.
  3. Verifier precision, recall and abstention rate on seeded errors.
  4. Weighted Jaccard similarity for personalisation.
- **Main risk:** results age quickly as models change, and any output resembling advice must stay in a research setting.

**Comparison (my judgement)**

| Mechanism | Public-data feasibility | Technical novelty | Regulatory risk | Main weakness |
|---|---|---|---|---|
| A. Exposure graph | High | Medium-high | Low | Group mapping effort |
| B. Household reverse stress | Medium | High | Low-medium | Income link not validated |
| C. Risk-label audit | High | Medium | Low | May read as analysis |
| D. Loss-chasing and guardrails | Low-medium | High | Medium | No Indian trade data |
| E. Advice audit and verifier | High | Medium-high | Low if research-only | Fast-moving baseline |

### Gaps
- The novelty of every mechanism needs a dedicated literature search, which the budget cut short.
- Not verified for feasibility: NSE and BSE shareholding-pattern access, debt ISIN-to-issuer mapping sources, machine-readable NPS and ULIP portfolios, Indian factor data, licensing of exchange data, and on-chain data as a surrogate.
- Historical event windows must be sourced and fixed before testing, to avoid cherry-picking.
