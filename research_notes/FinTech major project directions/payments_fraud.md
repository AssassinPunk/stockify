# Inadequately Addressed Problems in Digital Payments and Financial Fraud: India First, with Global Comparison

Research date: 6 November 2026. This is defensive research for a final-year engineering team.

**How to read the evidence tags**

| Tag | Meaning |
|---|---|
| [OFFICIAL] | I read the original text from the regulator, ministry, police, industry body or platform owner. |
| [PRESS] | An official figure as reported by the press. I did not read the primary document. |
| [RESEARCH] | A paper or preprint. I read the abstract unless the entry says full text. It is a research finding, not settled fact. |
| [SELF-REPORT] | An unaudited claim by a vendor, platform or agency about its own product. |
| [SNIPPET] | Seen only in a search result or a fetch summary. Check it before citing. |
| [OPINION], [VENDOR], [TERTIARY] | Commentary, vendor marketing, or an encyclopedia-style summary. Use these as leads, not as evidence. |

Everything under "Inferences" is my own reasoning, not a sourced fact.

**Limits of this pass**
- The web search budget ran out before the last two searches ran: Indian-language scam datasets, and public fraud data and its limitations. "I found none" on those topics is weak evidence.
- There was no dedicated search on behavioural biometrics.
- Page summaries came from an automated extraction step. Check exact numbers against the linked source before putting them in a report.

---

## Q1. What are the latest fraud numbers, and how much is user-authorised?

### Takeaway
India has no single fraud number. Citizen-reported cyber-fraud losses were about ₹22,495 crore in 2025, while the bank-reported "digital payment fraud" series shows tens of crores and is not comparable because its scope differs. I found no official authorised vs unauthorised split for India, but RBI treats authorised push payment (APP) fraud as the dominant type, and I4C's category shares suggest at least about 85% of loss value is victim-initiated (my inference).

### Cited Findings

**Citizen-reported losses (NCRP/I4C)**

| Year | Complaints | Amount reported (₹ crore) |
|---|---|---|
| 2021 | 2,62,846 | 551 |
| 2022 | 6,94,446 | 2,290 |
| 2023 | 13,10,357 | 7,465 |
| 2024 | 19,18,835 | 22,848 |
| 2025 | 24,02,579 | 22,495 |

- [OFFICIAL] The table above comes from a Rajya Sabha written reply of 11 February 2026, which notes the data is dynamic — [PIB, MHA](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2226441&lang=1&reg=3)
- [OFFICIAL] For 2021-2025 the reply gives more than 65.89 lakh complaints, more than ₹55,050 crore reported, more than ₹8,189 crore marked as lien, and more than 1,95,760 FIRs. CFCFRMS shows more than ₹11,158 crore "saved" across more than 32.80 lakh complaints up to 30 June 2026 — [PIB, MHA, 21 July 2026](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2287039&reg=3&lang=1)
- [OFFICIAL] The ₹8,189 crore figure is called "saved" in the February 2026 reply and "marked as Lien" in the July 2026 reply. A lien is not a refund to the victim — [February reply](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2226441&lang=1&reg=3); [July reply](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2287039&reg=3&lang=1)

**Conflicting 2025 totals (do not mix these)**
- [OFFICIAL] ₹22,495 crore — [PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2226441&lang=1&reg=3)
- [PRESS] About ₹22,930 crore and 28 lakh cases, attributed to the RBI discussion paper — [Swarajya](https://swarajyamag.com/news-brief/rbi-proposes-one-hour-delay-on-digital-payments-above-rs-10000-to-curb-rising-fraud)
- [PRESS] ₹19,812 crore and 21.77 lakh "cheating-linked" complaints, from I4C data — [The420](https://the420.in/india-cyber-fraud-52976-crore-i4c-data-investment-scams/)
- [PRESS] A Lok Sabha reply of 2 December 2025 said "over ₹32,600 crore". The article gives no period, so this figure should not be used — [The Quint](https://www.thequint.com/news/webqoof/wef-cybersecurity-report-flags-cyber-fraud-as-pervasive-threat)

**Category shares and digital arrest**
- [PRESS] I4C's 2025 category shares by loss: investment scams 77%, digital arrest 8%, credit card fraud 7%, sextortion 4%, e-commerce 3%, app/malware 1%. I did not see the primary I4C table — [The420](https://the420.in/india-cyber-fraud-52976-crore-i4c-data-investment-scams/)
- [PRESS] Digital arrest figures from I4C (the 2026 figures come from a status report filed in the Supreme Court): 2024: 1,23,672 complaints, ₹1,935 crore. 2025: 58,239 complaints, ₹1,211 crore. January-August 2026: 21,928 complaints, more than ₹647 crore — [NewsMobile](https://www.newsmobile.in/fraud-and-scam/digital-arrest-scams-cost-indians-over-%E2%82%B93000-crore-supreme-court-questions-banks-role/); [The420](https://the420.in/digital-arrest-fraud-supreme-court-mha-i4c/)
- Conflict: 8% of either 2025 total is about ₹1,585-1,800 crore, which does not match the ₹1,211 crore digital arrest figure. The two series likely use different bases.
- [PRESS] A 29 October 2026 Supreme Court bench suggested banks could be financially accountable for negligent transaction monitoring, and flagged suspiciously large transactions from senior citizens' accounts — [NewsMobile](https://www.newsmobile.in/fraud-and-scam/digital-arrest-scams-cost-indians-over-%E2%82%B93000-crore-supreme-court-questions-banks-role/)

**Bank-reported and UPI series (narrow scope)**
- [PRESS] RBI Annual Report 2025-26, card/internet/digital payments, frauds of ₹1 lakh and above, by year reported: FY24 28,836 cases, ₹1,452 crore. FY25 13,332 cases, ₹517 crore. FY26 293 cases, ₹29 crore. Total bank frauds in FY26 were 10,114 cases and ₹48,021 crore, including 314 older cases worth ₹30,199 crore reported afresh — [Outlook Business](https://www.outlookbusiness.com/news/financial-institutions-report-over-10000-cases-of-fraud-involving-48000-cr-in-fy26-rbi-data)
- [PRESS] RBI Trend and Progress 2024-25, date-of-occurrence basis: card/internet fraud was 7,756 cases (66.8% of cases) but ₹252 crore (7.2% of amount). H1 FY26 had 128 cases and ₹4 crore. RBI says these are "amounts involved, not actual losses" — [MediaNama](https://www.medianama.com/2025/12/223-cards-internet-fraud-66-in-fy25-decline-banking-rbi/)
- [PRESS] Lok Sabha reply reported 3 August 2026, digital payment frauds reported by banks to RBI: FY24 2,93,239 cases, ₹2,060.75 crore. FY25 1,44,855 cases, ₹821.88 crore. FY26 5,997 cases, ₹35.86 crore. ThePrint attributes part of the fall to a narrower reporting rule (fraud "committed on the bank"), and the reply gave no recovery figures — [ThePrint](https://theprint.in/india/banks-reported-rs-4457-cr-worth-of-digital-payment-fraud-over-11-yrs-close-to-half-of-it-was-in-2023-24/3004402/)
- [PRESS] UPI fraud: FY24 13.42 lakh incidents, ₹1,087 crore. FY25 12.64 lakh, ₹981 crore. FY26 April-November 10.64 lakh, ₹805 crore — [The420](https://the420.in/india-upi-fraud-data-fy26-parliament-digital-payments/); [Prokerala](https://www.prokerala.com/news/articles/a1707886.html). The Quint gives that period as January-November, which conflicts — [The Quint](https://www.thequint.com/news/webqoof/wef-cybersecurity-report-flags-cyber-fraud-as-pervasive-threat)
- [SNIPPET] FY26 to 15 March 2026: more than 1.63 million UPI cases and INR 12.26 billion — [Informist](https://www.informistmedia.com/MoneyWire/47276/UPI-Fraud-Over-1-6-mln-UPI-fraud-cases-involving-INR-12-bln-reported-in-so-far-in-FY26)

**Authorised vs unauthorised**
- [PRESS] RBI's April 2026 discussion paper targets APP fraud and describes most digital payment frauds as APP, without a percentage in the coverage I read. A ₹10,000 threshold reportedly covers about 98.5% of fraud value and about 45% of cases — [Swarajya](https://swarajyamag.com/news-brief/rbi-proposes-one-hour-delay-on-digital-payments-above-rs-10000-to-curb-rising-fraud); [Myelin Bridge commentary](https://myelinbridge.substack.com/p/rbis-disucssion-paper-on-digital)
- [OFFICIAL] Singapore: 81.8% of reported scams in 2025 involved self-effected transfers. Total losses were S$913.1 million, down 17.9% — [Singapore Police Force annual brief](https://www.police.gov.sg/-/media/SPF/Advisories/Scams/Annual-Scam-and-Cybercrime-Brief-2025.pdf)
- [OFFICIAL] UK, 2025: total payment fraud £1.28 billion. APP losses £576.4 million (up 19%, 248,070 cases). Unauthorised losses £703.4 million (down 5%, 3.81 million cases). Investment scam losses £221.5 million (up 40%) — [UK Finance](https://www.ukfinance.org.uk/news-and-insight/press-release/fraud-report-2026-press-release)

**Who suffers**
- [SNIPPET] A Rajya Sabha reply put 2025 senior citizen losses at ₹4,005.12 crore, and senior citizen and women's complaints together at ₹7,769.63 crore — [New Kerala](https://www.newkerala.com/news/a/over-lakh-senior-citizens-463-lakh-women-lodged-614.htm)

### Inferences
- Roughly 85% of 2025 loss value (investment plus digital arrest) is likely victim-initiated, if I4C's categories map to authorisation. I4C does not publish this mapping. Singapore's 81.8% is a similar size but counts cases, not value.
- The official UPI series is about 5% of NCRP losses (₹1,226 crore vs ₹22,495 crore; different periods and definitions). A team that benchmarks against UPI or RBI fraud series alone would miss most of the reported harm.
- The fall in RBI series to 293 cases should not be cited as evidence that fraud fell. Reporting changes and the ₹1 lakh threshold are stronger explanations.
- Digital arrest complaints fell, but average reported loss per complaint rose: about ₹1.56 lakh (2024), ₹2.08 lakh (2025), ₹2.95 lakh (January-August 2026). This could reflect awareness removing smaller cases, but the data cannot confirm that.
- Lien of about 15% of reported value (₹8,189 crore of ₹55,050 crore) is not a recovery rate, and it probably overstates what victims actually get back.

### Gaps
- No official India authorised/unauthorised split found.
- I did not read the primary RBI Annual Report, the RBI discussion paper PDF, or the I4C category table.
- The Lok Sabha answer [AU2481](https://eparlib.sansad.in/bitstream/123456789/3018042/1/AU2481_5bIzKk.pdf) timed out and [MHA Q432](https://www.mha.gov.in/MHA1/Par2017/pdfs/par2025-pdfs/LS02122025/432.pdf) returned 404. Both URLs came from a [secondary blog](https://www.scanmyshadow.com/blog/2026/10/india-1930-helpline-money-saved-and-upi-fraud-data.html).
- I found no NPCI-published incident-level UPI fraud data.

---

## Q2. Why does transaction-side detection miss authorised scams, and what do existing controls not do?

### Takeaway
In an authorised scam, the genuine user on the genuine device passes every authentication check, so the transaction carries little evidence of the manipulation behind it. Most Indian controls act on one signal (a risky number, a known mule, an OTP-protected screen). I found no published control that joins the live coercion context with the payment decision at population scale outside OS-vendor pilots.

### Cited Findings

**Why it is hard**
- [RESEARCH] A Federal Reserve Bank of Kansas City briefing says an authorised payment initiated by a victim will most likely go through, fast payments are irrevocable, and a Pay.UK AI pilot caught 56% of APP scam transactions — [Kansas City Fed, November 2024](https://www.kansascityfed.org/research/payments-system-research-briefings/combating-authorized-push-payment-scams-in-fast-payment-systems/)
- [OFFICIAL] UK Finance says confirmation of payee and warnings may help against redirection scams, but investment scam victims who believe the payee are likely to proceed regardless of warnings. These scams often start with small payments that do not look unusual — [UK Finance Annual Fraud Report 2026](https://www.ukfinance.org.uk/system/files/2026-06/UK%20Finance%20Fraud%20Report%202026.pdf)

**What exists and what it does not do**

| Control | What it actually does | What it does not do (sourced, or marked as inference) |
|---|---|---|
| NPCI fraud monitoring | AI/ML solution for all banks: generates alerts, declines transactions — [Rajya Sabha Q1032 via TaxGuru](https://taxguru.in/rbi/government-deploys-ai-combat-digital-payment-frauds-finance-ministry.html) | Inference: sees the transaction, not the call or screen context. No public performance data found. |
| MuleHunter.AI | RBIH risk scoring of accounts using transaction data, profiles and ecosystem learning. 29 banks by 28 July 2026 — [TaxGuru](https://taxguru.in/rbi/government-deploys-ai-combat-digital-payment-frauds-finance-ministry.html). 26 banks in March 2026 — [PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2244478&reg=3&lang=1) | RBI declined to disclose accounts identified. No accuracy metrics are public — [MediaNama RTI report](https://www.medianama.com/2025/12/223-rti-23-banks-mulehunter-mule-accounts/) |
| DPIP | RBIH pilot with seven banks sharing data to train models that flag anomalous transactions — [TaxGuru](https://taxguru.in/rbi/government-deploys-ai-combat-digital-payment-frauds-finance-ministry.html). The related IDPIC company was incorporated on 16 October 2025 — [PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2244478&reg=3&lang=1) | Still a pilot on the latest official statement. The Finance Ministry had raised delay concerns in 2025 — [Business Standard](https://www.business-standard.com/finance/news/fin-min-pushes-rbi-to-expedite-launch-of-platform-to-curb-digital-frauds-125093000979_1.html) |
| DoT FRI / DIP | Rates mobile numbers Medium, High or Very High. More than 1,000 entities onboarded, ₹660 crore prevented in six months [SELF-REPORT] — [DoT/PIB, 22 December 2025](https://www.dot.gov.in/static/uploads/2026/02/1994430b3740f7f61b7d7fd8b7f5120d.pdf) | DoT has not said whether users are notified, how scores are reviewed, or how to contest a tag — [MediaNama](https://www.medianama.com/2025/05/223-dot-financial-fraud-risk-indicator-upi/). Also no public accuracy data — [Policy Edge](https://www.policyedge.in/p/digital-intelligence-platform-dip). Inference: a fresh mule number or a payee without a phone link has no score. |
| Chakshu / Sanchar Saathi | Citizens report suspected fraud calls and SMS, and check connections in their name — [DoT/PIB](https://www.dot.gov.in/static/uploads/2026/02/1994430b3740f7f61b7d7fd8b7f5120d.pdf) | Inference: reactive. It relies on someone else having already reported the number. |
| PhonePe / Google Pay / Paytm | PhonePe blocks "Very High" numbers and is building warnings for "Medium". Paytm and Google Pay were integrating, details not given — [MediaNama](https://www.medianama.com/2025/05/223-dot-financial-fraud-risk-indicator-upi/) | No published effect on victim behaviour found. |
| UPI name display and collect limits | P2P collect ended on 1 October 2025 — [Business Today](https://www.businesstoday.in/personal-finance/banking/story/npci-to-tighten-upi-rules-peer-to-peer-collect-feature-to-end-in-october-489244-2025-08-13). Verified names required, with a date conflict: [30 June 2025](https://www.angelone.in/news/economy/upi-appsto-to-show-only-real-beneficiary-names-from-june-30-2025) vs [1 June 2026](https://www.sansalegal.com/post/upi-verified-name-display-rule-what-changed-for-digital-payments-from-june-1) | Inference: a verified name does not help if the victim was told to pay that person. |
| Google in-call protections | See Q3. | See Q3. |
| UK Confirmation of Payee | Name check before payment, since 2020 — [Kansas City Fed](https://www.kansascityfed.org/research/payments-system-research-briefings/combating-authorized-push-payment-scams-in-fast-payment-systems/) | Limited against malicious-payee scams, per [UK Finance](https://www.ukfinance.org.uk/system/files/2026-06/UK%20Finance%20Fraud%20Report%202026.pdf). I found no independent effect size. |
| UK APP reimbursement | Banks returned £354.3 million, 61% of all APP losses in 2025 — [UK Finance](https://www.ukfinance.org.uk/news-and-insight/press-release/fraud-report-2026-press-release). [SNIPPET] Start date of 7 October 2024 — [Farrer](https://www.farrer.co.uk/news-and-insights/authorised-push-payment-fraud-and-mandatory-reimbursement/), page blocked on retry. [SNIPPET] PSR's 89% refund rate for in-scope fraud over the first 15 months appeared in a search summary, and I could not tie it to a readable page. | Moves the loss. Which? reports intra-bank APP cases up 269% and international up 106%, both outside the scheme — [Which?](https://www.which.co.uk/policy-and-insight/article/which-responds-to-uk-finances-2026-fraud-report-a59ah9n36VKB) |
| Singapore Money Lock | At least 479,000 customers locked close to S$44 billion by 31 December 2025 — [SPF brief](https://www.police.gov.sg/-/media/SPF/Advisories/Scams/Annual-Scam-and-Cybercrime-Brief-2025.pdf) | The brief frames it as limiting loss if digital banking access is compromised. It requires users to opt in beforehand. No published effect on coerced victims found. |

- [PRESS] A PSR-commissioned report estimated a roughly 21% fall in Faster Payments APP losses (about £73 million a year) and a reimbursement rise from 54% to 65%. UK Finance's total APP losses still rose 19%, on a different scope — [Regulation Tomorrow](https://www.regulationtomorrow.com/2026/07/payment-fraud-falls-by-73m-following-psr-reimbursement-scheme/)
- [OFFICIAL] RBI's 2025 authentication directions allow issuers to use behaviour and device risk checks beyond two factors, but compensation in full is tied to non-compliant transactions — [RBI](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12898)
- [OFFICIAL] RBI's March 2026 draft would extend liability rules to "other categories of fraudulent" electronic banking transactions and add small-value compensation — [RBI press release](https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62340)
- [PRESS] Final customer protection rules were reportedly issued on 24 June 2026, effective 1 January 2027. This is single-source — [The420](https://the420.in/digital-arrest-fraud-supreme-court-mha-i4c/)

### Inferences
- The missing signal is context, not transaction features. A team that adds another classifier on transactions is unlikely to reach what authorised scams leave out of the payment record.
- Indian controls mostly attach risk to identifiers (phone numbers, accounts). Identifier reputation decays when criminals rotate SIMs and mule accounts, so cold-start detection stays inadequately addressed.
- The UK's reimbursement move shows that liability changes incentives. Rising liability in India, signalled by the Supreme Court and RBI, could raise demand for defensible detection and explainable decisions.

### Gaps
- **UPI Safety and UPI Help:** the NPCI page returned no readable content. I could not verify what these do, and I found no NPCI source.
- **Truecaller:** I obtained no source, so no claim is made.
- **bank.in:** I could not retrieve the RBI or registry source. I only observed a live bank using it ([Ujjivan SFB URL](https://www.ujjivansfb.bank.in/banking-blogs/personal-finance/rbi-digital-payment-authentication-rules)). Inference: a verified domain helps with lookalike websites, not with a victim on a call.
- I could not read the [PSR Confirmation of Payee page](https://www.psr.org.uk/our-work/account-to-account-payments/confirmation-of-payee/) (404) or the [Commons Library briefing](https://researchbriefings.files.parliament.uk/documents/CBP-8545/CBP-8545.pdf) (403).
- I did not verify the reports of [31 banks using MuleHunter](https://rmaindia.org/mulehunter-ai-rbis-ai-fraud-detection-system-now-live-across-31-banks/) or of an [MHA December 2026 mandate and 20,000 accounts per month](https://the420.in/rbi-mulehunter-ai-tool-mule-accounts-cyber-fraud-india/).

---

## Q3. On-device, privacy-preserving, multimodal scam-session detection

### Takeaway
Google has the strongest deployed system, but in India its on-device call analysis started on Pixel 9+, off by default, in Hindi and English only. A third-party Android app generally cannot hear a phone call, so an independent project should use session metadata and treat call content as optional. Real-time progression modelling is an active research area, mostly in Korean and Chinese, and I found no comparable Indian-language benchmark.

### Cited Findings

**Deployed systems**
- [PRESS] India, November 2025: Gemini Nano scam detection runs on the device without recording or sending audio. It is off by default, applies to unknown numbers, plays a beep, works in Hindi and English, and starts on Pixel 9+. Pixel's India share was under 1% in 2024, against Android's nearly 96% — [TechCrunch](https://techcrunch.com/2025/11/20/google-steps-up-ai-scam-protection-in-india-but-gaps-remain)
- [PRESS] A screen-share alert pilot in India with Navi, Paytm and Google Pay needs Android 11+ and offers one tap to end the call and sharing — [TechCrunch](https://techcrunch.com/2025/11/20/google-steps-up-ai-scam-protection-in-india-but-gaps-remain)
- [PRESS] Android 16 in-call protections with non-contacts block first-time installs from unverified sources, granting accessibility permission, and disabling Play Protect — [TechCrunch, May 2025](https://techcrunch.com/2025/05/13/google-announces-new-security-features-for-android-for-protection-against-scam-and-theft)
- [SNIPPET] A 30-second pause when a financial app is opened during a call with an unsaved number, tested in the UK, Brazil, India and the US. This comes from one article relying on unnamed sources — [The420](https://the420.in/a-30-second-rule-google-tests-new-protection-feature-pauses-calls-during-banking-app-use/)
- [OFFICIAL] 14 October 2026: screen-share blanking extends to Chrome and WebView (Android 15+), background call forwarding is blocked, verified financial calls have blocked more than 3 million spoofed calls in Brazil [SELF-REPORT], and scam detection flags more than 5 million suspected calls and texts a month [SELF-REPORT]. Chat notification alerts are expanding to OEMs including OPPO, vivo and Xiaomi. India availability is not stated — [Google](https://blog.google/security/new-android-scam-protections/)
- [OFFICIAL] Verified financial calls need the bank's app installed and signed in. Named partners are Revolut, Itaú and Nubank — [Google, 2026](https://blog.google/security/whats-new-in-android-security-privacy-2026/)
- [SELF-REPORT] Monzo's call status feature shows whether a genuine call is under way, with about 700 suspected fraud reports a month. No prevention figures are given — [Android Developers Blog](https://android-developers.googleblog.com/2024/03/battling-impersonation-scams-monzo-innovative-approach.html)
- [TERTIARY] Digital arrest contact and coercion are described as running by telephone, WhatsApp, other messaging platforms and long video calls. I did not check the underlying news citations — [Wikipedia](https://en.wikipedia.org/wiki/Digital_arrest_scam)

**Android constraints for third-party developers**
- [OFFICIAL] During a voice call, an ordinary app cannot capture call audio. The call-audio sources need a privileged pre-installed app with `CAPTURE_AUDIO_OUTPUT`. Accessibility services are the listed exception for audio capture. `AudioManager.getMode()` reporting `MODE_IN_CALL` or `MODE_IN_COMMUNICATION` indicates an active call — [Android: Sharing audio input](https://developer.android.com/media/platform/sharing-audio-input)
- [PRESS] Android 13 restricted settings, widened in Android 15, limit sideloaded apps' access to accessibility, notification listener and other sensitive roles — [9to5Google](https://9to5google.com/2024/09/12/android-15-sideloaded-apps-restrictions/); [Android Authority](https://androidauthority.com/android-15-enhanced-confirmation-mode-3436697)
- [OFFICIAL] Under Advanced Protection on Android 17, apps not labelled as accessibility tools lose accessibility service access — [Google](https://blog.google/security/whats-new-in-android-security-privacy-2026/)
- [OFFICIAL] Play Integrity's App Access Risk reports whether apps that can capture the screen or control the device are running, without revealing their identity. Standard limit: 10,000 requests per app per day by default — [Android: Execution environment](https://developer.android.com/security/fraud-prevention/environment)
- [OFFICIAL] `FLAG_SECURE` blanks screenshots and non-secure displays and helps with remote screen sharing, with reliability limits. `HIDE_OVERLAY_WINDOWS` blocks third-party overlays — [Android: Sensitive activities](https://developer.android.com/security/fraud-prevention/activities)
- [OFFICIAL] From Android 15, OTP content is removed for most notification listeners and hidden from remote viewers during screen sharing — [Android: Fraud prevention](https://developer.android.com/security/fraud-prevention)

**Research**
- [RESEARCH] Shen et al.: LLM real-time detection on Chinese transcripts. Real-time precision on synthetic data fell to about 0.70-0.77, compared with 0.95-1.00 retrospectively. The paper reports a false positive triggered by the word "payment", no user study, and a tension between early warnings and false alarms. Full-text extraction; verify the table — [arXiv:2502.03964](https://arxiv.org/html/2502.03964)
- [RESEARCH] PreScam: 11,573 conversational instances across 20 categories from 177,989 reports. Supervised encoders beat zero-shot LLMs on termination prediction, and models struggle to track how risk escalates — [arXiv:2605.12243](https://arxiv.org/abs/2605.12243)
- [RESEARCH] Vishing-Tactics-Bench: 35,340 utterances across 5,645 synthetic Chinese calls, framed as survival-style harm forecasting with lead-time analysis at a tight false-alarm budget — [arXiv:2609.07151](https://arxiv.org/abs/2609.07151)
- [RESEARCH] ScriptMind: 571 Korean cases turned into 22,712 training instances. An 11B small LLM reportedly beat GPT-4o by 13% (metric not stated in the abstract) — [arXiv:2601.13581](https://arxiv.org/abs/2601.13581)
- [RESEARCH] LLM rewriting reduced Korean vishing classifier accuracy by up to 30.96%, so detection based on surface wording is fragile — [arXiv:2507.16291](https://arxiv.org/abs/2507.16291)
- [SNIPPET] MiLTL: a cascade with a deterministic stage and a small language model on uncertain calls, with a Korean benchmark. The publisher page was blocked — [DOI 10.3390/a19090723](https://doi.org/10.3390/a19090723)
- [SNIPPET] A domain-adaptive scam call paper mentions Hinglish code-switching and edge processing, with a composite transcript dataset of N=46,982. I could not confirm whether it includes Hinglish data — [ResearchGate](https://www.researchgate.net/publication/401799491_Domain-Adaptive_Transfer_Learning_for_Privacy-Preserving_Scam_Call_Detection)

### Inferences
- **Remaining gap 1, coverage:** on-device call analysis is limited by device, language, opt-in, and by telephony. OS-level pilots may reach further, but I found no evidence of analysis of WhatsApp or other OTT calls in India.
- **Remaining gap 2, modalities:** the deployed warnings I could verify each cover a slice (a call, a message, a screen-share). I found no public benchmark that fuses call state, screen capture, app state, SMS context and payee risk over one session.
- **Remaining gap 3, language:** Hindi and English leave out most Indian languages, and Romanised code-mixing has little public scam data. Tamil, Telugu, Bengali and Marathi were not verified as supported.
- **Design consequence:** a Play-compliant third-party app should not depend on call audio. It can use call mode, App Access Risk, local contact status and in-app events. Call content can be an optional extension using a user-held recording of a simulated call.
- `MODE_IN_COMMUNICATION` could indicate VoIP sessions, but it does not identify the other party or app. This needs testing on real devices.

### Gaps
- A search summary quoted Google as saying the Accessibility API "cannot be requested for remote call audio recording". I could not tie this to a specific page or confirm it in Play policy, so check the current policy before relying on the accessibility route.
- I did not verify the exact permission needed for telephony call state on current Android versions, or an API for screen-recording detection. Check `TelephonyCallback` and `WindowManager.addScreenRecordingCallback` in the Android reference. These names are from memory.
- I found no independent evaluation of Google's Scam Detection (false positives, abandonment, prevented loss), and no India-specific count.
- The search for Indic-language scam benchmarks did not run because of the search limit.

---

## Q4. Mule account detection: state of the art 2023-2026

### Takeaway
Multigraph GNNs have measurably advanced on synthetic AML benchmarks, but the best minority-class F1 in MEGA's full table is still below 50% on all three low-illicit datasets, even with complete synthetic labels. Evidence on tree models is mixed: they trail GNNs well on AMLworld but lead on Tide. Federated and encrypted methods exist, but I found no public cross-bank evaluation on real data, and Indian production systems publish no metrics.

### Cited Findings
- [RESEARCH] AMLworld: an agent-based generator calibrated to real transactions. The authors argue synthetic data's complete labels can help model comparison, since many real laundering transactions go undetected — [arXiv:2306.16424](https://arxiv.org/abs/2306.16424). IBM's repository lists it as NeurIPS 2023 and offers GIN, GAT, PNA and RGCN with port, ego and reverse-message-passing adaptations (Apache 2.0) — [IBM/Multi-GNN](https://github.com/IBM/Multi-GNN)
- [RESEARCH] Multi-GNN: port numbering, ego IDs and reverse message passing improve minority-class F1 on laundering data by up to 30% — [arXiv:2306.11586, AAAI 2024](https://arxiv.org/abs/2306.11586)
- [RESEARCH] MEGA-GNN (TMLR 2026): beats Multi-GNN in 17 of 18 comparisons, and MEGA-PNA has the highest F1 on five of six AML datasets — [arXiv:2412.00241](https://arxiv.org/abs/2412.00241); [full PDF](https://arxiv.org/pdf/2412.00241)

| Minority-class F1 (%), [MEGA Table 16](https://arxiv.org/pdf/2412.00241) | Small HI | Small LI | Medium HI | Medium LI | Large HI | Large LI |
|---|---|---|---|---|---|---|
| GFP+XGBoost | 63.23 | 27.30 | 65.70 | 28.16 | 42.68 | 24.23 |
| PNA (base GNN) | 62.96 | 21.02 | 66.87 | 31.79 | 55.01 | 20.47 |
| Multi-PNA | 67.35 | 35.39 | 76.12 | 43.81 | 72.35 | 33.54 |
| Multi-FraudGT | 75.81 | 45.69 | 75.97 | 44.66 | 73.04 | 35.49 |
| MEGA-PNA | 74.01 | 46.32 | 78.26 | 49.40 | 76.95 | 38.31 |

These values were read from the paper's PDF text. They are means, with the ± values omitted here.

- [RESEARCH] MEGA's Table 4 shows Multi-FraudGT dropping from 75.81 to 61.74 on Small HI when port numbers are permuted, showing sensitivity to an arbitrary ordering — [arXiv:2412.00241](https://arxiv.org/pdf/2412.00241)
- [RESEARCH] Amatriciana: temporal GNN on the whole graph at once, F1 0.76 and 55% fewer false positives against compared models, on a public dataset not named in the abstract — [arXiv:2506.00654](https://arxiv.org/abs/2506.00654)
- [RESEARCH] ETDNet: Elliptic++ illicit F1 of 88.1% vs 60.4% for its comparison, ECAI 2025 — [arXiv:2508.03251](https://arxiv.org/abs/2508.03251)
- [RESEARCH] Elliptic2: 122K labelled subgraphs in a background graph of 49M clusters and 196M edges, for subgraph representation learning — [arXiv:2404.19109](https://arxiv.org/abs/2404.19109)
- [RESEARCH] Tide generator: timing-aware laundering patterns. LightGBM led at low illicit ratio (PR-AUC 78.05) and XGBoost at higher prevalence (85.12), and rankings change with prevalence — [arXiv:2603.01863](https://arxiv.org/abs/2603.01863)
- [RESEARCH] BlazingAML: pattern mining with a compiler, reporting 210x (CPU) and 333x (GPU) speedups at the same F1 on IBM data — [arXiv:2604.12241](https://arxiv.org/abs/2604.12241)
- [RESEARCH] Fully homomorphic encryption for collaborative AML with GNN and XGBoost pipelines. Graph features improved F1 by 8% on imbalanced data — [arXiv:2411.02926, SPACE 2024](https://arxiv.org/abs/2411.02926)
- [SNIPPET] FC2L: federated continual contrastive graph learning for cross-institution edge-level AML detection — [Springer DMKD](https://link.springer.com/article/10.1007/s10618-026-01192-0). DPxFin: reputation-weighted federated learning with adaptive differential privacy — [arXiv:2603.19314](https://arxiv.org/pdf/2603.19314)
- [RESEARCH] A review of continual graph learning for AML addresses forgetting under evolving patterns, with experiments on synthetic and real datasets — [arXiv:2503.24259](https://arxiv.org/abs/2503.24259)
- [RESEARCH] ProtoCP (KDD 2026): conformal prediction for temporal fraud graphs, addressing poor calibration where few fraud labels exist. It reaches target coverage with smaller prediction sets on four benchmarks including BankSim — [arXiv:2608.15768](https://arxiv.org/abs/2608.15768)
- [OFFICIAL/PRESS] MuleHunter was built by studying 19 mule-associated behaviours. RBI held mule counts as fiduciary data, and no accuracy figures are public — [MediaNama](https://www.medianama.com/2025/12/223-rti-23-banks-mulehunter-mule-accounts/)
- [OFFICIAL] Singapore's Facility Restriction Framework has placed 550 money mules, 801 SIM card mules and 51 corporate entities under restrictions (as at 9 February 2026) — [SPF](https://www.police.gov.sg/-/media/SPF/Advisories/Scams/Annual-Scam-and-Cybercrime-Brief-2025.pdf)
- [PRESS] A draft RBI mule-account SOP is tentatively due in December 2026, and banks disagree on the value of lagged credit — [The420](https://the420.in/digital-arrest-fraud-supreme-court-mha-i4c/)

### Inferences
- **Who suffers:** victims whose money leaves before a freeze, and potentially innocent account holders caught by broad flags. I found no published data on wrongful freezes, which is itself a gap.
- **Remaining gap 1, cross-bank edges:** I found federated training of model weights and encrypted inference, but less on propagating risk along edges that cross institutions, which is where layering hides.
- **Remaining gap 2, metrics:** F1 on a transaction does not measure how much money could still be stopped. A metric based on recoverable value over time would better match the lien problem.
- **Remaining gap 3, action:** a score does not say whether to watch, hold or freeze. Calibrated, cost-aware decisions under label scarcity and drift look under-studied in this setting, though ProtoCP is a close starting point.
- **Baseline warning:** any project needs a graph-feature gradient-boosting baseline. On AMLworld, GNNs clearly beat GFP+XGBoost in MEGA's table, but on Tide gradient boosting leads that paper's ranking and BlazingAML reports matching F1 with pattern mining. Model rankings therefore depend on the dataset, so results on a single benchmark are weak evidence.
- Synthetic results may not transfer to UPI. UPI's small tickets, VPAs and mule behaviour differ from AMLworld's assumptions, and this cannot be verified without bank data.

### Gaps
- I found no head-to-head paper covering all of temporal, multigraph, and federated approaches on the same splits.
- I did not read the full text of the federated papers, so their real-data claims are unverified.
- I found no published UPI-graph benchmark.
- Explainability in AML: I found only low-confidence sources in this pass ([example](https://www.researchgate.net/publication/398062882_AN_EXPLAINABLE_GRAPH_NEURAL_NETWORK_FRAMEWORK_FOR_ANTI-MONEY_LAUNDERING_IN_CRYPTOCURRENCY_TRANSACTIONS_USING_THE_ELLIPTIC_DATASET)). No strong finding is claimed.

---

## Q5. Account takeover, SIM swap, device binding, behavioural biometrics, deepfake KYC

### Takeaway
Regulation has moved to technology-neutral two-factor authentication and SIM binding, both aimed at proving the account holder or device is genuine. These are real controls for unauthorised fraud, but they do not address a genuine user under manipulation. Deepfake and injection evidence for India is largely vendor-sourced, which makes an independently measured benchmark a useful contribution.

### Cited Findings
- [OFFICIAL] RBI Authentication Directions (issued 25 September 2025, compliance by 1 April 2026): at least two distinct factors. For non-card-present transactions, one factor must be dynamic and unique to the transaction. Compromise of one factor must not affect the other. Issuers may check location, behaviour patterns, device attributes and transaction history, and may explore DigiLocker for high-risk confirmation. Loss from non-compliant transactions must be compensated in full. Cross-border card rules are due by 1 October 2026 — [RBI](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12898)
- Source note: the RBI page cites a letter dated 2 September 2026 inside directions dated 2025, so the page may have been updated. Check the official PDF.
- [PRESS] Government replies list device binding, two-factor PIN authentication, daily limits and use-case restrictions as UPI safeguards — [The420](https://the420.in/india-upi-fraud-data-fy26-parliament-digital-payments/)
- [PRESS] DoT's November 2025 directions require messaging accounts to stay tied to the active SIM. UPI and banking apps already face similar rules. DoT also announced a Mobile Number Validation platform to check whether a number belongs to the person on record — [The Hacker News](https://thehackernews.com/2025/12/india-orders-messaging-apps-to-work.html)
- [PRESS] The latest timeline is compliance by 31 December 2026 and enforcement from 1 January 2027, with fixed six-hour logouts reportedly replaced by risk-based logouts — [The Indian EYE](https://theindianeye.com/2026/10/23/india-to-enforce-sim-binding-rules-for-messaging-apps-from-january-2027/). This is a lower-confidence source.
- [OFFICIAL] UK remote banking losses fell 27% to £104.4 million in 2025 — [UK Finance](https://www.ukfinance.org.uk/news-and-insight/press-release/fraud-report-2026-press-release). A contributor in the UK Finance report says remote access and malware have declined while criminals exploit human behaviour — [UK Finance report](https://www.ukfinance.org.uk/system/files/2026-06/UK%20Finance%20Fraud%20Report%202026.pdf)
- [RESEARCH] A virtual camera detection model, trained on session metadata from authentic users, targets video injection. The abstract gives no numbers — [arXiv:2512.10653](https://arxiv.org/abs/2512.10653)
- [VENDOR, unverified] Claims include Frida-based injection defeating liveness checks (attributed to Carta et al.) — [DuckDuckGoose](https://www.duckduckgoose.ai/blog/video-kyc-under-attack-how-deepfakes-enter-remote-verification-flows), more than 8,000 bypass attempts at one institution (attributed to Group-IB), and an RBI August 2025 position on basic liveness — [HyperVerge](https://hyperverge.co/blog/deepfake-ai/). Vendors sell the remedy, so treat these as leads only.

### Inferences
- **Who suffers:** people who lose a SIM or device, and institutions whose onboarding admits synthetic or impersonated mule accounts. SIM binding may also hurt legitimate users on Wi-Fi-only devices, secondary phones or roaming. This comes from the [same report](https://theindianeye.com/2026/10/23/india-to-enforce-sim-binding-rules-for-messaging-apps-from-january-2027/).
- **Remaining gap 1:** the link between onboarding fraud and mule creation is under-measured in public data. Deepfake KYC matters here mainly as a mule supply problem.
- **Remaining gap 2:** behavioural signals built to spot an impostor may not detect a genuine but coached user. Whether coached behaviour is distinguishable needs testing.
- **Project fit:** deepfake KYC is a crowded area for student work, and credible injection testing needs careful ethics and device labs. I rank it below the session and mule directions.

### Gaps
- Behavioural biometrics: no dedicated search ran. I have no verified India-specific or independent evaluation evidence to report.
- I found no public India SIM-swap fraud figure and no peer-reviewed study of Indian V-CIP attacks.
- I did not confirm the RBI KYC text on liveness.

---

## Q6. The friction trade-off: do warnings and cooling-off periods work under coercion?

### Takeaway
Evidence favours specific, interruptive design over generic warnings, but in-the-moment warnings often fail, especially under stress and trust in the scammer. I found no randomised evaluation of warnings on coerced victims in real payment flows, and no published result yet on India's proposed one-hour hold. Singapore's Restriction Orders show that some victims stay convinced even after police contact.

### Cited Findings
- [RESEARCH] A US multi-agency and academic review (April 2024) found relatively little research directly testing scam-prevention messaging and says in-the-moment warnings often fail. It reports habituation, lower compliance under stress, and warnings that scammers pre-empt through coaching. Emotional arousal can disrupt recall of prior warnings — [FTC-hosted committee review](https://consumer.ftc.gov/system/files/consumer_ftc_gov/pdf/A%20Review%20of%20Scam%20Prevention%20Messaging%20Research.pdf)
- [RESEARCH] The same review says active warnings that interrupt a task do better than passive ones, and that a real-payment-platform experiment (Wen et al., 2022) found warnings appearing specific to the user or transaction were less often ignored — [same review](https://consumer.ftc.gov/system/files/consumer_ftc_gov/pdf/A%20Review%20of%20Scam%20Prevention%20Messaging%20Research.pdf)
- [RESEARCH] A UK online experiment in a simulated banking app found redesigned calls-to-action sharply reduced fraud success, while traditional behavioural and risk warnings had weaker effects. It is a simulated setting and a working paper, and I did not obtain effect sizes — [Akesson, Gathergood and Quispe-Torreblanca, 2023](https://ideas.repec.org/p/not/notcdx/2023-08.html)
- [OFFICIAL] Singapore issued 12 Restriction Orders by 1 February 2026 to restrict banking facilities of victims who continued to believe scammers despite police engagement. MAS and banks are also adding friction to transactions that drain large sums, cooling periods for high-risk changes, and in-app call verification notices — [SPF brief](https://www.police.gov.sg/-/media/SPF/Advisories/Scams/Annual-Scam-and-Cybercrime-Brief-2025.pdf)
- [OFFICIAL] ASCom and partners helped avert at least S$348 million in potential losses through proactive interventions, including S$267.5 million via Project A.S.T.R.O. — [SPF brief](https://www.police.gov.sg/-/media/SPF/Advisories/Scams/Annual-Scam-and-Cybercrime-Brief-2025.pdf)
- [PRESS] RBI's discussion paper (9 April 2026, comments to 8 May) proposes a one-hour hold above ₹10,000 with cancellation, trusted-person approval above ₹50,000 for those aged 70+ and persons with disabilities, a ₹25 lakh annual credit cap, and a kill switch. I found no final rules — [Swarajya](https://swarajyamag.com/news-brief/rbi-proposes-one-hour-delay-on-digital-payments-above-rs-10000-to-curb-rising-fraud); [Daijiworld](https://www.daijiworld.com/news/newsDisplay?newsID=1314260)
- [OPINION] A critique says whitelisting could itself be coerced, that merchants would face disputes, that the paper lacks cost-benefit analysis, and that it does not explain how these measures would stop digital arrest scams — [Myelin Bridge](https://myelinbridge.substack.com/p/rbis-disucssion-paper-on-digital)
- [PRESS] An individual case report describes a victim held under "digital arrest" for 13 consecutive hours — [The Tribune, January 2025](https://www.tribuneindia.com/news/india/gujarat-man-held-in-digital-custody-for-13-hours-duped-of-rs-13-lakh/amp)
- [RESEARCH] Brazil's Pix allows holds of up to 30 minutes by day or one hour at night for risk analysis — [Kansas City Fed](https://www.kansascityfed.org/research/payments-system-research-briefings/combating-authorized-push-payment-scams-in-fast-payment-systems/)
- [SNIPPET] A mandatory-reimbursement study with a pilot field study and lab experiment suggests reimbursement may weaken consumer precautions — [ResearchGate](https://www.researchgate.net/publication/390800552_Protecting_financial_consumers_from_authorized_push_payment_fraud_is_reimbursement_an_optimal_solution)
- [SELF-REPORT] A vendor-commissioned UK survey says only 33% of adults read fraud warnings before paying. It measures stated behaviour, and the sponsor sells related services — [The Paypers](https://thepaypers.com/fraud-and-fincrime/news/research-by-tunic-pay-opinium-shows-banks-scam-warnings-fail-to-stop-customers-taking-risks-to-make-payments)

### Inferences
- A one-hour hold assumes the delay breaks the scammer's influence. A long coercion session can outlast an hour, so a delay without separating the victim from the scammer may achieve little in the worst cases. This is a hypothesis to test, not a finding.
- Delay may be more useful for mule tracing than for persuasion, because it gives time for downstream risk checks and holds.
- The design question is who is informed and when: the victim, a trusted contact, the bank's human agent, or the payee's bank. Warnings addressed only to the victim are the weakest option for coerced users.
- **Who bears friction:** older adults and persons with disabilities under trusted-person rules, merchants under holds, and small businesses under credit caps. A project should report legitimate-user cost alongside fraud prevented.

### Gaps
- I found no randomised field evidence on coerced victims, and no independent effect size for UK Confirmation of Payee or Money Lock.
- I found no evidence on Google's in-call pause beyond the single report above.
- I did not read the Akesson full paper, so no effect sizes are given.

---

## Q7. Public data for student prototypes and ethical simulation

### Takeaway
Graph AML data is good enough for rigorous student work. Payment-session data and Indian-language scam data are the main shortfalls. Any session project must build and openly validate its own simulator, and report that results prove the mechanism rather than real-world prevalence.

### Cited Findings

| Dataset | What I verified | Use and limit |
|---|---|---|
| [IBM AML / AMLworld](https://www.kaggle.com/datasets/ealtman2019/ibm-transactions-for-anti-money-laundering-aml) | Six variants, Small/Medium/Large × HI/LI — [MEGA](https://arxiv.org/pdf/2412.00241). The Kaggle page was unreadable, but the [IBM repo](https://github.com/IBM/Multi-GNN) documents setup | Multigraph mule/laundering work. Synthetic. |
| [Elliptic++](https://github.com/git-disl/EllipticPlusPlus) | 203,769 transactions (4,545 illicit, 42,019 licit, 157,205 unknown); 822,942 wallets (14,266 illicit, 251,088 licit, 557,588 unknown) | Label scarcity and temporal drift. Bitcoin, not bank rails. |
| [Elliptic2](https://arxiv.org/abs/2404.19109) | 122K labelled subgraphs, 49M node clusters, 196M edges | Subgraph learning. Bitcoin. |
| [Tide](https://arxiv.org/abs/2603.01863) | Open generator, about 0.10% and 0.19% illicit reference sets | Timing-aware stress tests. |
| [PaySim](https://www.kaggle.com/datasets/ealaxi/paysim1) | Only the title, "Synthetic Financial Datasets For Fraud Detection", was readable | Baseline only. Details unverified. |
| [BankSim](https://www.kaggle.com/datasets/ealaxi/banksim1) | Title readable. Used as a benchmark by [ProtoCP](https://arxiv.org/abs/2608.15768) | Baseline only. Details unverified. |
| [IEEE-CIS](https://www.kaggle.com/c/ieee-fraud-detection) | Only the title was readable | Card-style features. Details unverified. |
| [BothBosu scam-dialogue](https://huggingface.co/datasets/BothBosu/scam-dialogue) | 1,600 LLM-generated English dialogues, 8 types, Apache 2.0 | Pipeline testing. Not Indian in content. |
| [Hinglish scam text](https://huggingface.co/datasets/Yash1072006/hinglish-scam-text-dataset) | 3,787 examples, but only 35 Hinglish scam and 28 Hinglish benign, hand-written, CC-BY-4.0 | Too small for training. A seed only. |
| [Multilingual phishing project](https://github.com/gupta7050/multilingual-phishing-detection) | 5,000 Hindi and 1,102 Hinglish author-created messages. No metrics stated on the page | Check provenance before use. |
| [MUTANT](https://arxiv.org/pdf/2302.11766) [SNIPPET] | Hinglish corpus, not about scams | Code-mix pretraining or background negatives. |
| [PreScam](https://arxiv.org/abs/2605.12243), [Vishing-Tactics-Bench](https://arxiv.org/abs/2609.07151) | Conversation progression benchmarks. Vishing-Tactics-Bench is Chinese and synthetic. PreScam's languages were not stated | Method templates. Check licence and access. |

### Inferences

**Ethical simulation rules (my recommendation)**
- Use simulated money and a mock banking app. Never use real accounts, numbers, payment rails or VPAs.
- Obtain institutional ethics approval for any human study. Use informed consent, debriefing, an easy way to withdraw, and low-stress scenarios. Do not recruit vulnerable people into coercive scenarios.
- Label tactics at an abstract level ("authority claim", "isolation request") drawn from public advisories. Do not publish operational scripts or corpora tuned to evade detectors.
- Publish generator parameters and a limitations statement. State clearly that simulated detection rates are not real-world rates.
- Test sensitivity by varying the simulator's assumptions, so results do not simply recover the rules used to build the data.
- Apply data minimisation in line with the DPDP Act, which RBI's directions also reference — [RBI](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12898)

### Gaps
- The planned searches on Indian-language datasets and on PaySim, BankSim and IEEE-CIS details did not run. Check the following from memory before use: the column names of AMLworld (I recall "From Bank" and "To Bank", needed for partitioning by bank), and sizes and fraud rates of the Kaggle sets.
- I found no public multimodal payment-session dataset, but the search was incomplete. Check again before claiming novelty.
- Dataset licences for AMLworld and Elliptic++ were not confirmed.

---

## Q8. Candidate defensive mechanisms beyond a classifier on transactions

### Takeaway
My top pick is a metadata-first coercion-session risk engine (C1), paired with the safe intervention testbed (C5) if the team can get ethics approval. The strongest graph-based alternative is cross-bank risk propagation scored on recoverable value (C3). All five are my own proposals. Their novelty claims come from a limited search, so the team should do a focused literature check before committing.

### Cited Findings
These are the evidence anchors for the proposals. The proposals themselves are inference.
- Lead-time and false-alarm evaluation for scams — [Vishing-Tactics-Bench](https://arxiv.org/abs/2609.07151)
- App Access Risk and call-mode signals available to apps — [Android: Execution environment](https://developer.android.com/security/fraud-prevention/environment); [Android: Sharing audio input](https://developer.android.com/media/platform/sharing-audio-input)
- Verified calls for banks, not government agencies, in what I found — [Google](https://blog.google/security/new-android-scam-protections/)
- Calibrated decisions for fraud graphs — [ProtoCP](https://arxiv.org/abs/2608.15768)
- Encrypted and federated baselines — [FHE AML](https://arxiv.org/abs/2411.02926); [DPxFin](https://arxiv.org/pdf/2603.19314)

### Inferences

**C1. Metadata-first coercion-session risk engine (recommended)**
- **Mechanism:** an on-device state model over one payment session, using signals a normal app can obtain: call or VoIP mode, caller not in contacts, screen-capture or control risk, app switching, new payee, amount relative to the user's own history, and an optional identifier risk signal. It outputs time-to-harm risk, then selects a graded action. No call audio or transaction history leaves the phone.
- **What is new:** survival-style forecasting applied to a whole payment session rather than a transcript. It also degrades gracefully when permissions or signals are missing, and needs no Gemini Nano or system privilege.
- **Evaluation without a bank:** build an open simulator of benign sessions (calling a relative while paying, screen-sharing with IT support) and scam-pressure sessions at tactic level. Measure lead time at a fixed false-alarm budget, performance as signals drop out, sensitivity to simulator assumptions, and latency, memory and battery on low-cost Android phones.
- **Main risks:** simulator circularity, and OS-level features may overtake it. The honest claim is "mechanism feasibility on open signals". It should also be tested for false alarms on legitimate calls.

**C2. Privacy-preserving verified-caller registry for banks and government agencies**
- **Mechanism:** an institution that genuinely places a call publishes a short-lived signed intent. The user's app checks it without revealing the query to the registry, and without letting outsiders list who is being called. A failed check gives a clear "no such call" result.
- **What is new:** Google's and Monzo's approaches are single-institution or app-based. This generalises to many issuers, including police-impersonation claims, with query privacy and defined offline behaviour.
- **Evaluation:** formal protocol analysis (Tamarin or ProVerif), replay and spoofing tests in a threat model, load simulation, and latency measurement.
- **Main risks:** needs institutional adoption to deploy. Coerced victims may be told to ignore it, so it should be presented as a verifiable building block and tested in C5.

**C3. Cross-bank risk propagation scored on recoverable value**
- **Mechanism:** each bank keeps its own subgraph. Banks exchange only encrypted or noised risk messages on cross-bank edges, after private matching of counterparties, to trace funds across hops in near real time.
- **What is new:** propagation over cross-silo edges rather than only averaging model weights, plus a new metric: value still recoverable at time t after the first suspicious hop. This connects directly to the lien and freeze problem.
- **Evaluation:** partition AMLworld and Tide by bank, using temporal hold-outs. Compare with a local graph-feature gradient-boosting baseline, a centralised upper bound, and federated averaging. Report minority F1, PR-AUC, recoverable value at time t, communication cost, privacy budget, and membership-inference leakage.
- **Main risks:** cryptographic cost at scale, and synthetic flows may not reflect UPI. Scope it to a small number of hops.

**C4. Calibrated, contestable action policy for mule flags**
- **Mechanism:** a decision layer on top of any detector. It uses conformal risk control to choose between monitor, step-up, credit hold and freeze, with a bound on wrongful freezes. Each action comes with a minimal subgraph explanation and an appeal record.
- **What is new:** moves from "calibrated score" to "bounded harm per action" under drift and missing labels, and treats redress as an engineering output. This responds to the transparency and redress concerns raised about [FRI](https://www.medianama.com/2025/05/223-dot-financial-fraud-risk-indicator-upi/).
- **Evaluation:** Elliptic++ with its unknown labels and AMLworld with masked labels (for example 1%, 5%, 10%). Test temporal drift, coverage under drift, wrongful-action rate, explanation fidelity and stability.
- **Main risks:** exchangeability assumptions break under drift. This must be measured and reported, not assumed away.

**C5. Safe intervention testbed plus an Indian-language tactic corpus**
- **Mechanism:** a mock UPI-style app and a scripted, ethically reviewed time-pressure scenario to compare interventions in randomised conditions: generic warning, specific warning, active call-to-action, delay, trusted-contact prompt, and "hang up first" flows. Alongside it, a small annotated Hindi, Hinglish and one regional-language tactic corpus built from public advisories.
- **What is new:** multilingual, India-specific evidence on intervention design, and on the trade-off between intervention type and legitimate-user drop-off. The [FTC-hosted review](https://consumer.ftc.gov/system/files/consumer_ftc_gov/pdf/A%20Review%20of%20Scam%20Prevention%20Messaging%20Research.pdf) identifies a shortage of direct testing.
- **Evaluation:** pre-registered primary outcome of aborted simulated payment, plus time to decision, comprehension by language, and false-abort rate on legitimate tasks. For the corpus, test tactic classification across languages and under benign paraphrase.
- **Main risks:** a simulation cannot reproduce real coercion, so results are an upper bound on what warnings might do. Ethics approval takes time, so start early.

**Rough ranking for a final-year team**

| Rank | Candidate | Innovation | Feasibility without bank access | Main evaluation risk |
|---|---|---|---|---|
| 1 | C1 + C5 | High | Medium-high | Simulator validity |
| 2 | C3 | High | Medium | Cryptographic cost; synthetic flows |
| 3 | C4 | Medium-high | High | Calibration under drift |
| 4 | C2 | Medium-high | High for protocol, low for deployment | Adoption; no behavioural proof |

This ranking is my judgement and is not based on measured data.

### Gaps
- No novelty claim here is verified as absolute. I did not search specifically for prior art on metadata-only session models, private caller registries, cross-silo risk propagation with recoverable-value metrics, or conformal action policies for mule freezes. Run those checks on arXiv, Google Scholar and in USENIX Security, IEEE S&P, ACM CCS, KDD and NeurIPS proceedings first.
- I did not confirm which Android signals work without special permissions on all target OEMs. A one-week device spike should come before committing to C1.
