import { run }                        from '@monstrs/buildpack-core'

import { YarnWorkspaceStartDetector } from './yarn-workspace-start.detector'

run(new YarnWorkspaceStartDetector())

// @ts-ignore
const core = require('@monstrs/buildpack-core') // eslint-disable-line
