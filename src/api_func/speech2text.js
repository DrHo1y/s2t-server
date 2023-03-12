import vosk from 'vosk'
import fs from 'fs'
import { Buffer } from 'buffer'
import util from 'util'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'

const nspawn = util.promisify(spawn)


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const modelPath = 'vosk_models/ru'
const sampleRate = 16000
const bufferSize = 8000

async function speech2text(req, res) {
    try {
    let { data } = req.body
    if (data == "" || data == null) {
        return res.status(400).json({ msg: "Wrong data format!" })
    }
    var filename = randomSting(8) + '.wav'
    filename = path.join(__dirname, '..','public', filename)
    fs.writeFileSync(filename, Buffer.from(data, 'base64'))
    if (!fs.existsSync(modelPath)) {
        console.log("Пожалуйста скачайте языковую модель по адресу: https://alphacephei.com/vosk/models")
        process.exit()
    }

    vosk.setLogLevel(-1)
    const model = new vosk.Model(modelPath)
    const rec = new vosk.Recognizer({model: model, sampleRate: sampleRate})

    const ffmpeg_run = spawn('ffmpeg', ['-loglevel', 'quiet', '-i', filename,
                         '-ar', String(sampleRate) , '-ac', '1',
                         '-f', 's16le', '-bufsize', String(bufferSize), '-'])
    var result =''
    ffmpeg_run.stdout.on('data', (stdout) => {
        if (!rec.acceptWaveform(stdout)) {
            result = rec.partialResult().partial
        }
    })
    ffmpeg_run.on('close', () => {
        res.status(200).json({ msg: String(result) })
        console.log(result)
        fs.unlinkSync(filename)
        model.free()
        rec.free()
        ffmpeg_run.stdout.pipe(ffmpeg_run.stdin)
        ffmpeg_run.stdout.destroy()
    })
    } catch (e) {
        console.error(e)
    }
}

const randomSting = length => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random()*charactersLength))
      counter += 1
    }
    return result
  }

export { speech2text }
