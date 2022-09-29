import { Awaitable, FactoryValue } from './types.js'
import chalk from 'chalk'
import { Api } from './api.types.js'

const isFunction = (value: any): value is Function => typeof value === 'function'

export const unfactorizeValue = async <T>(value?: FactoryValue<T>) =>
  value !== undefined ? isFunction(value) ? await value() : await value : value

export const Throw = (err: any) => {
  throw err
}

export const unwrapAwaitable = async <T>(awaitable: Awaitable<T>) => await awaitable

export const createSpotifyUri = (object: Api.Basic) => {
  return `spotify:${object.type}:${object.id}`
}

export const resolveUris = <T extends string | Api.Basic>(target: T | T[]): string[] => {
  if(Array.isArray(target))
    return target.map(v => resolveUris(v)).flat()
  else {
    if(typeof target === 'string') return [target]
    else return [createSpotifyUri(target)]
  }
}

export const resolveId = <T extends string>(target: string | Api.Basic<T>) => {
  if(typeof target === 'string') return target
  else return target.id
}

export const visualize = (o: any, _indent = 0, _depth = 0): string => {
  if (o === undefined) return chalk.red.bold('undefined')
  if (o === null) return chalk.red.bold('null')
  if (Array.isArray(o)) {
    if (_depth + 1 > 3) return chalk.grey.bold('...')
    const overflow = o.length > 10
    return typeof o[0] === 'object' ?
      `${chalk.grey.bold('[\n')}${o
        .map(v => visualize(v, 0, _depth + 1))
        .map(v => v.split('\n').map(v => '  '.repeat(_indent + 1) + v).join('\n'))
        .map(v => v + '\n')
        .join('')}${chalk.grey.bold('  '.repeat(_indent) + ']')}`
      : `${chalk.cyan.bold('[')}${o
        .slice(0, 10)
        .join(chalk.bold.grey(', '))}${overflow ? chalk.grey.bold(', ') + chalk.bold.cyan(`${o.length - 10} more items`) : ''}${chalk.cyan.bold(']')}`
  }
  if (typeof o !== 'object') {
    if (typeof o === 'string') {
      const from = o.length
      o = o.substring(0, 100)
      const to = o.length
      if (from !== to) return chalk.yellowBright(o).trimEnd() + chalk.bold.cyan('...')
      else return chalk.yellowBright(o)
    }
    return chalk.blueBright(o)
  }
  let result = ''
  const indent = '  '.repeat(_indent)
  result += chalk.bold.grey('{\n')
  for (const [key, value] of Object.entries(o)) {
    if (_depth > 3) return chalk.grey.bold('...')
    result += `  ${indent}${chalk.greenBright(key)}${chalk.bold.grey(':')} ${visualize(value, _indent + 1, _depth + 1)}\n`
  }
  result += indent + chalk.bold.grey('}')
  return result
}
