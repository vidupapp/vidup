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
      return { param: "forHandle", value: path.slice(1) }; // keep @ prefix
    }
    if (path.startsWith("/c/")) {
      // Try as handle (most modern channels have @handle equivalents)
      return { param: "forHandle", value: "@" + path.replace("/c/", "") };
    }
    if (path.startsWith("/user/")) {
      return { param: "forUsername", value: path.replace("/user/", "") };
    }
    // Bare @handle typed directly
    if (path.startsWith("/@")) {
      return { param: "forHandle", value: path.slice(1) };
    }
    return null;
  } catch {
    return null;
  }
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

  // ── Fetch channel snippet + statistics ───────────────────────
  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?${lookup.param}=${encodeURIComponent(lookup.value)}&part=snippet,statistics&key=${apiKey}`,
    { next: { revalidate: 0 } }
  );

  if (!channelRes.ok) {
    throw new Error(`YouTube API error: ${channelRes.status}`);
  }

  const channelData = await channelRes.json();

  if (!channelData.items?.length) {
    throw new Error(
      "Channel not found. Make sure the URL is correct and the channel is public."
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ch = channelData.items[0] as any;
  const youtubeChannelId: string = ch.id;
  const channelName: string = ch.snippet?.title ?? "Unknown";
  const subscriberCount = parseInt(ch.statistics?.subscriberCount ?? "0", 10);
  const totalVideos = parseInt(ch.statistics?.videoCount ?? "0", 10);
  const primaryLanguage: string | null = ch.snippet?.defaultLanguage ?? null;

  // ── Fetch last 5 video titles + avg views ─────────────────────
  // Uploads playlist ID = channel ID with 'UC' replaced by 'UU'
  const uploadsPlaylistId = "UU" + youtubeChannelId.slice(2);

  const playlistRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${uploadsPlaylistId}&part=snippet&maxResults=5&key=${apiKey}`,
    { next: { revalidate: 0 } }
  );

  let recentVideoTitles: string[] = [];
  let avgViews = 0;

  if (playlistRes.ok) {
    const playlistData = await playlistRes.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: any[] = playlistData.items ?? [];
    recentVideoTitles = items.map((i: any) => i.snippet?.title ?? "").filter(Boolean);

    // Fetch view counts for these videos
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
        const statsData = await statsRes.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const views = (statsData.items ?? []).map((v: any) =>
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
  };
}
