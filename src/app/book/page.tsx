import Link from "next/link";
import Image from "next/image";
import { Schoolbell } from "next/font/google";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Brain,
  Layers,
  Target,
  Lightbulb,
  Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { PixelRobot } from "@/components/kids/elements/pixel-art";
import { safeJsonLd } from "@/lib/format";

const kidsFont = Schoolbell({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "The Interactive Book of Prompting | Free Online Guide to AI Prompt Engineering",
  description:
    "Master AI prompt engineering with this free, interactive guide. Learn ChatGPT prompts, chain-of-thought reasoning, few-shot learning, and advanced techniques. 25+ chapters with real examples.",
  keywords: [
    "prompt engineering",
    "ChatGPT prompts",
    "AI prompts",
    "prompt engineering guide",
    "prompt engineering book",
    "how to write prompts",
    "AI prompt techniques",
    "chain of thought prompting",
    "few-shot learning",
    "prompt chaining",
    "system prompts",
    "LLM prompts",
    "GPT prompts",
    "Claude prompts",
    "AI communication",
  ],
  authors: [{ name: "bl1nk Team", url: "https://github.com/f" }],
  creator: "bl1nk Team",
  publisher: "agent.bl1nk.site",
  openGraph: {
    title: "The Interactive Book of Prompting",
    description:
      "Master AI prompt engineering with this free, interactive guide. Learn ChatGPT prompts, chain-of-thought reasoning, few-shot learning, and 25+ chapters of advanced techniques.",
    url: "https://agent.bl1nk.site/book",
    siteName: "agent.bl1nk.site",
    images: [
      {
        url: "https://agent.bl1nk.site/book-cover-photo.jpg",
        width: 1200,
        height: 630,
        alt: "The Interactive Book of Prompting - Free AI Prompt Engineering Guide",
      },
    ],
    locale: "en_US",
    type: "book",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Interactive Book of Prompting",
    description:
      "Master AI prompt engineering with this free, interactive guide. 25+ chapters with real examples.",
    images: ["https://agent.bl1nk.site/book-cover-photo.jpg"],
    creator: "@bl1nk_bot",
  },
  alternates: {
    canonical: "https://agent.bl1nk.site/book",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: "The Interactive Book of Prompting",
  alternateName: "AI Prompt Engineering Guide",
  description:
    "Master AI prompt engineering with this free, interactive guide. Learn ChatGPT prompts, chain-of-thought reasoning, few-shot learning, and advanced techniques.",
  author: {
    "@type": "Person",
    name: "bl1nk Team",
    url: "https://github.com/f",
  },
  publisher: {
    "@type": "Organization",
    name: "agent.bl1nk.site",
    url: "https://agent.bl1nk.site",
  },
  url: "https://agent.bl1nk.site/book",
  image: "https://agent.bl1nk.site/book-cover-photo.jpg",
  inLanguage: "en",
  genre: ["Technology", "Education", "Artificial Intelligence"],
  about: {
    "@type": "Thing",
    name: "Prompt Engineering",
  },
  isAccessibleForFree: true,
  numberOfPages: 25,
  bookFormat: "https://schema.org/EBook",
  license: "https://creativecommons.org/publicdomain/zero/1.0/",
};

export default function BookHomePage() {
  const highlights = [
    { icon: Brain, text: "Understanding how AI models think and process prompts" },
    { icon: Target, text: "Crafting clear, specific, and effective prompts" },
    {
      icon: Layers,
      text: "Advanced techniques: chain-of-thought, few-shot learning, and prompt chaining",
    },
    { icon: Sparkles, text: "Interactive examples you can try directly in the browser" },
    { icon: Lightbulb, text: "Real-world use cases for writing, coding, education, and business" },
    { icon: BookOpen, text: "The future of prompting: agents and agentic systems" },
  ];

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <div className="max-w-2xl">
        {/* Book Cover Image */}
        <div className="mb-10">
          <div className="relative aspect-video overflow-hidden rounded-lg shadow-2xl">
            <Image
              src="/book-cover-photo.jpg"
              alt="The Interactive Book of Prompting"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Book Cover Header */}
        <div className="mb-10">
          <p className="text-muted-foreground mb-4 text-sm">An Interactive Guide by</p>
          <h2 className="mb-6 text-lg font-medium">bl1nk Team</h2>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            The Interactive Book of Prompting
          </h1>
          <p className="text-muted-foreground text-xl">
            An Interactive Guide to Crafting Clear and Effective Prompts
          </p>
        </div>

        {/* Author Introduction */}
        <div className="text-muted-foreground mb-10 space-y-4">
          <p>
            Hi, I&apos;m <strong className="text-foreground">bl1nk Team</strong>, the curator of the
            popular{" "}
            <a
              href="https://github.com/bl1nk-bot/agent-library"
              className="text-primary hover:underline"
            >
              Agent Library
            </a>{" "}
            repository on GitHub and <strong className="text-foreground">agent.bl1nk.site</strong>.
          </p>
          <p>
            In this comprehensive and interactive guide, you&apos;ll discover expert strategies for
            crafting compelling AI prompts that drive engaging and effective conversations. From
            understanding how AI models work to mastering advanced techniques like prompt chaining
            and agentic systems, this book provides you with the tools you need to take your AI
            interactions to the next level.
          </p>
        </div>

        {/* Highlights */}
        <div className="mb-10">
          <h3 className="text-foreground mb-4 text-sm font-semibold">What you&apos;ll learn:</h3>
          <div className="space-y-3">
            {highlights.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <item.icon className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <span className="text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Book Structure */}
        <div className="bg-muted/30 mb-10 rounded-lg p-6">
          <h3 className="text-foreground mb-3 text-sm font-semibold">Book Structure</h3>
          <div className="text-muted-foreground grid grid-cols-2 gap-2 text-sm">
            <div>• Introduction</div>
            <div>• Part 1: Foundations</div>
            <div>• Part 2: Techniques</div>
            <div>• Part 3: Advanced Strategies</div>
            <div>• Part 4: Best Practices</div>
            <div>• Part 5: Use Cases</div>
            <div>• Part 6: Conclusion</div>
            <div>• 25 Interactive Chapters</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mb-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/book/00a-preface">
              Start Reading
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/book/01-understanding-ai-models">Skip to Chapter 1</Link>
          </Button>
        </div>

        {/* Note */}
        <div className="text-muted-foreground text-sm italic">
          <p>This book is continuously updated with new techniques and insights as AI evolves.</p>
        </div>

        {/* Kids Playable Book Section */}
        <div className="mt-10 rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 dark:border-amber-800 dark:from-amber-950/30 dark:to-orange-950/30">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="shrink-0">
              <PixelRobot className="h-20 w-16" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="mb-1 text-lg text-amber-800 dark:text-amber-200">
                Are you a school teacher or a parent?
              </p>
              <h3
                className={`pixel-text-shadow mb-3 text-2xl font-bold text-amber-900 md:text-3xl dark:text-amber-100 ${kidsFont.className}`}
              >
                Try our Playable Book for Kids! 🎮
              </h3>
              <p className="mb-4 text-sm text-amber-700 dark:text-amber-300">
                An interactive, game-based adventure to teach children (ages 8-14) how to
                communicate with AI through fun puzzles and stories.
              </p>
              <Button asChild className="bg-green-500 text-white hover:bg-green-600">
                <a href="/kids">
                  <Gamepad2 className="mr-2 h-4 w-4" />
                  Start Playing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-muted-foreground mt-12 border-t pt-6 text-sm">
          <p>
            Part of the{" "}
            <a
              href="https://github.com/bl1nk-bot/agent-library"
              className="text-primary hover:underline"
            >
              Agent Library
            </a>{" "}
            project. Licensed under CC0.
          </p>
        </div>
      </div>
    </>
  );
}
