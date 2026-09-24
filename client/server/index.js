import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { MongoClient } from 'mongodb'

const app = express(); app.use(cors()); app.use(express.json())
let db
if (process.env.MONGODB_URI) {
  MongoClient.connect(process.env.MONGODB_URI).then(client => { db = client.db(process.env.MONGODB_DB || 'deadly_assault'); console.log('MongoDB connected') }).catch(err => console.warn('MongoDB unavailable:', err.message))
}

app.get('/api/health', (_, res) => res.json({ status: 'ok', database: Boolean(db) }))
app.get('/api/guides/:slug', async (req, res) => {
  if (!db) return res.status(503).json({ message: 'Database not connected' })
  const guide = await db.collection('guides').findOne({ slug: req.params.slug }, { projection: { _id: 0 } })
  if (!guide) return res.status(404).json({ message: 'Guide not found' })
  res.json(guide)
})

app.listen(process.env.PORT || 5000, () => console.log(`API running on port ${process.env.PORT || 5000}`))
