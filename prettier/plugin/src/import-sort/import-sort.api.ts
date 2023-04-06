import { readFileSync } from 'fs'
import { globbySync }   from 'globby'
import { join }         from 'path'

const loadWorkspaces = () => {
  const exists = new Set()

  try {
    const { workspaces } = JSON.parse(readFileSync(join(process.cwd(), '/package.json'), 'utf-8'))

    if (workspaces?.length > 0) {
      const folders = globbySync(workspaces, {
        cwd: process.cwd(),
        onlyDirectories: true,
        absolute: true,
        expandDirectories: {
          files: ['package.json'],
          extensions: ['json'],
        },
      })

      folders.forEach((folder) => {
        try {
          const { name } = JSON.parse(readFileSync(join(folder, 'package.json'), 'utf-8'))

          if (name.startsWith('@')) {
            exists.add(name)
          }
        } catch (error) {} // eslint-disable-line
      })
    }
  } catch (error) {
    console.log(error) // eslint-disable-line
  }

  return exists
}

const workspaces = loadWorkspaces()

export const isWorkspaceModule = (imported: any) => {
  if (!(imported.moduleName.startsWith('@') && imported.moduleName.includes('/'))) {
    return false
  }

  const moduleParts = imported.moduleName.split('/')

  const moduleName =
    moduleParts.length === 2 ? imported.moduleName : moduleParts.slice(0, 2).join('/')

  return workspaces.has(moduleName)
}

export const isNodeModule = (imported: any, ...rest) => imported.moduleName.startsWith('node:')

export const isOrganizationModule = (imported: any) => imported.moduleName.startsWith('@')

export const isImportType = (imported: any) => imported.type === 'import-type'
