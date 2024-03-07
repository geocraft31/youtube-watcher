import getPlaylistData from "./util.mjs";

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

export default {
    list
    }