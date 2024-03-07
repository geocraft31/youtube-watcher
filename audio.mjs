import play from "play-dl";
import { opus } from "prism-media";
import Speaker from "speaker";
import { sleep } from "./util.mjs";

const opusDecoder = new opus.Decoder({
    channels: 2,
    rate: 48000,
    frameSize: 960,
});

const speaker = new Speaker({
    channels: 2,
    bitDepth: 16,
    sampleRate: 48000,
});


async function getVideoData(query) {
  const queryType = await play.validate(query);

  if (!queryType)
    throw Error(
      `Given querry is not a youtube link nor a serach item: ${query}`,
    );

  if (!queryType.startsWith("yt") && queryType != "search") {
    throw Error(
      `Given querry is not a youtube link nor a serach item: ${query}`,
    );
  }

  if (queryType == "yt_video" || queryType == "search") {
    const searchResult = await play.search(query, {
      source: { youtube: "video" },
    });
    return searchResult;
  }
  else if (queryType == "yt_playlist") {
    const playlist = await play.playlist_info(query)
    const videos = await playlist.all_videos()
    return videos
  }

}

export async function playAudioFromVideo(query) {
  const videoList = await getVideoData(query);
  const video = videoList[0]

  var source = await play.stream(video.url);

  console.log(`Now playing ${video.title}`)

  source.stream.on("data", (data) => {
    opusDecoder.write(data);
  });

  source.stream.on("finish", () => {
    source.stream.end();
    opusDecoder.end()
    speaker.end();
  });

  opusDecoder.on("data", (decodedData) => {
    speaker.write(decodedData);
  });
  
  speaker.on("finish", async () => {
    return true
  });
  
  await sleep(video.durationInSec * 1000)
}
