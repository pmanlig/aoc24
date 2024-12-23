// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

const down = 'v';
const up = '^';
const left = '<';
const right = '>';
const activate = 'A';

const numeric = {
	'7': { x: 0, y: 0 },
	'8': { x: 1, y: 0 },
	'9': { x: 2, y: 0 },
	'4': { x: 0, y: 1 },
	'5': { x: 1, y: 1 },
	'6': { x: 2, y: 1 },
	'1': { x: 0, y: 2 },
	'2': { x: 1, y: 2 },
	'3': { x: 2, y: 2 },
	'0': { x: 1, y: 3 },
	'A': { x: 2, y: 3 }
}

const directional = {
	'^': { x: 1, y: 0 },
	'A': { x: 2, y: 0 },
	'<': { x: 0, y: 1 },
	'v': { x: 1, y: 1 },
	'>': { x: 2, y: 1 }
}

export class S21 extends Solver {
	solve(input) {
		function translate(code, keypad) {
			let pos = { ...keypad[activate] }, out = [];
			for (let i = 0; i < code.length; i++) {
				let tgt = keypad[code[i]];
				if (keypad === numeric && (pos.y < 3 || tgt.x > 0)) {
					while (pos.x > tgt.x) { pos.x--; out.push(left); }
				}
				while (pos.x < tgt.x) { pos.x++; out.push(right); }
				while (pos.y > tgt.y) { pos.y--; out.push(up); }
				while (pos.y < tgt.y) { pos.y++; out.push(down); }
				while (pos.x > tgt.x) { pos.x--; out.push(left); }
				out.push(activate);
			}
			return out.join('');
		}

		function complexity(code) {
			let n = parseInt(code, 10);
			code = translate(code, numeric);
			code = translate(code, directional);
			code = translate(code, directional);
			// console.log('Code', code, code.length, n);
			return code.length * n;
		}

		// input = "029A\n980A\n179A\n456A\n379A";
		input = input.split('\n');
		let a = input.map(c => complexity(c)).reduce((a, b) => a + b, 0);
		console.log("379A");
		let x = translate("379A", numeric);
		console.log(x, x.length);
		x = translate(x, directional);
		console.log(x, x.length);
		x = translate(x, directional);
		console.log(x, x.length);
		return { solution: `Total complexity: ${a}` };
	}
}