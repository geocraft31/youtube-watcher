import { getPlaylistData, writePlaylistData } from "./util.mjs"
import { playAudioFromVideo } from "./audio.mjs"

export function list(targetPl) {
    const playlistData = getPlaylistData()

    if (typeof targetPl === "string") {
        try {
            playlistData[targetPl].forEach(song => {
                console.log(song)
            })
        } catch {
            console.error(`Playlist ${targetPl} not found.`)
        }
    } else {
        Object.keys(playlistData).forEach(playlist => {
            console.log(playlist)
        })
    }
}

export function add(song, kwargs) {
    const playlist = kwargs["list"]

    if (typeof playlist != "string") {
        return console.error("Playlist not provided or doesn't exist")
    }

    const playlistData = getPlaylistData()
    playlistData[playlist].push(song)
    writePlaylistData(playlistData)
}

export function remove(song, kwargs) {
    const playlist = kwargs["list"]

    if (typeof playlist != "string") {
        return console.error("Playlist not provided or doesn't exist")
    }

    let playlistData = getPlaylistData()
    const songIndex = playlistData[playlist].indexOf(song)

    playlistData[playlist].splice(songIndex, 1)
    writePlaylistData(playlistData)
}

export function create(name) {
    const playlistData = getPlaylistData()
    if (Object.keys(playlistData).includes(name)) {
        return console.error(`Can't create playlist ${name}, another playlist already has this name`)
    }

    playlistData[name] = []
    writePlaylistData(playlistData)
}

export function deletePlaylist(name) {
    const playlistData = getPlaylistData()
    if (!Object.keys(playlistData).includes(name)) {
        return console.error(`Can't delete playlist ${name}, no playlist has that name`)
    }

    delete playlistData[name]
    console.log(playlistData)
    writePlaylistData(playlistData)
}

export async function play(songList) {

    for (const song of songList) {
        await playAudioFromVideo(song);
    }

}

export function playlist(name) {
    const playlistData = getPlaylistData()
    if (!Object.keys(playlistData).includes(name)) {
        return console.error(`Playlist ${name} not found.`)
    }

    play(playlistData[name])
}