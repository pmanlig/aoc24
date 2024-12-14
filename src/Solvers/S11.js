// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

function digits(n) {
	let mul = 10, dig = 1;
	while (mul <= n) {
		mul *= 10;
		dig++;
	}
	return dig;
}

function blink(input) {
	let n = [];
	for (let i = 0; i < input.length; i++) {
		if (input[i] === 0) { n.push(1); }
		else if (digits(input[i]) % 2 === 0) {
			let mul = 10;
			while (mul * mul <= input[i]) { mul *= 10; }
			n.push(Math.floor(input[i] / mul));
			n.push(input[i] % mul);
		}
		else {
			n.push(input[i] * 2024);
		}
	}
	return n;
}

let stones = []

function count(x, lvl) {
	if (stones[x] === undefined) {
		let r = [x];
		for (let i = 0; i < 25; i++) { r = blink(r); }
		stones[x] = r;
	}
	if (lvl > 1) {
		let y = {}
		stones[x].forEach(s => {
			if (y[s] === undefined) { y[s] = 1; }
			else { y[s]++; }
		})
		return Object.entries(y).map(e => e[1] * count(parseInt(e[0], 10), lvl - 1)).reduce((a, b) => a + b, 0);
		// return stones[x].map(y => count(y, lvl - 1)).reduce((a, b) => a + b, 0);
	}
	return stones[x].length;
}

export class S11 extends Solver {
	setup(input) {
		/*
		console.log(blink([0, 1, 10, 99, 999]));
		let x = [125, 17];
		for (let i = 0; i < 25; i++) { x = blink(x); }
		console.log(x.length);
		*/

		input = [...input.matchAll(/(\d+)/g)].map(m => parseInt(m[1], 10));
		this.a = input.map(x => count(x, 1)).reduce((a, b) => a + b, 0);
		this.b = input.map(x => count(x, 3)).reduce((a, b) => a + b, 0);
		this.setState({ solution: `# stones after 25 blinks: ${this.a}\n# stones after 75 blinks: ${this.b}` })
	}

	solve(input) {
		return { solution: `# stones after 25 blinks: ${this.a}\n# stones after 75 blinks: ${this.b}` }
	}
}