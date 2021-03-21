import { DateTime } from "luxon";

const sortByTimeAscending = ({ games }) => games.sort((a, b) => {
	return a.isFinal - b.isFinal || (a.time - b.time) // final games after all games, then by time
  // return a.time - b.time || (a.isFinal ? -1 : 1) // if same time, final game has priority over non-final
})

const sortByDateAscending = ({ schedule }) => {
  return Object.keys(schedule).sort((a, b) =>
    DateTime.fromJSDate(new Date(a)).diff(DateTime.fromJSDate(new Date(b)))
  )
}

const sortAscending = ({ schedule }) =>
  sortByDateAscending({ schedule })
    .reduce((reduced, date) => ({
      ...reduced,
      [date]: sortByTimeAscending({ games: schedule[date] })
    }), {})

export { sortAscending }
