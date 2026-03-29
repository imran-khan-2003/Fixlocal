function Terms() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-8 text-slate-700">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">FixLocal Terms & Conditions</h1>
        <p className="text-sm text-slate-500 mt-2">Updated March 2026</p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">1. Platform relationship</h2>
        <p className="mt-2">
          FixLocal connects customers with independent tradespersons. We are not the employer of the tradespeople listed on our platform. By
          booking a job you enter a direct contract with the tradesperson for the scope and fee agreed inside the FixLocal app.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">2. Booking & payments</h2>
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>All payments are processed via FixLocal escrow. Do not pay in cash to stay covered by FixLocal Assurance.</li>
          <li>Price changes must be confirmed in-app by both parties before work continues.</li>
          <li>We may cancel jobs that violate our safety policy or unpaid invoices.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">3. Cancellations</h2>
        <p className="mt-2">
          You can cancel a booking without penalty up to 2 hours before the scheduled start time. Late cancellations may incur a fee of up to 30% of
          the quoted amount to compensate the professional for lost time. Tradespersons who repeatedly cancel will lose their verified status.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">4. Disputes & refunds</h2>
        <p className="mt-2">
          If you’re unhappy with the work, raise a dispute within 48 hours using the app. Funds remain in escrow until the dispute is resolved.
          Our team may request photos, chat logs, or onsite inspections to mediate fairly. FixLocal’s decision is final for escrow releases.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">5. Pro obligations</h2>
        <p className="mt-2">
          Tradespersons must maintain valid IDs, local licenses (where applicable), insurance proof, and respond to customer chats promptly. Any
          misconduct, fraud, or safety complaints can result in suspension without notice.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">6. Limitation of liability</h2>
        <p className="mt-2">
          FixLocal is not responsible for direct or indirect damages arising from the services performed by tradespersons. Our liability is limited
          to the amount held in escrow for a disputed booking.</p>
      </section>
    </div>
  );
}

export default Terms;