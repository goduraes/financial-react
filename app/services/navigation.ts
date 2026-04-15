import type { NavigateFunction } from "react-router";
export let navigate: NavigateFunction ;
export const setNavigate = (nav: NavigateFunction ) => navigate = nav;