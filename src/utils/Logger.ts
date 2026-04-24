/**
 * ============================================================
 * LOGGER UTILITY
 * ============================================================
 *
 * 📚 LEARNING NOTES:
 * A centralized logger provides:
 * 1. Consistent log formatting across all tests
 * 2. Log levels (info, warn, error, debug)
 * 3. File-based log storage for post-execution analysis
 * 4. Test step tracking with timestamps
 *
 * 🏗️ OOP - SINGLETON PATTERN:
 * Only one Logger instance exists in the application.
 * This ensures all log output goes to the same place.
 * ============================================================
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Log level enum for filtering log output.
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Logger class implementing the Singleton pattern.
 *
 * 📚 OOP - SINGLETON:
 * The Singleton pattern ensures a class has only one instance.
 * Use Logger.getInstance() instead of new Logger().
 */
export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private logFilePath: string;
  private logEntries: string[] = [];

  /**
   * Private constructor prevents direct instantiation.
   * This is key to the Singleton pattern.
   */
  private constructor(logLevel: LogLevel = LogLevel.INFO) {
    this.logLevel = logLevel;
    const logsDir = path.resolve(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.logFilePath = path.join(logsDir, `test-run-${timestamp}.log`);
  }

  /**
   * Get the singleton Logger instance.
   *
   * 📚 LEARNING NOTE:
   * This is the only way to get a Logger.
   * First call creates the instance, subsequent calls reuse it.
   */
  static getInstance(logLevel?: LogLevel): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(logLevel);
    }
    return Logger.instance;
  }

  /**
   * Reset the singleton (useful for testing).
   */
  static resetInstance(): void {
    Logger.instance = undefined as unknown as Logger;
  }

  // ============================================================
  // LOG METHODS
  // ============================================================

  /**
   * Log an informational message.
   */
  info(message: string, ...args: unknown[]): void {
    this.log(LogLevel.INFO, '📘 INFO', message, ...args);
  }

  /**
   * Log a warning message.
   */
  warn(message: string, ...args: unknown[]): void {
    this.log(LogLevel.WARN, '⚠️ WARN', message, ...args);
  }

  /**
   * Log an error message.
   */
  error(message: string, ...args: unknown[]): void {
    this.log(LogLevel.ERROR, '❌ ERROR', message, ...args);
  }

  /**
   * Log a debug message (only shown when log level is DEBUG).
   */
  debug(message: string, ...args: unknown[]): void {
    this.log(LogLevel.DEBUG, '🔍 DEBUG', message, ...args);
  }

  /**
   * Log a test step with a step number.
   */
  step(stepNumber: number, description: string): void {
    this.info(`Step ${stepNumber}: ${description}`);
  }

  /**
   * Log a test section header.
   */
  section(title: string): void {
    const separator = '═'.repeat(50);
    this.info(`\n${separator}`);
    this.info(`  ${title}`);
    this.info(separator);
  }

  /**
   * Log test start.
   */
  testStart(testName: string): void {
    this.section(`🧪 TEST START: ${testName}`);
  }

  /**
   * Log test end with result.
   */
  testEnd(testName: string, passed: boolean): void {
    const status = passed ? '✅ PASSED' : '❌ FAILED';
    this.section(`${status}: ${testName}`);
  }

  // ============================================================
  // INTERNAL METHODS
  // ============================================================

  private log(level: LogLevel, prefix: string, message: string, ...args: unknown[]): void {
    if (level < this.logLevel) return;

    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${prefix}: ${message}`;

    // Console output
    console.log(formattedMessage, ...args);

    // Store for file output
    const fullMessage = args.length > 0
      ? `${formattedMessage} ${JSON.stringify(args)}`
      : formattedMessage;
    this.logEntries.push(fullMessage);
  }

  /**
   * Write all accumulated log entries to the log file.
   * Call this at the end of a test run.
   */
  flush(): void {
    try {
      fs.appendFileSync(this.logFilePath, this.logEntries.join('\n') + '\n');
      this.logEntries = [];
    } catch (error) {
      console.error('Failed to write log file:', error);
    }
  }

  /**
   * Get the log file path.
   */
  getLogFilePath(): string {
    return this.logFilePath;
  }
}
