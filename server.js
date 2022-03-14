const express = require('express');
const fs = require('fs');
const addresses = require('./db.json');

let app = express();

function validate(req, res, next){
    if(req.method === 'POST'){
        let {id, flat_no, street, landmark, area, city, pincode} = req.body
        if(id == null){
            console.log("here", id, pincode.length, pincode)
            res.statusCode = 500;
            res.end('{"error":"INVALID INPUT"}');
        }

        next();
    }

    else if(req.method === "DELETE"){
        try{
            next()
        }
        catch(err){
            console.log(err)
        }
    }
    else{
        next();
    }
}

app.use( express.json() )
app.use(validate)


app.get('/api/addresses', (req, res) => {
    res.json(addresses);
})

app.post('/api/addresses', (req, res) => {
    let address = req.body;
    console.log(address);
    addresses.push(address)
    let newAddress = JSON.stringify(addresses, null, 2)
    fs.writeFile('db.json', newAddress, () => {
        console.log("Data added")
    })

    res.json(address)
})

app.delete('/api/addresses/:id', (req, res) => {
    const {id} = req.params;

    let newAddress = addresses.filter( (addr) => addr.id != id);
    let address = JSON.stringify(newAddress, null, 2)
    fs.writeFile('db.json', address, () => {
        console.log("Address Deleted")
    })
    res.json(newAddress)
})

app.put('/api/addresses/:id', (req, res) => {
    let {id} = req.params;
    console.log(id)
    let {flat_no, street, city} = req.body;
    console.log(id)

    let address = addresses.find( (addr) => addr.id == id);
    if(flat_no){
        address.flat_no = flat_no;
    }
    if(street){
        address.street = street;
    }
    if(city){
        address.city = city
    }

    addresses.push(address);
    let newAddress = JSON.stringify(addresses, null, 2);
    fs.writeFile('db.json', newAddress, () => {
        console.log("Adress successfully updated.")
    })

    res.json(address)

})

app.listen(8000, () => {
    console.log("Server started.....")
})