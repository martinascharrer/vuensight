import history from 'connect-history-api-fallback';
import express from 'express';
import { join } from 'path';

import { parse } from '@vue-component-insight/parser/dist';

export const startServer = async (directory: string, webpackConfigPath?: string,  tsConfigPath?: string) => {
    const app = express();

    app.get('/parse-result', async (request, response) => {
        const parseResult = await parse(directory, 'vue', webpackConfigPath, tsConfigPath);
        response.json(parseResult);
    });

    app.use(history());

    app.use(express.static(join(__dirname, '../../app/dist')));

    app.listen(4444, () => {
        console.log('server is listening on port 4444');
    });
};
