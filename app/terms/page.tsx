import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | CyberTech IT Portal",
  description: "Terms of use for fixit.cybertechcomps.com: the rules for using this site.",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
        Terms of Use
      </h1>
      <p className="text-xs text-slate-400 mb-10">Last updated: September 2025</p>

      <div className="prose prose-slate dark:prose-invert prose-sm max-w-none space-y-8">

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Acceptance</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            By accessing <strong>fixit.cybertechcomps.com</strong> you agree to these terms. If you do not
            agree, do not use this site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. What this site is</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            CyberTech IT Portal is an IT troubleshooting reference. Guides, commands, and checklists are
            published for informational and educational purposes. All content reflects our best understanding
            at the time of publication and may become outdated as operating systems and software change.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. No warranties</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            All content is provided <strong>as is</strong>, without warranties of any kind, express or
            implied. We do not guarantee that any guide will resolve your specific issue. IT environments
            vary. Always back up your data before following diagnostic procedures.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Limitation of liability</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            To the maximum extent permitted by law, CyberTech IT Portal and its operators are not liable
            for any loss or damage arising from your use of, or reliance on, any content on this site.
            This includes data loss, system damage, or downtime resulting from following our guides.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">5. Intellectual property</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            All written content, code examples, and design on this site are owned by CyberTech IT Portal
            unless otherwise noted. You may copy individual commands and short excerpts for personal,
            non-commercial use with attribution. Reproducing entire guides or substantial portions of the
            site without written permission is not permitted.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">6. User contributions</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            If you submit comments or ratings, you grant us a perpetual, non-exclusive license to display
            that content. Do not submit content that is abusive, spam, or contains malicious code. We
            reserve the right to remove any submission without notice.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">7. External links</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Our guides may link to official vendor documentation or external tools. We are not responsible
            for the content or practices of third-party websites.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">8. Changes to terms</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            We reserve the right to modify these terms at any time. Continued use of the site following
            changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">9. Governing law</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            These terms are governed by applicable law. Any disputes arising from use of this site shall
            be resolved in the appropriate jurisdiction.
          </p>
        </section>

      </div>
    </main>
  );
}
