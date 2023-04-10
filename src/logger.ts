class Logger {
  static staticLogger: nkruntime.Logger | undefined;

  static load(logger: nkruntime.Logger) {
    if (!Logger.staticLogger) {
      Logger.staticLogger = logger;
    }
  }

  static info(data: any, signal: string = '') {
    if (typeof data === 'string')
      Logger.staticLogger?.info(`${data}||${signal}`);
    else Logger.staticLogger?.info(`${JSON.stringify(data)}||${signal}`);
  }

  static debug(data: any, signal: string = '') {
    if (typeof data === 'string')
      Logger.staticLogger?.debug(`${data}||${signal}`);
    else Logger.staticLogger?.debug(`${JSON.stringify(data)}||${signal}`);
  }

  static warn(data: any, signal: string = '') {
    if (typeof data === 'string')
      Logger.staticLogger?.warn(`${data}||${signal}`);
    else Logger.staticLogger?.warn(`${JSON.stringify(data)}||${signal}`);
  }
  static error(data: any, signal: string = '') {
    if (typeof data === 'string')
      Logger.staticLogger?.error(`${data}||${signal}`);
    else Logger.staticLogger?.error(`${JSON.stringify(data)}||${signal}`);
  }
}
