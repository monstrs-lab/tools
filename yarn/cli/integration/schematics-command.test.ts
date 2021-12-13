import { PortablePath }     from '@yarnpkg/fslib'
import { xfs }              from '@yarnpkg/fslib'

import { packageUtils }     from './utils'
import { makeTemporaryEnv } from './utils'

jest.setTimeout(60000)

describe('yarn', () => {
  describe('commands', () => {
    describe('schematics', () => {
      test('it should init project', async () => {
        await makeTemporaryEnv(
          {
            dependencies: {
              '@monstrs/schematics': await packageUtils.pack('@monstrs/schematics'),
            },
          },
          async ({ path, run, source }) => {
            await run('install')

            const { code } = await run('generate', 'project', '--type', 'project')

            expect(code).toBe(0)
            expect(xfs.existsPromise(`${path}/tsconfig.json` as PortablePath)).resolves.toBe(true)
            expect(xfs.existsPromise(`${path}/.gitignore` as PortablePath)).resolves.toBe(true)
            expect(
              xfs.existsPromise(`${path}/config/husky/.gitignore` as PortablePath)
            ).resolves.toBe(true)
            expect(
              xfs.existsPromise(`${path}/config/husky/commit-msg` as PortablePath)
            ).resolves.toBe(true)
            expect(
              xfs.existsPromise(`${path}/config/husky/pre-commit` as PortablePath)
            ).resolves.toBe(true)
            expect(
              xfs.existsPromise(`${path}/config/husky/prepare-commit-msg` as PortablePath)
            ).resolves.toBe(true)
            expect(
              xfs.existsPromise(`${path}/.github/workflows/checks.yaml` as PortablePath)
            ).resolves.toBe(true)
            expect(
              xfs.existsPromise(`${path}/.github/workflows/preview.yaml` as PortablePath)
            ).resolves.toBe(true)
            expect(
              xfs.existsPromise(`${path}/.github/workflows/release.yaml` as PortablePath)
            ).resolves.toBe(true)
          }
        )
      })

      test('it should init project libraries', async () => {
        await makeTemporaryEnv(
          {
            dependencies: {
              '@monstrs/schematics': await packageUtils.pack('@monstrs/schematics'),
            },
          },
          async ({ path, run, source }) => {
            await run('install')

            const { code } = await run('generate', 'project', '--type', 'libraries')

            expect(code).toBe(0)
            expect(xfs.existsPromise(`${path}/tsconfig.json` as PortablePath)).resolves.toBe(true)
            expect(xfs.existsPromise(`${path}/.gitignore` as PortablePath)).resolves.toBe(true)
            expect(
              xfs.existsPromise(`${path}/config/husky/.gitignore` as PortablePath)
            ).resolves.toBe(true)
            expect(
              xfs.existsPromise(`${path}/config/husky/commit-msg` as PortablePath)
            ).resolves.toBe(true)
            expect(
              xfs.existsPromise(`${path}/config/husky/pre-commit` as PortablePath)
            ).resolves.toBe(true)
            expect(
              xfs.existsPromise(`${path}/config/husky/prepare-commit-msg` as PortablePath)
            ).resolves.toBe(true)
            expect(
              xfs.existsPromise(`${path}/.github/workflows/checks.yaml` as PortablePath)
            ).resolves.toBe(true)
            expect(
              xfs.existsPromise(`${path}/.github/workflows/publish.yaml` as PortablePath)
            ).resolves.toBe(true)
            expect(
              xfs.existsPromise(`${path}/.github/workflows/version.yaml` as PortablePath)
            ).resolves.toBe(true)
          }
        )
      })
    })
  })
})
