const express = require('express');
const path = require('path');

import { parse } from '@vue-component-insight/parser/dist';

export const startServer = async (dir) => {
    const app = express();

    app.use(express.static(path.join(__dirname, '../../app/dist')));

    app.get('/test', (req, res) => {
        res.sendFile(__dirname, '../../app/dist/index.html');
    });

    app.listen(4444, () => {
        console.log('server is listening on port 4444');
    });

    app.get('/parse-result', async (req, res) => {
        const parseResult = await parse(dir);

        res.json(parseResult);
    });
};
