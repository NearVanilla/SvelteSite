import { describe, expect, test } from 'bun:test';
import { formatDate, formatValue } from './format';

describe('formatValue', () => {
	test('count uses thousands separators', () => {
		expect(formatValue(4210, 'count')).toBe('4,210');
	});

	test('distance in blocks, singular for one', () => {
		expect(formatValue(100, 'distance')).toBe('1 block');
		expect(formatValue(12_345, 'distance')).toBe('123 blocks');
	});

	test('distance of 1000+ blocks in km', () => {
		expect(formatValue(250_000, 'distance')).toBe('2.5 km');
	});

	test('duration in minutes, hours and days', () => {
		expect(formatValue(14_400, 'duration')).toBe('12m');
		expect(formatValue(108_000, 'duration')).toBe('1h 30m');
		expect(formatValue(3_816_000, 'duration')).toBe('2d 5h');
	});

	test('health in hearts, singular for one', () => {
		expect(formatValue(20, 'health')).toBe('1 heart');
		expect(formatValue(205, 'health')).toBe('10 hearts');
	});
});

describe('formatDate', () => {
	test('formats as en-GB in UTC', () => {
		expect(formatDate(Date.UTC(2026, 10, 17, 23, 30))).toBe('17 Nov 2026');
	});
});
