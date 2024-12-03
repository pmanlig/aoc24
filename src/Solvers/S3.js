// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

export class S3 extends Solver {
	solve(input) {
		function calcSum(input) {
			return [...input.matchAll(/mul\((\d+),(\d+)\)/g)]
				.map(i => i.slice(1).map(n => parseInt(n, 10)))
				.map(i => i[0] * i[1])
				.reduce((a, b) => a + b);
		}
		let a = calcSum(input);
		let b = calcSum(input.split("do()").map(p => p.split("don't()")[0]).join(""));
		return { solution: `Instruction sum: ${a}\nRefined instruction sum: ${b}` };
	}
}