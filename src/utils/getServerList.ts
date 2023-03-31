import { RTC_PORT } from '~/constants';

export function getServerList(servers: any[], TurnServerPassword: string): any[] {
  const turnServers = servers.map((item: any) => {
    return {
      urls: `turn:${item.urls}:${RTC_PORT}`,
      credential: TurnServerPassword,
      username: item.username,
    };
  });
  const stunServers = servers.map((item: any) => {
    return {
      urls: `stun:${item.urls}:${RTC_PORT}`,
    };
  });
  return [...stunServers, ...turnServers];
}
