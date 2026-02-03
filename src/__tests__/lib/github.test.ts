import { describe, it, expect, vi, beforeEach } from "vitest";
import { getGithubStars } from "@/lib/github";

describe("getGithubStars", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("should fetch stars from the correct repository (bl1nk-bot/agent-library)", async () => {
    const mockStars = 100;
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ stargazers_count: mockStars }),
    } as Response);

    const stars = await getGithubStars(false, true);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("bl1nk-bot/agent-library"),
      expect.any(Object)
    );
    expect(stars).toBe(mockStars);
  });

  it("should return fallback stars if fetch fails", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
    } as Response);

    const stars = await getGithubStars(false, true);
    expect(stars).toBe(0); // Current fallback
  });
});
