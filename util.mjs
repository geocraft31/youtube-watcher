import fs from 'fs'
import { fileURLToPath } from 'url';
import path from 'path';

const filePath = path.resolve(fileURLToPath(import.meta.url), "..");

function getPlaylistData() {
    try {
        const data = fs.readFileSync(`${filePath}/playlist.json`, 'utf-8')
        return JSON.parse(data)
    } catch (err) {
        console.error(err)
    }
}

export default getPlaylistData