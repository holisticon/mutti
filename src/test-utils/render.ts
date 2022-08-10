import { LitElement, render as defaultRender, TemplateResult } from "lit";

export { html } from "lit";

export async function render<E extends LitElement>(
	template: TemplateResult
): Promise<E> {
	defaultRender(template, document.body);
	const ele = document.body.firstElementChild as E;
	await ele.updateComplete;
	return ele;
}
