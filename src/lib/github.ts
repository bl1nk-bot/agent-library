export async function getGithubStars(useCloneBranding: boolean, achievementConfigEnabled?: boolean): Promise<number> {
  let githubStars = 0; // fallback

  if (!useCloneBranding && achievementConfigEnabled !== false) {
    try {
      const res = await fetch("https://api.github.com/repos/bl1nk-bot/agent-library", {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });
      if (res.ok) {
        const data = await res.json();
        githubStars = data.stargazers_count;
      }
    } catch {
      // Use fallback
    }
  }

  return githubStars;
}
