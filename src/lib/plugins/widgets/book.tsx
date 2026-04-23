import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WidgetPlugin } from "./types";

function BookWidget() {
  const BOOK_WIDTH = 180;
  const BOOK_HEIGHT = 260;
  const BOOK_DEPTH = 22;

  return (
    <div className="group hover:border-foreground/20 from-primary/5 via-background to-primary/10 overflow-hidden rounded-[var(--radius)] border bg-gradient-to-br p-5 transition-colors">
      <style>{`
        @keyframes bookFlip {
          0%   { transform: rotateY(0deg); }
          30%  { transform: rotateY(18deg); }
          50%  { transform: rotateY(18deg); }
          80%  { transform: rotateY(-18deg); }
          100% { transform: rotateY(-18deg); }
        }
        @keyframes bookReturn {
          0%   { transform: rotateY(-18deg); }
          100% { transform: rotateY(0deg); }
        }
        @keyframes lightGlow {
          0%   { opacity: 0; }
          30%  { opacity: 0.25; }
          50%  { opacity: 0.2; }
          80%  { opacity: 0.35; }
          100% { opacity: 0.3; }
        }
        @keyframes lightFade {
          0%   { opacity: 0.3; }
          100% { opacity: 0; }
        }
        .book-3d-anim {
          animation: bookReturn 0.5s ease-out forwards;
        }
        .book-3d-anim:hover {
          animation: bookFlip 2.5s ease-in-out forwards;
        }
        .light-anim {
          animation: lightFade 0.5s ease-out forwards;
        }
        .light-anim:hover {
          animation: lightGlow 2.5s ease-in-out forwards;
        }
      `}</style>

      {/* 3D Book Container */}
      <div className="flex flex-col items-center gap-4">
        {/* Perspective container */}
        <Link
          href="https://fka.gumroad.com/l/art-of-chatgpt-prompting"
          className="block"
          style={{ perspective: "800px" }}
        >
          {/* 3D transform container */}
          <div
            className="book-3d-anim relative"
            style={{
              width: BOOK_WIDTH,
              height: BOOK_HEIGHT,
              transformStyle: "preserve-3d",
            }}
          >
            {/* FRONT: Book Cover */}
            <div className="absolute inset-0 overflow-hidden rounded-sm shadow-xl transition-shadow duration-300 group-hover:shadow-2xl">
              <Image
                src="/book-cover.jpg"
                alt="The Interactive Book of Prompting"
                fill
                className="object-cover"
              />
              {/* Subtle radial light glow from top-right */}
              <div
                className="light-anim pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 85% 15%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 30%, transparent 60%)",
                }}
              />
            </div>

            {/* Drop shadow under book */}
            <div className="absolute -bottom-3 left-1/2 h-4 w-24 -translate-x-1/2 rounded-full bg-black/20 opacity-50 blur-md transition-all duration-300 group-hover:w-28 group-hover:opacity-80 group-hover:blur-lg" />

            {/* RIGHT: Pages edge - extends backward from cover's right */}
            <div
              className="absolute top-0"
              style={{
                width: BOOK_DEPTH,
                height: BOOK_HEIGHT,
                right: 0,
                transform: "rotateY(-90deg)",
                transformOrigin: "right center",
                background:
                  "repeating-linear-gradient(to bottom, #f8f8f8 0px, #e0e0e0 1px, #f8f8f8 2px)",
              }}
            />

            {/* LEFT: Spine edge - extends backward from cover's left */}
            <div
              className="absolute top-0 rounded-l-sm"
              style={{
                width: BOOK_DEPTH,
                height: BOOK_HEIGHT,
                left: 0,
                transform: "rotateY(90deg)",
                transformOrigin: "left center",
                background: "linear-gradient(to right, #1a3535, #234848)",
              }}
            />
          </div>
        </Link>

        {/* Content */}
        <div className="w-full text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <BookOpen className="text-primary h-4 w-4" />
            <span className="text-primary text-xs font-medium">Free Interactive Guide</span>
          </div>
          <h3 className="mb-1.5 text-base font-semibold">The Interactive Book of Prompting</h3>
          <p className="text-muted-foreground mb-4 text-xs">
            Master AI prompting with 25 interactive chapters.
          </p>
          <Button asChild size="sm" className="w-full">
            <Link href="https://fka.gumroad.com/l/art-of-chatgpt-prompting">
              Start Reading
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const bookWidget: WidgetPlugin = {
  id: "book",
  name: "The Interactive Book of Prompting",
  prompts: [
    {
      id: "book-promo",
      slug: "interactive-book-of-prompting",
      title: "The Interactive Book of Prompting",
      description:
        "Master the art of crafting effective AI prompts with our comprehensive interactive guide.",
      content: "",
      type: "TEXT",
      tags: ["Prompting", "AI", "Guide", "Learning"],
      category: "Education",
      actionUrl: "https://fka.gumroad.com/l/art-of-chatgpt-prompting",
      actionLabel: "Read the Book",
      positioning: {
        position: 10,
        mode: "repeat",
        repeatEvery: 60,
        maxCount: 4,
      },
      shouldInject: () => {
        return true;
      },
      render: () => <BookWidget />,
    },
  ],
};
