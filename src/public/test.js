import vosk from 'vosk'

import async from"async"
import fs from"fs"
import { Readable } from"stream"
import wav from "wav"

const MODEL_PATH = "../../vosk_models/ru"

if (!fs.existsSync(MODEL_PATH)) {
    console.log("Please download the model from https://alphacephei.com/vosk/models and unpack as " + MODEL_PATH + " in the current folder.")
    process.exit()
}

// Process file 4 times in parallel with a single model
var files = Array(10).fill("l4bAmLdu.wav")
const model = new vosk.Model(MODEL_PATH)
var result = ''
async.filter(files, function(filePath, callback) {
    const wfReader = new wav.Reader();
    const wfReadable = new Readable().wrap(wfReader);

    wfReader.on('format', async ({ audioFormat, sampleRate, channels }) => {
        const rec = new vosk.Recognizer({model: model, sampleRate: sampleRate});
        if (audioFormat != 1 || channels != 1) {
            console.error("Audio file must be WAV format mono PCM.");
            process.exit(1);
        }
        for await (const data of wfReadable) {
            const end_of_speech = await rec.acceptWaveformAsync(data);
            if (end_of_speech) {
                //console.log(rec.result().text);
            }
        }
        console.log(rec.finalResult().text);
        rec.free();
        // Signal we are done without errors
        callback(null, true);
    });

    fs.createReadStream(filePath, {'highWaterMark': 4096}).pipe(wfReader);

}, function(err, results) {
    model.free();
    console.log("Done!!!!!");
});