"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Tokenizer Demo Component - simulates BPE-style tokenization
function simulateTokenization(text: string): string[] {
  if (!text) return [];

  const tokens: string[] = [];
  let i = 0;

  while (i < text.length) {
    if (text[i] === " ") {
      let chunk = " ";
      i++;
      const chunkLen = Math.min(2 + Math.floor(Math.random() * 3), text.length - i);
      for (let j = 0; j < chunkLen && i < text.length && text[i] !== " "; j++) {
        chunk += text[i];
        i++;
      }
      tokens.push(chunk);
    } else if (/[.,!?;:'"()\[\]{}]/.test(text[i])) {
      tokens.push(text[i]);
      i++;
    } else {
      const chunkLen = Math.min(2 + Math.floor(Math.random() * 3), text.length - i);
      let chunk = "";
      for (
        let j = 0;
        j < chunkLen && i < text.length && text[i] !== " " && !/[.,!?;:'"()\[\]{}]/.test(text[i]);
        j++
      ) {
        chunk += text[i];
        i++;
      }
      if (chunk) tokens.push(chunk);
    }
  }

  return tokens;
}

const sampleTokenizations: Record<string, string[]> = {
  "Hello, world!": ["Hel", "lo", ",", " wor", "ld", "!"],
  Unbelievable: ["Un", "bel", "iev", "able"],
  "ChatGPT is amazing": ["Chat", "GPT", " is", " amaz", "ing"],
  "The quick brown fox": ["The", " qui", "ck", " bro", "wn", " fox"],
  "Prompt engineering": ["Prom", "pt", " eng", "ine", "ering"],
  "Artificial Intelligence": ["Art", "ific", "ial", " Int", "ell", "igen", "ce"],
};

export function TokenizerDemo() {
  const [input, setInput] = useState("Hello, world!");
  const [tokens, setTokens] = useState<string[]>(sampleTokenizations["Hello, world!"]);

  const handleInputChange = (value: string) => {
    setInput(value);
    if (sampleTokenizations[value]) {
      setTokens(sampleTokenizations[value]);
    } else {
      setTokens(simulateTokenization(value));
    }
  };

  const tokenColors = [
    "bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700",
    "bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700",
    "bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700",
    "bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700",
    "bg-pink-100 dark:bg-pink-900/50 border-pink-300 dark:border-pink-700",
    "bg-cyan-100 dark:bg-cyan-900/50 border-cyan-300 dark:border-cyan-700",
  ];

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 border-b px-4 py-3">
        <span className="font-semibold">Tokenizer Demo</span>
        <span className="text-muted-foreground ml-2 text-sm">
          See how text is split into tokens
        </span>
      </div>
      <div className="space-y-4 p-4">
        <div>
          <label className="text-muted-foreground mb-1 block text-sm">Enter text:</label>
          <input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            className="bg-background focus:ring-primary/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            placeholder="Type something..."
          />
        </div>
        <div>
          <div className="text-muted-foreground mb-2 text-sm">Tokens ({tokens.length}):</div>
          <div className="flex flex-wrap gap-1">
            {tokens.map((token, i) => (
              <span
                key={i}
                className={cn(
                  "rounded border px-2 py-1 font-mono text-sm",
                  tokenColors[i % tokenColors.length]
                )}
              >
                {token === " " ? "␣" : token}
              </span>
            ))}
          </div>
        </div>
        <div className="text-muted-foreground text-xs">
          Try: "Unbelievable", "ChatGPT is amazing", or type your own text
        </div>
      </div>
    </div>
  );
}

// Context Window Demo Component
export function ContextWindowDemo() {
  const [promptLength, setPromptLength] = useState(2000);
  const [responseLength, setResponseLength] = useState(1000);
  const contextLimit = 8000;

  const totalUsed = promptLength + responseLength;
  const remaining = Math.max(0, contextLimit - totalUsed);
  const isOverLimit = totalUsed > contextLimit;

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 border-b px-4 py-3">
        <span className="font-semibold">Context Window Visualizer</span>
        <span className="text-muted-foreground ml-2 text-sm">
          Understand how context is consumed
        </span>
      </div>
      <div className="space-y-6 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Context Window: {contextLimit.toLocaleString()} tokens</span>
            <span
              className={cn(
                "font-mono",
                isOverLimit
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              )}
            >
              {remaining.toLocaleString()} remaining
            </span>
          </div>
          <div className="bg-muted flex h-8 overflow-hidden rounded-lg">
            <div
              className="flex items-center justify-center bg-blue-500 text-xs font-medium text-white transition-all duration-300"
              style={{ width: `${Math.min((promptLength / contextLimit) * 100, 100)}%` }}
            >
              {promptLength > 500 && "Prompt"}
            </div>
            <div
              className={cn(
                "flex items-center justify-center text-xs font-medium text-white transition-all duration-300",
                isOverLimit ? "bg-red-500" : "bg-green-500"
              )}
              style={{
                width: `${Math.min((responseLength / contextLimit) * 100, 100 - (promptLength / contextLimit) * 100)}%`,
              }}
            >
              {responseLength > 500 && "Response"}
            </div>
          </div>
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>0</span>
            <span>{(contextLimit / 2).toLocaleString()}</span>
            <span>{contextLimit.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 flex justify-between text-sm">
              <span>Your Prompt</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">
                {promptLength.toLocaleString()} tokens
              </span>
            </label>
            <input
              type="range"
              min="100"
              max="6000"
              value={promptLength}
              onChange={(e) => setPromptLength(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 flex justify-between text-sm">
              <span>AI Response</span>
              <span className="font-mono text-green-600 dark:text-green-400">
                {responseLength.toLocaleString()} tokens
              </span>
            </label>
            <input
              type="range"
              min="100"
              max="4000"
              value={responseLength}
              onChange={(e) => setResponseLength(Number(e.target.value))}
              className="w-full accent-green-500"
            />
          </div>
        </div>

        <div
          className={cn(
            "rounded-lg p-3 text-sm",
            isOverLimit
              ? "border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
              : "border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
          )}
        >
          {isOverLimit ? (
            <p>
              <span className="font-bold">Context overflow!</span> Your prompt + response exceeds
              the context window. The model will truncate or fail. Try reducing your prompt length
              or requesting shorter responses.
            </p>
          ) : (
            <p>
              <span className="font-bold">Tip:</span> Both your prompt AND the AI's response must
              fit within the context window. Long prompts leave less room for responses. Prioritize
              important information at the start of your prompt.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Temperature Demo Component
export function TemperatureDemo() {
  const [temperature, setTemperature] = useState(0.7);

  const getOutputExamples = (temp: number): string[] => {
    if (temp <= 0.2) {
      return [
        "The capital of France is Paris.",
        "The capital of France is Paris.",
        "The capital of France is Paris.",
      ];
    } else if (temp <= 0.5) {
      return [
        "The capital of France is Paris.",
        "Paris is the capital of France.",
        "The capital of France is Paris, a major European city.",
      ];
    } else if (temp <= 0.8) {
      return [
        "Paris serves as France's capital city.",
        "The capital of France is Paris, known for the Eiffel Tower.",
        "France's capital is the beautiful city of Paris.",
      ];
    } else {
      return [
        "Paris, the City of Light, proudly serves as France's capital!",
        "The romantic capital of France is none other than Paris.",
        "France chose Paris as its capital, a city of art and culture.",
      ];
    }
  };

  const getLabel = (temp: number): { text: string; color: string } => {
    if (temp <= 0.3) return { text: "Deterministic", color: "text-blue-600 dark:text-blue-400" };
    if (temp <= 0.6) return { text: "Balanced", color: "text-green-600 dark:text-green-400" };
    if (temp <= 0.8) return { text: "Creative", color: "text-amber-600 dark:text-amber-400" };
    return { text: "Very Creative", color: "text-pink-600 dark:text-pink-400" };
  };

  const label = getLabel(temperature);
  const examples = getOutputExamples(temperature);

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 border-b px-4 py-3">
        <span className="font-semibold">Temperature Demo</span>
        <span className="text-muted-foreground ml-2 text-sm">
          See how randomness affects outputs
        </span>
      </div>
      <div className="space-y-4 p-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm">Temperature</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg">{temperature.toFixed(1)}</span>
              <span className={cn("text-sm font-medium", label.color)}>{label.text}</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-muted-foreground mt-1 flex justify-between text-xs">
            <span>0.0 (Focused)</span>
            <span>1.0 (Random)</span>
          </div>
        </div>

        <div>
          <div className="text-muted-foreground mb-2 text-sm">
            Prompt: "What is the capital of France?"
          </div>
          <div className="mb-2 text-sm font-medium">Possible responses at this temperature:</div>
          <div className="space-y-2">
            {examples.map((example, i) => (
              <div key={i} className="bg-muted/50 rounded p-2 font-mono text-sm">
                {example}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg border p-3 text-sm">
          <span className="font-bold">Use low temperature</span> for factual, consistent answers.{" "}
          <span className="font-bold">Use high temperature</span> for creative writing and
          brainstorming.
        </div>
      </div>
    </div>
  );
}

// Structured Output Demo Component
export function StructuredOutputDemo() {
  const [activeFormat, setActiveFormat] = useState<"unstructured" | "json" | "table">(
    "unstructured"
  );

  const outputs = {
    unstructured: `Here are some popular programming languages: Python is great for data science and AI. JavaScript is used for web development. Rust is known for performance and safety. Go is good for backend services. Each has its strengths depending on your use case.`,
    json: `{
  "languages": [
    {
      "name": "Python",
      "best_for": ["data science", "AI"],
      "difficulty": "easy"
    },
    {
      "name": "JavaScript", 
      "best_for": ["web development"],
      "difficulty": "medium"
    },
    {
      "name": "Rust",
      "best_for": ["performance", "safety"],
      "difficulty": "hard"
    },
    {
      "name": "Go",
      "best_for": ["backend services"],
      "difficulty": "medium"
    }
  ]
}`,
    table: `| Language   | Best For            | Difficulty |
|------------|---------------------|------------|
| Python     | Data science, AI    | Easy       |
| JavaScript | Web development     | Medium     |
| Rust       | Performance, Safety | Hard       |
| Go         | Backend services    | Medium     |`,
  };

  const benefits = {
    unstructured: [
      { text: "Parse programmatically", supported: false },
      { text: "Compare across queries", supported: false },
      { text: "Integrate into workflows", supported: false },
      { text: "Validate for completeness", supported: false },
    ],
    json: [
      { text: "Parse programmatically", supported: true },
      { text: "Compare across queries", supported: true },
      { text: "Integrate into workflows", supported: true },
      { text: "Validate for completeness", supported: true },
    ],
    table: [
      { text: "Parse programmatically", supported: true },
      { text: "Compare across queries", supported: true },
      { text: "Integrate into workflows", supported: false },
      { text: "Validate for completeness", supported: true },
    ],
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 border-b px-4 py-3">
        <span className="font-semibold">Structured Output Demo</span>
        <span className="text-muted-foreground ml-2 text-sm">
          See the difference structure makes
        </span>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex gap-2">
          {(["unstructured", "json", "table"] as const).map((format) => (
            <button
              key={format}
              onClick={() => setActiveFormat(format)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                activeFormat === format
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {format === "unstructured" ? "Unstructured" : format.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 text-sm font-medium">Output:</div>
            <pre className="bg-muted/50 max-h-48 overflow-x-auto rounded-lg p-3 font-mono text-xs whitespace-pre-wrap">
              {outputs[activeFormat]}
            </pre>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">You can:</div>
            <div className="space-y-2">
              {benefits[activeFormat].map((benefit, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-2 rounded-lg p-2 text-sm transition-colors",
                    benefit.supported
                      ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300"
                      : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
                  )}
                >
                  {benefit.supported ? (
                    <Check className="h-4 w-4 shrink-0" />
                  ) : (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center">✗</span>
                  )}
                  {benefit.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="mb-2 text-sm font-medium">Parse programmatically:</div>
          {activeFormat === "unstructured" ? (
            <div className="rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-800 dark:bg-red-950/20">
              <div className="font-mono text-xs whitespace-pre-wrap text-red-700 dark:text-red-300">
                {`// ❌ Complex regex or NLP required
const languages = text.match(/([A-Z][a-z]+) is (?:great for|used for|known for|good for) (.+?)\\./g);
// Unreliable, breaks with slight wording changes`}
              </div>
            </div>
          ) : activeFormat === "json" ? (
            <div className="rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-800 dark:bg-green-950/20">
              <div className="font-mono text-xs whitespace-pre-wrap text-green-700 dark:text-green-300">
                {`// ✓ Simple and reliable
const data = JSON.parse(response);
const pythonInfo = data.languages.find(l => l.name === "Python");
console.log(pythonInfo.best_for); // ["data science", "AI"]`}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-800 dark:bg-green-950/20">
              <div className="font-mono text-xs whitespace-pre-wrap text-green-700 dark:text-green-300">
                {`// ✓ Parseable with markdown library
const rows = parseMarkdownTable(response);
const pythonRow = rows.find(r => r.Language === "Python");
console.log(pythonRow["Best For"]); // "Data science, AI"`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Few-Shot Demo Component
export function FewShotDemo() {
  const [exampleCount, setExampleCount] = useState(0);

  const examples = [
    { input: "I love this product!", output: "Positive" },
    { input: "Terrible experience, waste of money", output: "Negative" },
    { input: "It's okay, nothing special", output: "Neutral" },
  ];

  const testCase = { input: "Great quality but shipping was slow", expected: "Mixed" };

  const getModelConfidence = (
    count: number
  ): { label: string; confidence: number; correct: boolean } => {
    if (count === 0) return { label: "Positive", confidence: 45, correct: false };
    if (count === 1) return { label: "Positive", confidence: 62, correct: false };
    if (count === 2) return { label: "Mixed", confidence: 71, correct: true };
    return { label: "Mixed", confidence: 94, correct: true };
  };

  const result = getModelConfidence(exampleCount);

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 border-b px-4 py-3">
        <span className="font-semibold">Few-Shot Learning Demo</span>
        <span className="text-muted-foreground ml-2 text-sm">
          See how examples improve accuracy
        </span>
      </div>
      <div className="space-y-4 p-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm">Number of examples</span>
            <span className="font-mono text-lg">{exampleCount}</span>
          </div>
          <input
            type="range"
            min="0"
            max="3"
            value={exampleCount}
            onChange={(e) => setExampleCount(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-muted-foreground mt-1 flex justify-between text-xs">
            <span>Zero-shot</span>
            <span>One-shot</span>
            <span>Two-shot</span>
            <span>Three-shot</span>
          </div>
        </div>

        {exampleCount > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Examples provided:</div>
            {examples.slice(0, exampleCount).map((ex, i) => (
              <div key={i} className="bg-muted/50 flex gap-2 rounded p-2 text-sm">
                <span className="text-muted-foreground shrink-0">"{ex.input}"</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-semibold">{ex.output}</span>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-4">
          <div className="mb-2 text-sm font-medium">Test input:</div>
          <div className="bg-muted/30 mb-3 rounded-lg p-3">
            <span className="font-mono text-sm">"{testCase.input}"</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-muted-foreground mb-1 text-sm">Model prediction:</div>
              <div
                className={cn(
                  "rounded-lg p-2 font-semibold",
                  result.correct
                    ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
                )}
              >
                {result.label} {result.correct ? "✓" : "✗"}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-muted-foreground mb-1 text-sm">Confidence:</div>
              <div className="bg-muted h-8 overflow-hidden rounded-lg">
                <div
                  className={cn(
                    "flex h-full items-center justify-center text-xs font-medium text-white transition-all duration-500",
                    result.correct ? "bg-green-500" : "bg-red-500"
                  )}
                  style={{ width: `${result.confidence}%` }}
                >
                  {result.confidence}%
                </div>
              </div>
            </div>
          </div>
          <div className="text-muted-foreground mt-2 text-xs">
            Expected: <span className="font-semibold">{testCase.expected}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// JSON/YAML Format Demo Component
export function JsonYamlDemo() {
  const [activeFormat, setActiveFormat] = useState<"json" | "yaml" | "typescript">("typescript");

  const typeDefinition = `interface ChatPersona {
  name?: string;
  role?: string;
  tone?: PersonaTone | PersonaTone[];
  expertise?: PersonaExpertise[];
  personality?: string[];
  background?: string;
}`;

  const jsonOutput = `{
  "name": "CodeReviewer",
  "role": "Senior Software Engineer",
  "tone": ["professional", "analytical"],
  "expertise": ["coding", "engineering"],
  "personality": ["thorough", "constructive"],
  "background": "10 years in backend systems"
}`;

  const yamlOutput = `name: CodeReviewer
role: Senior Software Engineer
tone:
  - professional
  - analytical
expertise:
  - coding
  - engineering
personality:
  - thorough
  - constructive
background: 10 years in backend systems`;

  const outputs = {
    typescript: typeDefinition,
    json: jsonOutput,
    yaml: yamlOutput,
  };

  const descriptions = {
    typescript: "Define the structure with TypeScript interfaces",
    json: "Machine-readable, strict syntax, great for APIs",
    yaml: "Human-readable, supports comments, great for config",
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 border-b px-4 py-3">
        <span className="font-semibold">Format Comparison</span>
        <span className="text-muted-foreground ml-2 text-sm">Same data, different formats</span>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex gap-2">
          {(["typescript", "json", "yaml"] as const).map((format) => (
            <button
              key={format}
              onClick={() => setActiveFormat(format)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                activeFormat === format
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {format === "typescript" ? "TypeScript" : format.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="text-muted-foreground text-sm">{descriptions[activeFormat]}</div>

        <pre
          className={cn(
            "overflow-x-auto rounded-lg p-4 font-mono text-sm whitespace-pre",
            activeFormat === "typescript"
              ? "border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
              : activeFormat === "json"
                ? "border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
                : "border border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30"
          )}
        >
          {outputs[activeFormat]}
        </pre>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div
            className={cn(
              "rounded p-2 text-center",
              activeFormat === "typescript" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-muted/50"
            )}
          >
            <div className="font-semibold">TypeScript</div>
            <div className="text-muted-foreground">Define schema</div>
          </div>
          <div
            className={cn(
              "rounded p-2 text-center",
              activeFormat === "json" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-muted/50"
            )}
          >
            <div className="font-semibold">JSON</div>
            <div className="text-muted-foreground">APIs & parsing</div>
          </div>
          <div
            className={cn(
              "rounded p-2 text-center",
              activeFormat === "yaml" ? "bg-purple-100 dark:bg-purple-900/30" : "bg-muted/50"
            )}
          >
            <div className="font-semibold">YAML</div>
            <div className="text-muted-foreground">Config files</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Iterative Refinement Demo Component
export function IterativeRefinementDemo() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const iterations = [
    {
      version: 1,
      prompt: "Write a product description.",
      additions: null,
      output: "This is a great product. It has many features. You should buy it.",
      issue: "Too vague, no specific details",
      quality: 20,
    },
    {
      version: 2,
      prompt: "Write a product description for wireless earbuds.",
      additions: ["for wireless earbuds"],
      output:
        "These wireless earbuds offer great sound quality and comfortable fit. They have long battery life and come in multiple colors.",
      issue: "Better, but still generic",
      quality: 45,
    },
    {
      version: 3,
      prompt:
        "Write a 50-word product description for premium wireless earbuds. Highlight: noise cancellation, 8-hour battery, water resistance.",
      additions: [
        "50-word",
        "premium",
        "Highlight: noise cancellation, 8-hour battery, water resistance",
      ],
      output:
        "Experience pure audio bliss with our premium wireless earbuds. Advanced noise cancellation blocks distractions while delivering crystal-clear sound. With 8-hour battery life and IPX5 water resistance, they're perfect for workouts or commutes. Ergonomic design ensures all-day comfort.",
      issue: "Good details, needs stronger hook",
      quality: 72,
    },
    {
      version: 4,
      prompt:
        "Write a compelling 50-word product description for premium wireless earbuds.\n\nKey features: noise cancellation, 8-hour battery, IPX5 water resistance\nTone: Premium but approachable\nStart with a benefit, end with a call to action.",
      additions: [
        "compelling",
        "Tone: Premium but approachable",
        "Start with a benefit, end with a call to action",
      ],
      output:
        "Escape the noise and immerse yourself in studio-quality sound. Our premium wireless earbuds feature advanced noise cancellation, 8-hour battery life, and IPX5 water resistance for any adventure. Ergonomically designed for all-day comfort. Elevate your listening experience today.",
      issue: null,
      quality: 95,
    },
  ];

  const currentIteration = iterations[step];

  const renderPromptWithHighlights = (prompt: string, additions: string[] | null) => {
    if (!additions || additions.length === 0) return prompt;

    const parts: { text: string; highlighted: boolean }[] = [];
    let remaining = prompt;

    const sortedAdditions = [...additions].sort((a, b) => {
      const posA = prompt.indexOf(a);
      const posB = prompt.indexOf(b);
      return posA - posB;
    });

    for (const addition of sortedAdditions) {
      const index = remaining.indexOf(addition);
      if (index !== -1) {
        if (index > 0) {
          parts.push({ text: remaining.substring(0, index), highlighted: false });
        }
        parts.push({ text: addition, highlighted: true });
        remaining = remaining.substring(index + addition.length);
      }
    }
    if (remaining) {
      parts.push({ text: remaining, highlighted: false });
    }

    return parts.map((part, i) =>
      part.highlighted ? (
        <span key={i} className="rounded bg-green-200 px-0.5 dark:bg-green-800/50">
          {part.text}
        </span>
      ) : (
        <span key={i}>{part.text}</span>
      )
    );
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && step < iterations.length - 1) {
      timer = setTimeout(() => setStep((s) => s + 1), 2500);
    } else if (step >= iterations.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step, iterations.length]);

  const handlePlay = () => {
    if (step >= iterations.length - 1) {
      setStep(0);
    }
    setIsPlaying(true);
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg border">
      <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-3">
        <div>
          <span className="font-semibold">Iterative Refinement Demo</span>
          <span className="text-muted-foreground ml-2 text-sm">Watch a prompt evolve</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={cn(
              "rounded-lg px-3 py-1 text-sm font-medium transition-colors",
              isPlaying
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isPlaying ? "Playing..." : step >= iterations.length - 1 ? "Replay" : "Play"}
          </button>
          <button
            onClick={() => setIsPlaying(false)}
            disabled={!isPlaying}
            className="bg-muted hover:bg-muted/80 rounded-lg px-3 py-1 text-sm font-medium disabled:opacity-50"
          >
            Pause
          </button>
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          {iterations.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setStep(i);
                setIsPlaying(false);
              }}
              className={cn(
                "h-2 flex-1 rounded-full transition-all",
                i <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
        <div className="text-muted-foreground text-center text-sm">
          Version {currentIteration.version} of {iterations.length}
        </div>

        <div>
          <div className="mb-1 flex items-center gap-2 text-sm font-medium">
            Prompt
            <span className="bg-muted rounded px-2 py-0.5 text-xs">
              v{currentIteration.version}
            </span>
          </div>
          <pre className="rounded-lg border border-blue-200 bg-blue-50 p-3 font-mono text-sm whitespace-pre-wrap dark:border-blue-800 dark:bg-blue-950/30">
            {renderPromptWithHighlights(currentIteration.prompt, currentIteration.additions)}
          </pre>
          {currentIteration.additions && (
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <span className="inline-block h-3 w-3 rounded bg-green-200 dark:bg-green-800/50" />
              New in this version
            </div>
          )}
        </div>

        <div>
          <div className="mb-1 text-sm font-medium">Output</div>
          <div className="bg-muted/50 rounded-lg p-3 text-sm">{currentIteration.output}</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-muted-foreground mb-1 text-sm">Quality</div>
            <div className="bg-muted h-3 overflow-hidden rounded-full">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  currentIteration.quality >= 80
                    ? "bg-green-500"
                    : currentIteration.quality >= 50
                      ? "bg-amber-500"
                      : "bg-red-500"
                )}
                style={{ width: `${currentIteration.quality}%` }}
              />
            </div>
          </div>
          <div className="w-16 text-right text-2xl font-bold">{currentIteration.quality}%</div>
        </div>

        {currentIteration.issue ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
            <span className="font-semibold">Issue:</span> {currentIteration.issue}
          </div>
        ) : (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300">
            <span className="font-semibold">✓ Success!</span> The prompt now produces high-quality,
            consistent output.
          </div>
        )}
      </div>
    </div>
  );
}

// Cost Calculator Component
export function CostCalculatorDemo() {
  const [inputTokens, setInputTokens] = useState(500);
  const [outputTokens, setOutputTokens] = useState(200);
  const [requestsPerDay, setRequestsPerDay] = useState(1000);
  const [inputPrice, setInputPrice] = useState(0.15); // $ per 1M tokens
  const [outputPrice, setOutputPrice] = useState(0.6); // $ per 1M tokens

  const costPerRequest =
    (inputTokens * inputPrice) / 1_000_000 + (outputTokens * outputPrice) / 1_000_000;
  const dailyCost = costPerRequest * requestsPerDay;
  const monthlyCost = dailyCost * 30;

  const formatCurrency = (amount: number) => {
    if (amount < 0.01) return `$${amount.toFixed(4)}`;
    if (amount < 1) return `$${amount.toFixed(3)}`;
    if (amount < 100) return `$${amount.toFixed(2)}`;
    return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="bg-card my-6 rounded-lg border p-4">
      <div className="mb-4 text-sm font-medium">API Cost Calculator</div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Input Tokens */}
        <div>
          <label className="text-muted-foreground mb-1.5 block text-xs">
            Input Tokens (per request)
          </label>
          <input
            type="number"
            value={inputTokens}
            onChange={(e) => setInputTokens(Math.max(0, parseInt(e.target.value) || 0))}
            className="bg-background w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* Input Price */}
        <div>
          <label className="text-muted-foreground mb-1.5 block text-xs">
            Input Price ($ per 1M tokens)
          </label>
          <input
            type="number"
            step="0.01"
            value={inputPrice}
            onChange={(e) => setInputPrice(Math.max(0, parseFloat(e.target.value) || 0))}
            className="bg-background w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* Output Tokens */}
        <div>
          <label className="text-muted-foreground mb-1.5 block text-xs">
            Output Tokens (per request)
          </label>
          <input
            type="number"
            value={outputTokens}
            onChange={(e) => setOutputTokens(Math.max(0, parseInt(e.target.value) || 0))}
            className="bg-background w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* Output Price */}
        <div>
          <label className="text-muted-foreground mb-1.5 block text-xs">
            Output Price ($ per 1M tokens)
          </label>
          <input
            type="number"
            step="0.01"
            value={outputPrice}
            onChange={(e) => setOutputPrice(Math.max(0, parseFloat(e.target.value) || 0))}
            className="bg-background w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* Requests per Day */}
        <div className="md:col-span-2">
          <label className="text-muted-foreground mb-1.5 block text-xs">Requests per Day</label>
          <input
            type="number"
            value={requestsPerDay}
            onChange={(e) => setRequestsPerDay(Math.max(0, parseInt(e.target.value) || 0))}
            className="bg-background w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Results */}
      <div className="mt-4 grid gap-3 border-t pt-4 md:grid-cols-3">
        <div className="bg-muted/30 rounded-lg p-3 text-center">
          <div className="text-muted-foreground text-xs">Per Request</div>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {formatCurrency(costPerRequest)}
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 text-center">
          <div className="text-muted-foreground text-xs">Daily Cost</div>
          <div className="text-lg font-semibold text-amber-600 dark:text-amber-400">
            {formatCurrency(dailyCost)}
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 text-center">
          <div className="text-muted-foreground text-xs">Monthly Cost</div>
          <div className="text-lg font-semibold text-red-600 dark:text-red-400">
            {formatCurrency(monthlyCost)}
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="bg-muted/20 text-muted-foreground mt-3 rounded p-2 text-center font-mono text-xs">
        ({inputTokens.toLocaleString()} × ${inputPrice}/1M) + ({outputTokens.toLocaleString()} × $
        {outputPrice}/1M) = {formatCurrency(costPerRequest)}/request
      </div>
    </div>
  );
}
