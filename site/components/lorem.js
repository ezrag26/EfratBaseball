import React from 'react'
import { LoremIpsum } from 'lorem-ipsum'

const lorem = new LoremIpsum({
	sentencesPerParagraph: {
    min: 8,
		max: 12
  },
  wordsPerSentence: {
    min: 4,
		max: 16
  }
})

const Lorem = ({ numParagraphs = 1 }) => {
	return lorem.generateParagraphs(numParagraphs).split('\n').map(p => (<><p>{p}</p><br /></>))
}

export default Lorem
