// src/server.ts
import { app } from './app'

const start = async () => {
  try {
    await app.listen({ port: 3000 })
    app.log.info('Servidor rodando na porta 3000')
  } catch (err) {
    // Se por algum motivo app.log estiver indefinido, use console.error
    if (app && app.log && app.log.error) {
      app.log.error(err)
    } else {
      console.error(err)
    }
    process.exit(1)
  }
}

start()
