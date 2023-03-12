import express from 'express'

import { cors } from './midleware/cors.js'
import indexRouter from './routes/indexRouter.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'
import bodyParser from 'body-parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 100000, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))

app.use(cors)
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/api/', indexRouter)

export default app
