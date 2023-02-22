import React, { useEffect, useState } from 'react'
import { useAutoRefresh } from '../hooks/useAutoRefresh'

const randomPhoto = ({ width = 200, height = 300 } = {}) => {
	return fetch(`https://picsum.photos/${width}/${height}`)
}

const vwToPx = ({ scale }) => {
	return Math.round(document.documentElement.clientWidth * scale)
}

const vhToPx = ({ scale }) => {
	return Math.round(document.documentElement.clientHeight * scale)
}

const Banner = ({ style, src = '/', refresh }) => {
	const [banner, setBanner] = useState(src)

  useAutoRefresh((stop) => {
    randomPhoto({ width: vwToPx({ scale: 0.7 }), height: vhToPx({ scale: 0.5 }) })
		.then(photo => setBanner(photo.url))
  }, refresh, [])

  return (
    <img alt={'homepage-image'} src={banner} style={{ width: '70vw', height: '50vh', marginTop: '2rem', visibility: banner === '/' ? 'hidden' : 'visible', ...style }}/>
  )
}

export default Banner
