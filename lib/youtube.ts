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
