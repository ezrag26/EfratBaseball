module.exports = {
  XMLHttpRequestAsPromise: ({ method, url, options }) => {
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
      if (method === 'POST') request.setRequestHeader("Content-Type", options.contentType)
      request.responseType = options.responseType
      request.send(JSON.stringify(options.body))
    })
  },

  fetchGetJson: ({ url }) => {
    return fetch(url, {
      method: 'GET',
    })
  },

  fetchPostJson: ({ url, body }) => {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}