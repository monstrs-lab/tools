import type { Attributes }              from '@monstrs/logger'
import type { AttributeValue }          from '@monstrs/logger'
import type { FC }                      from 'react'
import type { ReactElement }            from 'react'

import { LOGGER_SQL_ATTRIBUTE_NAME }    from '@monstrs/mikro-orm-logger'
import { LOGGER_PARAMS_ATTRIBUTE_NAME } from '@monstrs/mikro-orm-logger'
import { SqlHighlighter }               from '@mikro-orm/sql-highlighter'
import { Text }                         from 'ink'
import { Box }                          from 'ink'
import { format }                       from 'sql-formatter'
import { nanoid }                       from 'nanoid'
import React                            from 'react'

export interface LogMikroOrmProps {
  children?: Attributes
}

export const LogMikroOrmSql: FC<{ children?: AttributeValue }> = ({ children }) => {
  if (children) {
    return (
      <Box paddingLeft={4}>
        <Text>SQL:</Text>
        <Text>{'    '}</Text>
        <Text>
          {new SqlHighlighter().highlight(format(children as string, { language: 'postgresql' }))}
        </Text>
      </Box>
    )
  }

  return null
}

export const LogMikroOrmParameters: FC<{ children?: AttributeValue }> = ({ children }) => {
  if (children && Array.isArray(children) && children.length > 0) {
    const params = (children as Array<string>).reduce<Array<ReactElement<any, any>>>((
      result,
      param,
      index
    ) => {
      result.push(
        <Text key={nanoid()} color='yellow'>
          {param}
        </Text>
      )

      if (index < children.length - 1) {
        result.push(
          <Text key={nanoid()} color='white'>
            ,
          </Text>
        )
      }

      return result
    }, [])

    return (
      <Box paddingLeft={4}>
        <Text>PARAMS:</Text>
        <Text> </Text>
        <Text color='white'>[</Text>
        {params}
        <Text color='white'>]</Text>
      </Box>
    )
  }

  return null
}

export const LogMikroOrm: FC<LogMikroOrmProps> = ({ children }) => (
  <>
    <LogMikroOrmSql>{children?.[LOGGER_SQL_ATTRIBUTE_NAME]}</LogMikroOrmSql>
    <LogMikroOrmParameters>{children?.[LOGGER_PARAMS_ATTRIBUTE_NAME]}</LogMikroOrmParameters>
  </>
)
