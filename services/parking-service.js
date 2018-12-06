const mongoService = require('./mongo-service')

const ObjectId = require('mongodb').ObjectId;


function query() {
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('parking');
            return collection.find({}).toArray()
        })
}

function remove(parkingId) {
    parkingId = new ObjectId(parkingId)
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('parking');
            return collection.remove({ _id: parkingId })
        })
}
function getById(parkingId) {
    parkingId = new ObjectId(parkingId)
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('parking');
            return collection.findOne({ _id: parkingId })
        })
}

function getOwnedParkingsByUserId(userId) {
    userId = new ObjectId(userId)
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('parking');
            return collection.find({ ownerId: userId }).toArray();
        })
}

function getReservedParkingsByUserId(userId) {
    userId = new ObjectId(userId)
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('parking');
            return collection.find({ reserverId: userId }).toArray();
        })
}
function add(parking) {
    parking.ownerId = new ObjectId(parking.ownerId);  
    parking.position = {
        type : 'Point',
        coordinates  : [parking.location.lat, parking.location.lng]
    }
    
    parking.createdAt = Date.now(); 
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('parking');
            return collection.insertOne(parking)
                .then(result => {
                    parking._id = result.insertedId;
                    return parking;
                })
        })
}


function reserve(parking) {
    parking.reserverId = new ObjectId(parking.reserverId)
    parking._id = new ObjectId(parking._id)
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('parking');
            return collection.updateOne({ _id: parking._id },
                { $set: { reserverId: parking.reserverId, occupiedUntil: parking.occupiedUntil, iconUrl: parking.iconUrl } })
                .then(result => {
                    return parking;
                })
        })
}


function update(parking) {
    parking._id = new ObjectId(parking._id)
    if(parking.reserverId) parking.reserverId = new ObjectId(parking.reserverId)
    parking.ownerId = new ObjectId(parking.ownerId)
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('parking');
            return collection.updateOne({ _id: parking._id }, { $set: parking })
                .then(result => {  
                    return parking;
                })
        })
}
function stop(parking) {
    parking._id = new ObjectId(parking._id)
    parking.ownerId = new ObjectId(parking.ownerId)    
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('parking');
            return collection.updateOne({ _id: parking._id }, { $set: parking })
                .then(result => {
                    return parking;
                })
        })
}

async function getParkingsByLocation(lng, lat) {
    var db = await mongoService.connect()
    return db.collection('parking')
        .find({
            "position": {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            lng,
                            lat
                        ]
                    },
                //  $maxDistance: 10000
                }
            }
        }).toArray()
}



module.exports = {
    query,
    remove,
    getById,
    add,
    update,
    reserve,
    stop,
    getOwnedParkingsByUserId,
    getReservedParkingsByUserId,
    getParkingsByLocation
}
