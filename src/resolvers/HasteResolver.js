/**
 * Copyright 2017-present, Callstack.
 * All rights reserved.
 *
 * @flow
 */
type Request = {
  request?: string,
};

type Options = {
  directories: Array<string>,
  hasteOptions?: *,
};

const findProvidesModule = require('../utils/findProvidesModule');

/**
 * Resolver plugin that allows requiring haste modules with Webpack
 */
function HasteResolver(options: Options) {
  const hasteMap = findProvidesModule(
    options.directories,
    options.hasteOptions
  );

  this.apply = resolver => {
    resolver.hooks.resolve.tapAsync(
      'described-resolve',
      (request: Request, context: *, callback: Function) => {
        const innerRequest = request.request;

        if (!innerRequest || !hasteMap[innerRequest]) {
          return callback();
        }

        const obj = Object.assign({}, request, {
          request: hasteMap[innerRequest],
        });

        return resolver.doResolve(
          resolver.hooks.resolve,
          obj,
          `Aliased ${innerRequest} with haste mapping: ${hasteMap[
            innerRequest
          ]}`,
          context,
          callback
        );
      }
    );
  };
}

module.exports = HasteResolver;
