import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-12">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <img src="/logo.png" alt="FixLocal" className="h-14 mb-2" />
          <p className="text-white/70 text-sm mt-3">
            India’s trusted marketplace for booking vetted tradespersons. Built by FixLocal for local neighborhoods.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide">Discover</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link to="/search?city=Bengaluru&service=Electrician">Electricians</Link></li>
            <li><Link to="/search?city=Bengaluru&service=Plumber">Plumbers</Link></li>
            <li><Link to="/search?city=Bengaluru&service=Cleaning">Cleaning pros</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide">For trades</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link to="/register">Join FixLocal</Link></li>
            <li><Link to="/dashboard/tradesperson">Tradesperson Console</Link></li>
            <li><Link to="/dashboard/tradesperson/ratings">Reviews</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide">Support</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><a href="mailto:support@fixlocal.example">support@fixlocal.example</a></li>
            <li>+91 99887 66554</li>
            <li>Mon–Sat, 9am–7pm IST</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between text-xs text-white/70">
          <p>© {new Date().getFullYear()} FixLocal. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;