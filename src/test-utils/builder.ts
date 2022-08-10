import { faker } from "@faker-js/faker";
import { MuttiDate } from "../core/date";

interface Builder<T> {
	(override?: Partial<T>): T;
}

function createBuilder<T>(fixture: Builder<T>): Builder<T> {
	return fixture;
}

interface ListOptions<T> {
	min: number;
	max: number;
	length: number;
	override: (index: number, list: T[]) => Parameters<Builder<T>>[0];
}

export function listOf<T>(
	builder: Builder<T>,
	options?: Partial<ListOptions<T>>
) {
	const length = faker.datatype.number({
		min: options?.length ?? options?.min ?? 1,
		max: options?.length ?? options?.max ?? 10,
	});
	const result: T[] = [];
	for (let i = 0; i < length; i++) {
		result.push(builder(options?.override?.(i, result)));
	}
	return result;
}

function oneOf<T>(...args: T[]): T {
	return faker.helpers.arrayElement(args);
}

////////////////////////////////////////////////////////////////////////////////

export interface Item {
	children: string;
	utilization?: number;
	startDate: string;
	endDate: string;
}

export interface Track {
	children: string;
	items: Item[];
}

/**
 * Returns the seed that is used to generate fake data. If a seed is provided,
 * the given seed will be used to create deterministic results.
 */
export function seed(seed?: number): number {
	return faker.seed(seed);
}

export const buildDate = createBuilder<MuttiDate>(() => {
	const date = oneOf(faker.date.recent(1500), faker.date.soon(900));
	return new MuttiDate(date.getTime());
});

export const buildItem = createBuilder<Item>((override) => {
	const itemLength = faker.datatype.number({ min: 7, max: 500 });
	const startDate = buildDate();
	return {
		children: faker.commerce.productName(),
		startDate: startDate.toString(),
		endDate: MuttiDate.from(startDate, itemLength).toString(),
		utilization: faker.datatype.number({ min: 0.3, max: 1, precision: 0.1 }),
		...override,
	};
});

export const buildTrack = createBuilder<Track>((override) => {
	return {
		children: faker.company.name(),
		items: listOf(buildItem, { min: 2, max: 15 }),
		...override,
	};
});
