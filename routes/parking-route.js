const parkingService = require('../services/parking-service.js')
const userService = require('../services/user-service.js')


function addParkingRoutes(app) {
    // PARKINGS REST API:

    // LIST
    app.get('/parking', (req, res) => {
        var lng = +req.query.lng
        var lat = +req.query.lat
        parkingService.getParkingsByLocation(lng,lat)
            .then(parkings => res.json(parkings))
    })

    // SINGLE
    app.get('/parking/:parkingId/', async (req, res) => {
        const parkingId = req.params.parkingId;

        var parking = await parkingService.getById(parkingId)
        var owner = await userService.getById(parking.ownerId)

        var x = {
            parking: parking,
            owner: owner
        }
        res.json(x)
      
    })

    // CREATE
    app.post('/parking/add', (req, res) => {
        const parking = req.body;        
            parkingService.add(parking)
            .then(parking =>  res.json(parking))
    })
    // DELETE
    app.delete('/parking/:parkingId', (req, res) => {
        const parkingId = req.params.parkingId;
        parkingService.remove(parkingId)
            .then(() => res.end(`Parking ${parkingId} Deleted `))
    })


    // UPDATE
    app.put('/parking/:parkingId', (req, res) => {
        const parking = req.body;
        parkingService.update(parking)
            .then(parking => res.json(parking))
    })



    // stop Parking
    app.put('/parking/stop', (req, res) => {
        const parking = req.body
        parkingService.stop(parking)
            .then(parking => res.json(parking))
    })


    // Reserving
    app.put('/parking/reserve/:parkingId', (req, res) => {
        const reserving = req.body;
        parkingService.reserve(reserving)
            .then(reserving => res.json(reserving))
    })
}


module.exports = addParkingRoutes;