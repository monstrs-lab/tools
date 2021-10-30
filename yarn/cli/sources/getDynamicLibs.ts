import * as cli       from '@yarnpkg/cli';
import * as core      from '@yarnpkg/core';
import * as fslib     from '@yarnpkg/fslib';
import * as libzip    from '@yarnpkg/libzip';
import * as parsers   from '@yarnpkg/parsers';
import * as shell     from '@yarnpkg/shell';
import * as clipanion from 'clipanion';
import * as semver    from 'semver';
import * as typanion  from 'typanion';
import * as yup       from 'yup';
import * as runtim from '@monstrs/yarn-runtime'

export const getDynamicLibs = () => new Map<string, any>([
  [`@yarnpkg/cli`, cli],
  [`@yarnpkg/core`, core],
  [`@yarnpkg/fslib`, fslib],
  [`@yarnpkg/libzip`, libzip],
  [`@yarnpkg/parsers`, parsers],
  [`@yarnpkg/shell`, shell],

  // Those ones are always useful
  [`clipanion`, clipanion],
  [`semver`, semver],
  [`typanion`, typanion],
  // TODO: remove in next major
  [`yup`, yup],
  //['@monstrs/yarn-runtime', runtim],
  ['@monstrs/yarn-runtime', () => core.miscUtils.dynamicRequire('@monstrs/yarn-runtime')]
]);
