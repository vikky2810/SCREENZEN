import fs from 'node:fs'
import path from 'node:path'

const logFile = path.join(process.cwd(), 'screenzen.log')

export function log(level: 'INFO' | 'WARN' | 'ERROR', source: string, message: string) {
  const timestamp = new Date().toISOString()
  const logEntry = `[${timestamp}] [${level}] [${source}] ${message}\n`
  
  // Console output
  const color = level === 'ERROR' ? '\x1b[31m' : level === 'WARN' ? '\x1b[33m' : '\x1b[36m'
  const reset = '\x1b[0m'
  console.log(`${color}[${source}]${reset} ${message}`)

  // File output
  try {
    fs.appendFileSync(logFile, logEntry)
  } catch (err) {
    console.error('Failed to write to log file:', err)
  }
}

export function info(source: string, message: string) { log('INFO', source, message) }
export function warn(source: string, message: string) { log('WARN', source, message) }
export function error(source: string, message: string) { log('ERROR', source, message) }
