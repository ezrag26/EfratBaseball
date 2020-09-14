import { DateTime } from "luxon";

const sortByTime = ({ games }) => games.sort((a, b) => a.time - b.time)

const sortAscending = ({ schedule }) =>
  Object.keys(schedule).sort((a, b) =>
    DateTime.fromJSDate(new Date(a)).diff(DateTime.fromJSDate(new Date(b)))
  )
    .reduce((reduced, date) => ({
      ...reduced,
      [date]: sortByTime({ games: schedule[date] })
    }), {})

export { sortAscending }