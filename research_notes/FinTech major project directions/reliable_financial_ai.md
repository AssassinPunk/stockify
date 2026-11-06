# AI Reliability and Misinformation in Finance: India Focus and Global State of the Art

Notes compiled 6 November 2026 for a final-year engineering team choosing a major project.

**Evidence tags.** [FACT] = regulator text, official record or vendor documentation. [RESEARCH] = paper or preprint finding, self-reported by its authors unless noted. [REPORTED] = news, law-firm or blog summary, not checked against the primary document. Inference appears only under "Inferences".

**How each source was read.** (full) = I read the paper's text. (abstract) = abstract or landing page only. (snippet) = search-result excerpt only. Most 2025-2026 papers cited are arXiv preprints and not peer reviewed unless a venue is given.

**Run limits.** The web search budget ran out before I could search these topics: Indian-filing XBRL access, Indic deepfake datasets, an Indian regulatory LLM benchmark, the Mills Review recommendations, and counterfactual or rule-extraction work in finance. For those topics I only fetched pages whose URLs I already had, so "I found no X" means "not found in limited searching", not "X does not exist". Nothing here is called unsolved.

---

## 1. Measured failure rates of LLMs on finance tasks, and suitability failures in advice

### Takeaway
Frontier models now score well on simple retrieval and closed-form questions, and their error rate on those is single-digit to low-teens. Top scores are still roughly 45-67% on agentic analyst work, stepwise reasoning, and uncontaminated or multilingual tests, though the multilingual figure is for the older GPT-4o. Suitability testing is a separate problem: the strongest 2026 evidence shows advice depending mainly on one input, self-reported risk tolerance.

### Cited Findings

**Benchmarks (newest usable results)**

| Benchmark | Task and size | Result | Read |
|---|---|---|---|
| [FinanceBench](https://arxiv.org/abs/2311.11944) (2023) | 10,231 questions in total; 150 sampled; 16 configurations; 2,400 reviewed answers | GPT-4-Turbo with retrieval answered wrongly or refused 81% of the time | abstract |
| [Vals Finance Agent v1.1](https://www.vals.ai/benchmarks/finance_agent) (4 Jun 2026) | 537 questions, 337 in the private test set; agents with EDGAR and web tools; graded by an LLM judge | Top: Claude Opus 4.7 64.37%, Claude Sonnet 4.6 63.33%, Muse Spark 60.59% | official page |
| [FinChain](https://arxiv.org/html/2506.02515v3) (v3 Jan 2026) | 2,900 test cases, 58 topics, 26 LLMs, executable Python ground truth | Best ChainEval 67.17 (GPT-5-mini); best final-answer correctness 84.66 (GPT-4.1) | partial full text |
| [XFinBench](https://arxiv.org/html/2508.15861v1) (ACL Findings 2025) | 4,235 graduate-level examples, 18 models | o1 67.3% overall against human experts 79.8%; o1 calculation exact match about 30.5-42.2% (table layout unclear, check Table 3) | partial full text |
| [FAMMA](https://arxiv.org/html/2410.04526) (v4 May 2025) | 1,945 Basic, 103 LivePro; English, Chinese, French | o1 about 88% Basic and about 60% LivePro in text, but 51.4% LivePro in Table 3. The paper's own figures disagree | partial full text |
| [FAITH](https://arxiv.org/html/2508.05201) (2025) | 2,406 masked spans from 453 S&P 500 firms | Error rate 4.4% for Claude Sonnet 4, 8.1% for Gemini 2.5 Pro, 10.8% for GPT-4.1, 63.0% for Llama 3.3 70B. The Multivariate class has only 10 spans | full tables |
| [MultiFinBen](https://arxiv.org/abs/2506.14028) | Five languages, multimodal | GPT-4o 46.01% overall, "dropping sharply" in multilingual settings; no drop figure in the abstract | abstract |
| [FinLFQA](https://arxiv.org/html/2510.06426v1) (2025) | 1,008 attributed long-form answers | Best evidence F1 59.2; best numerical F1 43.4; best knowledge recall 21.1 | partial full text |
| [FinDVer](https://aclanthology.org/2024.emnlp-main.818) (EMNLP 2024) | 4,000 claim-verification examples, 25 LLMs | Best about 77% against experts about 93%, from a [secondary review](https://liner.com/ko/review/findver-explainable-claim-verification-over-long-and-hybridcontent-financial-documents); unverified | abstract, snippet |
| [TAT-QA](https://arxiv.org/abs/2105.07624) (2021) | Hybrid table and text QA | TAGOP 58.0% F1; expert humans 90.8% F1. No current-model result found on the original benchmark | abstract |
| [FinBen](https://nips.cc/virtual/2024/poster/97525) (NeurIPS 2024) | 42 datasets, 24 tasks | Authors evaluated 21 LLMs per the poster, 15 per the [arXiv version](https://www.arxiv-vanity.com/papers/2402.12659). GPT-4 FinTrade Sharpe 1.51 ± 1.08, per [Alpha Illusion](https://arxiv.org/html/2605.16895v1). FinQA and ConvFinQA figures only in a [blog](https://beancount.io/pt/bean-labs/research-logs/2026/04/15/finben-financial-llm-benchmark); unverified | snippet |
| [BizBench](https://arxiv.org/abs/2311.06602) | 8 quantitative tasks, program synthesis | Main bottleneck is limited business and financial understanding. No scores in the abstract | abstract |

**Numeric hallucination specifics**
- [RESEARCH] Scale errors are a major failure mode. Fixing them alone would raise Llama 3.3 70B's value accuracy from 37.0% to 57.7%. — [FAITH](https://arxiv.org/html/2508.05201)
- [RESEARCH] Existing hallucination detectors treat all claims alike and miss 43% of computational errors that need arithmetic re-checking against tables. — [FinGround](https://arxiv.org/abs/2604.23588) (abstract)
- [RESEARCH] In 400 sampled o1 calculation responses, about 55.2% had a correct reasoning path with neither rounding error nor knowledge misuse. — [XFinBench](https://arxiv.org/html/2508.15861v1)
- [RESEARCH] Roughly 75% of each model's errors on FAMMA's non-arithmetic LivePro questions are domain-knowledge gaps. On hard LivePro arithmetic, o1 scored 0% without program-of-thoughts. — [FAMMA](https://arxiv.org/html/2410.04526)
- [RESEARCH] LLM judges also let numeric errors through. They accepted 87 incorrect Qwen3-30B answers on XBRLFiling, and 1, 9 and 31 incorrect GPT-5.5 answers on XBRLFiling, FinanceBench and TAT-DQA respectively. — [VeriFin](https://arxiv.org/abs/2608.10213) (full)

**Conflicts in current leaderboard data**
- [REPORTED] [BenchLM](https://www.benchlm.ai/benchmarks/financeAgentV2) appears to list a later Finance Agent v2 table with a Gemini model on top at 65.4% (20 Oct 2026), while an [August 2026 source](https://allmind.ai/research/ai-financial-research-benchmarks-explained) appears to put the v2 top at 60.60%. A [KuCoin article](https://kucoin.com/blog/can-ai-replace-financial-analysts-in-2026-vals-ai-finance-agent-v2-reveals-gpt-5-5-hits-just-52-percent-accuracy) says GPT-5.5 scored about 52%. I could not load a Vals v2 page, so none of these is confirmed. All from snippets.

**Suitability failures**
- [RESEARCH] Ross and Lo tested GPT-4o, GPT-5.4 Nano, Mini and full on 1,000 Latin-hypercube synthetic client profiles and a 20-product menu. Self-reported risk tolerance carried 57-88% of surrogate predictive weight across most models. For GPT-4o, equities had feature concentration 0.780 at R² 0.882. Web search cut concentration for cash by 65% and tax-advantaged accounts by 45%, raised it for equities by 16%, and for the GPT-5.4 family increased cross-client portfolio similarity. The GPT-5.4 family showed less collapse overall. — [Heuristic Collapse](https://arxiv.org/abs/2604.23837) (full)
- [RESEARCH] ChatGPT, Gemini and Copilot advice raised portfolio risk across five dimensions, including geographic, sector and trend-chasing risk, and debiasing only partly helped. — [Winder et al., PLOS ONE 2025](https://journals.plos.org/plosone/article%3Fid=10.1371/journal.pone.0325459) (snippet; PMC page blocked, so I have no effect sizes)
- [RESEARCH] On a standard risk questionnaire GPT looks moderately aggressive with the most varied answers, Gemini is moderate and consistent, Llama is more conservative, and personas shift each profile by different amounts. — [Cho et al.](https://arxiv.org/abs/2603.09303) (abstract)
- [RESEARCH] PortBench v6: ten LLMs, 6,269 QA items. High QA scores did not reliably translate into portfolio outperformance, and LLM portfolios beat equal weighting on Sharpe in 54.2% of 120 evaluations. — [PortBench](https://arxiv.org/abs/2605.27887) (abstract)
- **Conflict:** a search-result summary of PortBench ([listing](https://ideas.repec.org/p/arx/papers/2605.27887.html); exact version unconfirmed) reports that 90% of model-profile combinations fail to beat equal weight. That differs from the v6 abstract and may reflect an earlier version. Use v6.
- **Contrary evidence:** [Fieberg et al. 2023](https://www.cesifo.org/DocDL/cesifo1_wp10529.pdf) conclude GPT-4 can give suitable advice reflecting risk tolerance, capacity and sustainability preference, while [CESifo commentary](https://cesifo.org/en/mr-ai-will-see-you-now) says risk profiling is left to the investor. [Lo and Ross 2024](https://hdsr.mitpress.mit.edu/pub/jnml28pl) raised trust concerns, but [MIT Sloan](https://mitsloan.mit.edu/node/51548) reports Lo was impressed after retesting a later model (snippets).

### Inferences
- Falling error rates on lookup do not generalise to advice. The hard part has moved from "wrong number" to "wrong number for this person", and to accepting wrong numbers silently.
- Leaderboard numbers are weak evidence for a project claim because Vals grades with an LLM judge, FAMMA grades with GPT-4o, and contamination inflates older benchmarks. An independent deterministic oracle such as FinChain's or VeriFin's is a stronger evaluation design.
- FAITH's top-model error of 4.4% comes from a benchmark filtered for unanimous LLM answerability, which the authors say may exclude the hardest spans, so treat it as a floor.
- **Remaining technical gap:** no benchmark I found uses Indian filings, Indian products, Ind AS, or Hindi or Hinglish finance questions, and no suitability test uses Indian household profiles.

### Gaps
- No verified 2026 FinanceBench rerun with current frontier models at full-sample scale. The closest is VeriFin's 67-question subset, and [VERAFI](https://arxiv.org/abs/2512.14744v1) reports "FinanceBench-style" tasks.
- The 50% (per-document store) and 79% (long-context) FinanceBench figures come from a [blog](https://beancount.io/bean-labs/research-logs/2026/05/12/financebench-open-book-financial-qa-benchmark) (snippet). The [launch release](https://prnewswire.com/news-releases/patronus-ai-launches-industry-first-llm-benchmark-for-finance-to-address-hallucinations-301990858.html) gives 21% long-context failure for GPT-4 Turbo, which is consistent.
- BizBench's venue: the arXiv page lists none. I recall ACL 2024 but did not verify it.
- Ross and Lo use only GPT models and synthetic profiles, and the framing looks US-based. No Indian replication was found.

---

## 2. Hallucination prevention beyond RAG: what has been done in finance and what has not

### Takeaway
Finance now has working solver-based verification, but only for numeric claims about public filings and for institution-side compliance. Published results show a trade-off between assurance and coverage. Solver checks on personalised consumer advice did not appear in my searches.

### Cited Findings

**Program-aided reasoning**
- [RESEARCH] PoT beat chain-of-thought by about 12% on average across datasets including FinQA, ConvFinQA and TATQA. — [PoT, TMLR 2023](https://arxiv.org/abs/2211.12588) (abstract). PAL delegates solving to an interpreter. — [PAL](https://arxiv.org/abs/2211.10435) (abstract)
- [RESEARCH] On FAMMA LivePro, PoT moved o1 from 51.4% to 78.6% and DeepSeek-R1 from 46.6% to 63.0%. o1 on easy/medium/hard arithmetic moved from 25.0/35.7/0% to 83.3/92.8/62.5%. — [FAMMA](https://arxiv.org/html/2410.04526)
- [RESEARCH] Limit stated by VeriFin's authors: a generated program still chooses the operands and computation, so it can execute the wrong calculation correctly. — [VeriFin](https://arxiv.org/abs/2608.10213)

**Solver-based verification in finance**
- [RESEARCH] **VeriFin** (Stevens, v3 23 Oct 2026). It treats each answer as an untrusted claim, binds operands to filed XBRL facts, sets the formula from candidate-independent sources, and checks with Z3, returning Verified, Violated or Abstain with an unsat core. Results: zero observed false accepts in all 18 settings. — [VeriFin](https://arxiv.org/abs/2608.10213) (full)
  - Qwen3-30B on XBRLFiling: 304 correct accepted against 166 for an LLM judge, with false accepts falling from 87 to 0. In the same setting FinDVer had 34 and VerifierFC 27.
  - Coverage: 97-100% on XBRLFiling, but 49.3-82.1% on FinanceBench and 62.3-80.1% on TAT-DQA.
  - Evidence strength: on FinanceBench two models have only 10 true accepts, giving a 95% CI of [69.2, 100]. GPT-5.5 on XBRLFiling is [99.3, 100].
  - False rejects are real: for example 63 for Qwen3-30B and 37 for GPT-5.5 on XBRLFiling, from wrong period selection, sign conventions and misread quantities.
  - Verifier-guided repair at pass@3 recovered 47.7-69.9% on XBRLFiling against 6.5-26.1% for a generic retry. The authors call this exploratory and not a controlled comparison.
  - The registry is hand-curated: 59 metrics, 17 operation rules, 126 concepts, and 19 entries are FinanceBench-specific. XBRLFiling covers 10-Ks of 28 US companies.
- [RESEARCH] **VERAFI** (AWS authors). SMT-LIB policies for GAAP, SEC and mathematical checks act as prompt guidance during generation. It reports 94.7% factual correctness against 52.4% for dense retrieval with reranking, but the policy layer adds only 4.3 points over pure agentic processing. — [VERAFI](https://arxiv.org/abs/2512.14744v1) (snippet)
- [RESEARCH] **Neuro-Symbolic Compliance** covers 87 Taiwan FSC penalty cases, with statutes as hard constraints and facts as soft constraints. SMT generation accuracy is 86.21%. Restoration scores 1.0 against 0.3333 for LLM alone, but the ground truth there is the solver's own output, and only 13 of 63 satisfiable cases have reference assignments. — [Hsia et al.](https://arxiv.org/html/2601.06181v1) (near-full). Institution-side only, no consumer advice.
- [RESEARCH] **FinGround** uses six claim types with type-routed checks. It reports a 68% hallucination reduction over the strongest baseline, 78% over GPT-4o, a distilled 8B detector at 91.4% F1, and $0.003 per query. — [FinGround](https://arxiv.org/abs/2604.23588) (abstract). [Listed as ACL 2026 Industry Track](https://arxiv.org/pdf/2604.23588) (snippet).
- [RESEARCH] **Attribution:** FinLFQA finds citation attribution alone is insufficient, and that post-hoc and end-to-end attribution perform about the same. — [FinLFQA](https://arxiv.org/html/2510.06426v1)

**Amazon Bedrock Automated Reasoning checks**
- [FACT] GA 6 Aug 2025, per [AWS](https://aws.amazon.com/about-aws/whats-new/2025/08/automated-reasoning-checks-amazon-bedrock-guardrails). Marketed as ["up to 99%" verification accuracy](https://aws.amazon.com/blogs/aws/minimize-ai-hallucinations-and-deliver-up-to-99-verification-accuracy-with-automated-reasoning-checks-now-available/).
- [FACT] [Documented limits](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-automated-reasoning-checks.html): English (US) only; no streaming; detect mode only; no prompt-injection protection; a VALID result covers only what the policy variables capture; non-linear arithmetic such as exponents may time out or return TOO_COMPLEX; source documents limited to 50,000 characters. Listed regions include Sydney but no India region.
- [RESEARCH] The underlying ARc paper reports 99.2% soundness at 15.6% recall and 2.5% FPR with a 3-of-3 ensemble. Without redundant translation it is 98.6% soundness at 31.7% recall. Redundant translation adds about 5-15 seconds per validation. Numerical tables are named as hard to formalise without human vetting. The experiments evaluate no finance-specific policy. — [Bayless et al.](https://arxiv.org/html/2511.09008v1) (near-full)

**Conformal prediction and abstention**
- [RESEARCH] Conformal abstention bounds hallucination risk on closed-book QA in expectation, assuming exchangeable data, tested on Gemini Pro with two datasets. — [Abbasi-Yadkori et al.](https://arxiv.org/html/2405.01563v1) (near-full)
- [RESEARCH] Adaptive conformal inference aims to keep long-run coverage under distribution shift. — [Gibbs and Candès](https://arxiv.org/abs/2106.00170) (abstract)
- [RESEARCH] FinAbstain compares calibration methods for forecasting with abstention, but its results are labelled simulated and data collection was incomplete at submission. — [FinAbstain](https://arxiv.org/abs/2607.24875) (abstract)

### Inferences
- The field's direction is "LLM proposes, solver disposes", and the weak link has moved to translation and grounding. ARc buys 99% soundness with very low recall, and VeriFin buys zero false accepts with heavy abstention on data not built from XBRL relationships.
- VeriFin's near-complete XBRLFiling coverage is partly structural, because that benchmark is built from the same calculation relationships the verifier uses. FinanceBench and TAT-DQA coverage are the fairer indicators. The 19 FinanceBench-specific registry entries also raise a tuning question.
- "Up to 99%" should not be quoted without the recall figure. The ARc paper and the AWS product metric may not be the same measurement.
- Compound interest, EMI and XIRR involve exponents or root-finding, which the Bedrock docs flag as hard. A practical design computes these in trusted calculators and passes results to the solver as linear constraints.
- **Done in finance:** filing-number verification, institution compliance reasoning, policy-guided generation, claim-level grounding.
- **Not found in finance:** solver checks of advice against a user's own data, conformal risk control on financial QA verifiers, proof objects a third party can recheck, and any of this for Indian filings or in Indian languages.

### Gaps
- I ran no dedicated "proof-carrying answers" search. VeriFin's unsat cores and evidence bindings are the nearest thing I saw. Independent rechecking was not claimed in what I read.
- XBRL-Agent (ICAIF 2024), [Fin-RATE (arXiv 2602.07294)](https://arxiv.org/abs/2602.07294) and FinVerBench appear only as VeriFin references. I did not read them.
- I could not confirm from AWS docs that the engine is an SMT solver. The docs say "formal logic".
- The [LNT Sovereign package](https://pypi.org/project/lnt-sovereign/) claims Z3 finance deployment. It is proprietary and I found no independent evaluation, so do not rely on it.

---

## 3. Personalised advice correctness and multi-agent financial systems

### Takeaway
I found no published system that checks advice against a user's real balance sheet and rules using a solver, in one targeted search. Multi-agent systems are evaluated on trading returns rather than per-user correctness, and their reported returns shrink substantially under stricter testing.

### Cited Findings

**Multi-agent systems: claims against re-evaluation**
- [RESEARCH] TradingAgents reports cumulative returns of 23-27% and Sharpe 5.60-8.21 on AAPL, GOOGL and AMZN over 1 Jan to 29 Mar 2024, about three months. The authors note the high Sharpe comes from a short backtest with few drawdowns. — [TradingAgents](https://arxiv.org/html/2412.20138)
- [RESEARCH] FinCon claims better performance with lower communication cost; no metrics in the abstract. — [FinCon](https://arxiv.org/abs/2407.06567). Its reported window is about 8 months across 8 symbols, per [FINSABER](https://arxiv.org/html/2505.07078v3). FinRobot's abstract describes a platform and reports no evaluation. — [FinRobot](https://arxiv.org/abs/2405.14767)
- [RESEARCH] FINSABER (2004-2024, bias-controlled): FinMem's TSLA Sharpe falls from a reported 2.679 to 0.641, and neither FinMem nor FinAgent generates significant alpha (all p > 0.34). TradingAgents was not re-run in that paper. — [FINSABER](https://arxiv.org/html/2505.07078v3)
- [RESEARCH] Alpha Illusion re-ran two agents over Jan 2025 to Jan 2026 on five stocks with costs. TradingAgents went from +6.4% gross (Sharpe 0.43) to +2.3% net (Sharpe 0.22) against buy-and-hold +4.8%. QuantAgent reached -22.1% net (Sharpe -1.15). It cites a 71.85% FinMem return drop when testing crosses the pretraining cutoff. It proposes reporting protocols P1-P6: temporal integrity, dynamic universe, counterfactual robustness, calibration, realistic costs, and single-agent comparison. Its recommended architecture uses LLMs as auditable information interfaces feeding separate risk and execution modules. — [Alpha Illusion](https://arxiv.org/html/2605.16895v1) (partial)

**Personalised-correctness work**
- [RESEARCH] A constraint-aware portfolio MCQ benchmark exists, with no personal balance sheet. — [Cho and Kim](https://arxiv.org/abs/2603.09301) (abstract; no scores on the page)
- [RESEARCH] Fund2Persona builds personas from fund disclosures, uses 50 investor profiles, and reports 5-class accuracy of 0.339. — [Fund2Persona](https://www.emergentmind.com/papers/2606.29793) (snippet). It is not a constraint checker.
- [RESEARCH] "Whatever the correct mapping from client profile to portfolio, it should not be well-approximated by a single input" — the authors move the criterion from output accuracy to input sensitivity, since suitability has no closed-form truth. — [Ross and Lo](https://arxiv.org/abs/2604.23837)

### Inferences
- "Can an assistant check advice against a user's balance sheet?" splits into two parts. **Checkable now:** arithmetic facts ("your EMI is X"), liquidity and debt-service constraints, product eligibility, and whether stated facts match the profile. **Not provable:** that the advice is optimal or truly suitable. A verifier proves consistency with a stated rule set, and the honest claim stops there.
- Multi-agent debate adds no correctness guarantee I could find. For a student project, a deterministic checker outside the agent loop is more defensible than another trading agent, and returns-based evaluation is a trap because of contamination and short windows.
- Account Aggregator data is the plausible Indian source of a real balance sheet. It is outside this note's scope and not verified here. Student prototypes should use synthetic profiles and avoid real financial data.
- **Remaining technical gap:** a checker that (a) parses advice into typed claims, (b) grounds them in user facts, (c) checks arithmetic and rule constraints, and (d) returns the violated rule and a repair hint.

### Gaps
- Indian suitability rules: from memory, the SEBI Investment Advisers Regulations 2013 require risk profiling and suitability, and SEBI's 2024-25 IA and RA amendments added responsibility and disclosure duties for AI tools. I could not verify either in this run. Read the primary text before encoding rules.
- No independent FinCon or FinRobot re-evaluation with numbers beyond the sources above. One [snippet](https://arxiv.org/pdf/2510.07920) reports about 50% decay for TradingAgents and 62% for FinCon, with the setup unconfirmed.

---

## 4. Regulation and what it implies for an auditable design

### Takeaway
The direction across jurisdictions is consistent: disclosed AI use, deployer accountability, human override, testing and monitoring, logs, and specific reasons for adverse decisions. In India, FREE-AI is a committee report, and SEBI's final AI/ML guidelines were still announced rather than located as issued when I checked.

### Cited Findings

**RBI FREE-AI**
- [FACT] Released 13 Aug 2025; committee formed 26 Dec 2024; 7 Sutras; 26 recommendations under six pillars. — [RBI press release](https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=61018). The [report PDF](https://rbidocs.rbi.org.in/rdocs/PublicationReport/Pdfs/FREEAIR130820250A24FF2D4578453F824C72ED9F5D5851.PDF) sat behind a verification page, so everything below is secondary.
- [REPORTED] Sutras include disclosure with individual override, deployer accountability regardless of autonomy, and "understandable by design". 20.8% of surveyed entities deploy AI and 67% are interested. Recommendations cover AI inventories, annual-report disclosures, incident reporting and audits, board-approved policies, and a compliance toolkit. Proposed edits include contesting AI decisions and fairness audits in digital lending. — [Khaitan & Co](https://www.khaitanco.com/sites/default/files/2025-08/Ergo%20-%20FREE%20AI%20Framework%20-%2028%20Augusut%202025.pdf)
- [REPORTED] Pillars: Infrastructure, Policy, Capacity, Governance, Protection, Assurance. Models for credit, underwriting and customer service should be explainable and auditable, using tools such as SHAP and LIME. — [Chambers](https://chambers.com/articles/rbi-committee-report-on-responsible-ai-in-the-financial-sector-free-ai-framework)
- [REPORTED] Controls extend to models, data pipelines and access or audit trails, and incident reporting is on a tolerant good-faith basis. Recommendations are advisory until RBI issues directions. Half-yearly inventory cadence and the 127 of 612 entities figure appear only in search excerpts from summaries such as [Presencis](https://cdn.presencis.com/regulations/rbi-free-ai/article-overview/) and [Mondaq](https://www.mondaq.com/india/financial-services/1672260/rbis-move-toward-ethical-and-responsible-ai-in-financial-sector). I did not confirm which summary carries which detail, so treat these as unverified.

**SEBI**
- [FACT] Consultation paper dated 20 Jun 2025. — [SEBI](https://www.sebi.gov.in/reports-and-statistics/reports/jun-2025/consultation-paper-on-guidelines-for-responsible-usage-of-ai-ml-in-indian-securities-markets_94687.html)
- [REPORTED] Principles: model governance, investor-protection disclosure, testing, fairness and bias, privacy and cyber. Robo-advice and similar customer-facing systems get the full regime, while back-office uses get a lighter one. Also covered: separated test environments, drift monitoring including shadow testing, disclosure of accuracy and risks, grievance mechanisms, and reporting of glitches. — [Lakshmikumaran & Sridharan](https://www.lkslaw.com/insights/articles/sebi-s-consultation-paper-and-the-winds-of-ai-governance)
- [REPORTED] On 19 Aug 2026 at the FICCI conference, the chairman said SEBI plans guidelines with a tiered approach, kill-switch and human-in-the-loop controls, data controls, and full responsibility for in-house or bought tools. — [Outlook Money](https://www.outlookmoney.com/invest/sebi-to-issue-aiml-guidelines-for-capital-markets-mandatory-kill-switch-and-human-oversight-framework-explained)
- **Conflict:** a [DEV post](https://dev.to/techpulse01239/sebi-to-issue-ai-and-ml-guidelines-for-capital-markets-with-kill-switches-and-human-oversight-9j2) dates this to 10 Oct 2026 and mentions IOSCO alignment, uncorroborated. A [vendor page](https://zytratechnologies.com/solutions-sebi.html) mentions an August 2026 circular, also uncorroborated. I found no final guidelines.
- [FACT] The [5 May 2026 SEBI circular](https://www.sebi.gov.in/legal/circulars/may-2026/advisory-on-emerging-advanced-artificial-intelligence-ai-tools-for-vulnerability-detection_101270.html) concerns AI for vulnerability detection. It is not the responsible-use guidelines.

**EU**
- [FACT] Regulation (EU) 2026/1744 amends the AI Act, and Annex III high-risk obligations apply from 2 Dec 2027. — [AI Act Explorer](https://artificialintelligenceact.eu/ai-act-explorer/digital-omnibus/). In force 27 Jul 2026, per the same page's summary.
- [FACT] Annex III 5(b) covers creditworthiness and credit scoring, excluding fraud detection. — [Annex III](https://artificialintelligenceact.eu/annex/3/). Article 12 requires automatic event logs over the system's lifetime. — [Article 12](https://artificialintelligenceact.eu/article/12/). Article 86 gives a right to a clear and meaningful explanation of the AI system's role. — [Article 86](https://artificialintelligenceact.eu/article/86/)

**US and UK**
- [FACT] CFPB (6 Jun 2023): about 37% of the US population used a bank chatbot in 2022. Risks include inaccurate information, failure to recognise that federal rights are being invoked, and doom loops. — [CFPB](https://www.consumerfinance.gov/about-us/newsroom/cfpb-issue-spotlight-analyzes-artificial-intelligence-chatbots-in-banking). Critics say some supporting evidence reflects human-agent experiences. — [Clark Hill](https://clarkhill.com/news-events/news/unveiling-the-blind-spots-a-critical-review-of-the-cfpbs-issue-spotlight-on-chatbots-in-consumer-finance)
- [FACT] CFPB Circular 2022-03: complex algorithms do not excuse failing to give specific, accurate reasons for adverse action. — [CFPB](https://www.consumerfinance.gov/compliance/circulars/circular-2022-03-adverse-action-notification-requirements-in-connection-with-credit-decisions-based-on-complex-algorithms/). The page shows no withdrawal notice, but I could not confirm current enforcement posture.
- [FACT] FCA AI Live Testing: FS25/5 published 9 Sep 2025, exploring output-driven validation, evaluation report planned for Q1 2027. — [FCA](https://www.fca.org.uk/publications/feedback-statements/fs25-5-ai-live-testing). Mills Review published 6 Jul 2026. — [FCA](https://www.fca.org.uk/publications/calls-input/review-long-term-impact-ai-retail-financial-services-mills-review). [REPORTED] The FCA has said no AI-specific rules are coming. — [blog](https://burning-cost.github.io/2026/03/26/fca-long-term-ai-review)

### Inferences

**Design requirements implied (my mapping, not regulator text):**

| Requirement | Basis | Design consequence |
|---|---|---|
| Per-answer evidence record | EU Art. 12; FREE-AI audit trails; Alpha Illusion P1 | Append-only log of model version, prompt hash, data timestamps, claims, solver input and verdict |
| Reasons from the real decision logic | CFPB 2022-03; EU Art. 86; "understandable by design" | Generate explanations from violated rules, not post-hoc narrative |
| Kill switch and human override | SEBI 2026 statement; FREE-AI Sutra 2 | Runtime suspend flag, abstain-to-human path, user contest flow |
| Escalation | CFPB doom loops | Detect rights or complaint intent and route to a person |
| Disclosure of accuracy and risk | SEBI paper; FREE-AI | Publish measured false-accept and coverage figures per claim type |
| Fairness and drift testing | SEBI paper; FREE-AI | Metamorphic tests across profile and language, plus shadow runs |
| Inventory and incidents | FREE-AI | Machine-readable model card and incident export |
| Accountability stays with deployer | SEBI; FREE-AI Sutra 5 | Vendor LLM treated as untrusted, verifier owned locally |

- These are requirements for a credible design, not a claim of compliance. A student prototype should state it is not regulated advice.
- Papers citing an August 2026 EU high-risk deadline, including FinGround's abstract, appear out of date for Annex III systems after Regulation (EU) 2026/1744.

### Gaps
- The full text of the RBI report and SEBI paper was not read. Exact log-retention rules were not confirmed. I recall a five-year period being discussed in the SEBI paper, but the LKS article gives no period, so check it.
- Committee chair: I recall Dr Pushpak Bhattacharyya but did not verify it.
- [Secondary](https://healthcareandprotection.com/fca-launches-mills-review-considering-impact-of-ai-on-retail-financial-services/amp/) coverage was the only view of the Mills Review, and its seven recommendations were not read.

---

## 5. Explainable AI for finance: SHAP and LIME instability, faithfulness, rule extraction, counterfactuals

### Takeaway
Instability and disagreement among post-hoc explainers are well documented, including on credit data, yet regulators and commentators still name these tools while demanding specific and accurate reasons. This field is crowded, so it is a weaker choice for novelty unless tied to LLM advice.

### Cited Findings
- [RESEARCH] Post-hoc explainers often conflict on the same prediction (4 datasets, 6 methods, 6 models), and practitioners resolve conflicts with ad hoc heuristics. — [Disagreement Problem, TMLR](https://arxiv.org/abs/2202.01602) (abstract)
- [RESEARCH] A scaffolding attack lets a biased classifier produce innocuous LIME and SHAP explanations. — [Slack et al.](https://arxiv.org/abs/1911.02508) (abstract)
- [RESEARCH] On four public credit datasets, cost-sensitive classifiers give significantly less stable SHAP and LIME rankings, worsening with class imbalance. — [Ballegeer et al., EJOR 2025](https://arxiv.org/abs/2509.01409) (abstract; no numbers). Earlier work found stability falls as imbalance grows. — [Chen et al., EJOR](https://synapsesocial.com/papers/W4381997116) (snippet)
- [RESEARCH] On four financial datasets TreeSHAP was most faithful on tree models and LIME showed the largest variance across runs. — [Xiao and Fu 2026](https://ideas.repec.org/a/dba/jsisia/v2y2026i3p1-11.html) (snippet). A rank-weighted credibility index is proposed in [CIES](https://arxiv.org/pdf/2603.05024v1) (snippet).
- [RESEARCH] Rudin argues for inherently interpretable models in high-stakes settings. — [Rudin](https://arxiv.org/abs/1811.10154). Integer-programming recourse was tested on credit scoring. — [Ustun et al.](https://arxiv.org/abs/1809.06514). Recourse can become invalid when models update, and ROAR targets robustness to that. — [Upadhyay et al.](https://arxiv.org/abs/2102.13620) (abstracts)
- [RESEARCH] LLM chain-of-thought can be unfaithful, with accuracy dropping as much as 36% under biasing features while explanations do not mention them. — [Turpin et al., NeurIPS 2023](https://arxiv.org/abs/2305.04388) (abstract). Ross and Lo's surrogate approach audits behaviour rather than stated rationale.

### Inferences
- A SHAP or LIME output alone is weak evidence of "specific and accurate reasons", given instability and attacks. The Chambers-reported naming of those tools should not be read as an endorsement of their adequacy.
- LLM rationales in advice need independent checking: comparing a stated rationale with what surrogate analysis shows actually drove the output is a cheap, novel test.
- **Remaining technical gap:** recourse that stays valid after refits on Indian credit data, though public Indian credit data is an obstacle (unverified).

### Gaps
- No search results were obtained on rule extraction in finance, or on RBI or SEBI-specific explanation metrics.
- I found no study directly measuring SHAP against LIME rank disagreement on credit data, in one search.

---

## 6. Detecting misleading financial information in India

### Takeaway
Enforcement evidence is strong, and SEBI has an in-house multimodal tool, but with no public accuracy figures. I found no public Hinglish financial-claim dataset and no message-level Indian equity pump dataset. Datasets exist for crypto pumps, English numeric claims, four-language misinformation and political Hinglish claims, leaving a visible data gap.

### Cited Findings

**Rules**
- [REPORTED] Circular SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2025/11 of 29 Jan 2025 bars regulated entities from associating with persons giving unregistered advice or making unpermitted return or performance claims, excluding those solely in investor education. — [Mondaq](https://www.mondaq.com/india/securities/1580788/securities-law-update-%7c-clarification-on-intermediaries-and-other-associates-persons-regulated-by-sebi); [KS&K](https://ksandk.com/newsletter/sebi-unregistered-investment-claim-makers/)
- [REPORTED] Educational content should generally use data at least three months old, and live prices, coded references and buy/sell/hold calls are barred for unregistered finfluencers. — [Legal500](https://www.legal500.com/intelligence/india/corporate-commercial-law/sebi%27s-crackdown-on-finfluencers-regulations-and-enforcement). Check this against the SEBI circular before encoding.

**Surveillance and enforcement**
- [REPORTED] SEBI's chairman said on 2 Mar 2026 that more than 1.2 lakh posts were removed, and that in-house "Sudarshan" tracks audio, video and other content across languages. — [Tribune/ANI](https://www.tribuneindia.com/news/business/sebi-removes-1-2-lakh-misleading-finfluencer-posts-deploys-ai-sudarshan-chairman/). This is the regulator's own account, with no public precision, recall or method. A rise from about 70,000 appears in [one outlet](https://www.exchange4media.com/digital-news/sebi-takes-down-1-2-lakh-misleading-finfluencer-posts-steps-up-ai-surveillance-152481.html) only.
- [REPORTED] **Avadhut Sathe** (interim order, 4 Dec 2025; allegations, under challenge). Rs 546.16 crore impounded, about Rs 601 crore collected, more than 3.37 lakh investors. — [The Week](https://www.theweek.in/news/biz-tech/2025/12/05/who-is-avadhut-sathe-sebi-bans-dancing-finfluencer-from-securities-market-in-rs-546-crore-case.html). Evidence used: session recordings with entries, targets and stop losses; transcript-to-trade timing (33 of 34 sampled instances); testimonial checks against trading records; WhatsApp groups; 65% of 186 mentorship participants lost money in the six months after. — [LiveLaw](https://www.livelaw.in/amp/corporate-law/sebi-cracks-down-on-finfluencer-avadhut-sathe-impounds-546-crore-for-providing-unregistered-investment-advice-312335). SAT granted ad-interim relief on 19 Dec 2025. — [Free Press Journal](https://www.freepressjournal.in/amp/business/sat-grants-interim-relief-to-avadhut-sathe-training-academy-allows-operations-to-continue)
- [REPORTED] **82 SME stocks** (interim order 22 May 2026, examination period Dec 2023 to Jan 2026; allegations). Bullish posts on X, with target prices pushed through WhatsApp and Telegram, allegedly kept off X to avoid scrutiny. Gains alleged at over Rs 20.25 crore. — [Free Press Journal](https://www.freepressjournal.in/amp/business/sebi-bans-7-individuals-in-20-crore-stock-manipulation-case-linked-to-social-media-pump-and-dump-scheme). Many other web copies of this story are SEO spam on hijacked domains and should not be cited. An earlier Telegram case involved Rs 3.89 crore. — [BCAJ](https://bcajonline.org/journal/sebi-acts-against-pump-n-dump-operations-through-telegram-channels/)
- [REPORTED] **Jane Street** is an index-options manipulation allegation (Rs 4,843.57 crore deposited; Jan 2023 to Mar 2025), not a misinformation case. — [Angel One](https://www.angelone.in/news/market-updates/jane-street-vs-sebi-sat-adjourns-high-stakes-market-manipulation-case). SAT reserved its order on document disclosure, reported in Oct 2026. — [NewsBytes](https://www.newsbytesapp.com/news/business/sat-reserves-order-in-jane-street-document-disclosure-case/story). No final outcome found.

**Deepfakes and scale**
- [REPORTED] PIB flagged a fake Sitharaman video promising Rs 5.5 lakh weekly on Rs 22,000. I4C: more than Rs 52,976 crore lost to online fraud over six years, with investment scams nearly 77% of reported 2025 losses. MHA: Rs 55,659 crore over five years. Different periods, so do not add. — [Outlook Money](https://www.outlookmoney.com/news/pib-fact-check-flags-fake-ai-video-of-nirmala-sitharaman-promoting-investment-scheme). A Pune victim lost Rs 1.07 crore. — [Punekar News](https://www.punekarnews.in/?p=241575)
- [RESEARCH] Open-source detectors lose about 50% (video), 48% (audio) and 45% (image) of AUC on in-the-wild 2024 deepfakes. The set covers 52 languages, but per-language results did not appear in what I saw. — [Deepfake-Eval-2024](https://arxiv.org/html/2503.02857v4) (snippet)

**Finfluencer content research**
- [RESEARCH] CFA Institute India: 2% SEBI-registered, 33% give explicit recommendations, 63% fail to disclose ties adequately. 82% of followers invested on advice and 72% of those self-report profit; 8% report being duped, possibly understated. — [Storyboard18](https://www.storyboard18.com/how-it-works/33-finfluencers-give-stock-tips-2-sebi-registered-63-hide-sponsorships-report-59744.htm); [report](https://rpc.cfainstitute.org/sites/default/files/docs/surveys/clicks-and-credibility.pdf). Sample of 1,615 investors and 51 finfluencers, per a snippet.
- [RESEARCH] Event study of YouTube Shorts from ten Indian finfluencers (±5 days, NIFTY 200, tourism stocks): initial positive abnormal returns that decay. — [Gupta and Narain 2026](https://hrcak.srce.hr/346427). Narrow sector, and no claim-verification task.

**Datasets and models**

| Resource | Content | Public | India or Hinglish coverage |
|---|---|---|---|
| [PumpSense](https://arxiv.org/abs/2605.09431) (full) | 283,017 crypto Telegram messages, 39 groups, 2,246 pumps, κ = 0.96, mid-2017 to mid-2023. Detection F1 0.79 (LightGBM, 9.4 µs per sample), 0.83 (BGE-M3, 50 ms). Extraction: LLMs 0.83-0.91 against Longformer 0.37 | Yes, GitHub and Zenodo | None; crypto scheduled pumps |
| [NumClaim](https://arxiv.org/html/2402.11728) | Numeric claims; earnings-call subset open under CC BY 4.0, analyst reports not redistributable. Best F1 0.93-0.96; [repo](https://github.com/gtfintechlab/fin-num-claim) | Partial | None found |
| [Fin-Fact](https://arxiv.org/html/2309.08793) | 3,369 claims from PolitiFact, Snopes, FactCheck.org, text and image. GPT-4 F1 0.76 per Table 3 (paper's text differs) | Yes | None found |
| [FinDVer](https://aclanthology.org/2024.emnlp-main.818) | Document-based claim verification | Check repo | None found |
| [MFMDQwen](https://arxiv.org/abs/2604.18272) (snippet) / [MFMD-Scen](https://arxiv.org/abs/2601.05403) | English, Chinese, Greek, Bengali; 22 LLMs show scenario bias | [FMD repo](https://github.com/lzw108/FMD) | Bengali only |
| [HiFACTMix](https://arxiv.org/abs/2508.10001v1) (snippet) | 1,500 Hinglish political claims | Check | Hinglish, not finance |
| [MMCFND](https://arxiv.org/html/2410.10407v1) (snippet) | 28,085 fake-news instances across seven Indic languages | Check | Hindi and others, not finance |
| [Check Mate](https://arxiv.org/pdf/2010.13387) (snippet) | Hindi multimodal check-worthy content, health and politics | Check | Hindi, not finance |

### Inferences
- SEBI's evidence chain in the Sathe and SME orders is effectively a specification for automation: extract the call, timestamp it, join to prices and trades, and test claims against records. Public tooling can do the first two steps and the price join, but not trading-account analysis, which needs private data.
- PumpSense's discriminative features ("minutes left") suit scheduled crypto pumps. Alleged Indian SME schemes look slower (accumulate, tip, sell), so its model is unlikely to transfer directly, and detection needs market linkage.
- WhatsApp's end-to-end encryption and private groups make passive collection improper. An opt-in forward or tipline pattern is the ethical route. X, public Telegram channels and YouTube are observable.
- SEBI orders contain quoted messages, dates and scrips, which can serve as seed labels. The sample is small and biased to caught cases.
- Automated flags risk false accusation against named people, so frame outputs as triage for human review and report false-flag rate.
- Jane Street-type detection needs order-level and options data that students likely cannot obtain, so it is a poor target.
- **Remaining technical gaps:** Hinglish speech-to-claim extraction preserving numbers and tickers; point-in-time claim verification against Indian market data; a public labelled corpus; and Indic-language deepfake evaluation.

### Gaps
- NSE CEO deepfake: my search found nothing. I recall an April 2024 NSE warning, unverified.
- The Lalwani finfluencer study was seen only through a [column snippet](https://cms.investmentofficer.com/en/columns/gertjan-verdickt/finfluencer-revolution-unstoppable) (the page requires login). I recall Kakhbod et al.'s US finfluencer skill study, unverified.
- SEBI primary orders were not read; every figure above is from reporting. Read them before use.
- No search succeeded for Indic deepfake datasets or for Hinglish ASR numeric accuracy.
- Legality of collection (platform terms, DPDP Act) was not researched. Get guidance from your institution.

---

## 7. Which problems have a credible open technical contribution reachable in about 8 months, and candidate mechanisms

### Takeaway
Best option: a solver-backed checker for personalised advice, with a metamorphic audit as its evaluation. Best data-contribution option: Hinglish finfluencer claim verification against market data. Plain filing verification on US data is now crowded, so India-specific or abstention-focused angles are needed.

### Cited Findings
- [RESEARCH] Architecture precedent: [VeriFin](https://arxiv.org/abs/2608.10213) (benchmark released; candidate-independent grounding; abstain as a control decision).
- [RESEARCH] Evaluation precedent: [Ross and Lo](https://arxiv.org/abs/2604.23837) (1,000 Latin-hypercube profiles; feature concentration with R²).
- [RESEARCH] Data-scale precedents: [HiFACTMix](https://arxiv.org/abs/2508.10001v1) (1,500 claims) and [PumpSense](https://arxiv.org/abs/2605.09431) (κ-checked manual labels).
- [RESEARCH] Reporting precedent: [Alpha Illusion P1-P6](https://arxiv.org/html/2605.16895v1).

### Inferences

All content in this section is my own judgement. Novelty means "not found in my limited searching". Re-check arXiv before committing, since this area moves monthly (VeriFin v1 appeared in August 2026).

**Ranking**

| Rank | Direction | Novelty | Data risk | 8-month feasibility |
|---|---|---|---|---|
| 1 | M1 Verified personalised advice + M3 audit | High | Low (synthetic) | High |
| 2 | M2 Hinglish claim-to-market verifier | High | Medium | Medium-high if scope is capped |
| 3 | M4 Indian filing verifier with adaptive abstention | Medium | Medium, unverified access | Medium |
| 4 | M5 Order-seeded pump detection | Medium-high | High | Low-medium |
| 5 | XAI recourse or stability for credit | Low-medium | Medium-high | Medium, crowded |

**M1. Proof-carrying personalised advice**
- *Mechanism:* The LLM drafts advice, which is parsed into typed claims (amount, ratio, horizon, product, rule reference). Deterministic calculators compute EMI, XIRR and similar. Z3 checks claims against the user's balance sheet and a versioned rule pack, returning Verified, Violated or Abstain, with an unsat core and a repair loop. Each answer ships a recheckable evidence bundle.
- *Genuinely new:* moving filing-style verification to per-user facts and mixed hard rules with configurable policy heuristics; a third-party-recheckable bundle; Indian rule packs.
- *Evaluation:* build 1,000 synthetic Indian profiles plus a fault-injected advice corpus (wrong arithmetic, ignored debt, liquidity breach, ineligible product, stale rule).
  - *Metrics:* false-accept rate with exact CI, coverage, false-reject rate, unsat-core localisation accuracy, claim-parse F1, repair recovery at pass@1 and pass@3, latency.
  - *Baselines:* LLM judge, FinDVer RAG-CoT, generic retry, optionally Bedrock AR on the English subset.
- *Honest limit:* it proves consistency with a stated rule set, not good advice. Ground truth must come from independent labelling by a qualified adviser (report κ), avoiding the circularity seen in Hsia et al.

**M2. Hinglish finfluencer claim verifier linked to market data**
- *Mechanism:* ASR on public videos, then typed claim extraction (past return, target, guarantee, tip, coded reference, registration status), ticker linking, and point-in-time checks against adjusted prices and SEBI registers. Outputs a triage flag with evidence.
- *Genuinely new:* a public Hinglish financial claim corpus and verification against market data instead of fact-check articles.
- *Evaluation:* 1,500-3,000 annotated claims with a double-annotated sample.
  - *Metrics:* κ, numeric-token error rate after ASR, ticker-linking accuracy, verdict macro-F1, false-flag rate at fixed coverage, and event-study abnormal returns as a secondary analysis.
  - *Baselines:* dictionary linker, MFMDQwen or a general LLM judge, RAG-CoT, English-translated pipeline.
- *Risks:* annotation load and platform terms. Cap at 2-3 claim types if time runs short.

**M3. Metamorphic suitability auditor**
- *Mechanism:* property-based tests for advisers: paired profiles with required relations (shorter horizon must not raise equity; no emergency fund must raise liquidity; high-cost debt must be addressed; same profile in English, Hindi and Hinglish should give equivalent advice).
- *Genuinely new:* adds a test oracle and language invariance to surrogate-only audits, on Indian profiles and products.
- *Evaluation:* violation rate per relation with CI, feature concentration with R², pairwise Jaccard, with and without M1. *Baselines:* Ross and Lo's surrogate pipeline; unguarded LLM; RAG or web-search LLM.
- *Risks:* relations need expert sign-off, since some are debatable. Small API budget required.

**M4. Indian filing claim verifier with adaptive abstention**
- *Mechanism:* port candidate-independent grounding to Indian XBRL and Ind AS, then calibrate plan acceptance with adaptive conformal methods across fiscal periods.
- *Genuinely new:* the Indian taxonomy and benchmark, plus conformal control on verifier planning under time shift (none found in finance QA).
- *Evaluation:* VeriFin's XBRLFiling, FinanceBench and TAT-DQA subsets plus a new 300-600 question Indian set, with temporal splits. *Metrics:* false accepts with CI, coverage, risk-coverage curve, empirical versus nominal coverage. *Baselines:* VeriFin, LLM judge, FinDVer, VerifierFC.
- *Risks:* I could not verify bulk access to Indian XBRL in this run (I recall NSE, BSE and MCA filing XBRL). Do a 2-week data spike first. Conformal adds little if the base verifier already has zero false accepts, so target raising coverage instead.

**M5. SEBI-order-seeded cross-platform pump detection for SME stocks**
- *Mechanism:* mine orders for seed labels, weakly label public X and Telegram posts, and fuse with price and volume anomalies on thin SME stocks to measure lead-lag.
- *Genuinely new:* Indian equity focus and text-market fusion.
- *Evaluation:* leave-one-case-out event F1, PR-AUC at about 1% prevalence, precision@k per day, median lead time. *Baselines:* market-only anomaly detection; PumpSense-style LightGBM and BGE-M3 text-only models.
- *Risks:* few cases, historic posts possibly deleted, and limited SME data. Highest risk here, so treat it as stretch work.

**Suggested first month (any direction):** read the primary documents flagged above, check arXiv for overlap, run the data spike, and freeze metrics before building. Report abstention alongside accuracy, because a verifier can trivially reach zero false accepts by refusing everything.

### Gaps
- Costs, GPU needs and team skills were not assessed.
- No check was run for competing Indian student or industry projects or for patents.
- Novelty claims need a fresh dedicated literature search, which the search budget prevented here.
