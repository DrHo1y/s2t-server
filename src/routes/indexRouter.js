import { Router } from 'express'
//import { memUsage } from '../api_func/memUsage.js'
const router = Router()

import { speech2text } from '../api_func/speech2text.js'

router.get('/', async (req, res) => {
  res.status(200).json({ msg: 'Welcom to API!' })
})

//memUsage('router')

router.put('/recognize', speech2text)


export default router
