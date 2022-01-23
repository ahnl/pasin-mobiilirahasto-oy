console.log("Pasin mobiilirahasto Oy web server")

const express = require("express")
const path = require("path")

const app = express()

app.use(express.static(path.join(__dirname, "../public")))

const accounts = [
    {
        name: "Pasi",
        account: "+358000000001",
        balance: 8192
    },
    {
        name: "Antti",
        account: "+358000000002",
        balance: 12
    },
    {
        name: "Simo",
        account: "+358000000003",
        balance: 9000
    },
    {
        name: "Anonyymi",
        account: "+358000000004",
        balance: 20
    }
]
 
app.get("/api/info", (req, res) => {
    if (!req.query.account) return res.status(400).end()
    res.json(accounts[accounts.findIndex(a => a.account == req.query.account)])
})

app.get("/api/send", (req, res) => {
    if (!req.query.from || !req.query.to || !req.query.amount) return res.status(400).end()
    console.log(req.query.from)

    const fromIndex = accounts.findIndex(a => a.account == req.query.from)
    const toIndex = accounts.findIndex(a => a.account == req.query.to)

    if ( fromIndex < 0 || toIndex < 0 ) return res.status(200).json({status: "fail", message: "Tiliä ei löytynyt!"})
    if ( accounts[fromIndex].balance - parseInt(req.query.amount) < 0 ) return res.status(200).json({status: "fail", message: "Tililläsi ei ole tarpeeksi rahaa"})
    
    accounts[fromIndex].balance -= parseInt(req.query.amount)
    accounts[toIndex].balance += parseInt(req.query.amount)

    res.json({
        status: "ok",
        message: "Siirto on tehty! Kiitos palvelumme käytöstä, arvoisa asiakkaamme.",
        ...accounts[fromIndex]
    })
})

/*app.get("/", (req, res) => {
    res.end("maito")
})*/

app.listen(80)