export interface Program {
  id: string | number;
  title: string;
  sub_title?: string | null;
  start_time: string;  // ISO UTC format
  end_time: string;    // ISO UTC format
  category: string;
  description: string;
  slug?: string;
  image_url?: string | null;
  rating?: string | null;
  imdb_rating?: number | null;
  channel_id?: string;
}

export interface Channel {
  id: string;
  name: string;
  number: number; // Logical Channel Number (LCN)
  logo: string;
  type?: 'General' | 'Entertainment' | 'Movies' | 'Sport' | 'News' | 'Kids';
  programs: Program[];
  bvodPlatform?: string; // 'BBC iPlayer', 'ITVX', 'Channel 4', 'My5', 'U'
  streamUrl?: string;
  website?: string;
  visible?: boolean;
  position?: number;
}

export interface HubChannel {
  id: string;
  name: string;
  number?: number;
}
