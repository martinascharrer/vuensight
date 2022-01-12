const express = require('express');

const app = express();

app.listen(4444, () => {
    console.log('server is listening on port 5000')
});

app.get('/api/products', (req, res) => {
    res.json([
        { name: 'iPhone', price: 800 },
        { name: 'iPad', price: 650 },
        { name: 'iWatch', price: 750 }
    ])
});
