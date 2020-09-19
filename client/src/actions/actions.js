import { string } from "prop-types";

export const SET_MOVIES = "SET_MOVIES";
export const SET_FILTER = "SET_FILTER";
export const SET_USERNAME = "SET_USERNAME";

export function setMovies(value) {
  return { type: SET_MOVIES, value };
}

export function setFilter(value) {
  return { type: SET_FILTER, value };
}

export function setUsername(value) {
  return { type: SET_USERNAME, value };
}
// this is pseudo code, it's just a draft of our app's state
// {
//     visibilityFilter: string,
//     movies = [
//         {title, description, image path}

//     ]
// }
