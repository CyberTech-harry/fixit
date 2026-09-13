import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CyberTech IT Portal",
  description: "Privacy policy for fixit.cybertechcomps.com: how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
        Privacy Policy
      </h1>
      <p className="text-xs text-slate-400 mb-10">Last updated: September 2025</p>

      <div className="prose prose-slate dark:prose-invert prose-sm max-w-none space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Who we are</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            CyberTech IT Portal operates at <strong>fixit.cybertechcomps.com</strong>. This site provides
            IT troubleshooting guides, terminal command references, and diagnostic documentation. It is
            operated by CyberTech IT Engineering.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. What data we collect</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
            We collect only the minimum data necessary to operate this site:
          </p>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1.5 text-sm">
            <li><strong>Usage analytics:</strong> page views and search queries, collected in aggregate with no personally identifiable information.</li>
            <li><strong>Bookmarks:</strong> stored in your browser's local storage only. We do not store your bookmarks on our servers.</li>
            <li><strong>Comments and feedback:</strong> if you submit a comment or article rating, we store only that content and a timestamp. We do not require an account or email address.</li>
            <li><strong>Server logs:</strong> standard web server logs (IP address, request path, timestamp) retained for up to 30 days for security purposes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Cookies</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            This site uses one cookie to remember your dark/light mode preference. No tracking cookies,
            advertising cookies, or third-party analytics cookies are set. We do not use Google Analytics,
            Facebook Pixel, or similar tracking services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Third-party services</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            This site is hosted on GitHub Pages and routed through Cloudflare. Both services may process
            request metadata (IP addresses, headers) as part of their infrastructure. Refer to their
            respective privacy policies for details:
          </p>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1.5 text-sm mt-2">
            <li><a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" className="text-[#4a90e2] hover:underline" target="_blank" rel="noopener noreferrer">GitHub Privacy Statement</a></li>
            <li><a href="https://www.cloudflare.com/privacypolicy/" className="text-[#4a90e2] hover:underline" target="_blank" rel="noopener noreferrer">Cloudflare Privacy Policy</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">5. Data retention</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Article feedback and comments are retained indefinitely to maintain guide quality. Server logs
            are deleted after 30 days. You may request deletion of any content you have submitted by
            contacting us at the address below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">6. Your rights</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Depending on your location, you may have the right to access, correct, or request deletion of
            personal data we hold about you. To exercise these rights, contact us at the address below.
            We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">7. Children</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            This site is not directed at children under 13. We do not knowingly collect personal data
            from children.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">8. Changes to this policy</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We may update this policy. Changes will be reflected by the "Last updated" date at the top
            of this page. Continued use of the site after changes constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">9. Contact</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            For privacy-related questions, contact us at <strong>fixit.cybertechcomps.com</strong> via the
            feedback widget on any guide page.
          </p>
        </section>

      </div>
    </main>
  );
}
