import vosk from 'vosk'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const modelPath = 'vosk_models/ru'
const sampleRate = 16000

async function speech2text(req, res) {
    try {

    let { data } = req.body
    if (data == "" || data == null) {
        return res.status(400).json({ msg: "Wrong data format!" })
    }

    if (!fs.existsSync(modelPath)) {
        console.log("Пожалуйста скачайте языковую модель по адресу: https://alphacephei.com/vosk/models")
        process.exit()
    }

    vosk.setLogLevel(0)
    const model = new vosk.Model(modelPath)
    const rec = new vosk.Recognizer({model: model, sampleRate: sampleRate})
    var buff = Buffer.from(data, 'base64')
    rec.acceptWaveform(buff)
    var result = rec.finalResult().text
    res.status(200).json({ msg: String(result) })
    console.log(result)
    model.free()
    rec.free()
    buff = null
    data = null
    
    } catch (e) {
        console.error(e)
    }
}

export { speech2text }
