const { Router } = require('express');
const router = Router();

const Watson = require("./controllers/watson");

router.get('/', (req, res) =>{
    res.send('Server bot is up and running');
});

// Watson Assistant
router.post("/mensagem", Watson.mensagem);

module.exports = router;