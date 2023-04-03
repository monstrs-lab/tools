import { join }                from 'node:path'
import { fileURLToPath }       from 'node:url'

import { Tree }                from '@angular-devkit/schematics'
import { SchematicTestRunner } from '@angular-devkit/schematics/testing'
import { UnitTestTree }        from '@angular-devkit/schematics/testing'

describe('schematics', () => {
  describe('migrations', () => {
    let tree: Tree
    let schematicRunner: SchematicTestRunner

    beforeEach(() => {
      tree = new UnitTestTree(Tree.empty())

      schematicRunner = new SchematicTestRunner(
        '@monstrs/schematics',
        join(fileURLToPath(new URL('.', import.meta.url)), '../../migrations.json')
      )
    })

    it('should add .next to gitignore', async () => {
      const result = await schematicRunner.runSchematic('add-next-output-to-gitignore', {}, tree)

      expect(result.read('.gitignore')!.toString()).toContain('.next')
    })
  })
})
