import { loadConfig } from './config';
import rssParser from 'rss-parser';

const { RSS_FEEDS } = loadConfig();

const getLast24HoursItems = async (feedUrl: string) => {
  const parser = new rssParser();
  // Get the current time
  const now = new Date();

  const feed = await parser.parseURL(feedUrl);

  // Filter the items that were added in the last 24 hours
  const items = feed.items.filter((item) => {
    const date = new Date(item.pubDate ?? '');
    return now.getTime() - date.getTime() < 24 * 60 * 60 * 1000;
  });

  // Return the items
  return items;
};

export const getAllFeedsCombined = async () => {
  const items = await Promise.all(RSS_FEEDS.map(getLast24HoursItems));

  const combinedText = items.flat().reduce((acc, item) => `${acc}${item.contentSnippet}\n---\n`, '');

  return combinedText;
};
