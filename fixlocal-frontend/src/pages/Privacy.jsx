function Privacy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-8 text-slate-700">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">FixLocal Privacy Policy</h1>
        <p className="text-sm text-slate-500 mt-2">Updated March 2026</p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">1. Data we collect</h2>
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>Profile data such as name, phone, email, address, and identity documents.</li>
          <li>Booking metadata like preferred service, chat messages, photos, and payments.</li>
          <li>Device information (browser, OS, IP) used for fraud prevention and analytics.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">2. How we use your information</h2>
        <p className="mt-2">
          We use the data to match you with tradespersons, provide customer support, process payments via escrow, send notifications, and improve
          FixLocal’s product experience. We never sell personal data to third parties.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">3. Sharing with trades & partners</h2>
        <p className="mt-2">
          Limited information such as your name, job location, and chat history is shared with the assigned tradesperson to complete the job.
          Payment providers, identity-verification partners, and analytics tools receive only what is required to deliver their services.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">4. Security & retention</h2>
        <p className="mt-2">
          FixLocal uses encryption, strict access controls, and periodic audits to protect your data. Booking history is retained for at least 3
          years to comply with tax and dispute requirements, after which it is anonymized.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">5. Your rights</h2>
        <p className="mt-2">
          You can access, correct, or delete your FixLocal profile by raising a support ticket inside the app or emailing privacy@fixlocal.example.
          We aim to respond within 7 business days.
        </p>
      </section>
    </div>
  );
}

export default Privacy;