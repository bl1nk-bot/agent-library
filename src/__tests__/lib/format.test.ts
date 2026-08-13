import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  prettifyJson,
  isValidJson,
  toYaml,
  getDateLocale,
  formatDistanceToNow,
  formatDate,
} from "@/lib/format";
import { enUS, tr, es, zhCN, ja, arSA } from "date-fns/locale";

describe("prettifyJson", () => {
  it("should prettify valid JSON with proper indentation", () => {
    const input = '{"name":"John","age":30}';
    const expected = `{
  "name": "John",
  "age": 30
}`;
    expect(prettifyJson(input)).toBe(expected);
  });

  it("should prettify nested JSON objects", () => {
    const input = '{"user":{"name":"John","address":{"city":"NYC"}}}';
    const result = prettifyJson(input);
    expect(result).toContain('"user"');
    expect(result).toContain('"address"');
    expect(result).toContain('"city"');
    expect(result.split("\n").length).toBeGreaterThan(1);
  });

  it("should prettify JSON arrays", () => {
    const input = "[1,2,3,4,5]";
    const expected = `[
  1,
  2,
  3,
  4,
  5
]`;
    expect(prettifyJson(input)).toBe(expected);
  });

  it("should prettify mixed arrays and objects", () => {
    const input = '{"items":[{"id":1},{"id":2}]}';
    const result = prettifyJson(input);
    expect(result).toContain('"items"');
    expect(result).toContain('"id"');
    expect(result.split("\n").length).toBeGreaterThan(3);
  });

  it("should return original content for invalid JSON", () => {
    const invalidJson = "not valid json";
    expect(prettifyJson(invalidJson)).toBe(invalidJson);
  });

  it("should return original content for malformed JSON", () => {
    const malformed = '{"name": "John",}';
    expect(prettifyJson(malformed)).toBe(malformed);
  });

  it("should handle empty object", () => {
    expect(prettifyJson("{}")).toBe("{}");
  });

  it("should handle empty array", () => {
    expect(prettifyJson("[]")).toBe("[]");
  });

  it("should handle JSON with special characters", () => {
    const input = '{"message":"Hello\\nWorld"}';
    const result = prettifyJson(input);
    expect(result).toContain('"message"');
    expect(result).toContain("Hello\\nWorld");
  });

  it("should handle JSON with unicode characters", () => {
    const input = '{"emoji":"\\u2764","text":"Hello"}';
    const result = prettifyJson(input);
    expect(result).toContain('"emoji"');
  });

  it("should handle boolean and null values", () => {
    const input = '{"active":true,"deleted":false,"data":null}';
    const result = prettifyJson(input);
    expect(result).toContain("true");
    expect(result).toContain("false");
    expect(result).toContain("null");
  });

  it("should handle numeric values", () => {
    const input = '{"int":42,"float":3.14,"negative":-10}';
    const result = prettifyJson(input);
    expect(result).toContain("42");
    expect(result).toContain("3.14");
    expect(result).toContain("-10");
  });
});

describe("isValidJson", () => {
  it("should return true for valid JSON object", () => {
    expect(isValidJson('{"name":"John"}')).toBe(true);
  });

  it("should return true for valid JSON array", () => {
    expect(isValidJson("[1,2,3]")).toBe(true);
  });

  it("should return true for empty object", () => {
    expect(isValidJson("{}")).toBe(true);
  });

  it("should return true for empty array", () => {
    expect(isValidJson("[]")).toBe(true);
  });

  it("should return true for JSON string primitive", () => {
    expect(isValidJson('"hello"')).toBe(true);
  });

  it("should return true for JSON number primitive", () => {
    expect(isValidJson("42")).toBe(true);
    expect(isValidJson("3.14")).toBe(true);
  });

  it("should return true for JSON boolean", () => {
    expect(isValidJson("true")).toBe(true);
    expect(isValidJson("false")).toBe(true);
  });

  it("should return true for JSON null", () => {
    expect(isValidJson("null")).toBe(true);
  });

  it("should return false for invalid JSON", () => {
    expect(isValidJson("not json")).toBe(false);
  });

  it("should return false for malformed JSON with trailing comma", () => {
    expect(isValidJson('{"name": "John",}')).toBe(false);
  });

  it("should return false for single quotes (non-standard)", () => {
    expect(isValidJson("{'name': 'John'}")).toBe(false);
  });

  it("should return false for unquoted keys", () => {
    expect(isValidJson("{name: 'John'}")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isValidJson("")).toBe(false);
  });

  it("should return false for undefined-like string", () => {
    expect(isValidJson("undefined")).toBe(false);
  });

  it("should return true for nested valid JSON", () => {
    const nested = '{"level1":{"level2":{"level3":"value"}}}';
    expect(isValidJson(nested)).toBe(true);
  });

  it("should return true for JSON with whitespace", () => {
    const withWhitespace = `{
      "name": "John",
      "age": 30
    }`;
    expect(isValidJson(withWhitespace)).toBe(true);
  });
});

describe("toYaml", () => {
  it("should format string", () => {
    expect(toYaml("test")).toBe("test");
  });
  it("should format number", () => {
    expect(toYaml(123)).toBe("123");
  });
  it("should format object", () => {
    expect(toYaml({ a: 1 })).toBe("a: 1");
  });
});

describe("getDateLocale", () => {
  it("should return enUS for 'en' locale", () => {
    expect(getDateLocale("en")).toBe(enUS);
  });

  it("should return tr for 'tr' locale", () => {
    expect(getDateLocale("tr")).toBe(tr);
  });

  it("should return es for 'es' locale", () => {
    expect(getDateLocale("es")).toBe(es);
  });

  it("should return zhCN for 'zh' locale", () => {
    expect(getDateLocale("zh")).toBe(zhCN);
  });

  it("should return ja for 'ja' locale", () => {
    expect(getDateLocale("ja")).toBe(ja);
  });

  it("should return arSA for 'ar' locale", () => {
    expect(getDateLocale("ar")).toBe(arSA);
  });

  it("should return enUS for unknown locale", () => {
    expect(getDateLocale("unknown")).toBe(enUS);
    expect(getDateLocale("fr")).toBe(enUS);
    expect(getDateLocale("de")).toBe(enUS);
  });
});

describe("formatDistanceToNow", () => {
  beforeEach(() => {
    // Mock the current date to ensure consistent test results
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should format a date object relative to now", () => {
    const pastDate = new Date("2024-01-14T12:00:00Z");
    const result = formatDistanceToNow(pastDate);
    expect(result).toContain("day");
    expect(result).toContain("ago");
  });

  it("should format a date string relative to now", () => {
    const pastDateString = "2024-01-14T12:00:00Z";
    const result = formatDistanceToNow(pastDateString);
    expect(result).toContain("day");
    expect(result).toContain("ago");
  });

  it("should format with different locales", () => {
    const pastDate = new Date("2024-01-14T12:00:00Z");

    // English
    const enResult = formatDistanceToNow(pastDate, "en");
    expect(enResult).toContain("ago");

    // Spanish
    const esResult = formatDistanceToNow(pastDate, "es");
    expect(esResult).toContain("hace");

    // Turkish
    const trResult = formatDistanceToNow(pastDate, "tr");
    expect(trResult).toContain("önce");
  });

  it("should handle dates from a week ago", () => {
    const weekAgo = new Date("2024-01-08T12:00:00Z");
    const result = formatDistanceToNow(weekAgo);
    // date-fns may return "7 days ago" instead of "1 week ago"
    expect(result).toMatch(/days?|week/);
    expect(result).toContain("ago");
  });

  it("should handle dates from hours ago", () => {
    const hoursAgo = new Date("2024-01-15T10:00:00Z");
    const result = formatDistanceToNow(hoursAgo);
    expect(result).toContain("hours");
    expect(result).toContain("ago");
  });

  it("should default to en locale when none provided", () => {
    const pastDate = new Date("2024-01-14T12:00:00Z");
    const result = formatDistanceToNow(pastDate);
    expect(result).toContain("ago"); // English suffix
  });
});

describe("formatDate", () => {
  it("should format a date object with the given format string", () => {
    const date = new Date("2024-01-15T12:30:45Z");
    expect(formatDate(date, "yyyy-MM-dd")).toBe("2024-01-15");
  });

  it("should format a date string with the given format string", () => {
    const dateString = "2024-01-15T12:30:45Z";
    expect(formatDate(dateString, "yyyy-MM-dd")).toBe("2024-01-15");
  });

  it("should format with various format strings", () => {
    const date = new Date("2024-06-15T14:30:00Z");

    expect(formatDate(date, "MM/dd/yyyy")).toBe("06/15/2024");
    expect(formatDate(date, "dd.MM.yyyy")).toBe("15.06.2024");
    expect(formatDate(date, "MMMM d, yyyy", "en")).toBe("June 15, 2024");
  });

  it("should format with different locales", () => {
    const date = new Date("2024-06-15T14:30:00Z");

    // English month name
    const enResult = formatDate(date, "MMMM", "en");
    expect(enResult).toBe("June");

    // Spanish month name
    const esResult = formatDate(date, "MMMM", "es");
    expect(esResult).toBe("junio");

    // Turkish month name
    const trResult = formatDate(date, "MMMM", "tr");
    expect(trResult).toBe("Haziran");
  });

  it("should handle time formatting", () => {
    const date = new Date("2024-01-15T14:30:45Z");
    // Test format pattern (timezone-independent)
    expect(formatDate(date, "HH:mm:ss")).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(formatDate(date, "h:mm a", "en")).toMatch(/^\d{1,2}:\d{2} [AP]M$/i);
  });

  it("should default to en locale when none provided", () => {
    const date = new Date("2024-01-15T12:00:00Z");
    const result = formatDate(date, "EEEE"); // Day of week
    expect(result).toBe("Monday");
  });
});
