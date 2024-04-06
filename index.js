#!/usr/bin/env node

const { Command } = require("commander")
const { getPlaylistData, writePlaylistData, sleep, shuffleList } = require("./util.js")
const { playAudioFromVideo } = require("./audio.js")
const program = new Command()

program
    .name('Terminal-Music')
    .description('Plays video audio on the terminal')
    .version('0.0.1')

program.command('create')
    .description('Creates a new playlist with the given name')
    .argument('<string>', 'Name of the playlist')
    .option('-f, --force', 'Overwrites playlist with the same name')
    .action((name, options) => {
        const force = options.force ? true : false
        const playlistData = getPlaylistData()
        if (!force && Object.keys(playlistData).includes(name)) {
            return console.error(`Can't create playlist ${name}, another playlist already exist, if you want to overwrite spexify the force option`)
        }
        playlistData[name] = []
        writePlaylistData(playlistData)
    })

program.command('delete')
    .description('Deletes a playlist')
    .argument('<string>', 'Name of the playlist')
    .action((name) => {
        let playlistData = getPlaylistData()
        if (!Object.keys(playlistData).includes(name)) {
            return console.error(`Can't find playlist ${name}`)
        }
        delete playlistData[name]
        writePlaylistData(playlistData)
    })

program.command('add')
    .description("Adds a song to a playlist")
    .argument('<string>', 'Name of the song')
    .requiredOption('-pl, --playlist <name>', 'Name of the playlist to add the song')
    .action((song, options) => {
        const plName = options.playlist
        const plData = getPlaylistData()
        try {
            plData[plName].push(song)
            writePlaylistData(plData)        
        } catch {
            console.error(`Playlist ${plName} doesn't exist`)
        }
    })

program.command('remove')
    .description("Removes a song from a playlist")
    .argument('<string>', 'Name of the song')
    .requiredOption('-pl, --playlist <name>', 'Name of the playlist to remove the song from')
    .action((song, options) => {
        const plName = options.playlist
        const plData = getPlaylistData()

        try {
            const songIndex = plData[plName].indexOf(song)
            plData[plName].splice(songIndex, 1)
            writePlaylistData(plData)
        } catch {
            console.error(`Playlist ${plName} doesn't exist`)
        }
    })

program.command('list')
    .description("List all playlist and their songs")
    .action(() => {
        const plData = getPlaylistData()
        Object.keys(plData).forEach(plName => {
            console.log(` @ ${plName}:`)

            if (plData[plName].length == 0) {
                console.log(`\x1B[90m   [ empty ]`)
            }

            plData[plName].forEach(song => {
                console.log(`   - ${song}`)
            })
        })
    })

program.command('play')
    .description("Plays the audio of the video to the terminal")
    .argument('<string>', 'Name of the song')
    .option('-pl, --playlist', 'Plays the playlist that matches instead of the song')
    .option('-s, --shuffle', 'Shuffles the songs everytime one ends (ONLY WORKS WITH `-pl` option)')
    .option('-l, --loop', 'Loops the song or playlist')
    .action(async (name, options) => {
        const plOption = options.playlist ? true : false
        const shuffle = options.shuffle ? true : false
        const loop = options.loop ? true : false

        if (!plOption) {
            while (true) {
                await playAudioFromVideo(name)
                await sleep(100)

                if (!loop)
                    break
            }
        } else {
            const plData = getPlaylistData()
            if (!Object.keys(plData).includes(name)) {
                return console.error(`Playlist ${name} doesn't exist`)
            }

            const pl = plData[name]

            while (true) {
                if (shuffle)
                    shuffleList(pl)

                for (const song of pl) {
                    await playAudioFromVideo(song)
                }
                await sleep(100)

                if (!loop) {
                    break
                }
            }
        }

        while (true) {
            if (!loop) {
                break
            }
        }

    })

program.parse()