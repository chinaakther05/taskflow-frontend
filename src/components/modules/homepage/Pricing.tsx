
import {
  Check,
  Sparkles,
  Zap,
  Building2,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Perfect for small teams getting started.",
    price: "$0",
    period: "forever",
    icon: Zap,
    features: [
      "Up to 3 team members",
      "3 active projects",
      "Task management",
      "Basic team collaboration",
      "Basic progress tracking",
    ],
    button: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "Everything growing teams need to work smarter.",
    price: "$12",
    period: "per user / month",
    icon: Sparkles,
    features: [
      "Unlimited team members",
      "Unlimited projects",
      "Advanced task management",
      "Team collaboration",
      "Progress tracking",
      "Time tracking",
      "Priority support",
    ],
    button: "Start Pro Plan",
    highlighted: true,
  },
  {
    name: "Business",
    description: "Powerful tools for larger organizations.",
    price: "$29",
    period: "per user / month",
    icon: Building2,
    features: [
      "Everything in Pro",
      "Advanced permissions",
      "Detailed activity tracking",
      "Advanced reporting",
      "Organization management",
      "Dedicated support",
    ],
    button: "Choose Business",
    highlighted: false,
  },
];

const Pricing = () => {
  return (
    <section className="w-full border-b">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Simple pricing
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Choose the plan that fits your team
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Start for free and upgrade when your team needs more powerful
            tools and collaboration features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  plan.highlighted
                    ? "border-blue-600 shadow-lg shadow-blue-600/10"
                    : ""
                }`}
              >
                {/* Popular Badge */}
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">
                    Most Popular
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    plan.highlighted
                      ? "bg-blue-600 text-white"
                      : "bg-blue-600/10 text-blue-600"
                  }`}
                >
                  <Icon className="size-5" />
                </div>

                {/* Plan Info */}
                <h3 className="mt-6 text-xl font-semibold">
                  {plan.name}
                </h3>

                <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-6">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold tracking-tight">
                      {plan.price}
                    </span>

                    <span className="pb-1 text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <button
                  type="button"
                  className={`mt-7 h-11 rounded-lg px-4 text-sm font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border bg-background hover:bg-muted"
                  }`}
                >
                  {plan.button}
                </button>

                {/* Divider */}
                <div className="my-7 border-t" />

                {/* Features */}
                <div className="flex-1">
                  <p className="mb-4 text-sm font-semibold">
                    What&apos;s included:
                  </p>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-blue-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <Check className="size-4 text-green-600" />
          No long-term commitment. Upgrade or cancel whenever you want.
        </div>
      </div>
    </section>
  );
};

export default Pricing;

