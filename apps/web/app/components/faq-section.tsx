"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is GitBee and who is it for?",
    answer:
      "GitBee is a moderation assistant for open source projects. It helps maintainers by monitoring issues with Slack notifications, filtering irrelevant PRs, and enforcing community conduct guidelines with automated warnings and blocks.",
  },
  {
    question: "How does GitBee integrate with my GitHub repositories?",
    answer:
      "GitBee installs as a GitHub App. Simply authorize it with your repositories and it will automatically start monitoring issues and PRs. Connect your Slack workspace to receive real-time notifications.",
  },
  {
    question: "What exactly does GitBee do with PRs?",
    answer:
      "GitBee checks if PRs are relevant to your project scope. It does NOT review code quality or provide code suggestions. If a PR is spam or completely off-topic, GitBee can automatically close it with an explanation.",
  },
  {
    question: "How does the conduct enforcement work?",
    answer:
      "GitBee monitors for unprofessional behavior and Code of Conduct violations. It issues warnings to users, and after 3 or more warnings, it can automatically block repeat offenders from your repositories.",
  },
  {
    question: "Is my repository data secure with GitBee?",
    answer:
      "Absolutely. We use enterprise-grade security with end-to-end encryption. GitBee only accesses the permissions you grant, and we never store your source code. We're SOC 2 compliant and undergo regular security audits.",
  },
  {
    question: "How do I get started with GitBee?",
    answer:
      "Getting started is easy! Click 'Get started with GitHub', authorize GitBee for your repositories, connect your Slack workspace, and you're ready to go. GitBee will start monitoring immediately.",
  },
];

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex-1 px-4 md:px-12 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-start gap-4 lg:py-5">
          <div className="w-full flex flex-col justify-center text-[#ffffff] font-semibold leading-tight md:leading-[44px] font-sans text-4xl tracking-tight">
            Frequently Asked Questions
          </div>
          <div className="w-full text-[rgba(255,255,255,0.70)] text-base font-normal leading-7 font-sans">
            Everything you need to know about
            <br className="hidden md:block" />
            automating your OSS moderation.
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index);

              return (
                <div
                  key={index}
                  className="w-full border-b border-[rgba(255,255,255,0.1)] overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="group w-full px-5 py-[18px] flex justify-between items-center gap-5 text-left hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <div
                      className={`flex-1 text-[#ffffff] text-base font-medium leading-6 font-sans transition-colors ${isOpen ? "text-[#eab308]" : "group-hover:text-[#eab308]"}`}
                    >
                      {item.question}
                    </div>
                    <div className="flex justify-center items-center">
                      <ChevronDownIcon
                        className={`w-6 h-6 text-[rgba(255,255,255,0.60)] transition-transform duration-300 ease-in-out ${
                          isOpen
                            ? "rotate-180 text-[#eab308]"
                            : "rotate-0 group-hover:text-[#eab308]"
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-[18px] text-[rgba(255,255,255,0.70)] text-sm font-normal leading-6 font-sans">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
