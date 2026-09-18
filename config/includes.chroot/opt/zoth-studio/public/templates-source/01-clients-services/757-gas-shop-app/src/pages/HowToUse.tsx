import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  UserPlus,
  ShoppingBag,
  CreditCard,
  Wallet,
  Smartphone,
  Rocket,
  Link as LinkIcon,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Clock,
  ShieldCheck,
  Mail,
  MapPin,
  Eye,
  Zap,
  Gem,
  Leaf,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const basicsSteps: Step[] = [
  {
    title: 'Create your account',
    description:
      'Sign up with your email and password on the landing page. You will get a verification email — click the link to activate your account.',
    icon: <UserPlus className="h-5 w-5" />,
  },
  {
    title: 'Verify your age',
    description:
      'On first visit you will see an age-gate. Confirm you are of legal age to continue. This keeps the platform compliant and secure.',
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: 'Browse the Live Menu',
    description:
      'The Shop page shows everything in stock right now. Use the search bar or filter by type (Indica, Sativa, Hybrid) to narrow down your picks.',
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: 'Understand Past Rotation',
    description:
      'Out-of-stock strains appear in the Past Rotation gallery below the Live Menu. You can not buy them right now, but they often rotate back in throughout the year.',
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: 'Add to cart',
    description:
      'Pick a weight option and tap the plus button. If a variant is out of stock it will be crossed out. Your cart count appears in the top navigation.',
    icon: <Zap className="h-5 w-5" />,
  },
];

const intermediateSteps: Step[] = [
  {
    title: 'What are credits?',
    description:
      'Credits are your in-app balance. Every order deducts credits from your wallet. Think of it like store credit — fast, private, and tracked in one place.',
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    title: 'Top up with Cash App',
    description:
      'Go to the Wallet page. Under "Buy credits" you will see Cash App instructions. Send to $t757gs, include your registered email in the note, and credits post within 2 hours.',
    icon: <Smartphone className="h-5 w-5" />,
  },
  {
    title: 'Check your balance',
    description:
      'Your balance is visible in the header on desktop and inside the mobile menu. The Wallet page shows deposits, charges, and total activity.',
    icon: <Wallet className="h-5 w-5" />,
  },
  {
    title: 'Low-balance alert',
    description:
      'When you log in with less than 20 credits, a popup reminds you to top up so you are ready to check out. You can dismiss it and browse normally.',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: 'Place an order',
    description:
      'Go to Cart → Checkout. Review your items, confirm your balance covers the total, and place the order. You will be redirected to your order details.',
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    title: 'Track your order',
    description:
      'Visit the Orders page to see status, pickup details, and any messages. Each order gets its own detail page with a unique code for reference.',
    icon: <MapPin className="h-5 w-5" />,
  },
];

const advancedSteps: Step[] = [
  {
    title: 'Enable Advanced Mode',
    description:
      'On the Wallet or Profile page, toggle Advanced Mode. This unlocks Solana wallet linking and DePay checkout options. You can disable it anytime to keep the simple Cash App flow.',
    icon: <Rocket className="h-5 w-5" />,
  },
  {
    title: 'Link a Solana wallet',
    description:
      'In Advanced Mode, visit your Profile and follow the wallet-linking steps. Install Phantom if you do not have it, then sign a message to verify ownership. No seed phrase is ever shared with us.',
    icon: <LinkIcon className="h-5 w-5" />,
  },
  {
    title: 'Top up with DePay',
    description:
      'With a linked wallet and Advanced Mode on, the Wallet page shows DePay checkout links. Choose an amount, pay with USDC on Solana, and credits are added automatically.',
    icon: <Gem className="h-5 w-5" />,
  },
  {
    title: 'Generate AI order art',
    description:
      'After checkout, some orders let you generate a unique digital art piece tied to your purchase. This is optional and appears on the order detail page when available.',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: 'Customize your profile',
    description:
      'Choose an avatar, set a username, pick strain preferences, and add your Cash App $Cashtag. Preferences help highlight products that match your usual picks.',
    icon: <Leaf className="h-5 w-5" />,
  },
];

const faqs = [
  {
    q: 'Do I need a crypto wallet to use the app?',
    a: 'No. Cash App is the default payment method and works without any wallet. Advanced Mode unlocks crypto options for users who prefer them.',
  },
  {
    q: 'How long do Cash App credits take to post?',
    a: 'Usually within minutes, but allow up to 2 hours. Always include your registered email in the Cash App note so we can match the payment.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. We only store what is needed for orders and wallet tracking. No payment data is kept on our servers — Cash App and DePay handle payments externally.',
  },
  {
    q: 'Can I cancel an order?',
    a: 'Contact support@757gas.shop as soon as possible. Cancellations are handled case-by-case depending on pickup status.',
  },
  {
    q: 'What happens when a strain I liked comes back?',
    a: 'Past Rotation strains return based on seasonal availability. Check the Shop page regularly or browse the Past Rotation gallery to see what has rotated before.',
  },
];

function SectionCard({
  level,
  title,
  subtitle,
  steps,
  accent,
}: {
  level: string;
  title: string;
  subtitle: string;
  steps: Step[];
  accent: string;
}) {
  const [open, setOpen] = useState(true);

  return (
    <section className="rounded-[1.8rem] border border-border bg-card overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center justify-center h-8 w-8 rounded-lg text-xs font-extrabold ${accent}`}
          >
            {level}
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-6 space-y-4">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-[1.35rem] border border-border bg-background p-4 sm:p-5"
                >
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0 mt-0.5">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default function HowToUse() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-24">
      <Helmet>
        <title>How to Use | 757 Gas Shop</title>
        <meta
          name="description"
          content="Learn how to use 757 Gas Shop — from basics to advanced features."
        />
      </Helmet>

      {/* Hero */}
      <div className="rounded-[1.8rem] border border-border bg-card p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Guide
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            How to Use{' '}
            <span className="text-gradient">757 Gas Shop</span>
          </h1>
          <p className="text-muted-foreground text-lead max-w-xl">
            Everything you need to know — whether you are brand new, getting comfortable, or ready for the full experience.
          </p>
        </div>
      </div>

      {/* Sections */}
      <SectionCard
        level="01"
        title="Getting Started"
        subtitle="The basics — account, age gate, browsing, and cart"
        steps={basicsSteps}
        accent="bg-green-500/10 text-green-500"
      />

      <SectionCard
        level="02"
        title="Wallet & Orders"
        subtitle="Credits, Cash App top-ups, checkout, and tracking"
        steps={intermediateSteps}
        accent="bg-primary/10 text-primary"
      />

      <SectionCard
        level="03"
        title="Advanced Features"
        subtitle="Crypto mode, wallet linking, DePay, and AI art"
        steps={advancedSteps}
        accent="bg-purple-500/10 text-purple-400"
      />

      {/* FAQ */}
      <section className="rounded-[1.8rem] border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-extrabold tracking-tight">Common Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-[1.35rem] border border-border bg-background overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-muted/30 transition-colors"
              >
                <span className="font-bold text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300 ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 sm:px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-[1.8rem] border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center">
        <h3 className="text-xl font-extrabold tracking-tight mb-2">Ready to browse?</h3>
        <p className="text-muted-foreground text-sm mb-5">
          Head to the Live Menu and see what is in stock right now.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 btn-premium text-primary-foreground px-6 py-3 rounded-xl font-bold"
        >
          <ShoppingBag className="h-4 w-4" />
          Open Live Menu
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Support */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Still have questions?{' '}
          <a
            href="mailto:support@757gas.shop"
            className="text-primary hover:underline font-medium inline-flex items-center gap-1"
          >
            <Mail className="h-3.5 w-3.5" />
            support@757gas.shop
          </a>
        </p>
      </div>
    </div>
  );
}
