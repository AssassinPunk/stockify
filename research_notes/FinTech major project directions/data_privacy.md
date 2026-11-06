# Financial Data Sharing, Privacy and Data Quality in India, with Global Comparison

Research date: 6 November 2026. Written for a final-year engineering team choosing a major project.

**How to read the evidence labels**
- **[FACT]**: a regulation, specification, official dashboard or official statistic, read directly in this session.
- **[RESEARCH]**: a paper or preprint. Its claims are the authors' and were not reproduced here.
- **[SELF-REPORTED]**: figures or claims from a vendor, an industry body or a party with a commercial interest.
- **[INFERENCE]**: my own reasoning. Not established by any source.
- **(snippet)**: seen only in a search result summary, because the page itself was not opened. Check it before citing.

**Limits of this research**
- The session's web search budget ran out before five planned queries could run: Indian credit-report error surveys, TEE attacks other than TEE.fail, DigiLocker and Aadhaar verifiable credentials, Indian transaction-narration datasets, and CFPB developments after August 2026.
- "I found nothing" on those topics, and on AA-based ZK work, means one search or fewer. It does not show that nothing exists.
- The official DPDP Gazette text was not read. The DPDP points come from law-firm summaries.
- The term "inadequately addressed" is used throughout. Nothing here is claimed to be unsolved.

---

## 1. Account Aggregator ecosystem: adoption, FI types, data quality, failures, purpose codes, consent, and what FIUs do with data

### Takeaway
Adoption numbers are good and public. Quality evidence is thin: one vendor's platform funnel exists (45.4% consent approval, 75.9% fetch success), but API health dashboards are restricted to Sahamati members. I found no published failure-cause breakdown, schema-quality rate, consent-fatigue measurement or audit of FIU data handling. These areas are inadequately addressed, and they are also poorly measured.

### Cited Findings

#### Adoption
- [FACT] As on 31 March 2026: 179 FIPs live, 989 FIUs live, more than 2.88 billion accounts enabled, 284.6 million accounts linked, and 17 AAs with RBI registration. — https://financialservices.gov.in/account-aggregator-framework
- [SELF-REPORTED, official industry dashboard] As on 30 Sep 2026: 352.19 million accounts linked (cumulative), 595.11 million consents fulfilled (cumulative). September 2026 alone: 14.16 million accounts linked, 28.85 million consents fulfilled, 379.64 million data deliveries. "Fulfilled" means data was successfully delivered in one go. The extracted table had no clear column labels, so they were matched by checking that cumulative totals add up. The April figure minus its monthly value gives 284.56 million, which matches the government's March number. — https://sahamati.org.in/aa-dashboard/
- [SELF-REPORTED] Sahamati homepage: 1,970 million+ consents raised, 493 million+ fulfilled, 1,076 FIUs, 176 FIPs, 17 AAs, 1,117 entities live. Most figures carry no date. The 493 million matches the June 2026 dashboard row. — https://sahamati.org.in/
- [SELF-REPORTED] FY26 AA-enabled lending: an estimated ₹3.82 lakh crore across 3.68 crore loans, or 8.4% by value and 11.8% by volume of retail and MSME lending. Figures are "estimated" from "participating institutions" with no stated method. The "Key findings" list on the same page shows "4%" and "68 crore", which look like rendering errors. — https://sahamati.org.in/media-article/account-aggregator-powers-%E2%82%B93-82-lakh-crore-in-credit-with-secured-lending-emerging-as-a-new-growth-driver/
- [SELF-REPORTED] 500 million+ fulfilled consents, 600+ crore data fetches, and SRO recognition by RBI in June 2026. — https://sahamati.org.in/media-article/account-aggregator-crosses-500-million-consents-as-india-marks-5th-aa-foundation-day/
- [FACT, via press] RBI announced AA interoperability, expected by 31 Dec 2026. As of 12 Oct 2026 the rules and technical specifications were not yet released. Onboarding an AA can take 3 to 6 months for large institutions because of legal and audit steps, while the technical connection takes about 30 minutes. Asked who handles failed fetches across AAs, Sahamati's CEO said only that accountability should be clearly defined. — https://www.medianama.com/2026/10/223-sahamati-bg-mahesh-rbi-account-aggregator-interoperability/

#### FI types actually live
- [FACT] Setu lists 23 FI data types, but its mock FIP supports only 9: DEPOSIT, TERM_DEPOSIT, RECURRING_DEPOSIT, MUTUAL_FUNDS, ETF, EQUITIES, NPS, INSURANCE_POLICIES and GSTR1_3B. — https://docs.setu.co/data/account-aggregator/fi-data-types
- [SELF-REPORTED] 88.1% of FI queries are for deposit accounts. Equities are 6.4%, mutual funds 4.3%, and insurance plus GST 0.4% combined (six months before Oct 2025, proprietary Finarkein data). — https://cdn.finarkein.com/reports/aa-ecosystem/20251009/aa-in-action.pdf
- [SELF-REPORTED, commercial competitor of AA] CASParser's March 2026 assessment:
  - Broadly live: savings accounts at 72 banks, demat holdings via CDSL/NSDL, MF folios via CAMS/KFintech, GSTR 1 and 3B, NPS.
  - Patchy: FD/RD (about 40% of banks) and insurance (57 insurers, many on only 1 or 2 AAs).
  - Not live: bonds, G-Secs, CP, CDs, EPF, PPF.
  - Excluded: joint accounts and NRE/NRO accounts.
  - 13 of the 17 AAs have live FIP integrations.
  - Treat this as a claim to check against Sahamati's FIP-AA mapping. — https://casparser.in/blog/state-of-account-aggregator-2026/
- [SELF-REPORTED] A secondary builder's guide adds that fixed deposits are often silently missing rather than returning errors, and that outages tend to look like routing failures. — https://ecorpit.com/account-aggregator-integration-fintech-builders-2026/

#### Failure rates and data quality
- [SELF-REPORTED, one platform, secondary write-up] Finarkein, Dec 2025 to Aug 2026, 95 institutions: 111.1 million consent requests with 45.4% approved, and 87.1 million fetches with 75.9% success. 52 of 74 FIPs were reachable through more than one AA. Error data for Mar to Aug 2026 recorded 3,898 error responses across five AAs, with causes not stated. — https://smestreet.in/infocus/finarkein-report-highlights-next-phase-of-indias-account-aggregator-ecosystem-12519273
- [SELF-REPORTED] May 2024: 74.4% success rate for existing-to-AA customers, self-reported by 9 lending FIUs representing 60% of fulfilled consents (snippet). — https://sahamati.org.in/wp-content/uploads/2024/07/AA-Lending-Report-Abridged.pdf
- [FACT] ReBIT circular ReBIT/AA/2025/03 (23 Jan 2025): FIPs must strictly adhere to the FI schema. Mandatory fields "should not be missing, or null value/dummy data should not be provided". Absent optional data should be excluded. — https://sahamati.org.in/wp-content/uploads/2025/10/3Clarification_on_Mandatory_and_Optional_fields_V1.0.pdf
- [FACT] ReBIT/AA/2025/01: Deposit, RD and TD schema v2.0.0 was published 23 Jan 2025, with v1.x to be decommissioned by July 2025. — https://sahamati.org.in/wp-content/uploads/2025/10/5-Guidelines_Adoption_Deposit_RD_TD_FI_Type_Schema_Version_2.0.0.pdf
- [FACT] The Saans API health dashboards cover Consent Post, FI Fetch, FI Request and linking APIs, aggregated with no AA-wise view, and are restricted to Sahamati members. — https://sahamati.org.in/saans-api-health-dashboard/
- [FACT] The public v1.1 deposit XSD types `amount` as `xs:float`, `currentBalance` as `xs:string`, and `narration` as a required free-text string. This repo's last commit is 2022-12-01, so v2.0.0 may differ. Read from a local clone of https://github.com/Sahamati/account-aggregator-standards (file `schemas/deposit/deposit.xsd`).
- [RESEARCH, policy commentary] IMPRI proposes a minimum FIP performance benchmark with public disclosure of pull-success rates (snippet). — https://www.impriindia.com/insights/policy-update/account-aggregator-framework-2021-transforming-consent-based-data-sharing-in-indias-financial-ecosystem/

#### Purpose codes and consent granularity
- [FACT] There are only five purpose codes: 101 wealth management, 102 spending patterns or budget, 103 aggregated statement, 104 explicit consent for monitoring, 105 explicit one-time consent. None is specific to lending. — https://sahamati.org.in/purpose-codes/
- [FACT] Consent parameters:
  - `consentMode`: VIEW, STORE, QUERY, STREAM
  - `fetchType`: ONETIME, PERIODIC
  - `consentTypes`: PROFILE, SUMMARY, TRANSACTIONS
  - plus `fiTypes`, `dataRange`, `dataLife`, `frequency` (up to one per hour)
  - optional `dataFilter` on TRANSACTIONTYPE or TRANSACTIONAMOUNT
  - Sources: https://docs.setu.co/data/account-aggregator/consent-object and `specs/aa.yaml` in https://github.com/Sahamati/account-aggregator-standards
- [SELF-REPORTED] The Fair Use Template Library (repo updated 4 Sep 2026) sets upper bounds on purpose, frequency, validity, consent type and data range. It is described as "not regulatory advice". AAs are the primary enforcers and FIPs a second line, and template IDs are not passed in consent requests. Numeric limits and penalties were not on the page read. — https://github.com/Sahamati/fair-use-implementation-guidelines-for-aa

#### What FIUs do with the data, over-collection, and consent fatigue
- [FACT] Master Direction cl. 7.6.2: data "shall not be used or disclosed" by an AA or FIU beyond what the consent artefact specifies. Cl. 5(7) bars AAs from keeping customer financial data. Last updated 6 Sep 2024. — https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=10598
- [RESEARCH, commentary, 2020] EPW: the specifications set no standards for FIU storage or post-revocation handling. The authors warn of FIUs drawing as much data as possible, "take it or leave it" consent, and consent fatigue. These are analytical concerns, not documented misuse. — https://www.epw.in/engage/article/merits-and-demerits-indias-account-aggregator
- [SELF-REPORTED] Finarkein lists continuous post-disbursal "Loan and Repayment Monitoring" as a use case. A Bajaj Finance executive describes AA use in "risk monitoring and collections". — https://cdn.finarkein.com/reports/aa-ecosystem/20251009/aa-in-action.pdf
- [RESEARCH, survey, via Finarkein] CGAP-Sahamati (n=1,860): awareness rose from 12% to 30%, and willingness to share for better loan offers from 33% to 71%, between 2023 and 2024. This measures stated willingness, not fatigue. English was used in 94.94% of AA interactions and Hindi in 3.82%. — https://cdn.finarkein.com/reports/aa-ecosystem/20251009/aa-in-action.pdf

#### Global comparison
- [FACT] UK, September 2026: 99.52% of API calls succeeded (2.92 billion successful, 14.2 million failed), average response 327 ms, availability 99.51% unweighted and 99.79% weighted. These figures and their definitions are public. — https://www.openbanking.org.uk/api-performance/
- [SELF-REPORTED] UK: 13.3 million active users as of March 2025 (snippet). — https://www.openbanking.org.uk/?p=24810
- [SELF-REPORTED, press reading of the official dashboard] Brazil: 208.79 million active consents on 31 July 2026 and 7.14 billion open-data API calls (reading of 3 August 2026). The article notes that active consents measure adoption, not use. A different outlet says 239.8 million (snippet). — https://www.letsmoney.com.br/noticias/open-finance-208-milhoes-consentimentos-governanca/ and https://finsidersbrasil.com.br/?p=375736
- [FACT, law-firm summary] US: enforcement of the Section 1033 rule is enjoined by the E.D. Kentucky court while the CFPB reconsiders it. The first compliance date of 1 April 2026 passed without binding enforcement. — https://www.cozen.com/news-resources/publications/2026/section-1033-compliance-date-open-banking-rule-enjoined-and-under-reconsideration
- [SELF-REPORTED] A revised proposal reportedly went to OIRA on 6 Aug 2026 (snippet, not confirmed). — https://www.openbankingtracker.com/guides/section-1033-status

### Inferences
- [INFERENCE] Linkage is about 12% of enabled accounts (352.19 million of 2.88 billion). This is a capability measure rather than a failure rate.
- [INFERENCE] Consents fulfilled are about 25% of consents raised (493.5 million of 1,970 million), assuming both homepage figures date from June 2026. This is not a failure rate, since it also counts rejection, abandonment, expiry and retries.
- [INFERENCE] Multiplying Finarkein's rates gives roughly 34% of consent requests ending in a successful fetch (0.454 × 0.759). This is only indicative because a consent can produce several fetches.
- [INFERENCE] About 13 data deliveries occur per fulfilled consent in Sept 2026 (379.64 / 28.85; range 7.7 to 15.3 over six months). This suggests heavy periodic pulling, though multi-account consents also inflate it. It is the best public hint that AA is used for monitoring as well as one-time underwriting.
- [INFERENCE] The UK's 0.48% and India's 24.1% should not be compared directly. The UK counts individual API calls and the Finarkein figure counts end-to-end fetches. The comparison that does hold is transparency: the UK publishes the numbers and India restricts them.
- [INFERENCE] ReBIT's circular explicitly forbidding null and dummy values suggests those values occurred in production. It is indirect evidence, but it is the strongest primary signal I found.
- [INFERENCE] Lenders account for about 65% of successful consents (Finarkein, FY25) yet no purpose code names lending, so "purpose" carries little information. Fair Use templates add granularity, but they cap requests rather than verify use.

**Remaining technical gaps**
- No public, per-FIP measure of content quality. Saans measures API health, not whether balances reconcile.
- Enforcement stops at delivery. Nothing technical verifies `dataLife` or purpose after the FIU decrypts.
- Consent is all-or-nothing at record level. `dataFilter` selects rows but cannot answer a predicate. `QUERY` mode exists in the schema, but I found no evidence of production use.

### Gaps
- Failure causes across consent, discovery, FIP timeout and schema errors: not found. The full Finarkein "On Systems of Intelligence" report was not retrieved.
- Consent fatigue: no empirical measurement found. A user study would be new evidence.
- FIU retention or over-collection audit: none found.
- Fair Use numeric limits, and v2.0.0 schema contents: not read, since api.rebit.org.in is a JavaScript shell to the fetch tool.
- Finarkein's claim that UK consent must be renewed every 90 days may be outdated. I recall the FCA relaxing this, but did not verify it.

---

## 2. DPDP Act 2023 and DPDP Rules 2025

### Takeaway
Rules were notified in mid-November 2025 with staggered commencement: consent manager provisions begin one week from today (about 13 November 2026), and core fiduciary duties about 13 May 2027. How AAs fit as consent managers remains unresolved in the sources I read. For a student prototype using synthetic data, the practical effect is design guidance rather than a compliance burden.

### Cited Findings
- [FACT, law-firm summary] Commencement: Rules 1, 2 and 17 to 21 immediately; Rule 4 (consent managers) at 12 months; Rules 3, 5 to 16, 22 and 23 at 18 months. Sources differ by a day or so (13 or 14 November 2025; 12 to 14 May 2027). — https://ssrana.in/articles/meity-notifies-final-digital-personal-data-protection-rules-2025/ and https://yourstory.com/2025/11/digital-personal-data-protection-dpdp-rules-2025-rollout-over-18-months
- [FACT, law-firm summary, Ikigai Law]
  - Rule 3: itemised notice in plain language, with specified purposes.
  - Rule 4: consent managers must register, be incorporated in India, meet net-worth and governance requirements, avoid conflicts, and "cannot read the content" of data they handle.
  - Rule 6: encryption, masking or tokens, access controls, and logs kept at least one year.
  - Rule 7: all breaches are notifiable, with a detailed report within 72 hours and no harm threshold.
  - Rule 8: data and logs kept at least one year.
  - Rule 13: Significant Data Fiduciaries need annual DPIA and audit, plus algorithmic due diligence.
  - Rule 16: research, archiving and statistics exemption, subject to Second Schedule safeguards, including no decisions about specific individuals.
  - Source: https://www.legal500.com/intelligence/india/privacy/a-closer-look-at-the-dpdp-rules-2025
- [FACT, law-firm summary] Rule 8(3) requires personal data, traffic data and processing logs to be kept for at least one year from processing, for Seventh Schedule purposes. — https://ssrana.in/articles/meity-notifies-final-digital-personal-data-protection-rules-2025/
- [SELF-REPORTED, legal commentary, SCC Online, June 2026] Overlap issues: AAs already perform Rule 4 functions under RBI, and ReBIT has detailed standards while DPDP says "interoperable platforms" without system detail. AAs may not store financial information, while consent managers keep consent records at least seven years. Penalties reach ₹250 crore for fiduciaries and ₹50 crore for consent managers. The author proposes deemed-CM status and an RBI-DPB MoU. — https://www.scconline.com/blog/post/2026/06/26/account-aggregator-consent-manager-paradox-dpdp-rules-fintech-sector/
- [SELF-REPORTED] Sahamati (March 2025, responding to the draft rules) argues all AAs should be deemed consent managers and that the Board should adopt ReBIT standards. — https://sahamati.org.in/reconciling-the-account-aggregator-and-consent-manager-frameworks/
- [SELF-REPORTED, low-confidence source] As of August 2026 the Board was "not fully constituted" and registration was not operating. — https://compliancehub.wiki/india-dpdp-consent-manager-november-2026-phase-two-deadline-compliance/
- [SELF-REPORTED] MeitY has reportedly clarified that fiduciaries need not integrate with consent managers. — https://ecorpit.com/account-aggregator-integration-fintech-builders-2026/
- [FACT, law-firm summaries] RBI Digital Lending Directions 2025: collection must be need-based with prior explicit consent and an audit trail. One-time camera, microphone or location access is allowed only for KYC. Borrowers can deny, revoke or request deletion. LSPs hold minimal data (snippet). — https://corporate.cyrilamarchandblogs.com/2025/05/fig-paper-no-44-series-3-rbi-consolidates-directions-on-digital-lending-implications-for-res-lsps/ and https://ssrana.in/articles/rbi-introduced-digital-lending-direction-2025/
- Sources conflict on whether SPDI Rules 2011 are already repealed (SS Rana suggests so) or continue for 18 more months (Mondaq) (snippet). — https://ssrana.in/articles/meity-notifies-final-digital-personal-data-protection-rules-2025/ and https://www.mondaq.com/india/privacy-protection/1708830/dpdp-act-compliance-mandate

### Inferences
- [INFERENCE] "Need-based" in the lending directions and "specified purpose" in DPDP create a legal demand for minimisation, but no accepted technical test for it. A lender cannot currently show that it took the least data sufficient for the decision. Mechanism 4 below targets this.
- [INFERENCE] Tension for ZK-style systems: Rule 8(3) requires logs to be kept, so a minimised flow still needs an auditable, consent-linked record. A proof must therefore be retained and bound to a consent ID.
- [INFERENCE] Prototype guidance, not legal advice:
  - Use synthetic data by default.
  - If volunteers' real statements are used, get written consent, process locally, keep no copies, and do not make decisions about them.
  - Do not assume the Rule 16 research exemption without reading the Second Schedule.
  - Even so, build the notice, withdrawal and erasure flows, because reviewers will ask.
- [INFERENCE] Since consent managers "cannot read" content and AAs are data-blind, neither can check what happens at the FIU. The technical blind spot therefore sits at the data fiduciary.

### Gaps
- Gazette text not read. Direct fetches of the MeitY PDF (a URL recalled from memory, https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf), the JSA note and dpdpa.support all returned HTTP 403. The ₹2 crore net-worth figure for consent managers is from my memory, not verified here. The Third Schedule retention classes and exact Act sections, including s.6(1) on necessity and s.3(c) on personal or domestic use, are also unverified.
- Whether MeitY or the Board will deem AAs to be consent managers: not resolved in sources read. Check again after 13 November 2026.
- Whether any consent manager is registered yet: unknown.

---

## 3. Selective disclosure: can a person prove "EMI-to-income under 40%" or "balance above X" without sharing a statement?

### Takeaway
"Balance above X" looks feasible with existing tools. "EMI-to-income under 40%" is harder for a reason cryptography does not fix: income and EMI are not signed fields, and the prover chooses which accounts to include. I found no public work on ZK proofs over AA data, though my search was limited. The gap looks real, with the caveat that it is unconfirmed whether the FIP's signature reaches the party who would need it.

### Cited Findings

#### What the AA framework actually signs
- [FACT] Master Direction cl. 7.3: the FIP must digitally sign data before sending it to the AA. — https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=10598
- [FACT] The public spec shows `x-jws-signature` as a "Detached JWS" of the request or response body. The fetch response carries `encryptedFI` plus `KeyMaterial` (ECDH on Curve25519). The sample consent JWS header decodes to `{"alg":"RS256",...,"b64":false,"crit":["b64"]}`. — `specs/aa.yaml` in https://github.com/Sahamati/account-aggregator-standards
- [FACT] None of the 23 FI schema XSDs in that repo contains a signature element (grep returned zero files). The repo is from Dec 2022 and predates schema v2.0.0. — https://github.com/Sahamati/account-aggregator-standards
- [FACT] ReBIT API spec v2.0.0: "The FIU or the customer submits the consent ID" to `/FI/fetch`, so the customer is a named requester in the spec. — https://specifications.rebit.org.in/artefacts/NBFC-AA_API_Specification_v2.0.0.pdf

#### Web-data proofs (zkTLS)
- [RESEARCH] DECO (CCS 2020): the first system to prove TLS data provenance without trusted hardware or server changes. — https://arxiv.org/abs/1909.00938
- [RESEARCH] "Proxying Is Enough" (AFT 2025): in the proxy model, HTTPS integrity holds because of HTTP's variable padding, and for pre-determined responses it needs AEAD context unforgeability. ChaCha20-Poly1305 satisfies this and AES-GCM does not. Reports 60 to 90% runtime savings. — https://eprint.iacr.org/2024/733
- [SELF-REPORTED, competitor-authored] Xie and Wang benchmark (200 Mbps, 10 ms, 8 vCPU, responses to 2 KB), browser runtimes:

  | System | Browser time | Memory |
  |---|---|---|
  | Primus MPC-TLS | about 5 s | 146 MB |
  | Primus Proxy-TLS | about 2.3 to 2.7 s | 71 to 111 MB |
  | TLSNotary MPC | 47 to 53 s | about 148 MB |
  | Reclaim | 13 to 86 s | about 300 to 356 MB |
  | Pluto/Origo | 193 to 390 s | about 1.4 GB |

  The report also describes a key-consistency flaw across AES blocks in Reclaim, not demonstrated as an attack. The authors' benchmark tooling is hosted by Primus, so read Primus-favourable results with care. — https://hackmd.io/@-fI_Eu_rR8qs02aOhOPWNg/HkRyz5OF1g
- [SELF-REPORTED] TLSNotary (Aug 2025, 16 vCPU): about 5 s native and about 10 s browser for typical responses of about 10 KB. Browser is about 3x slower overall. Runtime is linear in round-trip time because of about 40 rounds. — https://tlsnotary.org/blog/2025/08/31/benchmarks
- [RESEARCH, Reclaim co-author] Reclaim attests a 1200 kB response in 7.28 s on a lower-mid-range phone, described as about two orders of magnitude beyond previously benchmarked sizes. Preprint, September 2026. — https://eprint.iacr.org/2026/2187
- [SELF-REPORTED] Reclaim calls user-initiated proofs "generally safe" on many sites but flags risk at some large US banks whose terms bar scraping. India's position on banks is not addressed beyond DPDP s.8(5). — https://blog.reclaimprotocol.org/posts/legal-considerations
- zkPass: no performance numbers found.

#### Signed-document proofs
- [RESEARCH] GovBind (Sept 2026): combines Proxy-mode TLSNotary with ZK content proofs on Turkish e-Devlet PDFs, proving no overdue tax debt and bounded penalties. End-to-end 54 to 119 s, verify 44 to 127 ms, proof 11 to 12 KiB. This is the closest analogue found. It does not cover India. — https://eprint.iacr.org/2026/2206
- [SELF-REPORTED] zkPDF (PSE): SP1-based proofs over PKCS#7 RSA-SHA256 signed PDFs. **Archived 19 Aug 2026.** — https://github.com/privacy-ethereum/zkpdf
- [SELF-REPORTED, unattributed note] zkPDF timings: 13 min 7 s on 64-core CPU with 200 GB RAM; 1 min 7 s on RTX 4090. PDF size unstated. — https://hackmd.io/@sagarmarlin/BJKs_7Ojle
- [RESEARCH, single author] Predicate proofs: 32-bit threshold in about 6.2 ms prove and 1.0 ms verify with Bulletproofs, 608-byte proof. The paper names the "source-integrity gap": a proof binds to a committed value, not to the system of record. Its proposed fix uses enclave attestation. — https://arxiv.org/abs/2608.30083

#### Credentials and identity
- [SELF-REPORTED] Anon Aadhaar: Circom circuits verify the government signature and allow selective reveal of age, state and gender on the client. The repo labels its test zkey not for production. — https://github.com/anon-aadhaar/anon-aadhaar
- [SELF-REPORTED] Longfellow (Google): hash-based, transparent, for ECDSA and mdoc. Benchmarks in the slides read 16.7 to 38.3 ms prover, hardware unstated. Slides cite security reviews. — https://datatracker.ietf.org/meeting/124/materials/slides-124-cfrg-longfellow-zk-01 and paper https://eprint.iacr.org/2024/2010
- [SELF-REPORTED] Longfellow is reportedly deployed in Google Wallet, and is experimental in the EU age verification spec (snippet). — https://datatracker.ietf.org/meeting/126/materials/slides-126-cfrg-longfellow-zk-00

#### Toolchain performance on commodity hardware (Mopro, self-reported; compare only within a table)

| Circuit | Stack | Device | Time |
|---|---|---|---|
| RSA | Circom + rapidsnark | iPhone 16 Pro / S23 Ultra / M1 Max | 749 / 950 / 676 ms (proof only) |
| Anon Aadhaar | Circom + rapidsnark | same | 3.1 / 3.4 / 2.4 s (proof only) |
| Anon Aadhaar | Circom + snarkjs | S23 Ultra / M1 Max | 51.5 / 19.8 s |
| RSA | Noir (nargo 1.0.0-beta.3) | Pixel 6 / laptop CLI / laptop web | 1.1 / 0.22 / 2.1 s |
| Anon Aadhaar | Noir | Pixel 6 / laptop CLI / laptop web | 8.2 / 1.4 / 17.0 s |
| zkEmail | Noir | Pixel 6 / laptop CLI / laptop web | 4.8 / 0.8 / 6.6 s |
| RSA | Halo2 | M1 Pro | 26.9 s, about 5 GB RAM; crashes on phones tested |

Source: https://zkmopro.org/docs/performance

#### Who has tried this on AA data
- [SELF-REPORTED] Acre: a hobby-scale prototype using Reclaim (not AA) on gig platforms. Its contract stores `monthly_earnings` in readable state, contradicting its privacy claim, and its DigiLocker flow is mocked. — https://github.com/SomehowLiving/Acre
- One extended search for AA plus zero-knowledge returned nothing AA-specific. — no source; see Gaps.

### Inferences
- [INFERENCE] **The binding path is the first research question.** There are three unknowns:
  1. Does the FIP sign plaintext before encrypting, or only the JSON containing ciphertext?
  2. Does the FIP's JWS survive the AA hop, or does the FIU receive only the AA's detached JWS?
  3. Can a customer obtain the signature?

  If the signature is hop-level over ciphertext, the proof must also show decryption, which is costly. If the AA re-signs, the proof attests to the AA, and AAs are meant to be data-blind. Either result is publishable. It is a finding to establish, not an assumption to build on.
- [INFERENCE] The published costs span about 1 s (Anon Aadhaar-style) to about 13 min (zkVM parsing a PDF). A bank statement with hundreds of XML rows sits somewhere between, depending on design. Commit-and-prove (one heavy binding step, then cheap repeated predicates) looks most promising, but no number exists for it on AA payloads.
- [INFERENCE] **ZK may be the wrong tool if issuers cooperate.** If an FIP were willing to answer `QUERY` requests and sign "balance ≥ X", no ZK is needed, though the FIP learns the query. ZK earns its cost when issuers will not change, or when unlinkability from the issuer matters. A good report states this plainly.
- [INFERENCE] **Longfellow is not a drop-in.** It targets ECDSA, while the spec sample shows RS256. Whether its approach could extend to RSA is a possible comparison point.
- [INFERENCE] **The real gap for ratios is completeness and semantics.** Three problems remain after a perfect proof:
  - A prover can omit the account that services the EMI, or the loan held elsewhere.
  - Salary and EMI come from free-text narration, so a classifier decides what they are.
  - Self-transfers can inflate "income".

  These are attacks on the statement, not on the cryptography. None of the systems above addresses them in the sources read.
- [INFERENCE] zkTLS against bank portals is the weaker path for India, since it depends on login-scraping-like behaviour and terms of use, while a licensed consent channel exists. AES-GCM's lack of context unforgeability is another caution for short, predictable responses in proxy mode.
- [INFERENCE] Adoption barrier: lenders may need underlying data for audit and collections, so proofs may suit pre-qualification, rentals and visa-style checks before they suit underwriting.

### Gaps
- Whether any Indian startup or lab has done ZK on AA data: not verified. Before committing, the team should search GitHub, arXiv and ePrint directly, and ask Sahamati or ReBIT about question 1 to 3 above.
- AEAD and KDF used on `encryptedFI` (AES-GCM is my recollection, not confirmed in text read). `params` in KeyMaterial leaves this open.
- Whether real CAS, AIS or bank PDFs carry usable digital signatures: not checked.
- DigiLocker verifiable credentials and the current Aadhaar QR format: search did not run.
- RBI's position on credential-sharing or scraping-style access: not found.

---

## 4. Privacy-preserving analytics: FL, DP, MPC, confidential computing, synthetic data

### Takeaway
Reported bank-scale results mostly come from synthetic or simulated data, and I found no audited production results. FREE-AI itself calls this area "nascent". On public financial tables, strong DP costs substantial utility, and low membership-inference scores do not prove privacy. Published work relies on flat, public tabular data, so hierarchical Indian transaction data is inadequately addressed.

### Cited Findings

#### RBI's view
- [FACT] FREE-AI (13 Aug 2025) surveyed 612 supervised entities: 20.80% (127) using or developing AI. Of 171 NBFCs, 27% use AI. — https://www.rbi.org.in/Scripts/PublicationReportDetails.aspx?UrlPage=&ID=1306
- [FACT] §2.1.9 says PETs and federated learning can enable joint training without exchanging raw data, and that these developments "remain nascent". §4.4.10 says the sector data infrastructure should use PETs, anonymisation and aggregation as applicable. Rec. 1 proposes financial-sector data infrastructure, and Rec. 2 an AI innovation sandbox "without any regulatory relaxations". §1.2.1 mentions Gen-AI synthetic data for safer training. §4.4.59 suggests red-teaming for memorised data leaks. The glossary defines DP and FL without linking them to obligations. — same URL
- [FACT] Recommendations are not binding, and are expected to become directions over time (snippet). — https://www.mondaq.com/india/financial-services/1672260/rbis-move-toward-ethical-and-responsible-ai-in-financial-sector

#### Deployment versus claims
- [SELF-REPORTED] Swift, Dec 2024: 12 global institutions plus Google Cloud, combining FL with TEEs, with a sandbox on synthetic data planned for H1 2025. No performance figures in this article. — https://fstech.co.uk/fst/Swift_and_google_to_use_advanced_ai_and_federated_learning_to_tackle_fraud.php
- [FACT] BIS Hertha (closed, June 2025): synthetic data with 1.8 million accounts and 308 million transactions. Payment-system analytics found 12% more illicit accounts, and 26% improvement for unseen behaviours. BIS calls it "one piece of the puzzle" and leaves legal issues out of scope. — https://www.bis.org/about/bisih/topics/fmis/hertha.htm
- [FACT] BIS Aurora Phase 1: synthetic data, with collaborative approaches found more effective than siloed ones. Real-world PoCs were considered essential. — https://www.bis.org/publ/othp66.pdf (project page text; PET comparisons in the 103-page report not read) and https://www.bis.org/about/bisih/topics/fmis/aurora.htm
- [RESEARCH] Federated gradient boosting (CIKM 2025) used a private banking dataset and notes real-world FL on banking fraud types remains underexplored (snippet). — https://pure.seoultech.ac.kr/en/publications/federated-gradient-boosting-for-financial-fraud-detection-an-empi/
- [RESEARCH] FedFraud: F1 0.90 and AUC 0.96, on the public credit card fraud dataset rather than bank data (snippet). — https://www.preprints.org/manuscript/202505.0264

#### Confidential computing and India's DEPA
- [FACT] iSPIRT's `depa-training` is a reference Confidential Clean Room with a Credit Risk scenario (XGBoost, DP). It is work in progress and "should not be used in production". — https://github.com/iSPIRT/depa-training
- [SELF-REPORTED] Clean rooms were proposed in 2021 with lenders running rules without seeing raw data. — https://pn.ispirt.in/confidential-clean-rooms-in-depa/
- [RESEARCH] TEE.fail (IEEE S&P '26): a DDR5 bus interposer under $1,000 breaks SGX, TDX and SEV-SNP, extracting attestation keys. Intel and AMD treat physical interposers as out of scope, with physical security as the mitigation. — https://tee.fail/

#### Synthetic data and DP utility
- [RESEARCH] Zuo et al. (arXiv Feb 2026), DP-CTGAN and DP-TVAE on six public tabular sets. Balanced accuracy:

  | Dataset | Real | DP-CTGAN ε=1 | DP-CTGAN ε=10 | DP-TVAE ε=1 |
  |---|---|---|---|---|
  | Adult | 0.818 | 0.681 | 0.734 | 0.508 |
  | Bank Churn | 0.721 | 0.523 | 0.562 | 0.499 |
  | Credit Default | 0.658 | 0.554 | 0.613 | 0.499 |
  | German Credit | 0.686 | 0.501 | 0.505 | 0.518 |

  MIA success mostly fell between 0.47 and 0.53, for non-private generators too. The authors state MIA success "is not a reliable proxy" for DP guarantees. Severe imbalance makes generation harder. — https://arxiv.org/abs/2602.09288 and https://arxiv.org/html/2602.09288
- [RESEARCH] DP-TLDM: TabDDPM gives strong quality but is weak against attribute and especially membership inference attacks (snippet). — https://arxiv.org/abs/2403.07842
- [RESEARCH] A 2024 Fraunhofer study: DP-CTGAN may collapse in training, and with smaller noise offers limited protection against MIA and linkage (snippet). — https://publica.fraunhofer.de/handle/publica/487497
- [RESEARCH] Cheng and Bahmani (2025): query-based MIAs on TabDDPM and TabSyn, arguing fidelity metrics miss the risk (snippet). — https://www.arxiv.org/pdf/2510.16037

### Inferences
- [INFERENCE] Evidence quality differs sharply: institutional projects report on simulated data, and academic work on public benchmarks. Neither yet provides audited production results in the sources read, so a project should not claim real-world performance.
- [INFERENCE] MPC: I found no India-relevant financial deployment evidence, though I did not run a dedicated search. Do not treat that as a negative result.
- [INFERENCE] Standard benchmark sets are flat tables (Adult, German Credit) with no account hierarchy, transaction sequences, narration text or accounting invariants. A generator can score well on them and still produce statements whose balances do not roll forward. A reviewer of Indian fintech work would notice this immediately.
- [INFERENCE] TEEs defend against a remote or software attacker, while TEE.fail weakens the case where the hardware operator is the adversary. That is exactly the situation in a clean room hosted by a counterparty, so a TEE-only design needs a stated threat model.
- [INFERENCE] FL or MPC as the main contribution is risky for a student team: results on simulated banks repeat prior work, and real banks are unreachable. DP is more useful for releasing narrow aggregates, as in Mechanism 3, than for generating whole datasets.

### Gaps
- Swift's later pilot results: not retrieved. I recall a 2025 claim of improved detection, but could not verify it.
- Aurora's PET-by-PET comparison: not read.
- Evidence of any Indian bank running FL or clean rooms in production: none found.
- FCA synthetic data work and MPC deployments: not searched.

---

## 5. Detecting inconsistent financial records: AIS/26AS, bank, CAS and bureau

### Takeaway
RBI now has detailed bureau data-quality rules, but the resulting scores are not public. I found no official error prevalence for India. Cross-source reconciliation at the level of individual financial events has no public benchmark or peer-reviewed Indian method in what I found. It is inadequately addressed, and a team can make real progress here without privileged access.

### Cited Findings

#### Bureau errors and rules
- [FACT] RBI CIC Directions (28 Nov 2025, RBI/DOR/2025-26/378):
  - Fortnightly updates (para 15).
  - Monthly Data Quality Index by segment, with half-yearly reports to RBI (para 20).
  - Half-yearly search-and-match review (para 7) with root-cause analysis on complaints (paras 8, 38).
  - Single report per borrower using identifiers such as PAN or Voter ID (para 21).
  - Quarterly identifier-inconsistency checks (para 19).
  - Corrections made at source by the submitting institution; the CIC cannot alter data first (para 25).
  - ₹100 per day compensation after 30 days (para 41).
  - CKYC not mentioned.
  - Source (a reproduction on TaxGuru): https://taxguru.in/rbi/rbi-credit-information-companies-directions-2025.html
- [FACT, via press] RBI Ombudsman complaints against CICs: 1,039 (FY23), 3,847 (FY24), 4,585 (FY25), over 84% tied to loan issues such as incorrect reporting or score mismatches. Total scheme complaints were 13,34,244 in FY25. — https://knnindia.co.in/news/newsdetails/sectors/rbi-ombudsman-complaints-jump-1355-in-fy25-cic-grievances-hit-3-year-high-rbi-report
- [FACT] The compensation framework excludes disputes on score computation, among others (snippet; verify against circular RBI/2023-24/72). — https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12554
- [FACT] RBI penalised all four CICs a total ₹1.01 crore in June 2023 for inaccurate data and missed timelines (snippet; verify). — https://www.moneylife.in/article/credit-bureaus-must-resolve-customer-complaint-within-30-days-else-pay-rs100-fine-per-day-rbi/72398.html
- [RESEARCH, US comparator] FTC (n=1,001; 2,968 reports): about 1 in 5 consumers had a confirmed error corrected, and 5% had errors that could worsen loan terms. Published February 2013, so dated. — https://www.ftc.gov/news-events/news/press-releases/2013/02/ftc-study-five-percent-consumers-had-errors-their-credit-reports-could-result-less-favorable-terms

#### Tax statements
- [FACT, via press] In 2022 the CBDT called fears of AIS-mismatch notices "unfounded", saying the AIS shows what reporting entities supply and is corrected on feedback (snippet). — https://www.business-standard.com/amp/article/economy-policy/taxpayers-fear-notices-due-to-annual-income-statement-discrepancies-122073100708_1.html
- [FACT, via press] From 12 December 2025 CBDT reportedly sent SMS and email nudges for AIS-related mismatches (snippet). — https://www.taxscan.in/top-stories/income-tax-dept-sends-nudge-intimations-on-itr-ais-mismatches-and-high-value-transactions-what-taxpayers-must-do-1440030
- [SELF-REPORTED] Practitioners describe AIS feedback as opaque and slow (snippet). — https://carajput.com/learn/ais-woes-how-taxpayers-are-struggling-with-inaccurate-reporting.html
- [SELF-REPORTED] 26AS TDS corrections depend on the deductor filing a revised return (snippet). — https://disytax.com/ais-vs-form-26as-difference-mismatch-fix/

#### Parsers and entity resolution
- [SELF-REPORTED] casparser (MIT): parses CAMS, KFintech, NSDL and CDSL PDFs to typed models, JSON or CSV. It exposes `parse_warnings` when a scheme or holding does not reconcile. It rejects re-printed PDFs and leaves MF Central out of scope for v1.0. — https://github.com/codereverser/casparser
- [RESEARCH] SGER (ACL 2026 Industry, Dream11): fine-tuned LLM for Indian name matching, 99.02% accuracy and F1 0.994 on 50,000 held-out pairs. Dataset release unconfirmed. — https://arxiv.org/pdf/2605.23597
- [SELF-REPORTED] Vendors document Indian name issues such as Pooja/Puja, initials and placeholder surnames. — https://hyperverge.co/blog/name-match-in-onboarding-tackling-complexities-in-indias-bfsi-landscape/

### Inferences
- [INFERENCE] 4,585 complaints reaching the Ombudsman is a floor on visible disputes, not an error rate. The more than 4x rise over two years may reflect awareness as well as errors.
- [INFERENCE] RBI's framework is institution-side and per-bureau. Nobody in the sources read gives a consumer a cross-source view that says "this bureau loan has no matching EMI debit" or "this AIS dividend has no bank credit".
- [INFERENCE] Name matching is well served for pairs of person names. The less-addressed task is matching events across sources with different granularity, timing and identifiers: masked accounts, folios, ISINs, TDS sections, narrations.
- [INFERENCE] Para 25(2) makes a useful design rule: a reconciler should output who must correct what, because the bureau cannot change data by itself.
- [INFERENCE] A knowledge graph is a reasonable representation for explainability, but it is not itself the innovation. The measurable contribution is match quality and explanation quality.

### Gaps
- India-specific bureau error prevalence: the planned search did not run. DQI values are unpublished in anything I read.
- Official AIS or 26AS mismatch statistics: none found. Parliament replies and CAG reports were not checked.
- Peer-reviewed knowledge-graph reconciliation for Indian records, and public Indian datasets: none found in one search. Absence is unconfirmed.
- Whether commercial tax tools already reconcile AIS, 26AS and bank data at event level: not evaluated. Check before claiming novelty.

---

## 6. Blockchain: where is it justified and where is it unnecessary?

### Takeaway
A shared ledger has a credible case in wholesale settlement between institutions, where atomic delivery-versus-payment is the point. RBI's results are not yet public enough to confirm benefits. Retail e₹ usage fell in FY26. For consent logs, credentials, proofs of income and data sharing, a blockchain is usually unnecessary and can make privacy worse.

### Cited Findings
- [FACT, via press] Retail e₹ in circulation fell 24.08%, from ₹1,016.46 crore (March 2025) to ₹771.66 crore (March 2026), per RBI's annual report (snippet; inkl returned 403 on fetch). — https://www.inkl.com/news/retail-central-bank-digital-currency-in-circulation-falls-by-24-in-fy26 and https://www.devdiscourse.com/article/business/3925952-decline-in-retail-cbdc-circulation-observed-for-fy26-despite-rbis-initiatives
- [FACT, via press] FY25: 17 banks and 60 lakh retail users by March 2025 (snippet). — https://www.indiatvnews.com/business/news/e-rupee-in-circulation-grows-to-rs-1-000-crore-says-rbi-2025-05-29-992431
- [FACT, via press] FY25 coverage carries the headline "no volume in wholesale" (snippet, headline only). — https://informistmedia.com/MoneyWire/30310/rbi-report-e-rupee-circulation-jumps-4-fold-in-fy25-no-volume-in-wholesale
- [FACT, via press] Programmable CBDC paid food subsidies in Gujarat, Puducherry and Chandigarh; cross-border pilots planned (snippet). — https://www.business-standard.com/finance/news/rbi-cross-border-cbdc-pilots-digital-currency-2026-27-126052900721_1.html
- [SELF-REPORTED, tracker citing RBI documents] UMI: announced 8 Oct 2025; tokenised CD pilot "has commenced" per the May 2026 annual report; DLT with wholesale CBDC settlement. Not disclosed: ledger, operator, participants, volumes, legal standing of the token. — https://themonsoonledger.com/pilots/in-rbi-umi-tokenised-certificates-of-deposit/
- [FACT, via press] Demat 2.0 (Sept 2026): ₹1,025 crore of bonds (REC ₹500 crore, L&T ₹500 crore, IIFL ₹25 crore) on a ledger run by depositories, settled via wholesale CBDC through UMI. Claimed: atomic settlement, proceeds on bid day rather than 2 to 3 days later, automated coupons. — https://thecryptobasic.com/2026/09/11/india-launches-107-million-tokenised-bond-pilot-linked-to-rbi-wholesale-cbdc/
- [FACT, via press] Deposit tokenisation pilot on the wholesale CBDC leg, from Oct 2025 with few banks (snippet). — https://www.business-standard.com/economy/news/rbi-deposit-tokenisation-pilot-cbdc-wholesale-digital-tokens-oct8-125100700532_1.html
- [SELF-REPORTED] Acre's contract state exposes `monthly_earnings`, `tenure_months` and `completion_rate`, despite claiming to store only a proof hash. — https://github.com/SomehowLiving/Acre

### Inferences
- [INFERENCE] **Justified or at least testable:** atomic settlement across securities and cash between many regulated parties, and programmable conditions on money (subsidies). Even here, 1,025 crore across three issuers shows feasibility, not cost advantage, and no comparison against a central ledger was found.
- [INFERENCE] **Unnecessary:**
  - Consent records: the artefact is already a signed JWS with a known issuer.
  - Income proofs: a verifier needs a key and a proof, not a chain.
  - KYC or credential storage.
  - Bureau correction: Para 25 already names a single responsible source.

  Where tamper-evidence is wanted, an append-only Merkle log in the style of Certificate Transparency provides it without tokens or consensus.
- [INFERENCE] **Harmful:** personal or derived financial data on immutable ledgers conflicts with erasure duties, and public state undermines the privacy claim, as Acre shows.
- [INFERENCE] Test for students: if there is a single trusted operator, or all writers already trust a regulator, a database with signed logs is simpler. Using blockchain should require naming mutually distrusting writers and a settlement action. Most student project ideas in this area would not pass that test.
- [INFERENCE] Retail e₹ decline may partly reflect pilot design rather than demand, and UPI's strength is a plausible competitor. The sources do not establish the cause.

### Gaps
- Current e₹ users and transaction volume for FY26: not found.
- UMI ledger and technology details: not published per the tracker.
- Comparison of DLT settlement cost versus existing T+1 or RTGS: not found.

---

## 7. Developer access: how can students realistically prototype?

### Takeaway
Students can reach AA-shaped mock data, but cannot reach real FIP data, since FIUs must be regulated. Realistic building blocks are the Setu sandbox, other AA sandboxes, public XSDs, their own CAS PDFs, and a self-built mock FIP.

### Cited Findings
- [FACT] Only entities regulated by a financial sector regulator may be FIPs or FIUs. Sahamati lists 8 AA sandboxes: Anumati, Finvu, INK, OneMoney, Protean, Saafe, Setu, NADL. Costs and eligibility are not stated. Central Registry UAT allows dummy data only. — https://sahamati.org.in/how-to-join-the-account-aggregator-network-to-share-and-access-financial-data/
- [FACT] Setu sandbox: register on The Bridge, create an FIU product, get `x-product-instance-id`, `x-client_id` and `x-client-secret`, and test with a mock callback such as Beeceptor. Production requires KYC and review, and Setu handles Sahamati onboarding. Docs do not state cost or student eligibility. — https://docs.setu.co/data/account-aggregator/quickstart
- [FACT] Setu's documentation is inconsistent: the quickstart says it has mock data for all 23 FI types, while the FI data types page says FIP mock testing supports only 9. Custom mock sources require contacting aa@setu.co. — https://docs.setu.co/data/account-aggregator/quickstart, https://docs.setu.co/data/account-aggregator/fi-data-types and https://docs.setu.co/data/account-aggregator/overview
- [FACT] Finvu publishes sandbox docs at spec 1.1.3, without stating sign-up conditions on the page read. — https://finvu.github.io/sandbox/
- [FACT] Public resources: 23 FI XSDs with sample XML, plus OpenAPI files (dated 2022) — https://github.com/Sahamati/account-aggregator-standards; a Curve25519 helper — https://github.com/Sahamati/rahasya; v2.0.0 API spec PDF — https://sahamati.org.in/wp-content/uploads/2025/10/2-API_Specifications_v2.0.0.pdf
- [SELF-REPORTED, secondary guide] Certification covers security, API schema, FI schema and Central Registry integration, and is tied to a ReBIT spec version. The framework repo itself was not read. — https://ecorpit.com/account-aggregator-integration-fintech-builders-2026/ (framework: https://github.com/Sahamati/certification-framework)
- [SELF-REPORTED, competitor] AA fees follow a Sahamati rate card from 1 Dec 2026, up to ₹96 per account for 20 years of investment history. First-year integration is estimated at ₹5 to 25 lakh, and CAS parsing API starts at ₹999 per month. — https://casparser.in/blog/state-of-account-aggregator-2026/
- [SELF-REPORTED] MF Central is a CAMS-KFintech JV offering CAS, transaction and information APIs (press release, snippet). — https://bseindia.com/xml-data/corpfiling/AttachHis/\dc505bcd-f381-4933-a424-d341434a6353.pdf
- [SELF-REPORTED, low-confidence] A third-party copy of the MF Central integration doc describes client-ID-based token auth and a UAT environment (snippet). Eligibility and pricing not confirmed. — https://www.scribd.com/document/749204247/MFCentral-API-Integration-Document-CAS-v2-2-1-2
- [FACT] Individuals can obtain their own CAS through AMFI links and registrar mailback. — https://amfiindia.com/investor-corner/online-center/download-CAS.html

### Inferences
- [INFERENCE] Recommended stack, in order:
  1. Write a local ReBIT-shaped mock FIP from the public XSD, signing with your own RSA key and exchanging keys with rahasya. This gives full control over faults, signatures and scale.
  2. Validate request and consent flow shape against the Setu sandbox.
  3. Build a synthetic persona generator emitting bank, CAS, AIS-like and bureau-like records with planted errors, so ground truth is known.
  4. Use your own CAS PDFs via casparser only as a realism check, and keep them out of the repository.
- [INFERENCE] Say this clearly in the report: results are on mock or synthetic data, and no claim is made about real FIP behaviour. Reviewers respect that more than an implied real integration.
- [INFERENCE] Email Sahamati, ReBIT and Setu early with specific questions (signature path, student access). A written reply is itself useful evidence.

### Gaps
- Whether Setu's sandbox is free and open to students: not stated. Sign up to find out. A 404 on Setu's licence page prevented checking.
- Mock data signatures: whether Setu's mock FIP returns any verifiable signature is unknown and matters for Mechanism 1.
- MF Central access for non-regulated developers: unconfirmed.
- CAMS or KFintech direct CAS API terms: not found.
- Public Indian transaction or narration datasets: search did not run.

---

## 8. Candidate technical mechanisms for a major project

### Takeaway
Five mechanisms follow, none needing privileged access. In my judgement, the strongest innovation case combines Mechanisms 1 and 2. Mechanism 3 has the best usefulness-to-risk ratio, and Mechanism 5 gives the strongest demo.

### Cited Findings
Each mechanism rests on evidence cited in sections 1 to 7. The key anchors are:
- Master Direction cl. 7.3 on FIP signing — https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=10598
- Null and dummy value prohibition — https://sahamati.org.in/wp-content/uploads/2025/10/3Clarification_on_Mandatory_and_Optional_fields_V1.0.pdf
- Restricted API health dashboards — https://sahamati.org.in/saans-api-health-dashboard/
- Fair Use upper bounds — https://github.com/Sahamati/fair-use-implementation-guidelines-for-aa
- CIC correction rules — https://taxguru.in/rbi/rbi-credit-information-companies-directions-2025.html
- Synthetic data evaluation metrics — https://arxiv.org/html/2602.09288

### Inferences
Everything in this section is my proposal. "Genuinely new" means I found no prior public work in limited searching, so the team must verify this first.

#### Mechanism 1: AA-bound predicate proofs with an explicit binding analysis
- **What it does:** a person proves "balance ≥ X" or "average monthly credits ≥ Y" from an AA-format payload without revealing it. The team compares three binding designs: signature over plaintext, signature over ciphertext plus proven decryption, and commit-and-prove with cheap repeated predicates.
- **Genuinely new:** a ReBIT FI schema circuit or witness format, and a documented answer on whether the current AA signature path supports holder-side proofs at all. If it does not, a concrete, minimal spec change is itself a contribution.
- **Benchmarks:**
  - Constraints or gates, prove time, peak RAM, proof size and verify time at 10, 100, 1,000 and 5,000 transactions.
  - Hardware: 8 GB laptop, mid-range Android, browser WASM.
  - Stacks: Circom with rapidsnark, Noir with bb, and SP1 as the zkVM baseline.
  - Marginal cost of a second predicate after commitment.
  - Baselines from section 3: Anon Aadhaar (about 1.4 to 17 s) and zkPDF (minutes).
  - Negative tests: tampered field, stale data replay, wrong account, proof reuse by another verifier.
- **Prototype:** local mock FIP with own RSA key, public XSDs and Deposit.xml. No real bank signature is needed until the design question is answered.
- **Main risk:** the signature does not reach the holder in practice. The project still has a result, but the deployment story changes.

#### Mechanism 2: Completeness and semantic hardening for derived ratios
- **What it does:** defines and defends "EMI-to-income under 40%" against cheating that valid signatures cannot stop: omitting an account, inflating income by self-transfer, choosing a favourable window, and crafting narrations. Defences could include a signed coverage statement, bureau-attested obligations, counterparty matching across accounts, and a transparent rule set evaluated inside the proof.
- **Genuinely new:** a threat model and measured attack results for privacy-preserving affordability proofs. Prior systems reviewed prove facts about a document, not that the set of documents is complete.
- **Benchmarks:**
  - Attack success rate before and after each defence.
  - Salary and EMI classifier precision and recall.
  - Ratio error against ground truth.
  - Circuit cost per rule.
  - Information leaked by the chosen threshold, for example across repeated queries.
- **Prototype:** synthetic ledgers with planted attacks. Evaluate in plaintext first, then move a small rule subset into the circuit.
- **Main risk:** no public labelled Indian narration dataset was found, so realism depends on the generator. Full completeness may need FIP or bureau cooperation, which should be stated as a limit.

#### Mechanism 3: AA payload conformance testing with a privacy-preserving scoreboard
- **What it does:** a validator runs schema and semantic checks at the FIU: XSD validity, balance roll-forward, timestamps inside declared ranges, unique transaction IDs, null or dummy detection, v1 and v2 drift. FIUs then contribute per-FIP scores through secure aggregation with DP noise.
- **Genuinely new:** public metrics for content quality (existing health dashboards measure API signals and are restricted), plus a published method for sharing quality scores without exposing customers or individual FIUs.
- **Benchmarks:**
  - Fault detection recall and precision using mutation testing across fault types.
  - False alarm rate on clean data.
  - Latency per payload at 10 KB, 1 MB and 10 MB.
  - FIP rank correlation against ground truth at ε of 0.1, 1 and 10.
  - Minimum number of participating FIUs for useful results.
- **Prototype:** mutate mock XML. Simulate about 20 FIP fault profiles and about 50 FIUs.
- **Main risk:** injected faults may not match real ones. Mitigate by asking Sahamati or a TSP to review the fault catalogue. This is also the least novel cryptographically.

#### Mechanism 4: Minimal-sufficient-consent calculator
- **What it does:** given an underwriting model and data, search for the smallest consent (FI types, Summary vs Transactions, months of history, filters, one-time vs periodic) that keeps performance within a chosen tolerance. Output a valid consent JSON and a report for the "need-based" requirement.
- **Genuinely new:** a measurable definition of over-collection tied to actual AA consent fields. Commentary raises over-collection, but I found no measurement.
- **Benchmarks:**
  - Balanced accuracy and AUC against fields disclosed and months of history.
  - Size of the minimal consent versus a typical broad consent.
  - Stability across retraining and subgroups.
  - Attribute inference risk from what is still disclosed.
  - Comparison with Fair Use limits, if obtainable.
- **Prototype:** public credit datasets such as Give Me Some Credit and Credit Card Default, plus synthetic AA-shaped data.
- **Main risk:** public datasets are flat and do not map well onto AA fields, so conclusions are indicative. It is also more data science than systems work, which may affect how innovative a panel finds it.

#### Mechanism 5: Event-level cross-source reconciliation with a public benchmark
- **What it does:** parses AIS or 26AS, bank statements, CAS and bureau reports into a common event graph. Resolves entities (names, masked accounts, folios, ISINs) and matches events within time and amount tolerance. It explains each discrepancy and names the party who must correct it, following CIC Directions para 25.
- **Genuinely new:** an open, invariant-preserving synthetic benchmark for Indian multi-source reconciliation, and event-level matching rather than name matching. The generator would also serve Mechanisms 1 to 4.
- **Benchmarks:**
  - Match F1 at increasing noise and missing-data levels.
  - Unexplained residual rate.
  - Explanation correctness with human raters.
  - Rule-based baseline vs probabilistic linkage vs LLM-assisted.
  - Cost per statement.
  - For the generator: roll-forward violation rate, train-on-synthetic test-on-real where any real data exists, MIA, and distance to closest record.
- **Prototype:** synthetic personas emitting all formats, casparser for CAS, and team members' own documents kept locally with consent.
- **Main risk:** commercial tax tools may already do parts of this, and ground truth is only as good as the generator. Avoid training on anyone's real data without a documented basis under DPDP.

#### Comparison

| Mechanism | Innovation | Feasibility | Main dependency |
|---|---|---|---|
| 1. AA-bound predicate proofs | High | Medium | Signature path answer |
| 2. Completeness hardening | High | Medium | Realistic synthetic ledgers |
| 3. Conformance and scoreboard | Medium | High | Realistic fault catalogue |
| 4. Minimal-sufficient consent | Medium | High | Mapping public data to AA fields |
| 5. Event-level reconciliation | Medium to high | Medium to high | Format coverage, generator quality |

A sensible path is to start with the generator and mock FIP (needed by all), answer the signature question in the first few weeks, and then choose between 1+2 and 3+5 based on that answer.

### Gaps
- Novelty is provisional for all five. Before committing, search GitHub, arXiv, ePrint and Indian startup products for each.
- Feasibility numbers for AA payload circuits do not exist yet. Measuring them in an early spike is the best way to reduce risk.
- Whether lenders or regulators would accept proofs in place of raw data is unknown. Interviewing even two or three lenders would add evidence.
