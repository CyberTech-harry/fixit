import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | CyberTech IT Portal",
  description: "Terms of use for fixit.cybertechcomps.com — the rules for using this site.",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white mb-2 tracking-tight">
        Terms of Use
      </h1>
      <p className="text-xs text-stone-400 mb-10">Last updated: September 2025</p>

      <div className="prose prose-stone dark:prose-invert prose-sm max-w-none space-y-8">

        <section>
          <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-2">1. Acceptance</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            By accessing <strong>fixit.cybertechcomps.com</strong> you agree to these terms. If you do not
            agree, do not use this site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-2">2. What this site is</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            CyberTech IT Portal is an IT troubleshooting reference. Guides, commands, and checklists are
            published for informational and educational purposes. All content reflects our best understanding
            at the time of publication and may become outdated as operating systems and software change.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-2">3. No warranties</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            All content is provided <strong>as is</strong>, without warranties of any kind, express or
            implied. We do not guarantee that any guide will resolve your specific issue. IT environments
            vary. Always back up your data before following diagnostic procedures.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-2">4. Limitation of liability</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            To the maximum extent permitted by law, CyberTech IT Portal and its operators are not liable
            for any loss or damage arising from your use of, or reliance on, any content on this site.
            This includes data loss, system damage, or downtime resulting from following our guides.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-2">5. Intellectual property</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            All written content, code examples, and design on this site are owned by CyberTech IT Portal
            unless otherwise noted. You may copy individual commands and short excerpts for personal,
            non-commercial use with attribution. Reproducing entire guides or substantial portions of the
            site without written permission is not permitted.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-2">6. User-submitted content</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            By submitting a comment or feedback on this site, you grant us a non-exclusive, royalty-free
            licence to display that content on the site. You are responsible for ensuring your submissions
            do not violate third-party rights or applicable law. We reserve the right to remove any
            submission at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-2">7. Acceptable use</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-3">
            You must not use this site to:
          </p>
          <ul className="list-disc list-inside text-stone-600 dark:text-stone-400 space-y-1.5 text-sm">
            <li>Scrape or harvest content at scale for commercial purposes</li>
            <li>Attempt to access or interfere with the site's infrastructure</li>
            <li>Submit false, harmful, or unlawful content</li>
            <li>Use content to facilitate illegal activities</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-2">8. External links</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            This site may link to external resources. We do not control and are not responsible for
            the content or availability of external sites.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-2">9. Governing law</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            These terms are governed by the laws of the jurisdiction in which the operator resides.
            Any disputes will be subject to the exclusive jurisdiction of those courts.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-2">10. Changes</h2>
          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
            We may update these terms at any time. The "Last updated" date will reflect the most recent
            revision. Continued use of the site after changes constitutes acceptance.
          </p>
        </section>

      </div>
    </main>
  );
}
