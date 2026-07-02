type LogLevel = 'info' | 'warn' | 'error';

type LogContext = Record<string, string | number | boolean | null | undefined>;

function writeLog(level: LogLevel, message: string, context: LogContext = {}) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    service: 'raeburnai-workflow-auditor',
    ...redact(context)
  };

  const line = JSON.stringify(payload);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.info(line);
}

function redact(context: LogContext): LogContext {
  const output: LogContext = {};
  for (const [key, value] of Object.entries(context)) {
    if (/key|secret|token|password|document|text/i.test(key)) {
      output[key] = '[redacted]';
    } else {
      output[key] = value;
    }
  }
  return output;
}

export const logger = {
  info: (message: string, context?: LogContext) => writeLog('info', message, context),
  warn: (message: string, context?: LogContext) => writeLog('warn', message, context),
  error: (message: string, context?: LogContext) => writeLog('error', message, context)
};
