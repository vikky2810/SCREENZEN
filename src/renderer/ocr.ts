import { createWorker } from 'tesseract.js'
import localforage from 'localforage'

// Configure localForage
localforage.config({
  name: 'ScreenZen',
  storeName: 'screenshots'
})

export async function processScreenshot(filePath: string) {
  const worker = await createWorker('eng')
  
  try {
    const { data: { text } } = await worker.recognize(filePath)
    
    const screenshotData = {
      path: filePath,
      text: text,
      timestamp: Date.now(),
      id: crypto.randomUUID()
    }

    // Save to IndexedDB
    await localforage.setItem(screenshotData.id, screenshotData)
    
    console.log(`Successfully indexed: ${filePath}`)
    return screenshotData
  } catch (error) {
    console.error(`OCR Error for ${filePath}:`, error)
  } finally {
    await worker.terminate()
  }
}

export async function getAllScreenshots() {
  const screenshots: any[] = []
  await localforage.iterate((value) => {
    screenshots.push(value)
  })
  return screenshots.sort((a, b) => b.timestamp - a.timestamp)
}
