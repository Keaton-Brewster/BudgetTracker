const router = require("express").Router();

router.get('/', (request, response) => {
    response.sendFile(path.resolve('/index.html'));
})

module.exports = router;