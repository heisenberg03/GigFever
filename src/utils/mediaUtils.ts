import * as VideoThumbnails from 'expo-video-thumbnails';

export async function trimMediaAsync(uri: string, maxDuration: number, startTime: number): Promise<string> {
  try {
    // In production, integrate with a native module (e.g., FFmpeg)
    return `${uri}?trimmed=${maxDuration}&start=${startTime}`;
  } catch (e) {
    console.warn(e);
    return uri;
  }
}
