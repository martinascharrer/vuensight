import { normalize } from 'path';
import {
  cruise, IDependency, IReporterOutput, IModule
} from 'dependency-cruiser';

// extract features of dependency-cruiser are still experimental and therefore not exported by default.
// See: https://github.com/sverweij/dependency-cruiser/blob/develop/doc/api.md#utility-functions
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import extractTSConfig from 'dependency-cruiser/config-utl/extract-ts-config';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import extractWebpackResolveConfig from 'dependency-cruiser/config-utl/extract-webpack-resolve-config';

import { Dependency } from  '@vuensight/types';

export const findDependencies = (
    directory = 'src',
    fileType?: string,
    webpackConfigPath?: string,
    tsConfigPath?: string
):IModule[] | null => {
  let cruiseResult: IReporterOutput | null = null;
  const webpackResolveConfig = webpackConfigPath ? extractWebpackResolveConfig(webpackConfigPath) : null;
  const tsConfig = tsConfigPath ? extractTSConfig(tsConfigPath) : null;
  try {
    cruiseResult = cruise(
        [directory],
        {
          includeOnly: `.${fileType}`,
          exclude: ['node_modules'],
          doNotFollow: {
             path: 'node_modules',
             dependencyTypes: [
                'npm',
                'npm-dev',
                'npm-optional',
                'npm-peer',
                'npm-bundled',
                'npm-no-pkg',
             ],
          },
          forceDeriveDependents: true,
        },
        webpackResolveConfig,
        tsConfig
    );
  } catch (error) {
    console.error('Something went wrong cruising the project ', error);
  }
  if (cruiseResult && typeof cruiseResult?.output !== 'string') return cruiseResult?.output?.modules;
  return null;
};

export const formatDependencies = (dependencies: IDependency[]): Dependency[] => {
  return dependencies.map((dependency) => ({
      fullPath: normalize(dependency.resolved),
  }));
};
