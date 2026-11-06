# Indian Patent Law for Software and FinTech, plus a Preliminary Prior-Art Scan (as of 6 November 2026)

Status of these notes: a preliminary, non-legal scan by a non-lawyer. Nothing here says a mechanism is novel, inventive or patentable. It records only what was found and not found, with the search strings used and the limits of the search. A registered patent agent must review any filing decision.

## How can the team tell a product idea, a technical improvement and a potentially patentable invention apart?

### Takeaway
The dividing line is where the core of the claim lies. A commercial or advisory rule is a product idea. Better engineering using known methods is a technical improvement. Only something that solves a technical problem by technical means, with a measured technical effect and a not-obvious difference from the prior art, is worth sending to a patent agent as a candidate.

### Cited Findings
- The Guidelines' business-method test asks whether the core is "primarily an administrative/commercial/business strategy" or a "technical improvement/ solution to an underlying system or process", with business context used "only as a constraint" — [CRI Guidelines 2025 §4.5.2.1](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)
- A bank's tiered fee calculation is given as a business method. A new cryptographic technique for online banking, or a technical process that speeds transaction processing in the server architecture, "would likely not be" — [CRI Guidelines 2025 §4.5.2](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)
- The presence of words such as "payment" or "transactions", or of a context such as "credit providing", does not by itself make a claim a business method — [CRI Guidelines 2025 §4.5.2](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)
- Listed as tending to fall outside the exclusion: faster processing, better storage or memory use, efficient database search or indexing, improved authentication security, concrete privacy or cryptographic methods, fault tolerance in distributed systems, efficient ML training or architectures for a specific technical task (Table 1) — [CRI Guidelines 2025 §4.5.4.2](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)
- Listed as tending to be excluded: automating bookkeeping without a data-processing gain, standard business reports or dashboards, "a basic expert system for legal advice using if-then rules", simple lookups, recommendations from basic user profiling (Table 2) — [CRI Guidelines 2025 §4.5.4.2](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)

### Inferences
Working triage. These are team filters, not legal tests.

| Category | Typical signal | Example from the candidate list | Sensible output |
|---|---|---|---|
| Product idea | The value is a financial rule, a user journey, a score or a dashboard. It could be described without saying how the system works internally | "Alert me when my portfolio is riskier than my profile" | Build it. Don't spend on filing |
| Technical improvement | Better engineering with known components, and the result is what a competent engineer would expect | Running a known GNN on a new dataset; adding a rules check after an LLM call | Project report, paper, open source |
| Potentially patentable invention (candidate only) | All of: (1) a technical problem independent of user preference; (2) specific technical means in the claim; (3) a measured effect beyond ordinary computing; (4) a stated difference from the closest documents below; (5) enough detail to reproduce | To be established by the team, if at all | Keep confidential, make an invention record, consult an agent before any disclosure |

Preliminary 3(k) pressure by mechanism. This flags risk. It is not a forecast of any outcome.

| Mechanism | Pressure point | Nearest supportive language |
|---|---|---|
| A | "Expert system ... if-then rules" (Table 2); suitability rules look commercial | Would need a technical effect in the verification pipeline itself |
| B, C, D, H, K | Financial analysis or scoring reads as "financial scheme" or financial activity; dashboards and alerts risk 3(k) and 3(n) | Table 1 only if the improvement is in data processing. The "simulation" row names technical or physical systems, not household finance |
| E | Blackberry (2026) "user-dependent problem" could be raised against scam susceptibility | Comviva, Microsoft (2023), Table 1 row on authentication security |
| F | Abstract ML; §5.2.3 asks for training data detail that students may not have | Table 1 row on training efficiency or architectures; privacy row |
| G | Algorithm limb if only the maths is claimed | Guidelines' cryptography example; §4.5.3 asks for implementation detail in the payment setting |
| I, J | Behavioural or market scoring reads as analysis; a behavioural guardrail may read as a user problem | Weak on the text read |
| L | "Simple conversion of manual tasks", bookkeeping | Table 1 row on search and indexing; Ab Initio (Madras 2025) on data lineage and faster queries |

### Gaps
- Annexure I (allowable and non-allowable claim examples) and Annexure II (case list) are referred to in the Guidelines, but the PDF I read ends at page 63 without them. A summary of Draft v2.0 lists financial computations and POS terminals among annexure examples — [BananaIP search excerpt, not opened](https://www.bananaip.com/intellepedia/cri-guidelines-2025-version-2/). Read the annexures before relying on the table above.

## What do Section 3(k), Section 3(m) and the CRI Guidelines say today?

### Takeaway
The final Guidelines were notified in July 2025 and supersede Draft v1 and v2. They set structured tests for each limb of 3(k), and they say novel hardware is not required.

### Cited Findings
- Section 3(k): "a mathematical or business method or a computer programme per se or algorithms". Section 3(m): "a mere scheme or rule or method of performing mental act or method of playing game". Section 3(n), quoted in the Guidelines: "a presentation of information" — [Patents Act 1970, amendments to 1-08-2024](https://ipindia.gov.in/frontend/pdf/patents/1_113_1_The_Patents_Act__1970___incorporating_all_amendments_till_1-08-2024.pdf); [CRI Guidelines 2025 §3.2](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)
- Timeline: Draft v1.0 on 25 March 2025; Draft v2.0 on 26 June 2025 with comments due 7 July 2025; final notified, with a PIB release dated 29 July 2025. The PIB page returned 403 to my fetcher, so these dates come from search excerpts — [PIB, not opened](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2149719&reg=48&lang=2); [NASSCOM, not opened](https://community.nasscom.in/communities/public-policy/draft-guidelines-examination-computer-related-inventions-cri-2025-version)
- The Guidelines apply "with immediate effect" and delete Manual Chapter 09.03.05.10 — [CRI Guidelines 2025 §§6-7](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)
- Computer programme per se, four steps: construe the substance and essential technical features; identify the core problem, solution and technicality; decide whether there is a technical effect "beyond a mere incidental effect"; conclude. "Allowability under section 3(k) does not necessitate presence of 'Novel Hardware'" — [CRI Guidelines 2025 §4.5.4](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)
- Algorithm, three steps: identify the series of steps; decide whether they are abstract or enabled with technical specifics; conclude. The claim must add "technical realization or application in a technical framework". The Guidelines' example is a cryptographic algorithm claimed without explaining its implementation in a payment system — [CRI Guidelines 2025 §4.5.3](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)
- Worked examples: dynamic ad pricing applying "a set of business rules" through a server and database is excluded (Example 3). An NFC point-of-sale payment method is discussed as technical, with payment context as the framework (Example 4). I read Example 3's conclusion in full and Example 4 in part — [CRI Guidelines 2025 §4.5.2.2](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)
- Form does not rescue substance: claims in any form are refused if in substance they fall in an excluded category, and the exclusion cannot be avoided by "camouflaging" — [CRI Guidelines 2025 §4.4.2](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)
- AI: abstract models are not patentable, but an innovation that "transforms abstract principles into a real-world tangible application ... may become" patentable subject matter. AI-generated inventions are not patentable because AI is not a "person" under Section 6; AI-assisted inventions are not categorically excluded — [CRI Guidelines 2025 §§5.2, 5.2.1](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)
- AI disclosure: test results should be included where reliability matters, including "robustness to minor input perturbations (e.g., fraud detection ...)" and quantified false positive and false negative rates. Example 9 expects architecture, dataset characterisation, preprocessing, training settings and validation metrics — [CRI Guidelines 2025 §5.2.3](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)
- Blockchain: applications must describe cryptographic techniques, data structures, consensus and hardware or network interactions — [CRI Guidelines 2025 §5.4.1](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)
- Mathematical method test (three steps) and novelty via the "Seven Stambh" test from Ericsson v. Lava, as summarised by a law firm — [Remfry note](https://www.remfry.com/wp-content/uploads/2025/08/CRI-Guidelines.pdf)

### Inferences
- Claims built on "apply rules to financial data on a server" are the pattern that Example 3 refuses. Most of mechanisms B, C, D, H and K would start near that pattern unless the team identifies a different technical core.
- Team workflow: use the §4.5.4.1 four steps and the §4.5.2.1 test as a written self-check for each candidate.

### Gaps
- I did not read every example in §4.5. No example found in the passages read covers financial advice, LLM output checking or portfolio analytics.

## What do the recent decisions establish on technical effect and technical advancement?

### Takeaway
The courts accept that software can clear 3(k) when it shows a specific technical effect. Security and data-performance effects have succeeded, while user-convenience and bare-instruction claims have failed. The law is not settled, as commentators note inconsistent tests and OpenTV treats the business-method limb as an absolute bar.

### Cited Findings
Unless stated, quotations and dates come from the case excerpts reproduced in [CRI Guidelines 2025 §3.5](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf). I read Ferid Allani in the original. I did not open the other judgments, because future.indiankanoon.org did not resolve from my fetcher.

| Decision | Date, number | Outcome and point | Source level |
|---|---|---|---|
| Ferid Allani v. Union of India (Delhi HC) | 12 Dec 2019, W.P.(C) 7/2014, Prathiba M. Singh J | Para 11: an invention showing a "technical effect" or "technical contribution" "is patentable even though it may be based on a computer program". Directed re-examination, so it did not itself decide patentability | [Judgment](https://ipindia.gov.in/storage/uploads/media/2.%20Ferid%20Allani%20v.%20Union%20of%20India%2C%202019%2C%20M%20Pratibha.pdf) |
| OpenTV v. Controller (Delhi HC) | 11 May 2023, C.A. 14/2021 | Para 72: the bar on business methods is "an absolute bar without analysing issues relating to technical effect". Para 73: ask whether the application "addresses a business or administrative problem" | Guidelines excerpt |
| Microsoft v. Asst. Controller (Delhi HC, authentication) | 15 May 2023, C.A. 29/2022 | Para 41: two-tier cookie authentication goes "beyond the user-interface level" and is "closer to the heart of computer and network technology" | Guidelines excerpt |
| Raytheon v. Controller General (Delhi HC) | 15 Sep 2023, C.A. 121/2022 | Para 21: novel hardware is "a higher standard which lacks any basis in law" | Guidelines excerpt |
| Microsoft v. Asst. Controller (Delhi HC 2024, compression) | 16 Apr 2024, C.A. 185/2022 | Para 33: must contribute to "a specific and credible technical effect or enhancement beyond mere general computing processes". This is the 2024 Delhi decision in the brief | Guidelines excerpt |
| Microsoft v. Asst. Controller (Madras HC) | 3 Jul 2024, (T) CMA (PT) 49/2023 | Para 36: effect on hardware, or a technical solution "not limited in its impact to a particular application or data set". Para 25 (quoted in Guidelines §2.1): protection for an algorithm as such is limited to copyright in its expression | Guidelines excerpt |
| Ab Initio v. Asst. Controller (Delhi HC) | 30 Jul 2024, C.A. 26/2021 | Para 38: technical effect "cannot be just about nuts and bolts"; an input enabling faster processing counts | Guidelines excerpt |
| Blackberry v. Asst. Controller (Delhi HC, algorithm) | 30 Aug 2024, C.A. 229/2022 | Paras 48, 52: instructions or policies directing flow without hardware change are not protected; "the inventive feature would have to be the implementation and not the algorithm itself". Refused | Guidelines excerpt; [Cyril Amarchand note](https://corporate.cyrilamarchandblogs.com/2024/09/invention-that-is-a-series-of-instructions-does-not-meet-the-criteria-for-patent-protection-under-section-3k-of-the-patents-act/) |
| Blackberry v. Controller (Delhi HC, media files) | 2024:DHC:6572, Aug 2024 | Auto-selection of media files: 3(k) objection rejected as it increased device capability; claims to be amended. Court did not treat the EPO refusal as decisive | [Verdictum](https://www.verdictum.in/app-lite/court-updates/high-courts/delhi-high-court-2024-dhc-6572-blackberry-limited-v-controller-patents-and-designs-allows-blackberrys-patent-for-auto-selection-of-media-files-sec-3k-of-patents-act-1549845?hasShare=1); [IAM](https://www.iam-media.com/article/delhi-high-court-upholds-patentability-of-software-implemented-inventions-based-technical-contribution-following-blackberry-application-refusal) |
| Comviva v. Asst. Controller (Delhi HC) | 12 Nov 2024 per a search excerpt, Amit Bansal J | Contactless card token authentication is not a business method or programme per se. Words like "payment" are not decisive, and authentication completes before the transaction. Refusal set aside | [AIPPI](https://www.aippi.org/news/decoding-business-method-delhi-high-court-clarifies-section-3k-interpretation-in-comviva-technologies-case/); [Indian Kanoon, not reachable](https://future.indiankanoon.org/doc/197857960) |
| Caleb Suresh Motupalli v. Controller (Madras HC) | 29 Jan 2025, 2025:MHC:293, C.M.A. (PT) 2/2024 | Appeal dismissed. Guidelines quote it on enablement: the applicant "merely coalesced" prior disclosures, and undue experimentation was needed (Sections 10(4)(a), 10(4)(b), 10(5)). A blog adds 3(k) and 3(m) reasoning | Guidelines §5.2.2; [IP-Adjutor](https://ip-adjutor.blogspot.com/2025/02/caleb-suresh-motupalli-vs-controller-of.html) |
| Kroll v. Controller (Delhi HC) | C.A. 439/2022, article dated 3 Sep 2025 | Peer-to-peer person location: "without any demonstrable technical advancement". Refusal upheld | [Conventus Law](https://conventuslaw.com/report/india-delhi-high-court-upholds-patent-refusal-under-section-3k/) |
| Ab Initio v. Controller (Madras HC) | 4 Nov 2025, 2025 MHC 2579 | Data lineage: novel hardware not needed; 3(k) is assessed on the claim as a whole without prior art; faster query handling relied on; adopts the EPO two-hurdle approach. Allowed | [Casemine commentary](https://www.casemine.com/commentary/in/technical-contribution-without-novel-hardware:-madras-high-court%E2%80%99s-section-3%28k%29-framework-for-computer%E2%80%91related-inventions-in-ab-initio-technology-llc-v.-controller-of-patents/view) |
| Blackberry v. Controller (Delhi HC, colour coding) | 30 Apr 2026, 2026:DHC:3668, Tejas Karia J | Colour-coding recipients to avoid misdirected messages: a "user-dependent problem", no hardware improvement, and obvious over D1 to D3. Refused | [Lawfoyer](https://lawfoyer.in/blackberry-limited-v-controller-of-patents-and-designs-2026dhc3668/); [Bar & Bench, not opened](https://www.barandbench.com/news/litigation/delhi-high-court-rejects-blackberry-patent-claim-on-colour-coded-messaging) |

- A May 2026 commentary says Delhi benches use two tests (hardware improvement versus overcoming a pre-existing problem, which can include user experience), that Madras mainly uses the first, and that the outcomes are inconsistent. It says the 2025 Guidelines have not made 3(k) "any less fuzzy" — [SpicyIP](https://spicyip.com/2026/05/keep-the-technical-lets-bring-consistency-in-3k.html)

Source conflicts to note:
- One case brief merges Microsoft and Raytheon under one number. The Guidelines show separate numbers and dates, and I follow the Guidelines — [The Legal Lock](https://www.thelegallock.com/resources/case-briefs/case-brief-microsoft-technology-licensing-v-asst-controller-of-patents-and-designs-and-raytheon-company-v-controller-general-of-patents-and-designs)
- Caleb's date appears as 20 March 2025 on one listing. The Guidelines say 29 January 2025 — [LatestLaws, not opened](https://www.latestlaws.com/judgements/madras-high-court/2025/march/2025-latest-caselaw-4229-mad)
- An AIPPI article and a search excerpt give C.A. 492/2022 for OpenTV or Comviva, while the Guidelines give C.A. 14/2021 for OpenTV. Verify Comviva's number from the judgment.

### Inferences
- OpenTV and the Guidelines are in some tension with Comviva. For the team, the safest reading is that a claim framed as solving a financial, advisory or suitability problem faces the OpenTV question first, before technical effect is considered.
- "Technical problem" framing matters for mechanism E. Comviva and Microsoft (2023) credit security effects, while Blackberry (2026) discounted a user error. A scam-defence claim could be argued either way.
- Caleb is a warning for student filings: stitching known components together without working detail fails on enablement, even before 3(k).
- I attribute the 2024 "Administration of Wireless Systems" reasoning to C.A. 229/2022 because the quoted algorithm language matches. The note I read does not give the number.

### Gaps
- I found no 2025-2026 Indian decision on an LLM, AI-advice or wealth-tech claim in the results.
- Judgment texts other than Ferid Allani were not opened, so paragraph-level detail rests on the Guidelines and on commentary.

## What happens if students publish or demo before filing, and what do filing, fees and ownership look like?

### Takeaway
India has no general grace period. Section 31 is narrow, so a paper, preprint, public repository or open demo before filing can count against the team's own application. The practical order is to check ownership, file a provisional that fully describes what will be shown, and only then present.

### Cited Findings
- Section 29(2): prior publication does not anticipate if the matter was obtained from the applicant and published without consent, and the application follows as soon as reasonably practicable after learning of it. The protection is lost if the invention was commercially worked in India before priority, other than for reasonable trial — [Patents Act 1970](https://ipindia.gov.in/frontend/pdf/patents/1_113_1_The_Patents_Act__1970___incorporating_all_amendments_till_1-08-2024.pdf)
- Section 30: communication to Government for investigating the invention does not anticipate — [Patents Act 1970](https://ipindia.gov.in/frontend/pdf/patents/1_113_1_The_Patents_Act__1970___incorporating_all_amendments_till_1-08-2024.pdf)
- Section 31: covers display at an exhibition notified in the Official Gazette, resulting publication, unauthorised use during the exhibition, and "a paper read by the true and first inventor before a learned society or published with his consent in the transactions of such a society", if the application is made within twelve months of the opening or the reading or publication — [Patents Act 1970](https://ipindia.gov.in/frontend/pdf/patents/1_113_1_The_Patents_Act__1970___incorporating_all_amendments_till_1-08-2024.pdf)
- Section 32: public working in India within one year before priority is excused only "for the purpose of reasonable trial only" and where it was reasonably necessary to do so in public — [Patents Act 1970](https://ipindia.gov.in/frontend/pdf/patents/1_113_1_The_Patents_Act__1970___incorporating_all_amendments_till_1-08-2024.pdf)
- Section 33(1): matter "described in the provisional specification" may be used or published after filing it without causing refusal or revocation on that ground alone. Section 34 is the saving clause — [Patents Act 1970](https://ipindia.gov.in/frontend/pdf/patents/1_113_1_The_Patents_Act__1970___incorporating_all_amendments_till_1-08-2024.pdf)
- Section 9(1): a complete specification must follow within twelve months of the provisional, or the application is deemed abandoned — [Patents Act 1970](https://ipindia.gov.in/frontend/pdf/patents/1_113_1_The_Patents_Act__1970___incorporating_all_amendments_till_1-08-2024.pdf)
- Section 39: a person resident in India needs a written permit to file abroad, unless an Indian application was made at least six weeks earlier and no secrecy direction applies — [Patents Act 1970](https://ipindia.gov.in/frontend/pdf/patents/1_113_1_The_Patents_Act__1970___incorporating_all_amendments_till_1-08-2024.pdf)
- A blog on the IP Office site (the author's own views, not the Office's) says a conference talk, paper, video or public demo "can be treated as prior art", that "not every journal, conference, or seminar qualifies", and that a thesis in a public repository such as Shodhganga is also a disclosure. It advises filing a provisional (Form 1 and Form 2) first — [IP India student guide](https://ipindia.gov.in/storage/uploads/media/blog1-student_guideline.pdf)
- Rule 29A and Form 31 were added by the 2024 Rules, and the form requires documentary evidence (the Gazette notification, proof of consent, society records) — [2024 Rules, Form 31](https://taxguru.in/wp-content/uploads/2024/03/Patents-Amendment-Rules-2024-Table-Forms.pdf). "Learned society" and "transactions" are undefined, a demo day is not automatically covered, and a preprint or conference paper should not be assumed to qualify — [Intepat](https://www.intepat.com/blog/grace-period-under-section-31-of-the-patents-act-in-india)
- The EPO and many other jurisdictions generally have no comparable grace period, and Section 31 only protects the Indian filing — [IP India student guide](https://ipindia.gov.in/storage/uploads/media/blog1-student_guideline.pdf)

Fees from the First Schedule, as substituted by the March 2024 Rules (e-filing, rupees). Confirm against the current schedule before filing.

| Item | Natural person, startup, small entity or educational institution | Others, alone or jointly with any of those |
|---|---|---|
| Form 1 application (provisional or complete) | 1,600 | 8,000 |
| Form 18 request for examination | 4,000 | 20,000 |
| Form 18A expedited examination | 8,000 | 60,000 |
| Form 31 grace period | 500 | 2,500 |

Source: [Patents (Amendment) Rules 2024 tables](https://taxguru.in/wp-content/uploads/2024/03/Patents-Amendment-Rules-2024-Table-Forms.pdf). The Form 31 figure is also reported as checked in June 2026 by [Intepat](https://www.intepat.com/blog/grace-period-under-section-31-of-the-patents-act-in-india).

- Natural persons get the lowest category with no extra form. Eligible educational institutions get the 80% reduction by filing Form 28. Agent fees are separate — [IP India student guide](https://ipindia.gov.in/storage/uploads/media/blog1-student_guideline.pdf). The 80% reduction dates from the 2021 amendment — [IPWatchdog, search excerpt](https://ipwatchdog.com/2021/10/09/india-amends-patent-rules-reduces-fees-80-educational-institutions/)
- Ownership: "There's no single national rule". It depends on the institute's IP policy and funding agreements, and the guide or PI may be a co-inventor without being an applicant — [IP India student guide](https://ipindia.gov.in/storage/uploads/media/blog1-student_guideline.pdf). Section 6 limits applicants to the true and first inventor, an assignee or a legal representative — [Patents Act 1970](https://ipindia.gov.in/frontend/pdf/patents/1_113_1_The_Patents_Act__1970___incorporating_all_amendments_till_1-08-2024.pdf)
- AICTE's 2019 National Innovation and Start-Up Policy, as reported: joint ownership where institute facilities or funds are substantially used "or the work is part of a curriculum or academic activity"; sole inventor ownership if made without facilities or funds and outside working hours. A Commerce Ministry draft at that time favoured institute ownership — [Millennium Post](https://www.millenniumpost.in/nation/sole-patent-ownership-to-innovator-if-invented-without-institute-support-376287); [Business Standard, not opened](https://business-standard.com/article/pti-stories/aicte-to-take-up-patent-rights-for-on-campus-inventions-issue-with-commerce-ministry-119092900276_1.html)

### Inferences
| Event before filing | Reading of the statute (confirm with an agent) |
|---|---|
| Conference or journal paper, arXiv, blog | Treat as prior art unless clearly a learned-society paper under 31(d). Even then the protection is India-only, and foreign rights may be lost |
| College evaluation, viva or mid-term demo | No source addresses this directly. Whether it is "public" likely turns on whether attendees are bound to confidence. Treat as a risk: file first, or hold a closed session under written confidentiality |
| Hackathon, expo, demo day | Outside 31(a) unless Gazette-notified |
| Public GitHub repo, video, project website, thesis or report upload | Same exposure as a publication. Keep repos private until filing |
| Live pilot with users | Section 32 helps only for reasonable trial that had to be public. Don't plan around it |
| Someone leaks it without consent | Section 29(2), if the team acts as soon as practicable |
| Presentation after a provisional | Section 33(1) protects only matter described in the provisional, so a thin provisional leaves the extra detail exposed |

- A final-year major project is "curriculum or academic activity", so under the reported AICTE framing joint ownership with the institute is a likely starting point. Read the college's own policy first.
- Fee trap: joining a company as co-applicant moves the application to the higher column, per the table heading.
- An unfiled team should plan its submission calendar backward from the first evaluation or paper date.

### Gaps
- The Section 13 search provision was read, but I did not retrieve authority on what amounts to public knowledge in a closed academic evaluation.
- I did not retrieve a list of currently notified Section 31 exhibitions, or any ruling on what is a "learned society".
- The institute policies at [CBIT](https://cbit.edu.in/userfiles/policy/2024/IPR-POLICY-AY-2024-2025.pdf) and [SRKREC](https://www.srkrec.ac.in/assets/documents/policies/ipr-policy.pdf) were surfaced but not opened. Whether AICTE's policy has since changed was not confirmed.
- The US grace period was not retrieved in a primary source and so is not stated here.

## What do inventive step and industrial applicability require, and what evidence supports a filing?

### Takeaway
3(k) clearance is not enough. The difference over the closest art must be non-obvious, the benefit must be concrete, and the specification must let a skilled person reproduce it. Measured evidence against a baseline is the team's strongest asset.

### Cited Findings
- Section 2(1)(ja): inventive step means "technical advance as compared to the existing knowledge or having economic significance or both and that makes the invention not obvious to a person skilled in the art" — [Patents Act 1970](https://ipindia.gov.in/frontend/pdf/patents/1_113_1_The_Patents_Act__1970___incorporating_all_amendments_till_1-08-2024.pdf)
- CRIs are assessed "in like manner as in other categories". The structured approach listed runs: identify the skilled person, common general knowledge, the inventive concept, the differences from the cited matter, and whether those differences would be obvious — [CRI Guidelines 2025 §4.2](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)
- Madras HC treats the two questions separately: 3(k) looks at technical contribution, while Sections 2(1)(j) and (ja) look at novelty and advance over prior art — [Casemine commentary on Ab Initio](https://www.casemine.com/commentary/in/technical-contribution-without-novel-hardware:-madras-high-court%E2%80%99s-section-3%28k%29-framework-for-computer%E2%80%91related-inventions-in-ab-initio-technology-llc-v.-controller-of-patents/view)
- Industrial applicability: "a concrete benefit must be derivable directly from the description", and "mere speculative use" does not suffice — [CRI Guidelines 2025 §4.3](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)
- Blackberry 2026 shows that combining three documents, with a small shift in context, can defeat inventive step — [Lawfoyer](https://lawfoyer.in/blackberry-limited-v-controller-of-patents-and-designs-2026dhc3668/)
- Vague "time and resources saved" arguments were rejected as not a tangible change in hardware — [SpicyIP](https://spicyip.com/2026/05/keep-the-technical-lets-bring-consistency-in-3k.html)

### Inferences
Evidence pack worth building during the project:
1. A dated invention record: problem, alternatives tried, who contributed what (private git history helps).
2. A prior-art log like the one below, with the closest documents and a feature-by-feature comparison.
3. Benchmarks against a named baseline: latency, memory, storage, false positives and negatives, robustness to perturbation, and the error rate of the verification step.
4. The technical-effect statement in one sentence, without financial benefit language.
5. Enablement detail: architecture, schemas, thresholds, training data description, failure handling.
6. Ownership paper: institute policy, assignment if needed, inventor list, funding terms.

### Gaps
- I did not retrieve Indian data on grant rates or examination timelines for fintech applications.

## How do US Alice and Section 101, and EPO technical character, compare?

### Takeaway
Both matter only if foreign filing is planned. The USPTO has recently been more permissive towards AI improvements, but courts are not bound by that. The EPO applies a two-stage approach in which only technical features count towards inventive step, and it lacks a comparable general grace period.

### Cited Findings
- Ex parte Desjardins (Appeals Review Panel, September 2025, precedential): claims to reducing "catastrophic forgetting" in training were a technological improvement. It binds examiners and the PTAB, not federal courts — [Davis Wright Tremaine, 5 Oct 2026](https://www.dwt.com/insights/2026/10/uspto-ai-patent-eligibility-guidance)
- USPTO offers a voluntary Subject Matter Eligibility Declaration under 37 C.F.R. § 1.132, and the Director testified on 29 September 2026. Alice/Mayo challenges remain in court — [Davis Wright Tremaine](https://www.dwt.com/insights/2026/10/uspto-ai-patent-eligibility-guidance)
- Recentive v. Fox (Fed. Cir., April 2025): patents that "do no more than claim the application of generic machine learning to new data" are ineligible, as reported in search excerpts — [Bloomberg Law, not opened](https://news.bloomberglaw.com/esg/ai-patent-eligibility-has-shifted-with-one-machine-learning-case); [Cooley, not opened](https://www.cooley.com/news/insight/2025/2025-10-06-ex-parte-desjardins-squires-helmed-uspto-looks-to-train-ptab-on-101-eligibility-of-ai-related-patent-claims)
- EPO: technical means clear the exclusion, then inventive step under COMVIK counts only features contributing to technical character. AI routes are a technical application or a specific implementation exploiting computer architecture. T 0702/20 (pruning ANN nodes) was refused — [California Lawyers Association recap, 26 Nov 2025](https://calawyers.org/intellectual-property-law/event-recap-technical-character-at-the-epo-latest-guidelines-case-law-for-patenting-ai-software/)
- India differs: OpenTV para 72 notes that "as such" qualifies all categories in the UK and Europe, while "per se" in India does not qualify business methods — [CRI Guidelines 2025 §3.5.3](https://ipindia.gov.in/frontend/pdf/patents/guidelines/GUIDELINES%20FOR%20EXAMINATION%20OF%20COMPUTER%20RELATED%20INVENTIONS%20%28CRIs%29%20-%202025.pdf)

### Inferences
- "Apply ML or an LLM to financial data" is the weak pattern in all three systems. An improvement to how the verification, cryptography or training itself works is the common stronger pattern.

### Gaps
- USPTO memos, the Desjardins opinion, Alice itself and the 2026 EPO Guidelines text were not opened. One search excerpt says the 2026 edition took effect on 1 April 2026, and section numbering differs across sources.

## What was searched, and what are the limits of this scan?

### Takeaway
This scan is thin, and absence of a result means little. Each mechanism got one or two direct patent queries through a general search tool, a planned second round did not run, and no Indian patent database was actually searched. Treat every "not found" as "not found by this scan".

### Cited Findings
Access results (6 Nov 2026):

| Source | Result |
|---|---|
| Google Patents search UI, [patents.google.com/?q=...](https://patents.google.com/?q=(LLM+financial+advice+verification+SMT+constraints)) | Only an app shell without JavaScript; no results |
| Google Patents robots | [robots.txt](https://patents.google.com/robots.txt) disallows everything except `/`, `/advanced`, `/patent/`, `/sitemap/` |
| Google Patents data endpoint | One query was sent to `/xhr/query` before I read robots.txt. It is disallowed for automated access, so I stopped. String: `"large language model" "financial advice" verif` (68 total results; first 10 seen). Results were used only as leads, then opened at `/patent/` |
| Google Patents document pages | Worked. This is the source of the bibliographic details below |
| WIPO Patentscope, [result URL tried](https://patentscope.wipo.int/search/en/result.jsf?query=FP:(large%20language%20model%20financial%20advice%20verification)) | HTTP 403. Not retried. **No Patentscope search was performed** |
| InPASS, [iprsearch.ipindia.gov.in/PublicSearch](https://iprsearch.ipindia.gov.in/PublicSearch) | Reachable, but the form needs a CAPTCHA, which I did not attempt to bypass. **No InPASS search was performed** |
| Google Scholar | [robots.txt](https://scholar.google.com/robots.txt) disallows `/scholar`. **Not queried.** Publications came from the search tool and direct arXiv pages |

Patent-scan queries run through the search tool, restricted to patents.google.com, patents.justia.com and freepatentsonline.com (A1 to patents.google.com only). Results also included USPTO PDFs and arXiv papers.

| Ref | Exact string |
|---|---|
| A1 | `large language model output verification financial advice constraint solver patent` |
| A2 | `patent generating financial recommendation machine learning model validate output compliance rules portfolio suitability generative AI hallucination numeric check` |
| B | `patent look-through portfolio exposure mutual fund holdings aggregate graph corporate group ownership concentration risk` |
| C | `patent detect mismatch risk tolerance questionnaire versus actual portfolio risk investor suitability monitoring alert` |
| D | `patent household financial digital twin Monte Carlo simulate major purchase affordability probability recommended remedies` |
| E | `patent detecting social engineering scam during phone call payment app on-device screen sharing remote access active call transaction block` |
| F | `federated graph neural network money mule account detection cross-institution patent temporal transaction graph privacy` |
| G | `zero-knowledge proof bank statement income verification without revealing, selective disclosure signed financial data patent loan eligibility` |
| H | `patent loan stacking detection multiple lenders real-time before credit bureau update transaction data early warning debt` |
| I | `patent social media posts stock manipulation pump and dump detection correlate messages with trading market surveillance influencer` |
| J | `patent detecting trader emotional state tilt loss chasing from trade sequence behavioural intervention trading platform restriction` |
| K | `patent counterfactual explanation credit denial actionable recourse adverse action machine learning thin file applicant` |
| L | `patent reconciliation financial records knowledge graph entity resolution tax statement bank statement inconsistent multiple sources` |

Second-round queries that did **not** run, because the session's web-search budget ran out. Rerun them manually:
- `Amazon Bedrock Guardrails Automated Reasoning checks formal logic validate LLM output SMT mathematically verifiable` (partly replaced by opening the AWS page directly)
- `patent formal verification large language model response satisfiability modulo theories logic extract claims automated reasoning policy`
- `patent generative AI wealth advisor extract numerical values from generated response validate against customer account data before displaying`
- `Android in-call scam protection screen sharing banking app active phone call Google Play Protect block sideload` (partly replaced by opening the Google post directly)
- `patent mobile banking app detect screen sharing or remote access application during ongoing call fraud risk step-up authentication trusted contact`
- `"federated learning" "graph neural network" anti-money laundering patent application multiple banks suspicious account`
- `Account Aggregator India zero knowledge proof affordability selective disclosure signed FIP data consent ReBIT`
- `"Account Aggregator" patent India invention consented financial data system method application`

### Inferences
Other limits a reader should weigh:
- **No IN-numbered application was opened.** The only Indian-origin document seen is Mastercard's US12271352B2, with an Indian priority application. India-specific claims around AIS, 26AS, CAS, Account Aggregator or SEBI rules are effectively unsearched.
- No CPC or IPC classification searching, no Espacenet, no Lens, and Chinese filings appeared only by chance. Published applications are hidden for about 18 months, so recent filings cannot be seen.
- Direct queries missed relevant documents. US20260203817A1 and US20250086656A1 surfaced only from citation lists, which suggests real coverage is greater than the ratings imply.
- Page reading was partial. WebFetch returns about 100,000 characters per call, and many patents are longer. "Claims read" is marked per document; otherwise "not described" means not in the portion read.
- Google Patents labels legal status and assignee as assumptions, and these are quoted as such. Abandoned or expired documents still appear in the tables because a published document can be cited as prior art regardless of status. That last point is general knowledge, not sourced here.
- Summaries come through an extraction model reading the pages, so verify each key document by eye before relying on it.

Overall preliminary ratings, in what I could search:

| Mechanism | Rating | Confidence in rating | Main thing not found by this scan |
|---|---|---|---|
| A. LLM advice verification | Moderately covered, fast-moving | Low to medium | A patent combining personal balance sheet checks, a solver and an audit certificate |
| B. Look-through exposure graph | Moderately covered | Low | Retail look-through plus ESOPs and promoter-group links |
| C. Stated vs revealed risk drift | Moderately covered, old base art | Medium | Claimed comparison of revealed behaviour and tail risk |
| D. Household digital twin | Sparse in the one query that ran | Low | Major-purchase affordability probability with counterfactual remedies |
| E. Scam-session detection | **Crowded** | Medium to high | One document fusing all four on-device signals |
| F. Federated temporal GNN for mules | Patents: **not rated** (one broad query returned none; the dedicated patent query could not run). Publications: moderately covered | Publications: low | Any patent, which is not evidence that few exist |
| G. ZK proofs over AA or bank data | Moderately covered | Medium | Account Aggregator-specific work (query did not run) |
| H. Loan stacking early warning | Moderately covered | Low to medium | Borrower-facing warning tied to bureau refresh gaps |
| I. Finfluencer to microstructure | Moderately covered | Low | Source credibility scoring tied to order-book events |
| J. Retail derivatives guardrail | Moderately covered | Low | Explicit loss-chasing or tilt model for retail F&O |
| K. Stable recourse, thin file | Publications: **Crowded**. Patents: sparse in the one query that ran | Low | Thin-file credit-specific recourse stability |
| L. Record reconciliation | **Crowded** at the generic entity-resolution layer. India-specific layer: **not searched** | Low | AIS, 26AS, CAS, bank and bureau reconciliation |

Rating rule: "Sparse" appears only where a query actually ran and returned little (D, and K for patents), and it describes that one query only. A rating is withheld where the relevant search could not run (F patents). These aspects are recorded as **not searched**:

| Scope | Not searched |
|---|---|
| All 12 mechanisms | InPASS, WIPO Patentscope and Google Scholar. No rating here reflects those sources |
| A | Dedicated formal-verification and wealth-advisor patent queries |
| E | Dedicated screen-share and remote-access patent query |
| F | Dedicated federated-learning and GNN patent query |
| G | Account Aggregator-specific work, both patent and general |
| B, C, D, H, I, J, K, L | Second-round queries were not planned or run. Indian-specific terms were not searched |

Use of Google Patents after the single disclosed `/xhr/query` request was limited to `/patent/` pages, which robots.txt allows. I checked robots.txt only and did not separately review Google's terms of service, so anyone reusing this workflow should check them.

### Gaps
- Product documentation was opened only for A (AWS) and E (Android). Commercial tools for B, C, D, H, I, J and L were not checked, and they could be strong prior art.
- Follow-up with a human: run the queries above in InPASS, Patentscope and Espacenet, and add CPC G06Q40/ classes.

## Mechanism A: Deterministic verification of LLM financial advice

### Takeaway
Rating: **Moderately covered, fast-moving.** General LLM validation has patents, and formal checks of LLM output are already a shipping product and a 2026 research line. The specific combination was not found in a patent, on thin searching.

### Cited Findings
| Document | Assignee or authors | Priority; published | Google status | What it covers | Read level |
|---|---|---|---|---|---|
| [US11875123B1](https://patents.google.com/patent/US11875123B1/en) Advice generation system | Intuit | 2023-07-31; 2024-01-16 | Active | LLM intent, planner over account state, plan, LLM advice, forwarded to user. A constraint solver in the description acts before the LLM. No claim validates generated advice | Claims read |
| [US12147513B1](https://patents.google.com/patent/US12147513B1/en) Dynamic evaluation of LLM prompts | Citibank | 2024-04-11; 2024-11-19 | Active | Prompt validation, redaction and output validation using metrics and thresholds. No formal solver described in the part read | Part; no claims |
| [US20250321866A1](https://patents.google.com/patent/US20250321866A1/en) Validating AI applications for compliance | Citibank | 2024-04-16; 2025-10-16 | Abandoned | Test cases per guideline; compares outcomes. Loan-approval example | Part; no claims |
| [CN120851162A](https://patents.google.com/patent/CN120851162A/en) Cognitive firewall | Shengtai Renhe | 2025-07-09; 2025-10-28 | Pending | Formal verification module over compiled agent instructions. Not finance-specific | Most |
| [US20260030679A1](https://patents.google.com/patent/US20260030679A1/en) Financial coaching | Brightplan | 2024-07-29; 2026-01-29 | Pending | PII handling, fiduciary prompt, human escalation. No numeric check of responses | Claim 1 summary |
| [CN119444260A](https://patents.google.com/patent/CN119444260A/en) LLM financial consulting | Baoding Northen; Hebei Finance University | 2024-10-25; 2025-02-14 | Deemed withdrawn per a legal event | LLM advice; no post-generation check described | Page read |
| [AWS Automated Reasoning checks](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-automated-reasoning-checks.html) (product) | Amazon | Page undated | Generally available | Extracts formal logic rules from a document, translates LLM text into logic, returns proofs of validity or contradiction. Names financial services and mortgage approvals. Detect mode only; not personal balance sheets | Page read |
| [VeriFin, arXiv 2608.10213](https://arxiv.org/abs/2608.10213) | Hall, Shome, Eiers | Aug 2026 | n/a | Z3 check of LLM numeric answers grounded in XBRL filings; accept, reject or abstain. Company filings, not personal data | Abstract |
| [Neuro-Symbolic Compliance, arXiv 2601.06181](https://arxiv.org/abs/2601.06181) | Hsia, Yu, Jiang | Jan 2026 | n/a | LLM to SMT for financial regulation, plus minimal change to restore compliance | Abstract |
| [BiasMix-Finance, arXiv 2608.28646](https://arxiv.org/abs/2608.28646) | Kukreja et al. | Aug 2026 | n/a | JSON schema, KYC caps and QP projection of LLM portfolios. Code public | Abstract |

Search strings: A1, A2, and the disclosed `/xhr/query` lead.

### Inferences
- Between AWS (logic check of LLM text against policy), VeriFin (solver check of numeric claims) and BiasMix (KYC caps), an examiner could assemble a combination argument against a broad claim. Any distinct contribution would need to lie elsewhere, for example in a specific claim-extraction or certificate mechanism with measured effect. This is a flag for the agent, not a conclusion.
- Strong project and paper direction regardless.

### Gaps
- Dedicated formal-verification and wealth-advisor patent queries did not run. AWS's own patents were not searched. "Audit certificate" was not searched as a separate term.

## Mechanism B: Look-through exposure graph with control links

### Takeaway
Rating: **Moderately covered.** Fund look-through and issuer-family rollups exist, mostly for institutions. The retail combination with ESOPs and promoter-group control was not found, on one query.

### Cited Findings
| Document | Assignee or authors | Priority; published | Google status | What it covers | Read level |
|---|---|---|---|---|---|
| [US20050267835A1](https://patents.google.com/patent/US20050267835/en) Exposure across portfolios by category | BlackRock | 2003-12-31; 2005-12-01 | Abandoned | Rollup by "Ult. Issuer", direct plus corporate underlier (EI DuPont example). Manager-level, no end investor look-through | Part; no claims |
| [US7599869B2](https://patents.google.com/patent/US7599869/en) Pre-trade compliance | Charles Schwab | 2000-10-11; 2009-10-06 | Expired | Rule 2a-7 aggregation by entity across issuer, guarantor and controlled-person roles | Part |
| [US10043216B2](https://patents.google.com/patent/US10043216B2/en) 3-D diversification visualisation | Vanguard | 2014-03-19; 2018-08-07 | Active | Looks through funds to underlying holdings; no corporate-control linkage | Most |
| [US9245299B2](https://patents.google.com/patent/US9245299/en) Composite portfolio segmentation | Locus LP | 2013-03-15; 2016-01-26 | Active | Groups by functional attributes such as shared customers. Not parent-subsidiary structures | Part |
| [CorpFam, arXiv 2609.04269](https://arxiv.org/abs/2609.04269) | Gupta | Sep 2026 | n/a | Corporate-family resolution; matchers recover only 4.2% of pairs with no shared name | Abstract |

Also surfaced, not opened: [US5930774A](https://patents.google.com/patent/US5930774) fund overlap.

Search string: B.

### Inferences
- CorpFam suggests that a hard technical sub-problem sits in candidate generation for corporate-family links. That is a more technical angle than the exposure calculation, which reads as financial analysis under Table 2.

### Gaps
- Morningstar-style look-through tools, Indian promoter-group data and any India-specific filings were not searched.

## Mechanism C: Stated vs revealed risk and suitability drift

### Takeaway
Rating: **Moderately covered, with old base art.** Comparing stated tolerance with portfolio risk and alerting has been described since at least 1999-2001. Revealed-behaviour tail-risk drift was not found in the portions read.

### Cited Findings
| Document | Assignee | Priority; published | Google status | What it covers | Read level |
|---|---|---|---|---|---|
| [US11403708B2](https://patents.google.com/patent/US11403708B2/en) Investor risk management | Andes Wealth | 2019-05-21; 2022-08-02 | Active | Risk monitor plots actual portfolio risk against the tolerance bar, recalculated daily. Risk is volatility, with no tail measure | Part; no claims |
| [US11610266B2](https://patents.google.com/patent/US11610266B2/en) Behavioral risk management | Andes Wealth | 2021-07-21; 2023-03-21 | Active | Behavioural Risk Index. Claim 7 compares stated measures with each other, not with actual portfolio risk; a portfolio example appears in the description only. Questionnaire-based | Claims read |
| [US20020147671A1](https://patents.google.com/patent/US20020147671A1/en) Financial portfolio risk management | Listed: United Syndicate, Accenture | 1999-11-01; 2002-10-10 | Expired | VaR filtering against permissible tolerance; alerts on activity non-compliant with personal parameters | Part |
| [US20260203817A1](https://patents.google.com/patent/US20260203817A1/en) Managing a portfolio's performance | BhFS | 2025-01-15; 2026-07-16 | Pending | Trade-derived bias scores including "over-estimation of risk tolerance". No stated-vs-actual comparison described | Part; claim 1 partly |

Search excerpt only, not opened: [US6859788B1](https://patents.google.com/patent/US6859788B1/en), [US8442889B2](https://patents.google.com/patent/US8442889), [EP1034497A1](https://patents.google.com/patent/EP1034497A1/sv).

Search string: C.

### Inferences
- The base idea looks unpromising as a stand-alone invention given dates back to 1999. The reasonable output is a product feature or study.

### Gaps
- Regulated suitability-monitoring products and SEBI-related systems were not checked.

## Mechanism D: Probabilistic household digital twin

### Takeaway
Rating: **Sparse in the one query that ran (string D)**, low confidence. InPASS, Patentscope and Scholar were not searched. One family turned up and the other results were off-topic. Don't read this as open space, because that family already covers household Monte Carlo simulation in depth.

### Cited Findings
| Document | Assignee | Priority; published | Google status | What it covers | Read level |
|---|---|---|---|---|---|
| [US7689494B2](https://patents.google.com/patent/US7689494/en) Simulation of portfolios and risk budget analysis, family includes [US20070244777A1](https://patents.google.com/patent/US20070244777A1/en) and [US20100185561A1](https://patents.google.com/patent/US20100185561A1/en) | Advisor Software; now listed as Refinitiv | 2006-03-23; 2010-03-30 | Active | Lifetime resources against claims; Monte Carlo paths; unemployment chance and duration; disability, illness and death stress tests; countering behaviours; property sale. No explicit major-purchase affordability probability or correlated income and liability shocks in the part read | First ~23% of page; no claims |

Off-topic results for this query: vehicle digital twin [US20190384870A1](https://patents.google.com/patent/US20190384870A1/en), and household energy digital twin [arXiv 2606.31744](https://arxiv.org/pdf/2606.31744) (not opened).

Search string: D.

### Inferences
- "Digital twin" appears mostly in non-finance filings, so searching that term may miss financial planning art that uses other words. Retail planning software is a likely unsearched source.
- Household finance does not obviously fit the Guidelines row on simulating "technical/physical systems".

### Gaps
- No query tried "goal-based planning", "what-if", "mortgage affordability" or "stress test household". Most of the US7689494B2 page was unread.

## Mechanism E: On-device fusion to detect social-engineering payment sessions

### Takeaway
Rating: **Crowded.** Banks, device makers and platform owners have filings on call-linked scam detection with payment intervention, and Android already ships in-call restrictions with a banking screen-share pilot. The exact four-signal fusion was not found in one document, but no dedicated query ran on it.

### Cited Findings
| Document | Assignee | Priority; published | Google status | What it covers | Read level |
|---|---|---|---|---|---|
| [US10810510B2](https://patents.google.com/patent/US10810510B2/en) Conversation and context aware fraud prevention | IBM | 2017-02-17; 2020-10-20 | Active | Claims: intercept call, multi-sensory inputs including a callee biometric, overall risk metric. Description: flags requests for remote access, detects wallet or device transfer use, freezes transfers, texts or transfers to a trusted person | Claims read |
| [US20220232036A1](https://patents.google.com/patent/US20220232036A1/en) Social engineering and malware alerts | JPMorgan | 2021-01-15; 2022-07-21 | Pending | OS call notification plus scam lists; a payment within a time window triggers warning, re-authentication or block. No screen-share or trusted contact | Most |
| [US20250086656A1](https://patents.google.com/patent/US20250086656A1/en) Real-time social engineering prevention | JPMorgan | filed 2023-09-07; 2025-03-13 | Pending | On-device pattern match of voice and text with local database; notifies caregivers; extra authentication. No screen-share | Claims gist |
| [US11463574B1](https://patents.google.com/patent/US11463574B1/en) Restricting access based on voice parameters | Capital One; family US11889011B2, US12368798B2 | 2021-06-07; 2022-10-04 | Active | Detects a call, scores risk, transcribes, and on account identifiers applies limits, suspension or extra authentication. No screen-share | Part |
| [US12626261B2](https://patents.google.com/patent/US12626261B2/en) / [US20250278737A1](https://patents.google.com/patent/US20250278737) Automated scam detection | Scamnetic | 2023-10-02; 2026-05-12 | Granted | Claims are counterparty identity scoring. Description adds an active-call check, payment anomaly observer and trusted-party notification | Claims read |
| [US20170142252A1](https://patents.google.com/patent/US20170142252A1/en) Scam risk during a voice call | Microsoft (granted US9692885B2) | 2015-11-17; 2017-05-18 | Active | Voice sample and number; alert during the call | Most |
| [Android in-call protections](https://blog.google/security/whats-new-in-android-security-privacy-2025/) (product) | Google | 13 May 2025 | Shipping; banking pilot | Blocks sideloading, accessibility grants and disabling Play Protect during calls. Warns if a banking app opens while screen sharing with an unknown contact; UK pilot with Monzo, NatWest, Revolut. No India pilot mentioned | Page read |

Citation lists on the IBM and Scamnetic pages also name Wells Fargo US10616411B1, USAA US11102344B1, Sentien US12652347B2, T-Mobile US20240223606A1, Lenovo US12166918B2, Nuance US11363138B2, and [US11818164B2](https://patents.google.com/patent/US11818164B2/en). Titles only; not opened.

Search string: E. The screen-share query did not run.

### Inferences
- High risk of a combination objection. The Android pilot is especially close on call state, screen share and banking app.
- It remains attractive as a project with a security framing, which aligns with Comviva and Table 1. Patent prospects need an agent's view of any specific, measured difference, such as an on-device fusion design with defined latency or privacy behaviour.

### Gaps
- Accessibility-API and media-projection detection patents were not searched. Indian payment-network or NPCI systems were not searched.

## Mechanism F: Federated or privacy-preserving temporal GNN for mule detection

### Takeaway
Rating: **Patents not rated; publications moderately covered.** One broad query returned no patents, and the dedicated patent query could not run, so patent coverage is unknown. Treat this mechanism's patent side as not searched, not as open space.

### Cited Findings
| Document | Authors | Date | What it covers | Read level |
|---|---|---|---|---|
| [arXiv 1909.12946](https://arxiv.org/abs/1909.12946) Federated Graph Learning for Financial Crimes | Suzumura et al. | Sep 2019 | Federated graph learning across institutions; UK FCA TechSprint data; about 20% better than local models | Abstract |
| [2SFGL, arXiv 2310.08335](https://arxiv.org/abs/2310.08335) | Pan et al. | Oct 2023 | Two-stage federated graph protocol with virtual fusion | Abstract |
| [arXiv 2411.02926](https://arxiv.org/abs/2411.02926) FHE for collaborative AML | Effendi, Chattopadhyay | Nov 2024 | FHE GNN and XGBoost pipelines across institutions | Abstract |
| [arXiv 2604.21789](https://arxiv.org/abs/2604.21789) Compliance Moral Hazard | Ni, Zheng, Birge | Apr 2026, v5 Oct 2026 | Incentives for cross-firm sharing; synthetic AML benchmark. Game-theoretic, not federated learning | Abstract |
| [arXiv 2607.17586](https://arxiv.org/abs/2607.17586) Explainable mule identification | Zhang et al. | Jul 2026 | Production LightGBM, TreeSHAP and LLM. A non-graph, single-institution counterpoint | Abstract |

Surfaced, not opened: [arXiv 2502.19952](https://arxiv.org/pdf/2502.19952).

Search string: F. The patent-focused follow-up did not run.

### Inferences
- The temporal aspect specifically did not appear in the federated abstracts read, but that was only abstract-level reading.
- §5.2.3 expects training-data detail, and students without real cross-bank data would be limited to synthetic data, which affects enablement and evidence.

### Gaps
- No patent data. Federated-learning patent filings, Chinese fintech filings and Indian I4C or RBI MuleHunter material were not checked.

## Mechanism G: Zero-knowledge proofs over signed AA or bank data

### Takeaway
Rating: **Moderately covered.** Very close building blocks exist, including a Microsoft patent with a bank-signed balance, loan and mortgage-income example. The Account Aggregator-specific layer was not searched, as that query did not run.

### Cited Findings
| Document | Assignee or authors | Priority; published | Google status | What it covers | Read level |
|---|---|---|---|---|---|
| [US12341895B2](https://patents.google.com/patent/US12341895B2/en) Zero-knowledge confidential computing | Microsoft | 2023-01-12; 2025-06-24 | Active | TEE prover and attestation. Example: bank-signed hash of balance, threshold check, lending decision; mortgage income range | Page read |
| [US11997107B2](https://patents.google.com/patent/US11997107B2/en) Decentralized verification in TLS (DECO) | Cornell | 2019-08-30; 2024-05-28 | Active | Three-party TLS; selective opening; zero-knowledge predicate over a bank statement. No server cooperation or source signature. No lending described in part read | Part |
| [US11658827B2](https://patents.google.com/patent/US11658827B2/en) Selective disclosure of attributes and entries | Philips | 2019-06-27; 2023-05-23 | Active | Issuer-signed attributes and entries, ZK proof of signature. Medical focus | Part |
| [US12107951B2](https://patents.google.com/patent/US12107951B2/en) Provenance verification | Philips | 2019-09-06; 2024-10-01 | Active | Adds public record ID for duplicate detection. Medical focus | Part |
| [TLSNotary review, arXiv 2409.17670](https://arxiv.org/abs/2409.17670) | Kalka, Kirejczyk | Sep 2024 | Provenance for TLS data using MPC and ZK | Abstract |
| [BLS-MT-ZKP, arXiv 2402.15447](https://arxiv.org/abs/2402.15447) | Bećirović Ramić et al. | Feb 2024 | Selective disclosure by BLS, Merkle trees, Bulletproofs | Abstract |

Surfaced, not opened: [CN112149156A](https://patents.google.com/patent/CN112149156A/en).

Search string: G. The Account Aggregator query did not run.

### Inferences
- Of the candidates, this sits closest to the Guidelines' language on cryptography and privacy. That eases the 3(k) framing only. The Microsoft and Philips documents are likely the first things to compare against.
- A possible technical question for the team is the Account Aggregator data format and signature scheme. Whether AA data is signed in a way that suits efficient proofs was not verified here.

### Gaps
- ReBIT AA specifications, zk-identity products and evidence of lender acceptance were not retrieved. Proof performance on realistic statement sizes was not reviewed.

## Mechanism H: Cross-lender stacking and debt-spiral early warning

### Takeaway
Rating: **Moderately covered.** Mastercard holds a granted patent on classifying stacking from transaction streams, and TransUnion covers a lender-network exchange that addresses bureau lag. A borrower-facing warning tied to refresh gaps was not found.

### Cited Findings
| Document | Assignee | Priority; published | Google status | What it covers | Read level |
|---|---|---|---|---|---|
| [US12555108B2](https://patents.google.com/patent/US12555108B2/en) / [US20240378604A1](https://patents.google.com/patent/US20240378604A1/en) Credit stacking identification | Mastercard | 2023-05-08; granted 2026-02-17 | Active | Claim 1: label transactions, group streams, loan or non-loan, train a neural classifier, apply to a target entity. Description covers "permissioned financial accounts", and stacking defined by receipts within two weeks or a DTI threshold such as 50%. Claims don't mention bureau, consent or borrower alert | Claims read |
| [US11354670B2](https://patents.google.com/patent/US11354670B2/en) Fraud prevention exchange | TransUnion | 2018-02-27; 2022-06-07 | Active | Lenders share status codes for pending transactions; velocity alerts. Says credit reporting can take 45 or more days. Fraud focus, lender network data | Part |
| [US12566978B2](https://patents.google.com/patent/US12566978B2/en) Select transaction identification | Mastercard | Not opened | Not opened | Same-family-style title | Title only |

Citing family, titles only, not opened: Equifax US12639754B2, Block US20250278731A1, Affirm US20250307918A1. Search excerpt only: [US7546271 mortgage cross-lender comparison](https://patents.justia.com/patent/7546271).

Search string: H.

### Inferences
- A classifier over transaction streams is close to Mastercard's claim 1, so freedom to operate in the US is a separate issue that the team should not ignore if commercialising. This scan is not a freedom-to-operate opinion.
- Timing relative to bureau refresh and borrower-facing use are differences to investigate. Those read as business framing unless a technical mechanism underlies them.

### Gaps
- Indian AA-based lending monitoring, CIC refresh rules and Indian filings were not searched.

## Mechanism I: Linking finfluencer claims to microstructure events

### Takeaway
Rating: **Moderately covered.** Correlating social signals with trading alerts is present in a granted NICE patent and an abandoned CME application. Source credibility tied to order-book events was not found.

### Cited Findings
| Document | Assignee or authors | Priority; published | Google status | What it covers | Read level |
|---|---|---|---|---|---|
| [US12555126B2](https://patents.google.com/patent/US12555126B2/en) Market sentiment manipulation | NICE | 2024-06-02; 2026-02-17 | Active | Claim 1: alert-driven social feed collection, GenAI summary, social vs structured-news sentiment mismatch, pause transactions. No credibility scoring or microstructure in the portion read | Claims read |
| [US20150081505A1](https://patents.google.com/patent/US20150081505A1/en) Abusive trading in electronic markets | CME | 2013-09-19; 2015-03-19 | Abandoned | Account baselines including order-to-cancel ratios; social volume; "message impact scoring" by reach; tracks sources that previously triggered alerts | Part |
| [AIMM, arXiv 2512.16103](https://arxiv.org/abs/2512.16103) | Neela | Dec 2025 | n/a | Reddit, bot, coordination and price signals to daily ticker risk. Social features synthetic; only 3 positive events | Abstract |
| [arXiv 2301.11403](https://arxiv.org/abs/2301.11403) | Nam, Skillicorn | Jan 2023 | n/a | Language of forum posts around pump patterns; 85% accuracy | Abstract |

Surfaced, not opened: [US20090157451A1](https://patents.google.com/patent/US20090157451A1/en), [PumpSense arXiv 2605.09431](https://arxiv.org/pdf/2605.09431). Title only: Wells Fargo US11238535B1.

Search string: I.

### Inferences
- CME already uses order-to-cancel ratios and source history, which narrows the claimed gap. The remaining difference would be how credibility is computed per claim or per person, and that risks reading as analysis.
- Data access (Indian tick and order-book data, Telegram) is a practical constraint on evidence.

### Gaps
- SEBI surveillance tools and finfluencer regulation were not reviewed.

## Mechanism J: Retail derivatives behaviour guardrail

### Takeaway
Rating: **Moderately covered.** A 2026 application uses a recurrent network on trade history with corrective actions, and a 2011 filing already limits buying power on loss streaks. An explicit retail F&O tilt model was not found.

### Cited Findings
| Document | Assignee | Priority; published | Google status | What it covers | Read level |
|---|---|---|---|---|---|
| [US20260203817A1](https://patents.google.com/patent/US20260203817A1/en) Managing a portfolio's performance | BhFS | 2025-01-15; 2026-07-16 | Pending | Claim 1: RNN on transaction patterns for biases such as overconfidence and disposition effect; corrective actions such as capping amounts or removing instruments. Loss chasing and tilt not named in summary | Part; claims partly |
| [US20120233049A1](https://patents.google.com/patent/US20120233049) Managing risk in a trading environment | Bionic Trader; listed Precision Trading IP | 2011-03-11; 2012-09-13 | Abandoned | Buying-power boundaries adjusted by P&L, win rates and streaks; pop-ups, entry blocks, self-triggered limits. Emotion is user-entered or biometric, not inferred from trades | Part |
| [US12511691B2](https://patents.google.com/patent/US12511691B2/en) Brain state and performance models | Optios | 2021-06-08; 2025-12-30 | Active | Neurometric score at trade time, thresholds and alerts. Needs sensors | Part |
| [US7805358B2](https://patents.google.com/patent/US7805358B2/en) Limiting aggressive trading | BGC Partners | 2005-07-29; 2010-09-28 | Active | Trade credit by order aggressiveness. Market-structure purpose, not wellbeing | Part |

Search string: J. US20260203817A1 surfaced via a citation list, not the query.

### Inferences
- Two documents together cover much of "detect from trades" and "restrict". The team should treat the base idea as disclosed and look for a specific technical difference, if any.
- A guardrail may also face a "user-dependent problem" objection, by analogy with Blackberry 2026.

### Gaps
- Responsible-gambling patents, a likely analogous field for loss chasing, and broker features such as kill switches were not searched. SEBI F&O studies were out of scope here.

## Mechanism K: Stable, actionable recourse for thin-file credit denials

### Takeaway
Rating: **Publications crowded; patents sparse in the one query that ran (string K).** Recourse and counterfactual research is large and already studies instability. Thin-file-specific work was not found.

### Cited Findings
| Document | Assignee or authors | Date | What it covers | Read level |
|---|---|---|---|---|
| [US20220374782A1](https://patents.google.com/patent/US20220374782A1/en) Counterfactuals for regression | JPMorgan | Priority 2021-05-21; pub 2022-11-24; abandoned | Default-probability example; notes threshold counterfactuals are "very sensitive". No recourse stability over time or model updates in part read | Part |
| [Survey, arXiv 2010.04050](https://arxiv.org/abs/2010.04050) | Karimi, Barthe, Schölkopf, Valera | Oct 2020 | Definitions and formulations of recourse | Abstract |
| [CARE, arXiv 2108.08197](https://arxiv.org/abs/2108.08197) | Rasouli, Yu | Aug 2021 | Coherent, actionable, constraint-respecting counterfactuals | Abstract |
| [arXiv 2106.02666](https://arxiv.org/abs/2106.02666) Counterfactuals Can Be Manipulated | Slack et al. | Jun 2021 | Small perturbations produce very different counterfactuals; loan dataset | Abstract |

Search excerpt only: [Towards User Guided Actionable Recourse, arXiv 2309.02517](https://arxiv.org/pdf/2309.02517). The search summary mentioned "causal recourse" and "counterfactual rules" filings in the JPMorgan page's citations, whose numbers I did not capture, so they are not cited here.

Search string: K.

### Inferences
- Stability is an already-recognised research problem, so "make recourse stable" alone does not distinguish the work. Better suited as research than as a patent candidate unless a specific technical method and measured gain emerges.

### Gaps
- Credit-scoring vendors' explainability patents, Indian RBI digital-lending rules and thin-file datasets were not searched.

## Mechanism L: Reconciling AIS, 26AS, CAS, bank and bureau records

### Takeaway
Rating: **Crowded at the generic entity-resolution and knowledge-graph layer.** A filing specific to these Indian record types was not found, but no India-specific query ran.

### Cited Findings
| Document | Assignee | Priority; published | Google status | What it covers | Read level |
|---|---|---|---|---|---|
| [US20200409936A1](https://patents.google.com/patent/US20200409936A1/en) (granted US11704899B2) Resolving entities from multiple sources | Meta (Facebook) | 2018-04-20; 2020-12-31 | Active | Unique IDs, fused records; conflicting values scored by ML confidence, filtered and ranked. No financial records | Part |
| [US9535902B1](https://patents.google.com/patent/US9535902B1/en) Entity resolution, structured and unstructured | Digital Reasoning | 2013-06-28; 2017-01-03 | Active | Attribute comparison; source confidence resolves conflicts; financial databases and trades as examples | Part |
| [US12271352B2](https://patents.google.com/patent/US12271352B2/en) Entity resolution | Mastercard (Indian priority 202021042074) | 2020-09-28; 2025-04-08 | Active | Graph embeddings to match merchant records on a payment network | Part |

Surfaced, not opened: [WO2013027129A1](https://patents.google.com/patent/WO2013027129A1/en), [US20160048770A1](https://patents.google.com/patent/US20160048770A1/en), [EP2916242A1](https://patents.google.com/patent/EP2916242A1/en).

Search string: L.

### Inferences
- Guidelines Table 2 lists automating bookkeeping and accounting without a data-processing gain as excluded. Ab Initio (Madras 2025) is the helpful analogue only where a concrete query or data-handling gain is shown.
- Domain rules for matching AIS and 26AS entries would likely read as administrative. A technical candidate, if any, would need to be in the matching or conflict-resolution method with measured gain.

### Gaps
- No search on tax-preparation vendors (for example Intuit) or Indian tax-tech filings. CAS, AIS and 26AS terms were not searched individually.
