// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

export class S25 extends Solver {
	solve(input) {
		let keys = [], locks = [];

		const parseLock = (input) => {
			let l = [0, 0, 0, 0, 0];
			for (let r = 1; r < input.length; r++) {
				for (let p = 0; p < input[r].length; p++) {
					if (input[r][p] === "#") { l[p]++; }
				}
			}
			locks.push(l);
		}

		const parseKey = (input) => {
			let k = [0, 0, 0, 0, 0];
			for (let r = input.length - 2; r >= 1; r--) {
				for (let p = 0; p < input[r].length; p++) {
					if (input[r][p] === "#") { k[p]++; }
				}
			}
			keys.push(k);
		}

		const parse = (input) => {
			if (input[0][0] === '#') { parseLock(input); }
			else { parseKey(input); }
		}

		const fit = (key, lock) => key[0] + lock[0] < 6 && key[1] + lock[1] < 6 && key[2] + lock[2] < 6 && key[3] + lock[3] < 6 && key[4] + lock[4] < 6;

		// input = "";
		input = input.split("\n\n").map(m => m.split('\n').map(l => l.split('')));
		input.forEach(kl => parse(kl));
		let n = 0;
		for (const key of keys) {
			for (const lock of locks) {
				if (fit(key, lock)) { n++; }
			}
		}
		return { solution: `# possible combinations: ${n}` };
	}
}