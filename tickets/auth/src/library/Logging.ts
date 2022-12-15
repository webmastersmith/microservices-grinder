import chalk from 'chalk';

export default class Log {
  public static log = (args: any) => this.info(args);
  public static info = (args: any) => console.log(chalk.blue(`[${new Date().toLocaleString()}] [INFO]`, typeof args === 'string' ? chalk.blueBright(args) : args));
  public static warn = (args: any, path: string = '', name: string = '') =>
    console.log(
      chalk.yellow(`[${new Date().toLocaleString()}] [INFO]`, typeof args === 'string' ? chalk.yellowBright(args) : args),
      path ? chalk.yellowBright(path) : '',
      name ? chalk.redBright(name) : ''
    );
  public static error = (args: any) => console.log(chalk.red(`[${new Date().toLocaleString()}] [INFO]`, typeof args === 'string' ? chalk.redBright(args) : args));
}
