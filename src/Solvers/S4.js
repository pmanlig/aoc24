// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

export class S4 extends Solver {
	solve(input) {
		function test(input, r, c, tgt, dx, dy) {
			for (let i = 0; i < tgt.length; i++) {
				if (0 > r + i * dy || input.length <= r + i * dy) return 0;
				if (0 > c + i * dx || input[r + i * dy].length <= c + i * dx) return 0;
				if (input[r + i * dy][c + i * dx] !== tgt[i]) return 0;
			}
			return 1;
		}

		// input = "MMMSXXMASM\nMSAMXMSMSA\nAMXSXMAAMM\nMSAMASMSMX\nXMASAMXAMM\nXXAMMXXAMA\nSMSMSASXSS\nSAXAMASAAA\nMAMMMXMMMM\nMXMXAXMASX";
		input = input.split('\n').map(l => l.split(''));
		let tgt = "XMAS", found = 0;
		let rev = tgt.split('').reverse().join('');
		for (let r = 0; r < input.length; r++) {
			for (let c = 0; c < input[r].length; c++) {
				found += test(input, r, c, tgt, 1, -1);
				found += test(input, r, c, rev, 1, -1);
				found += test(input, r, c, tgt, 1, 0);
				found += test(input, r, c, rev, 1, 0);
				found += test(input, r, c, tgt, 1, 1);
				found += test(input, r, c, rev, 1, 1);
				found += test(input, r, c, tgt, 0, 1);
				found += test(input, r, c, rev, 0, 1);
			}
		}

		let xMas = 0;
		for (let r = 1; r < input.length - 1; r++) {
			for (let c = 1; c < input[r].length - 1; c++) {
				if (input[r][c] === 'A') {
					if (input[r - 1][c - 1] === 'M' && input[r + 1][c + 1] === 'S') {
						if (input[r + 1][c - 1] === 'M' && input[r - 1][c + 1] === 'S') xMas++;
						else if (input[r + 1][c - 1] === 'S' && input[r - 1][c + 1] === 'M') xMas++;
					}
					else if (input[r - 1][c - 1] === 'S' && input[r + 1][c + 1] === 'M') {
						if (input[r + 1][c - 1] === 'M' && input[r - 1][c + 1] === 'S') xMas++;
						else if (input[r + 1][c - 1] === 'S' && input[r - 1][c + 1] === 'M') xMas++;
					}
				}
			}
		}
		return { solution: `Number of words: ${found}\nNumber of X-MASs: ${xMas}` };
	}
}