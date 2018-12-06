const mongoService = require('./mongo-service') 

const ObjectId = require('mongodb').ObjectId;

function query() {
    return mongoService.connect()
        .then(db => {
            const collection = db.collection('geo_parking_check');
            return collection.find({}).toArray()
        })
        .then(parkings => {
            return parkings.map( park => {
                var array = park.location.coordinates
                var location = {
                    lng : array[0],
                    lat : array[1]
                }
                return { ...park , location }
            })
        })
}

