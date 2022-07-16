import React, { useEffect, useState } from 'react'

const randomPhoto = ({ width = 200, height = 300 } = {}) => {
	return fetch(`https://picsum.photos/${width}/${height}`)
}

const vwToPx = ({ scale }) => {
	return Math.round(document.documentElement.clientWidth * scale)
}

const vhToPx = ({ scale }) => {
	return Math.round(document.documentElement.clientHeight * scale)
}

const Banner = ({ src = '/', refresh = 0 }) => {
	const [banner, setBanner] = useState(src)

	useEffect(() => {
		if (banner !== '/') return

		randomPhoto({ width: vwToPx({ scale: 0.7 }), height: vhToPx({ scale: 0.5 }) })
		.then(photo => setBanner(photo.url))
	}, [])

	useEffect(() => {
		if (!refresh || banner === '/') return

		setTimeout(() => {
			randomPhoto({ width: vwToPx({ scale: 0.7 }), height: vhToPx({ scale: 0.5 }) })
			.then(photo => setBanner(photo.url))
		}, 1000 * refresh)
	}, [banner])

  return (
    <img alt={'homepage-image'} src={banner} style={{ width: '70vw', height: '50vh', marginTop: '2rem', visibility: banner === '/' ? 'hidden' : 'visible' }}/>
  )
}

export default Banner
