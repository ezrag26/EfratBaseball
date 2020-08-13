module.exports = {
  onBlur: elem => {
    const e = elem.target

    // raise label if input has text inside
    e.value ? e.nextElementSibling.classList.add('raise') : e.nextElementSibling.classList.remove('raise')
  },

  onClick: elem => elem.target.previousElementSibling.focus() // focus the input element to raise label
}