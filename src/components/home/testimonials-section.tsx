import Link from "next/link";
import Image from "next/image";
import { Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  date: string;
  image: string;
  text: string;
  href: string;
}

export function TestimonialsSection({ t }: { t: (key: string) => string }) {
  const testimonials: Testimonial[] = [
    {
      name: "Greg Brockman",
      role: "President & Co-Founder at OpenAI",
      date: "Dec 12, 2022",
      image: "/sponsors/gdb.jpg",
      text: "Love the community explorations of ChatGPT, from capabilities (https://github.com/f/awesome-chatgpt-prompts) to limitations (...). No substitute for the collective power of the internet when it comes to plumbing the uncharted depths of a new deep learning model.",
      href: "https://x.com/gdb/status/1602072566671110144"
    },
    {
      name: "Wojciech Zaremba",
      role: "Co-Founder at OpenAI",
      date: "Dec 10, 2022",
      image: "/sponsors/woj.jpg",
      text: "I love it! https://github.com/f/awesome-chatgpt-prompts",
      href: "https://x.com/woj_zaremba/status/1601362952841760769"
    },
    {
      name: "Clement Delangue",
      role: "CEO at Hugging Face",
      date: "Sep 3, 2024",
      image: "/sponsors/clem.png",
      text: "Keep up the great work!",
      href: "https://x.com/clementdelangue/status/1830976369389642059"
    },
    {
      name: "Thomas Dohmke",
      role: "Former CEO at GitHub",
      date: "Feb 5, 2025",
      image: "https://github.com/ashtom.png",
      text: "You can now pass prompts to Copilot Chat via URL. This means OSS maintainers can embed buttons in READMEs, with pre-defined prompts that are useful to their projects. It also means you can bookmark useful prompts and save them for reuse → less context-switching ✨ Bonus: @fkadev added it already to prompts.chat 🚀",
      href: "https://x.com/ashtom/status/1887250944427237816"
    }
  ];

  return (
    <div className="mt-6 pt-6 border-t">
      <p className="text-center text-xs text-muted-foreground mb-6">{t("achievements.lovedByPioneers")}</p>
      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {testimonials.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-5 rounded-lg border bg-muted/30 overflow-hidden hover:border-primary/50 transition-colors"
          >
            <Quote className="absolute top-3 right-3 h-16 w-16 text-muted-foreground/10 -rotate-12" />
            <div className="relative z-10 flex flex-col gap-3 h-full">
              <div className="flex items-center gap-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role} · {item.date}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed">&ldquo;{item.text}&rdquo;</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
