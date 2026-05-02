export interface Author {
  name: string;
  url: string;
  logo: string;
}

export interface Match {
  view_url: string;
  label: string;
  time: string;
  home_logo: string;
  home_name: string;
  score: string;
  away_logo: string;
  away_name: string;
  url: string;
  authors: Author[];
}

export interface Channel {
  name: string;
  logo: string;
  url: string;
}

export const TV_CHANNELS: Channel[] = [
  { name: "မဟာ HD", logo: "https://play-lh.googleusercontent.com/wvOXePMu15onYRUrKL1L_IxYsth0dJLi_qCliblXvM0vfmUL2yFTzFSIBOAhCsrTxQ", url: "https://tv.mahar.live/mahar/website.stream/playlist.m3u8" },
  { name: "MRTV-4 HD", logo: "https://www.myanmartvchannels.com/assets/cache/images/channeliconb/mrtv42-120x120-81c.jpg", url: "https://pplive.comquas.com:5443/LiveApp/streams/w3g3EYjBtqgJ1677679288037.m3u8" },
  { name: "Channel7 HD", logo: "https://upload.wikimedia.org/wikipedia/en/e/e8/Channel7_logo.png", url: "https://pplive.comquas.com:5443/LiveApp/streams/CLcBFN71NkF61709008601656.m3u8" },
  { name: "မဟာအီးစပွတ် HD", logo: "https://maharesports.com/wp-content/uploads/2022/07/cropped-Mahar-Tab_Logo.png", url: "https://tv.mahar.live/esports/mahar.stream/esports/mahar2/chunks.m3u8" },
  { name: "ဒီဗွီဘီသတင်း", logo: "https://yt3.googleusercontent.com/8HhfrJBa1OmR9nbubJ16lzuxIR6QiT9mhW2EUDLMnmTibwZF2IIDghzn1g5Qfutx0g6xdx0D=s900-c-k-c0x00ffffff-no-rj", url: "https://live-stream.dvb.no/hls/stream_high/index.m3u8" },
  { name: "မဟာဗောဓိ", logo: "https://i.imgur.com/lV7WEVs.png", url: "https://pplive.comquas.com:5443/LiveApp/streams/rHEBIW7pjQLU1677679374164.m3u8" },
  { name: "FORTUNE TV HD", logo: "https://yt3.googleusercontent.com/ytc/AIdro_m3ypkRiX0knAxWmQ9M-b20znrxJfbnGT60Za_yU3yl1w=s900-c-k-c0x00ffffff-no-rj", url: "http://103.215.194.93:8282/hls/fortunetv/live/vmix_1080.m3u8" },
  { name: "5 Plus", logo: "https://i.imgur.com/4EHL2mH.png", url: "https://5a13fe32ef748.streamlock.net/mmplay/5plus/playlist.m3u8" },
  { name: "Channel K", logo: "https://i.imgur.com/6PqxuhF.png", url: "https://l1-xl1.myanmarnet.com/relay/channelk/ch1/stream.m3u8" },
  { name: "Mahar TV", logo: "https://i.imgur.com/ig0QECf.png", url: "https://tv.mahar.live/mahar/website.stream/playlist.m3u8" }
];
