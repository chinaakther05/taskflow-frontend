
"use client";

import { useState } from "react";
import {
  ChevronDown,
  CircleHelp,
  MessageCircleQuestion,
} from "lucide-react";

const faqs = [
  {
    question: "What is TaskFlow?",
    answer:
      "TaskFlow is a project management platform that helps teams organize projects, manage tasks, collaborate with team members, and track progress from one workspace.",
  },
  {
    question: "Is TaskFlow free to use?",
    answer:
      "Yes. TaskFlow offers a free plan for teams that are just getting started. You can upgrade to a paid plan when you need more features.",
  },
  {
    question: "Can I invite my team members?",
    answer:
      "Yes. You can invite team members to your workspace and assign them specific roles, projects, and tasks based on their responsibilities.",
  },
  {
    question: "What are the different user roles?",
    answer:
      "TaskFlow supports Admin, Project Manager, and Member roles. Each role has different permissions to keep your workspace organized and secure.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer:
      "Absolutely. You can upgrade your plan whenever your team needs additional features, more members, or more workspace capabilities.",
  },
  {
    question: "Is my workspace secure?",
    answer:
      "TaskFlow uses authentication and role-based access control to help protect your workspace and ensure users only access the features they are allowed to use.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="relative w-full overflow-hidden border-b">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-0 top-20 -z-10 h-72 w-72 rounded-full bg-blue-600/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* Left Side */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
              <MessageCircleQuestion className="size-5" />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Frequently asked questions
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Got questions?
              <br />
              We&apos;ve got answers.
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Find answers to the most common questions about TaskFlow,
              account setup, team collaboration, pricing, and security.
            </p>

            {/* Help Card */}
            <div className="mt-8 rounded-2xl border bg-background p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                  <CircleHelp className="size-4" />
                </div>

                <div>
                  <p className="font-semibold">
                    Still have questions?
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    We&apos;re here to help you understand how TaskFlow
                    works.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-2xl border bg-background transition-all duration-300 ${
                    isOpen
                      ? "border-blue-600/30 shadow-md shadow-blue-600/5"
                      : "hover:border-blue-600/20 hover:shadow-sm"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    className="flex w-full items-center justify-between gap-5 p-5 text-left sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 text-sm font-semibold text-blue-600">
                        0{index + 1}
                      </span>

                      <span className="font-semibold">
                        {faq.question}
                      </span>
                    </div>

                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "text-muted-foreground"
                      }`}
                    >
                      <ChevronDown
                        className={`size-4 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>

                  <div
                    id={`faq-answer-${index}`}
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-12 mr-5 border-t pb-6 pt-4 sm:mr-6">
                        <p className="text-sm leading-7 text-muted-foreground">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

