import { LitElement, render as defaultRender, TemplateResult } from "lit";

export { html } from "lit";

/** Renders the template and returns the rendered element as well as its shadowRoot and content content. */
export async function render<E extends LitElement>(
	template: TemplateResult
): Promise<{ element: E; content: HTMLElement; root: ShadowRoot }> {
	defaultRender(template, document.body);
	const element = document.body.firstElementChild as E;
	await element.updateComplete;

	const content = element.shadowRoot?.firstElementChild as HTMLElement;
	return { element, content, root: element.shadowRoot as ShadowRoot };
}
