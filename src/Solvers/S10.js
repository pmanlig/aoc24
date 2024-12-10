// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

export class S10 extends Solver {
	solve(input) {
		function peaks(input, r, c, h) {
			if (r < 0 || r >= input.length || c < 0 || c >= input[r].length) { return []; }
			if (h !== input[r][c]) { return []; }
			if (h++ === 9) { return [{ r: r, c: c }]; }
			return [...peaks(input, r + 1, c, h),
			...peaks(input, r - 1, c, h),
			...peaks(input, r, c + 1, h),
			...peaks(input, r, c - 1, h)];

		}

		function trailheadScore(input, r, c) {
			let acc = {};
			peaks(input, r, c, 0).forEach(p => {
				let idx = p.r * 1000 + p.c;
				if (acc[idx] === undefined) { acc[idx] = 1; }
				else { acc[idx]++; }
			});
			return acc;
		}

		// input = "0123\n1234\n8765\n9876";
		// input = "1110111\n1111111\n1112111\n6543456\n7111117\n8111118\n9111119";
		// input = "1190119\n1111198\n1112117\n6543456\n7651987\n8761111\n9871111";
		input = input.split('\n').map(l => l.split('').map(n => parseInt(n, 10)));
		let a = 0;
		let b = 0;
		// console.log(trailheadScore(input, 0, 3));
		for (let r = 0; r < input.length; r++) {
			for (let c = 0; c < input[r].length; c++) {
				let acc = trailheadScore(input, r, c)
				a += Object.keys(acc).length;
				b += Object.values(acc).reduce((a, b) => a + b, 0);
			}
		}
		return { solution: `Total score: ${a}\nTotal rating: ${b}` };
	}
}