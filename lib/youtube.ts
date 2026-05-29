// ── Video helpers ─────────────────────────────────────────────

export function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0] || null;
    return null;
  } catch {
    return null;
  }
}

export interface VideoMetadata {
  videoId: string;
  title: string;
  description: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  channelTitle: string;
}

export async function fetchVideoMetadata(videoIds: string[]): Promise<VideoMetadata[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY not configured");

  const ids = videoIds.join(",");
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${ids}&key=${apiKey}&part=snippet,statistics`,
    { next: { revalidate: 0 } }
  );

  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);

  const data = await res.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.items ?? []).map((item: any) => ({
    videoId: item.id,
    title: item.snippet?.title ?? "",
    description: (item.snippet?.description ?? "").slice(0, 600),
    viewCount: parseInt(item.statistics?.viewCount ?? "0", 10),
    likeCount: parseInt(item.statistics?.likeCount ?? "0", 10),
    commentCount: parseInt(item.statistics?.commentCount ?? "0", 10),
    publishedAt: item.snippet?.publishedAt ?? "",
    channelTitle: item.snippet?.channelTitle ?? "",
  }));
}

// ── Channel helpers ───────────────────────────────────────────

export interface ChannelData {
  youtubeChannelId: string;
  channelName: string;
  subscriberCount: number;
  totalVideos: number;
  avgViews: number;
  recentVideoTitles: string[];
  primaryLanguage: string | null;
  avatarUrl: string | null;
  contentCategory: string | null;
  topicCategories: string[];
  uploadFrequency: string;
}

/** Parse a YouTube channel URL into an API lookup key */
function parseChannelUrl(url: string): { param: string; value: string } | null {
  try {
    const u = new URL(url.trim());
    const path = u.pathname.replace(/\/$/, "");

    if (path.startsWith("/channel/")) {
      return { param: "id", value: path.replace("/channel/", "") };
    }
    if (path.startsWith("/@")) {
      return { param: "forHandle", value: path.slice(1) };
    }
    if (path.startsWith("/c/")) {
      return { param: "forHandle", value: "@" + path.replace("/c/", "") };
    }
    if (path.startsWith("/user/")) {
      return { param: "forUsername", value: path.replace("/user/", "") };
    }
    return null;
  } catch {
    return null;
  }
}

/** Extract a human-readable category name from a Wikipedia URL */
function parseTopicCategory(url: string): string {
  try {
    const segment = url.split("/wiki/")[1] ?? "";
    return decodeURIComponent(segment).replace(/_/g, " ");
  } catch {
    return url;
  }
}

/** Derive upload frequency label from an array of ISO publish dates (newest first) */
function deriveUploadFrequency(dates: string[]): string {
  const timestamps = dates
    .map((d) => new Date(d).getTime())
    .filter((t) => !isNaN(t))
    .sort((a, b) => b - a);

  if (timestamps.length < 2) return "Unknown";

  const gaps: number[] = [];
  for (let i = 0; i < timestamps.length - 1; i++) {
    gaps.push((timestamps[i] - timestamps[i + 1]) / (1000 * 60 * 60 * 24));
  }
  const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;

  if (avg < 1.5) return "Daily";
  if (avg < 3.5) return "2–3× week";
  if (avg < 9) return "Weekly";
  if (avg < 20) return "Bi-weekly";
  return "Monthly";
}

export async function fetchChannelData(channelUrl: string): Promise<ChannelData> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY not configured");

  const lookup = parseChannelUrl(channelUrl);
  if (!lookup) {
    throw new Error(
      "Could not parse channel URL. Use a format like youtube.com/@handle or youtube.com/channel/UCxxxxx"
    );
  }

  // ── Fetch channel snippet + statistics + topicDetails ────────
  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?${lookup.param}=${encodeURIComponent(lookup.value)}&part=snippet,statistics,topicDetails&key=${apiKey}`,
    { next: { revalidate: 0 } }
  );

  if (!channelRes.ok) {
    throw new Error(`YouTube API error: ${channelRes.status}`);
  }

  const channelJson = await channelRes.json();

  if (!channelJson.items?.length) {
    throw new Error(
      "Channel not found. Make sure the URL is correct and the channel is public."
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ch = channelJson.items[0] as any;
  const youtubeChannelId: string = ch.id;
  const channelName: string = ch.snippet?.title ?? "Unknown";
  const subscriberCount = parseInt(ch.statistics?.subscriberCount ?? "0", 10);
  const totalVideos = parseInt(ch.statistics?.videoCount ?? "0", 10);
  const primaryLanguage: string | null = ch.snippet?.defaultLanguage ?? null;
  const avatarUrl: string | null =
    ch.snippet?.thumbnails?.high?.url ??
    ch.snippet?.thumbnails?.medium?.url ??
    ch.snippet?.thumbnails?.default?.url ??
    null;

  // Topic categories from YouTube (Wikipedia URLs)
  const rawTopics: string[] = ch.topicDetails?.topicCategories ?? [];
  const topicCategories = rawTopics;
  const contentCategory = rawTopics.length > 0 ? parseTopicCategory(rawTopics[0]) : null;

  // ── Fetch last 10 videos for avg views + frequency ────────────
  const uploadsPlaylistId = "UU" + youtubeChannelId.slice(2);

  const playlistRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${uploadsPlaylistId}&part=snippet&maxResults=10&key=${apiKey}`,
    { next: { revalidate: 0 } }
  );

  let recentVideoTitles: string[] = [];
  let avgViews = 0;
  let uploadFrequency = "Unknown";

  if (playlistRes.ok) {
    const playlistJson = await playlistRes.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: any[] = playlistJson.items ?? [];

    recentVideoTitles = items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((i: any) => i.snippet?.title ?? "")
      .filter(Boolean)
      .slice(0, 5);

    const publishDates: string[] = items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((i: any) => i.snippet?.publishedAt ?? "")
      .filter(Boolean);

    uploadFrequency = deriveUploadFrequency(publishDates);

    const videoIds = items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((i: any) => i.snippet?.resourceId?.videoId)
      .filter(Boolean)
      .join(",");

    if (videoIds) {
      const statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoIds}&part=statistics&key=${apiKey}`,
        { next: { revalidate: 0 } }
      );

      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const views = (statsJson.items ?? []).map((v: any) =>
          parseInt(v.statistics?.viewCount ?? "0", 10)
        );
        if (views.length > 0) {
          avgViews = Math.round(views.reduce((a: number, b: number) => a + b, 0) / views.length);
        }
      }
    }
  }

  return {
    youtubeChannelId,
    channelName,
    subscriberCount,
    totalVideos,
    avgViews,
    recentVideoTitles,
    primaryLanguage,
    avatarUrl,
    contentCategory,
    topicCategories,
    uploadFrequency,
  };
}
