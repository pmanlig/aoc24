// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

export class S1 extends Solver {
	solve(input) {
		let x = input.split('\n').map(l => /^(\d+)\s+(\d+)$/.exec(l).slice(1).map(n => parseInt(n, 10)));
		let y = x.map(l => l[1]).sort();
		x = x.map(l => l[0]).sort();
		let d = 0
		for (let i = 0; i < x.length; i++) {
			d += Math.abs(x[i] - y[i]);
		}
		let s = 0, i = 0, j = 0;
		while (i < x.length) {
			while (j < y.length && y[j] < x[i]) j++;
			while (j < y.length && y[j] === x[i]) {
				s += x[i];
				j++;
			}
			while (i < x.length && x[i] === x[i + 1]) i++;
			i++;
		}
		return { solution: `Total distance: ${d}\nSimilarity score: ${s}` };
	}
}