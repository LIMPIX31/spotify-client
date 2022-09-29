import chalk from 'chalk'
import { visualize } from '../utils.js'

export const Entity: ClassDecorator = (target: any) => {
  target.prototype['toString'] = function() {
    if (this.raw === undefined || this.raw === null) return 'Unknown Entity'
    return `${chalk.cyan.bold(`[${this.constructor.name}]`)} ` + visualize(this.raw)
  }
}
