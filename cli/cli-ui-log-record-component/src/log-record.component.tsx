import type { LogRecord as Record }        from '@monstrs/logger'

import { LOGGER_NAMESPACE_ATTRIBUTE_NAME } from '@monstrs/logger'
import { Box }                             from 'ink'
import { FC }                              from 'react'
import React                               from 'react'

import { LogStackTrace }                   from './log-stack-trace.component.jsx'
import { LogMessage }                      from './log-message.component.jsx'
import { LogNamespace }                    from './log-namespace.component.jsx'

export interface LogRecordProps extends Record {
  namespace?: string
  stack?: string
}

export const LogRecord: FC<LogRecordProps> = ({ namespace, body, stack, attributes = {} }) => (
  <Box flexDirection='column'>
    <Box flexDirection='row'>
      <Box flexGrow={1}>
        <Box paddingRight={1}>
          <LogNamespace>{namespace || attributes[LOGGER_NAMESPACE_ATTRIBUTE_NAME]}</LogNamespace>
        </Box>
        <Box>
          <LogMessage>{body}</LogMessage>
        </Box>
      </Box>
    </Box>
    <LogStackTrace>{stack || attributes['@stack']}</LogStackTrace>
  </Box>
)
