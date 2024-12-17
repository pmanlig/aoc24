// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

export class S13 extends Solver {
	solve(input) {
		function machine(input) {
			let a = /Button A: X\+(\d+), Y\+(\d+)/.exec(input).slice(1).map(n => parseInt(n, 10));
			let b = /Button B: X\+(\d+), Y\+(\d+)/.exec(input).slice(1).map(n => parseInt(n, 10));
			let p = /Prize: X=(\d+), Y=(\d+)/.exec(input).slice(1).map(n => parseInt(n, 10));

			return {
				a: { x: a[0], y: a[1] },
				b: { x: b[0], y: b[1] },
				prize: { x: p[0], y: p[1] }
			}
		}

		function tokens(mac) {
			let max = Math.floor(mac.prize.x / mac.a.x);
			let sol = null;
			for (let a = 0; a <= max; a++) {
				let rx = mac.prize.x - mac.a.x * a;
				let ry = mac.prize.y - mac.a.y * a;
				if (
					ry > 0 &&
					rx % mac.b.x === 0 &&
					ry % mac.b.y === 0 &&
					rx / mac.b.x === ry / mac.b.y
				) {
					let b = Math.floor(rx / mac.b.x);
					if (a <= 100 && b <= 100) {
						if (sol === null || 3 * sol.a + sol.b > 3 * a + b) {
							sol = { a: a, b: b }
						}
					}
				}
			}
			return sol !== null ? 3 * sol.a + sol.b : 0;
		}

		function manytokens(mac) {
			// console.log(mac);
			mac.prize.x += 10000000000000;
			mac.prize.y += 10000000000000;

			let unitX = mac.a.x;
			let unitA = 1;
			while (unitX % mac.b.x > 0) {
				unitA++;
				unitX += mac.a.x;
			}
			let unitYA = unitA * mac.a.y;
			let unitB = unitX / mac.b.x;
			let unitYB = unitB * mac.b.y;
			let u = Math.max(0, Math.floor(mac.prize.x / unitX) - 1);
			let fracX = mac.prize.x - u * unitX;
			for (let a = 0; a <= fracX / mac.a.x; a++) {
				if ((fracX - a * mac.a.x) % mac.b.x === 0) {
					let b = (fracX - a * mac.a.x) / mac.b.x;
					let y = mac.prize.y - a * mac.a.y - b * mac.b.y - u * unitYA;
					// console.log(a, b, unitA, unitB, y, unitYA, unitYB, (unitYB - unitYA), y / (unitYB - unitYA));
					if (y % (unitYB - unitYA) === 0 && y / (unitYB - unitYA) >= 0) {
						// console.log("Solution!", a, (fracX - a * mac.a.x) / mac.b.x);
						let d = y / (unitYB - unitYA);
						a += (u - d) * unitA;
						b += d * unitB;
						return 3 * a + b;
					}
				}
			}
			return 0;
		}

		// input = "Button A: X+94, Y+34\nButton B: X+22, Y+67\nPrize: X=8400, Y=5400\n\nButton A: X+26, Y+66\nButton B: X+67, Y+21\nPrize: X=12748, Y=12176\n\nButton A: X+17, Y+86\nButton B: X+84, Y+37\nPrize: X=7870, Y=6450\n\nButton A: X+69, Y+23\nButton B: X+27, Y+71\nPrize: X=18641, Y=10279";
		// input = "Button A: X+67, Y+25\nButton B: X+12, Y+30\nPrize: X=2506, Y=5230";
		let machines = input.split("\n\n").map(d => machine(d));
		// console.log(machines.map(m => tokens(m)).filter(n => n > 0));
		let a = machines.map(m => tokens(m)).reduce((a, b) => a + b, 0);
		let b = machines.map(m => manytokens(m)).reduce((a, b) => a + b, 0);
		return { solution: `Minimum # of tokens: ${a}\nCorrected # of tokens: ${b}` };
	}
}