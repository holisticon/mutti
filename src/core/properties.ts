import { unsafeCSS } from "lit";

/** Helper function to set a variable in a Lit `CSSResult` from a JS expression. */
export function varX(property: string, fallback?: unknown) {
	return unsafeCSS(`var(${property}${fallback ? ", " + fallback : ""})`);
}

export const themeProp = {
	itemGap: "--mutti-theme-item-gap",
	todayColor: "--mutti-theme-today-color",
};
