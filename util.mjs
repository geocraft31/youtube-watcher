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

function writePlaylistData(data) {
    try {
        if (typeof data != "string") {
            data = JSON.stringify(data)
        }
        
        fs.writeFileSync(`${filePath}/playlist.json`, data, {encoding: 'utf-8'})
    } catch (err) {
        console.error(err)
    }
}

export default {
    getPlaylistData, 
    writePlaylistData
}