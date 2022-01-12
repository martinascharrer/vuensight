const express = require('express');

import { parse } from '@vue-component-insight/parser/dist';

export const startServer = async (dir) => {
    const app = express();

    app.listen(4444, () => {
        console.log('server is listening on port 4444')
    });

    app.get('/parse-result', async (req, res) => {
        const parseResult = await parse(dir);

        res.json(parseResult);
    });
};
