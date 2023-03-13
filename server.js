import https from 'https'
import fs from 'fs'

const host = '192.168.227.130'
const port = 8000

import app from './src/app.js'


try {
    https
    .createServer({
        key: fs.readFileSync('cert/privateKey.pem'),
        cert: fs.readFileSync('cert/certificate.pem'),
    },
    app)
    .listen(port, host, () => {
        console.log(`recognizer server on https://${host}:${port}`)
    })
} catch (e) {
    console.log('error ', e.message)
    process.exit(1)
}

