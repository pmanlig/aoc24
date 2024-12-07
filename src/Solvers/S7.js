// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

export class S7 extends Solver {
	solve(input) {
		function isValid(expect, res, terms) {
			if (terms.length === 0) { return res === expect; }
			if (isValid(expect, res + terms[0], terms.slice(1))) { return true; }
			if (isValid(expect, res * terms[0], terms.slice(1))) { return true; }
			return false;
		}

		function concat(a, b) {
			let mul = 10;
			while (b >= mul) { mul *= 10; }
			return a * mul + b;
		}

		function isValidEx(expect, res, terms) {
			if (terms.length === 0) { return res === expect; }
			if (isValidEx(expect, res + terms[0], terms.slice(1))) { return true; }
			if (isValidEx(expect, res * terms[0], terms.slice(1))) { return true; }
			if (isValidEx(expect, concat(res, terms[0]), terms.slice(1))) { return true; }
			return false;
		}

		if (input === null) { return { solution: `Ingen lösning än` }; }
		// input = "190: 10 19\n3267: 81 40 27\n83: 17 5\n156: 15 6\n7290: 6 8 6 15\n161011: 16 10 13\n192: 17 8 14\n21037: 9 7 18 13\n292: 11 6 16 20";
		input = input.split('\n').map(l => [...l.matchAll(/(\d+)/g)].map(n => parseInt(n[0], 10)));
		let a = input.filter(e => isValid(e[0], e[1], e.slice(2))).map(e => e[0]).reduce((a, b) => a + b, 0);
		let b = input.filter(e => isValidEx(e[0], e[1], e.slice(2))).map(e => e[0]).reduce((a, b) => a + b, 0);
		return { solution: `Total calibration result: ${a}\nModified calibration result: ${b}` };
	}
}