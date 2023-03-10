import history from 'connect-history-api-fallback';
import express from 'express';
import { join } from 'path';

import { parse } from '@vuensight/parser';

export default async (directory: string, port?: number, webpackConfigPath?: string, tsConfigPath?: string) => {
  const app = express();

  const localPort = port || 4444;

  app.get('/parse-result', async (request, response) => {
    const parseResult = await parse(directory, 'vue', webpackConfigPath, tsConfigPath);
    response.json(parseResult);
  });

  app.use(history());

  app.use(express.static(join(__dirname, '../app')));

  app.listen((+localPort), () => {
    console.log(`👀 vuensight: http://localhost:${localPort}`);
  });
};
