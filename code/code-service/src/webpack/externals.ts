import { getProjectUnpluggedDependencies } from '@monstrs/code-project'
import { getWorkspace }                    from '@monstrs/code-project'

export const unusedExternals = [
  // nestjs
  'cli-color',
  'flaschenpost',
  'amqp-connection-manager',
  'kafkajs',
  'amqplib',
  'redis',
  'mqtt',
  'nats',
  '@nestjs/websockets',

  // typeorm
  'typeorm-aurora-data-api-driver',
  'react-native-sqlite-storage',
  '@sap/hana-client',
  'better-sqlite3',
  'mongodb',
  'oracledb',
  'pg-native',
  'mysql',
  'ioredis',
  'hdb-pool',
  'mysql2',
  'mssql',
  'sql.js',
]

export const getExternals = async (cwd: string) => {
  const workspace = await getWorkspace(cwd)

  const workspaceExternals: Array<String> = Object.keys(
    workspace?.manifest?.raw?.externalDependencies || {}
  )

  const unpluggedExternals: Array<String> = Array.from(await getProjectUnpluggedDependencies())

  return Array.from(new Set([...workspaceExternals, ...unpluggedExternals, ...unusedExternals]))
}
