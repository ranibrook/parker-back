const userService = require('../services/user-service')
const parkingService = require('../services/parking-service')
const BASE = '/user'

function addUserRoutes(app) {
    app.get('/user', (req, res) => {
        userService.query()
            .then(users => res.json(users))
    })

    app.post('/login', (req, res) => {
        const mail = req.body
        console.log('email:', mail);

        userService.checkLogin(mail)
            .then(user => res.json(user)).catch(err => {
                console.log('user is not exist');
            })
    })
    app.get('/user/:id', (req, res) => {
        const userId = req.params.id
        // console.log('ran veariel', req.params);
        Promise.all([
            userService.getById(userId),
            parkingService.getOwnedParkingsByUserId(userId),
            parkingService.getReservedParkingsByUserId(userId)
        ])
            .then(([user, ownedParkings, reservedParkings]) => {
                res.json({ user, reservedParkings, ownedParkings })
            })
    })

    app.post(`${BASE}/checkLogin`, (req, res) => {
        var userInfo = req.body
        userService.checkLogin(userInfo)
            .then(user => {
                req.session.user = user
                if (user) res.json(user)
                else res.status(401).send('Wrong user/pass');
            })
    })

    app.post(`${BASE}/add`, (req, res) => {
        var newUser = req.body
        userService.addUser(newUser)
            .then(newUser => res.json(newUser))
    })
}


module.exports = addUserRoutes;