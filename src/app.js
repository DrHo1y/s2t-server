import express from 'express'
import { cors } from './midleware/cors.js'
import indexRouter from './routes/indexRouter.js'
import bodyParser from 'body-parser'


const app = express()

app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 100000, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cors)
app.use('/api/', indexRouter)

export default app
