export interface PackOptions {
  workspace: string
  registry: string
  publish: boolean
  tagPolicy: TagPolicy
}

export type TagPolicy = 'hash-timestamp' | 'revision'
