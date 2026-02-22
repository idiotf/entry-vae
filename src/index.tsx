import { jsxToProject } from 'entry-jsx'
import { createWriteStream } from 'fs'
import { pack } from 'tar-stream'
import { resolve } from 'path'
import { Main } from './main'
import { setWeightFromFile } from './matrix'

function getProjectJson() {
  return JSON.stringify(jsxToProject(<Main />))
}

function createTar(projectJson: string) {
  const tar = pack()
  tar.entry({ name: 'temp/project.json' }, projectJson)
  tar.finalize()
  return tar
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`\
Entry VAE builder

Usage: bun run build [path] [...flags]

Flags:
  -h, --help  Show this message
  --copy      Copy built project.json file to clipboard
  --open      Open built .ent file on Entry offline editor`)

  process.exitCode = 0
} else {
  await setWeightFromFile('prod')

  const path = process.argv[2]
  if (path) {
    console.time('build complete')

    const projectJson = getProjectJson()
    if (process.argv.includes('--copy'))
      await Bun.$`echo ${projectJson} | clip`

    const promise = Bun.write(path, [])
    const tar = createTar(projectJson)

    await promise
    tar.pipe(createWriteStream(path))

    console.timeEnd('build complete')

    if (process.argv.includes('--open'))
      Bun.spawn(['entry', resolve(process.cwd(), path)]).unref()
  } else {
    createTar(getProjectJson()).pipe(process.stdout)
  }
}
