'use client';

import { useState } from 'react';

const RATE = 9;
const rupees = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;
const lakh = (value: number) => `₹${(value / 100000).toLocaleString('en-IN', { maximumFractionDigits: 1 })} lakh`;

export function monthlyEmi(principal: number, annualRate: number, months: number) {
  const rate = annualRate / 12 / 100;
  const growth = (1 + rate) ** months;
  return (principal * rate * growth) / (growth - 1);
}

export default function FinPilotPreview() {
  const [price, setPrice] = useState(1200000);
  const [downPercent, setDownPercent] = useState(20);
  const [years, setYears] = useState(5);

  const downPayment = (price * downPercent) / 100;
  const loan = price - downPayment;
  const months = years * 12;
  const emi = monthlyEmi(loan, RATE, months);
  const interest = emi * months - loan;

  const rows = [
    ['Car price', rupees(price)],
    [`Down payment (${downPercent}%)`, rupees(downPayment)],
    ['Loan amount', rupees(loan)],
    ['Loan tenure', `${years} ${years === 1 ? 'year' : 'years'}`],
    ['Illustrative interest rate', `${RATE}% p.a.`],
    ['Interest payable', rupees(interest)],
  ];

  return (
    <div className="chat" data-ui>
      <div className="chat-head">
        <strong>FinPilot</strong>
        <span>Concept preview</span>
      </div>
      <div className="chat-body">
        <p className="bubble bubble-user">
          I&apos;m planning to buy a car worth {lakh(price)}. Can you help me plan the purchase?
        </p>
        <div className="bubble bubble-pilot">
          <p>Let&apos;s break it down.</p>
          <dl className="chat-table">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="chat-emi">
            <span>Estimated EMI</span>
            <output aria-live="polite">≈ {rupees(emi)}/month</output>
          </div>
          <p>Also budget for insurance, fuel and maintenance, and check that the EMI fits your monthly income.</p>
        </div>
      </div>
      <div className="chat-controls">
        <label htmlFor="fp-price">
          <span>Car price <b>{lakh(price)}</b></span>
          <input id="fp-price" type="range" min={300000} max={3000000} step={50000} value={price} aria-valuetext={lakh(price)} onChange={(e) => setPrice(Number(e.target.value))} />
        </label>
        <label htmlFor="fp-down">
          <span>Down payment <b>{downPercent}%</b></span>
          <input id="fp-down" type="range" min={10} max={50} step={5} value={downPercent} aria-valuetext={`${downPercent} percent`} onChange={(e) => setDownPercent(Number(e.target.value))} />
        </label>
        <label htmlFor="fp-years">
          <span>Tenure <b>{years} {years === 1 ? 'year' : 'years'}</b></span>
          <input id="fp-years" type="range" min={1} max={7} step={1} value={years} aria-valuetext={`${years} years`} onChange={(e) => setYears(Number(e.target.value))} />
        </label>
      </div>
      <p className="chat-note">
        Illustrative estimates for learning only. This is not a loan offer or a personalised recommendation, and actual
        rates and terms vary by lender.
      </p>
    </div>
  );
}
