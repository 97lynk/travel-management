export class Logger {

  static info(message, ...args) {
    Logger.log('info', message, ...args);
  };
  static success(message, ...args){
    Logger.log('success', message, ...args);
  };

  static error(message, ...args){
    Logger.log('error', message, ...args);
  };

  static warn(message, ...args){
    Logger.log('warn', message, ...args);
  };

  static log(LEVEl, message, ...args){
    let color = 'black';
    switch (LEVEl) {
      case 'success':
        color = 'green';
        break;
      case 'error':
        color = 'red';
        break;
      case 'warn':
        color = 'darkorange';
        break;
      case 'info':
      default:
        color = 'black';
    }
    console.log('%c' + message, `color: ${color}`, ...args);
  };
}
