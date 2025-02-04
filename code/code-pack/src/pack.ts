import type { PackOptions } from './pack.interfaces.js'
import type { PackOutputs } from './pack.interfaces.js'

import { stringify }        from '@iarna/toml'
import { execUtils }        from '@yarnpkg/core'
import { xfs }              from '@yarnpkg/fslib'
import { ppath }            from '@yarnpkg/fslib'

import { getTag }           from './tag.utils.js'

export const pack = async (
  { workspace, registry, publish, tagPolicy, builder, buildpack, require }: PackOptions,
  context: execUtils.PipevpOptions
): Promise<PackOutputs> => {
  const repo = workspace.replace('@', '').replace(/\//g, '-')
  const image = `${registry}${repo}`

  const tag = await getTag(tagPolicy)

  const envs = [
    {
      name: 'WORKSPACE',
      value: workspace,
    },
    {
      name: 'CNB_USER_ID',
      value: '1001',
    },
  ]

  if (require && require.length > 0) {
    envs.push({
      name: 'BP_REQUIRE',
      value: require.join(','),
    })
  }

  const descriptor = {
    project: {
      id: repo,
      name: repo,
      version: '0.0.1',
    },
    build: {
      exclude: ['.git', '.yarn/unplugged'],
      env: envs
    },
  }

  const descriptorPath = ppath.join(await xfs.mktempPromise(), 'project.toml')

  await xfs.writeFilePromise(descriptorPath, stringify(descriptor))

  const args = [
    'build',
    `${image}:${tag}`,
    '--descriptor',
    descriptorPath,
    '--buildpack',
    buildpack || 'monstrs/buildpack-yarn-workspace:0.0.3',
    '--builder',
    builder || 'monstrs/builder-base:buster',
    '--tag',
    `${image}:latest`,
    '--verbose',
  ]

  if (publish) {
    args.push('--publish')
  }

  // TODO: check and install pack

  await execUtils.pipevp('pack', args, context)

  return {
    images: [`${image}:${tag}`, `${image}:latest`],
    tags: [tag, 'latest'],
    workspace,
  }
}
