export interface CoingeckoMarketChartData {
    prices: [number, number][]; // [timestamp, price]
    market_caps: [number, number][]; // [timestamp, marketCap]
    total_volumes: [number, number][]; // [timestamp, totalVolume]
}

export interface CoingeckoCoinData {
    id: string;
    symbol: string;
    name: string;
    web_slug: string;
    asset_platform_id: string | null;
    platforms: Record<string, string>;
    detail_platforms: Record<
        string,
        {
            decimal_place: null | number;
            contract_address: string;
        }
    >;
    block_time_in_minutes: number;
    hashing_algorithm: string;
    categories: string[];
    preview_listing: boolean;
    public_notice: null | string;
    additional_notices: string[];
    description: {
        en: string;
    };
    links: {
        homepage: string[];
        blockchain_site: string[];
        official_forum_url: string[];
        chat_url: string[];
        announcement_url: string[];
        twitter_screen_name: string;
        facebook_username: string;
        bitcointalk_thread_identifier: null | string;
        telegram_channel_identifier: string;
        subreddit_url: string;
        repos_url: {
            github: string[];
            bitbucket: string[];
        };
    };
    image: {
        thumb: string;
        small: string;
        large: string;
    };
    country_origin: string;
    genesis_date: string;
    sentiment_votes_up_percentage: number;
    sentiment_votes_down_percentage: number;
    watchlist_portfolio_users: number;
    market_cap_rank: number;
    status_updates: string[];
    last_updated: string;
}

export interface ShapedCoinData {
    id: string;
    name: string;
    symbol: string;
    prices: [number, number][]; // [timestamp, price]
    marketCaps: [number, number][]; // [timestamp, marketCap]
    totalVolumes: [number, number][]; // [timestamp, totalVolume]
}
