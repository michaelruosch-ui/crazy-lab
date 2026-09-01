export const MAX_PHOTOS_PER_ENTRY = 10
export const MAX_VIDEO_SECONDS = 3
export const MAX_VIDEO_BYTES = 15 * 1024 * 1024

export function validateVideo(durationSeconds: number, sizeBytes: number): string | undefined {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    return 'Die Videolänge konnte nicht erkannt werden. Bitte nimm das Video nochmals auf.'
  }
  if (durationSeconds > MAX_VIDEO_SECONDS + 0.15) {
    return `Das Video ist länger als ${MAX_VIDEO_SECONDS} Sekunden. Bitte kürzer aufnehmen.`
  }
  if (sizeBytes > MAX_VIDEO_BYTES) {
    return 'Das Video ist trotz kurzer Dauer zu gross. Bitte mit normaler Kameraqualität aufnehmen.'
  }
  return undefined
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => resolve(String(reader.result))
    reader.readAsDataURL(file)
  })
}

export function fileToCompressedPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error('Foto konnte nicht gelesen werden.'))
      image.onload = () => {
        const scale = Math.min(1, 1000 / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        const context = canvas.getContext('2d')
        if (!context) return reject(new Error('Foto konnte nicht verkleinert werden.'))
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.78))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

export function videoToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const url = URL.createObjectURL(file)
    const cleanup = () => URL.revokeObjectURL(url)
    video.preload = 'metadata'
    video.onerror = () => {
      cleanup()
      reject(new Error('Video konnte nicht gelesen werden.'))
    }
    video.onloadedmetadata = () => {
      const error = validateVideo(video.duration, file.size)
      cleanup()
      if (error) {
        reject(new Error(error))
        return
      }
      fileToDataUrl(file).then(resolve, reject)
    }
    video.src = url
  })
}
