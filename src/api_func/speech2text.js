import vosk from 'vosk'

const modelPath = 'vosk_models/ru'
const sampleRate = 16000


async function speech2text(req, res) {
    try {

        let { data } = req.body
        if (data == "" || data == null) 
            return await res.status(400).json({ msg: "Wrong data format!" })
        vosk.setLogLevel(-1)
        var model = new vosk.Model(modelPath)
        var rec = new vosk.Recognizer({model: model, sampleRate: sampleRate})
        
        var buff = Buffer.from(data, 'base64')
        rec.acceptWaveform(buff)
        var result = rec.finalResult().text
        await res.status(200).json({ msg: String(result) })

        console.log('ok')
        model.free()
        rec.free()
        buff = null
        
    } catch (e) {
        console.error(e)
    } 
}

export { speech2text }
