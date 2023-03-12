import vosk from 'vosk'

import fs from "fs"
import { spawn } from "child_process"

const MODEL_PATH = "../../vosk_models/ru"
var FILE_NAME = "test.wav"
const SAMPLE_RATE = 16000
const BUFFER_SIZE = 4000

if (!fs.existsSync(MODEL_PATH)) {
    console.log("Please download the model from https://alphacephei.com/vosk/models and unpack as " + MODEL_PATH + " in the current folder.")
    process.exit()
}

if (process.argv.length > 2)
    FILE_NAME = process.argv[2]

vosk.setLogLevel(-1)
const model = new vosk.Model(MODEL_PATH)
const rec = new vosk.Recognizer({model: model, sampleRate: SAMPLE_RATE})

const ffmpeg_run = spawn('ffmpeg', ['-loglevel', 'quiet', '-i', FILE_NAME,
                         '-ar', String(SAMPLE_RATE) , '-ac', '1',
                         '-f', 's16le', '-bufsize', String(BUFFER_SIZE) , '-'])
var result = ''
ffmpeg_run.stdout.on('data', (stdout) => {
    if (!rec.acceptWaveform(stdout)){
        result = result + rec.partialResult().partial + " "
    }
    if (!result.trim() == '') {
        //console.log(result)
    }
})

ffmpeg_run.on('exit', () => {
    console.log(`${result}`)
})
