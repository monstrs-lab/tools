export interface PackOptions {
  workspace: string
  registry: string
  publish: boolean
  tagPolicy: TagPolicy
}

export type TagPolicy = 'hash-timestamp' | 'revision'

export interface PackOutputs {
  images: Array<string>
  tags: Array<string>
  workspace: string
}
