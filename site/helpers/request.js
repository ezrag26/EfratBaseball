module.exports = {
  XMLHttpRequestAsPromise: ({method, url, options}) => {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(request.response)
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          })
        }
      }
      request.open(method, url)
      request.responseType = options.responseType
      request.send(options.body)
    })
  }
}