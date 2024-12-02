// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

export class S2 extends Solver {
	solve(input) {
		function isSafe(report) {
			let incDec = report[0] > report[1] ? 1 : -1;
			for (let i = 1; i < report.length; i++) {
				let d = (report[i - 1] - report[i]) * incDec;
				if (d < 1 || d > 3) return false;
			}
			return true;
		}

		function isDampSafe(report) {
			if (isSafe(report)) return true;

			function r(n, u) { return n < u ? report[n] : report[n + 1]; }

			function dampSafe(u) {
				let incDec = r(0, u) > r(1, u) ? 1 : -1;
				for (let i = 1; i < report.length - 1; i++) {
					let d = (r(i - 1, u) - r(i, u)) * incDec;
					if (d < 1 || d > 3) return false;
				}
				return true;
			}

			for (let u = 0; u < report.length; u++) {
				if (dampSafe(u)) return true;
			}

			return false;
		}

		// input = "7 6 4 2 1\n1 2 7 8 9\n9 7 6 2 1\n1 3 2 4 5\n8 6 4 4 1\n1 3 6 7 9";
		input = input.split('\n').map(l => l.split(' ').map(n => parseInt(n, 10)));
		let safe = input.filter(l => isSafe(l));
		let dampSafe = input.filter(l => isDampSafe(l));
		return { solution: `# of safe reports: ${safe.length}\n# of safe report with dampener: ${dampSafe.length}` };
	}
}