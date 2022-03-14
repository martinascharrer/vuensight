import * as history from 'connect-history-api-fallback';
import * as express from 'express';
import { join } from 'path';

import { parse } from '@vue-component-insight/parser/dist';

export const startServer = async (dir) => {
    const app = express();

    app.get('/parse-result', async (req, res) => {
        const parseResult = await parse(dir);

        res.json(parseResult);
    });

    app.use(history());

    app.use(express.static(join(__dirname, '../../app/dist')));

    app.listen(4444, () => {
        console.log('server is listening on port 4444');
    });
};
