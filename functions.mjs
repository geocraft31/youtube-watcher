import util from "./util.mjs";

const {getPlaylistData, writePlaylistData} = util 

function list(targetPl) {
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

function add(song, kwargs) {
    const playlist = kwargs["list"]

    if (typeof playlist != "string") {
        return console.error("Playlist not provided or doesn't exist")
    }

    const playlistData = getPlaylistData()
    playlistData[playlist].push(song)
    writePlaylistData(playlistData)

}

export default {
    list,
    add
    }