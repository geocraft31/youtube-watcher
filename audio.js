
const play = require("play-dl")
const { opus } = require("prism-media")
const Speaker = require("speaker")
const { hyperlink, sleep } = require("./util.js")


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
      limit: 1
    });
    return searchResult;
  }
  else if (queryType == "yt_playlist") {
    const playlist = await play.playlist_info(query)
    const videos = await playlist.all_videos()
    return videos
  }

}

async function playAudioFromVideo(query) {
  const videoList = await getVideoData(query);
  const video = videoList[0]

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
    try {
        var source = await play.stream(video.url) ;
    } catch {
        console.error(`Error while getting video data`)
    }

  console.log(`Now playing: ${hyperlink(video.url, video.title)}`)
  console.log(`From:        ${hyperlink(video.channel.url, video.channel.name)}`)

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
  
  await sleep((video.durationInSec) * 1000)

}

module.exports = {
  playAudioFromVideo: playAudioFromVideo
}