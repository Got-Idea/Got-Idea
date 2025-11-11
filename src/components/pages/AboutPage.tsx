import React, { FC } from 'react';
import { LogoIcon } from '../Icons';

const AboutPage: FC = () => {
    const sectionTitleClass = "text-xl font-bold text-[var(--gotidea-text)] mb-4";
    const paragraphClass = "text-[var(--gotidea-text-muted)] leading-relaxed mb-6";
    const listItemClass = "mb-2";
    const strongClass = "font-semibold text-[var(--gotidea-text)]";

    return (
        <div className="flex-grow p-6 md:p-10 lg:p-12 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
                <header className="text-center mb-12">
                    <div className="inline-block p-4 bg-[var(--gotidea-bg-alt)] rounded-xl border border-[var(--gotidea-border)] shadow-[var(--gotidea-shadow)] mb-6">
                        <LogoIcon className="w-12 h-12 text-[var(--gotidea-primary)]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--gotidea-text)]">About Got Idea</h1>
                </header>

                <main className="bg-[var(--gotidea-bg-alt)] p-8 rounded-xl border border-[var(--gotidea-border)] shadow-[var(--gotidea-shadow)]">
                    <section className="mb-8">
                        <h2 className={sectionTitleClass}>Our Philosophy</h2>
                        <p className={paragraphClass}>
                            Got Idea was born from a simple belief: <strong className={strongClass}>You should own your AI journey.</strong>
                        </p>
                        <p className={paragraphClass}>
                            While platforms like Lovable, Cursor, and Bolt.new have revolutionized AI-powered development, they lock you into their ecosystem. We believe you deserve better.
                        </p>
                        <p className={paragraphClass}>
                            With Got Idea, you bring your own API keys from OpenAI, Anthropic, Google Gemini, or any AI provider you choose. This means you control your costs, your data, and your destiny.
                        </p>
                    </section>
                    
                    <section className="mb-8">
                        <h2 className={sectionTitleClass}>What Makes Us Different</h2>
                        <ul className={`${paragraphClass} list-disc list-inside`}>
                            <li className={listItemClass}>
                                <strong className={strongClass}>Your API Keys:</strong> Use any AI provider you want, pay only for what you use.
                            </li>
                            <li className={listItemClass}>
                                <strong className={strongClass}>Complete Control:</strong> Export your code, deploy anywhere, no vendor lock-in.
                            </li>
                            <li className={listItemClass}>
                                <strong className={strongClass}>Privacy First:</strong> Your API keys never leave your browser.
                            </li>
                             <li className={listItemClass}>
                                <strong className={strongClass}>Transparent Pricing:</strong> No hidden costs, no subscription tiers.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className={sectionTitleClass}>Our Mission</h2>
                        <p className={paragraphClass}>
                            We're on a mission to democratize AI-powered development. Whether you're a solo founder, a startup, or an enterprise, you should have access to the same powerful tools without breaking the bank or sacrificing control.
                        </p>
                        <p className="font-semibold text-center text-[var(--gotidea-primary)] mt-8">
                            Your Idea. Your API. Your Creation.
                        </p>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default AboutPage;