const router = require("express").Router();

router.get('/', (request, response) => {
    try {
        response.sendFile('index.html');
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = router;