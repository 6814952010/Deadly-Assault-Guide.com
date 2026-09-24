// Uploads go straight from the browser to Vercel Blob:
// 1. ask the API for a short-lived signed URL (admin only),
// 2. PUT the file to Blob, bypassing the 4.5 MB Vercel function limit,
// 3. send the returned pathname with the form; the API verifies it.
export async function uploadToBlob(file, { folder, token, onProgress }) {
  const response = await fetch('/api/uploads/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ folder, contentType: file.type, size: file.size, fileName: file.name })
  })
  const signed = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(signed.message || 'Unable to prepare upload.')

  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', signed.uploadUrl)
    Object.entries(signed.headers || {}).forEach(([name, value]) => xhr.setRequestHeader(name, value))
    xhr.setRequestHeader('Content-Type', file.type)
    xhr.upload.onprogress = event => {
      if (onProgress && event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100))
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve()
      let message = `Upload to storage failed (${xhr.status}).`
      try { message = JSON.parse(xhr.responseText).error?.message || message } catch { /* keep default */ }
      reject(new Error(message))
    }
    xhr.onerror = () => reject(new Error('Upload to storage failed. Check your connection.'))
    xhr.send(file)
  })

  return signed.pathname
}
