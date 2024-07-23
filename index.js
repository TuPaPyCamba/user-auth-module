import express from 'express'

const app = express()

const PORT = process.env.PORT ?? 3000

app.get('/', (req, res)=>{
    res.send('SERVER: funcionando correctamente')
})

app.listen(PORT, ()=>{
    console.log(`SERVER: servicios funcionando en el la siguiente direccion. \n ruta de servicio:          http://localhost:${PORT}`)
})
