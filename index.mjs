import play from "play-dl";
import readline from "readline"
import { opus } from "prism-media";
import Speaker from "speaker";
import imageToAscii from "image-to-ascii";

const hlt = (url, text) => {
  return `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\`;
};

function getAllIndices(string, substring) {
  const indeces = [];
  let index = string.indexOf(substring);

  while (index !== -1) {
    indeces.push(index);
    index = string.indexOf(substring, index + 1);
  }
  return indeces;
}

function findClosestNumber(target, numbers) {
  if (numbers.length === 0) {
    return null; // Handle the case where the list is empty
  }

  let closestNumber = numbers[0];
  let minDifference = Math.abs(target - closestNumber);

  for (const number of numbers) {
    const difference = Math.abs(target - number);

    if (difference < minDifference) {
      minDifference = difference;
      closestNumber = number;
    }
  }

  return closestNumber;
}

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

var index = 0;

async function playAudioFromVideo(query) {
  const videoList = await getVideoData(query);
  var video = videoList[index];

  imageToAscii(
    video.thumbnails[0].url,
    {
      fit_screen: true,
      bg: true,
      fg: true,
    },
    (err, converted) => {
      console.log(err || converted);
      let imgWidth = converted
        .split("\n")[0]
        .replace(/\x1b\[[0-9;]*[mGKH]/g, "").length;

      let textOffsetX = 1;
      let textOffsetY = 3;

      let playingText = `Now Playing: ${video.title}`;

      process.stdout.cursorTo(imgWidth + textOffsetX, textOffsetY);

      if (
        playingText.length >
        process.stdout.columns - imgWidth - textOffsetX
      ) {
        let midString = `Now Playing: ${video.title}`.length / 2;
        let spaces = getAllIndices(video.title, " ");

        let closest = findClosestNumber(midString, spaces);

        process.stdout.write("Now Plaing: ");
        process.stdout.write(hlt(video.url, playingText.slice(13, closest)));
        textOffsetY++;

        process.stdout.cursorTo(imgWidth + textOffsetX, textOffsetY);
        process.stdout.write(
          `             ${hlt(video.url, playingText.slice(closest, -1))}`,
        );
      } else {
        process.stdout.write(`Now Playing: ${hlt(video.url, video.title)}`);
      }
      textOffsetY++;
      process.stdout.cursorTo(imgWidth + textOffsetX, textOffsetY);
      process.stdout.write(
        `From:        ${hlt(video.channel.url, video.channel.name)}`,
      );
      process.stdout.cursorTo(process.stdout.columns, process.stdout.rows - 1);
    },
  );

  var source = await play.stream(video.url);

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

  source.stream.on("data", (data) => {
    opusDecoder.write(data);
  });

  source.stream.on("finish", () => {
    source.stream.end();
    speaker.end();
  });

  opusDecoder.on("data", (decodedData) => {
    speaker.write(decodedData);
  });

  speaker.on("finish", async () => {
    index++;
    if (index == videoList.length) process.exit();

    playAudioFromVideo(query);
  });
}

export default playAudioFromVideo;
