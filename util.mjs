import fs from 'fs'
import { fileURLToPath } from 'url';
import path from 'path';

const filePath = path.resolve(fileURLToPath(import.meta.url), "..");

export function getPlaylistData() {
    try {
        const data = fs.readFileSync(`${filePath}/playlist.json`, 'utf-8')
        return JSON.parse(data)
    } catch (err) {
        console.error(err)
    }
}

export function writePlaylistData(data) {
    try {
        if (typeof data != "string") {
            data = JSON.stringify(data)
        }

        fs.writeFileSync(`${filePath}/playlist.json`, data, {encoding: 'utf-8'})
    } catch (err) {
        console.error(err)
    }
}

export function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function hyperlink(url, text) {
    return `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\`;
}