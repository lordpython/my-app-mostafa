import express from 'express'
import { createServer as createViteServer } from 'vite'
import compression from 'compression'

async function createServer() {
  const app = express()

  // Add compression middleware
  app.use(compression())

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  })

  // Use vite's connect instance as middleware
  app.use(vite.middlewares)

  // Set proper content type headers
  app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
    }
    next()
  })

  app.listen(4000, () => {
    console.log('Server running at http://localhost:4000')
  })
}

createServer()
