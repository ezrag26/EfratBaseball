import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import NonAdminHeader from "../NonAdminHeader"
import BasePage from '../BasePage'
import ComingSoon from "../helpers/coming-soon";
import { randomBits } from '../helpers/unique'
import { Center, Stack} from "../helpers/Typography";

const EnlargedImage = ({ enlarge, setEnlarge }) => {
  return (
    enlarge.enlarge &&
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', position: 'absolute', left: '0', top: window.pageYOffset, height: '100vh', width: '100vw', backgroundColor: 'grey', opacity: '0.8', overflow: 'hidden' }} onClick={() => {
      document.body.style.overflow = 'inherit' // re-enable scrolling
      setEnlarge({ enlarge: false, url: ''})
    }}>
      <img src={enlarge.url} alt={enlarge.url} style={{ position: 'relative', height: '75vh', width: '75vw' }} onClick={(e) => { e.stopPropagation() }}/>
    </div>
  )
}

const Gallery = ({ urls }) => {
  const [enlarge, setEnlarge] = useState({ enlarge: false, url: '' })

  const enlargeImage = (e) => {
    const imgURL = e.target.getAttribute('src')
    setEnlarge({ enlarge: true, url: imgURL })
    document.body.style.overflow = 'hidden' // disable scrolling
  }

  return (
    <>
      <NonAdminHeader />
      {
        (
					<BasePage title={'Gallery'}>
						<ComingSoon />
					</BasePage>
        ) ||
        (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', margin: '2rem auto', width: '80%' }}>
              {
                urls.map(url => {
                  return <img key={randomBits()} src={url} alt={url} style={{ width: '300px', height: '300px', margin: '1rem auto' }} onClick={e => enlargeImage(e)}/>
                })
              }
            </div>
            <EnlargedImage enlarge={enlarge} setEnlarge={setEnlarge}/>
          </>
        )
      }
    </>
  )
}

ReactDOM.render(<Gallery urls={[
  'https://www.google.com/imgres?imgurl=https%3A%2F%2Ftechcrunch.com%2Fwp-content%2Fuploads%2F2019%2F03%2FGettyImages-844016022.jpg%3Fw%3D730%26crop%3D1&imgrefurl=https%3A%2F%2Ftechcrunch.com%2F2019%2F07%2F11%2Frobot-umpires-make-independent-league-baseball-debut%2F&tbnid=CTRvkGk2w67NPM&vet=12ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygDegUIARDfAQ..i&docid=66t5_TjqzLlnBM&w=730&h=486&q=baseball%20images&safe=off&client=safari&ved=2ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygDegUIARDfAQ',
  'https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.history.com%2F.image%2Far_1%3A1%252Cc_fill%252Ccs_srgb%252Cfl_progressive%252Cq_auto%3Agood%252Cw_1200%2FMTU3ODc4NjAyOTkyNTI2NjY1%2Fask-history-who-invented-baseball-2.jpg&imgrefurl=https%3A%2F%2Fwww.history.com%2Fnews%2Fwho-invented-baseball&tbnid=oa2B0Jz6xdR4UM&vet=12ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygEegUIARDhAQ..i&docid=TR8yKRT2AgVoxM&w=1200&h=1200&q=baseball%20images&safe=off&client=safari&ved=2ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygEegUIARDhAQ',
  'https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn.vox-cdn.com%2Fthumbor%2FdnCR0gGpeL3GyUB6-6HVvS-FG7c%3D%2F1400x1050%2Ffilters%3Aformat(jpeg)%2Fcdn.vox-cdn.com%2Fuploads%2Fchorus_asset%2Ffile%2F21702587%2F1227928661.jpg.jpg&imgrefurl=https%3A%2F%2Fwww.federalbaseball.com%2F2020%2F8%2F7%2F21358217%2Fnational-league-east-roundup&tbnid=vYZge_xfTZttOM&vet=12ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygOegUIARD5AQ..i&docid=8OhDaPZokqfWTM&w=1400&h=1050&itg=1&q=baseball%20images&safe=off&client=safari&ved=2ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygOegUIARD5AQ',
  'https://www.google.com/imgres?imgurl=https%3A%2F%2Ftechcrunch.com%2Fwp-content%2Fuploads%2F2019%2F03%2FGettyImages-844016022.jpg%3Fw%3D730%26crop%3D1&imgrefurl=https%3A%2F%2Ftechcrunch.com%2F2019%2F07%2F11%2Frobot-umpires-make-independent-league-baseball-debut%2F&tbnid=CTRvkGk2w67NPM&vet=12ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygDegUIARDfAQ..i&docid=66t5_TjqzLlnBM&w=730&h=486&q=baseball%20images&safe=off&client=safari&ved=2ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygDegUIARDfAQ',
  'https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.history.com%2F.image%2Far_1%3A1%252Cc_fill%252Ccs_srgb%252Cfl_progressive%252Cq_auto%3Agood%252Cw_1200%2FMTU3ODc4NjAyOTkyNTI2NjY1%2Fask-history-who-invented-baseball-2.jpg&imgrefurl=https%3A%2F%2Fwww.history.com%2Fnews%2Fwho-invented-baseball&tbnid=oa2B0Jz6xdR4UM&vet=12ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygEegUIARDhAQ..i&docid=TR8yKRT2AgVoxM&w=1200&h=1200&q=baseball%20images&safe=off&client=safari&ved=2ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygEegUIARDhAQ',
  'https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn.vox-cdn.com%2Fthumbor%2FdnCR0gGpeL3GyUB6-6HVvS-FG7c%3D%2F1400x1050%2Ffilters%3Aformat(jpeg)%2Fcdn.vox-cdn.com%2Fuploads%2Fchorus_asset%2Ffile%2F21702587%2F1227928661.jpg.jpg&imgrefurl=https%3A%2F%2Fwww.federalbaseball.com%2F2020%2F8%2F7%2F21358217%2Fnational-league-east-roundup&tbnid=vYZge_xfTZttOM&vet=12ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygOegUIARD5AQ..i&docid=8OhDaPZokqfWTM&w=1400&h=1050&itg=1&q=baseball%20images&safe=off&client=safari&ved=2ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygOegUIARD5AQ',
  'https://www.google.com/imgres?imgurl=https%3A%2F%2Ftechcrunch.com%2Fwp-content%2Fuploads%2F2019%2F03%2FGettyImages-844016022.jpg%3Fw%3D730%26crop%3D1&imgrefurl=https%3A%2F%2Ftechcrunch.com%2F2019%2F07%2F11%2Frobot-umpires-make-independent-league-baseball-debut%2F&tbnid=CTRvkGk2w67NPM&vet=12ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygDegUIARDfAQ..i&docid=66t5_TjqzLlnBM&w=730&h=486&q=baseball%20images&safe=off&client=safari&ved=2ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygDegUIARDfAQ',
  'https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.history.com%2F.image%2Far_1%3A1%252Cc_fill%252Ccs_srgb%252Cfl_progressive%252Cq_auto%3Agood%252Cw_1200%2FMTU3ODc4NjAyOTkyNTI2NjY1%2Fask-history-who-invented-baseball-2.jpg&imgrefurl=https%3A%2F%2Fwww.history.com%2Fnews%2Fwho-invented-baseball&tbnid=oa2B0Jz6xdR4UM&vet=12ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygEegUIARDhAQ..i&docid=TR8yKRT2AgVoxM&w=1200&h=1200&q=baseball%20images&safe=off&client=safari&ved=2ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygEegUIARDhAQ',
  'https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn.vox-cdn.com%2Fthumbor%2FdnCR0gGpeL3GyUB6-6HVvS-FG7c%3D%2F1400x1050%2Ffilters%3Aformat(jpeg)%2Fcdn.vox-cdn.com%2Fuploads%2Fchorus_asset%2Ffile%2F21702587%2F1227928661.jpg.jpg&imgrefurl=https%3A%2F%2Fwww.federalbaseball.com%2F2020%2F8%2F7%2F21358217%2Fnational-league-east-roundup&tbnid=vYZge_xfTZttOM&vet=12ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygOegUIARD5AQ..i&docid=8OhDaPZokqfWTM&w=1400&h=1050&itg=1&q=baseball%20images&safe=off&client=safari&ved=2ahUKEwiE0pSv5pHrAhUaShoKHe_zBWYQMygOegUIARD5AQ',
]}/>, document.querySelector('#root'))
