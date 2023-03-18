import https from 'https'
import fs from 'fs'

const host = '192.168.3.43'
const port = 8000

import app from './src/app.js'


try {
    https
    .createServer({
        key: fs.readFileSync('cert/key.pem'),
        cert: fs.readFileSync('cert/cert.pem'),
    },
    app)
    .listen(port, () => {
        console.log(`recognizer server on https://${host}:${port}`)
    })
} catch (e) {
    console.log('error ', e.message)
    process.exit(1)
}

