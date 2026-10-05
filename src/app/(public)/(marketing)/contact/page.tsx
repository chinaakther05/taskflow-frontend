
import {
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";

const ContactPage = () => {
  return (
    <main className="w-full">
      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Contact us
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              We&apos;d love to hear from you
            </h1>

            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
              Have a question about TaskFlow, need help with your workspace,
              or want to learn more? Send us a message and we&apos;ll get back
              to you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-24">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold">
              Let&apos;s talk
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Our team is here to help you get the most out of TaskFlow.
              Reach out whenever you need assistance.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                  <Mail className="size-5" />
                </div>

                <div>
                  <p className="font-semibold">Email</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    support@taskflow.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                  <MessageCircle className="size-5" />
                </div>

                <div>
                  <p className="font-semibold">Support</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We&apos;re here to help with your questions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                  <MapPin className="size-5" />
                </div>

                <div>
                  <p className="font-semibold">Location</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border bg-blue-600/[0.04] p-6">
              <p className="text-sm font-semibold">
                Need quick help?
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Check our FAQ section for answers to common questions
                about TaskFlow.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border bg-background p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Send us a message
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Fill out the form and we&apos;ll get back to you.
              </p>
            </div>

            <form className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  placeholder="How can we help?"
                  className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  rows={6}
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-lg border bg-background px-3 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Send Message
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;

