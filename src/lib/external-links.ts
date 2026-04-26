import { isTauri } from '@tauri-apps/api/core';
import { ALL_CONFERENCES } from '@/data/conferences-extended';

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, '');
}

const ALLOWED_HOSTS = new Set(
  ALL_CONFERENCES.flatMap((conference) => {
    try {
      const hostname = normalizeHostname(new URL(conference.website).hostname);
      return [hostname];
    } catch {
      return [];
    }
  }),
);

export async function openConferenceWebsite(url: string): Promise<void> {
  const parsed = new URL(url);
  const hostname = normalizeHostname(parsed.hostname);

  if (parsed.protocol !== 'https:' || !ALLOWED_HOSTS.has(hostname)) {
    throw new Error('为了安全，应用只允许打开受信任的 HTTPS 会议官网。');
  }

  if (isTauri()) {
    const { openUrl } = await import('@tauri-apps/plugin-opener');
    await openUrl(parsed.toString());
    return;
  }

  window.open(parsed.toString(), '_blank', 'noopener,noreferrer');
}
