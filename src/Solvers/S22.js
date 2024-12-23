// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

/* global BigInt */

const prune = n => n % 16777216n;

export class S22 extends Solver {
	solve(input) {
		function secret(n) {
			n = BigInt(n);
			n = prune((n * 64n) ^ n);
			n = prune((n >> 5n) ^ n);
			n = prune((n * 2048n) ^ n);
			return Number(n);
		}

		function findMax(p) {
			let m = Math.max(...p.slice(4));
			// console.log("Max", m);
			for (let i = 4; i < p.length; i++) {
				if (p[i] === m) {
					// console.log("Found!", i);
					return [
						p[i - 3] - p[i - 4],
						p[i - 2] - p[i - 3],
						p[i - 1] - p[i - 2],
						p[i] - p[i - 1],
					];
				}
			}
		}

		function findSeq(prices, seq) {
			let d = [
				prices[1] - prices[0],
				prices[2] - prices[1],
				prices[3] - prices[2]
			];
			for (let i = 4; i < prices.length; i++) {
				d.push(prices[i] - prices[i - 1]);
				let j = d.length - 4;
				if (d[j++] === seq[0] && d[j++] === seq[1] && d[j++] === seq[2] && d[j++] === seq[3]) { return prices[i]; }
			}
			for (let i = 0; i < d.length - 4; i++) {
				if (d[i] === -2 && d[i + 1] === 1 && d[i + 2] === -1 && d[i + 3] === 3)
					console.log("Found seq", i);
			}
			return 0;
		}

		/*
		console.log("1", 15887950 === secret(123));
		console.log("2", 16495136 === secret(15887950));
		console.log("3", 527345 === secret(16495136));
		console.log("4", 704524 === secret(527345));
		console.log("5", 1553684 === secret(704524));
		console.log("6", 12683156 === secret(1553684));
		console.log("7", 11100544 === secret(12683156));
		console.log("8", 12249484 === secret(11100544));
		console.log("9", 7753432 === secret(12249484));
		console.log("10", 5908254 === secret(7753432));
		//*/

		input = "1\n10\n100\n2024";
		input = input.split('\n').map(n => parseInt(n, 10));

		let secrets = input.map(n => {
			let x = [n];
			for (let i = 0; i < 2000; i++) { x.push(secret(x[i])); }
			return x;
		});
		let a = secrets.map(x => x[2000]).reduce((a, b) => a + b, 0);
		let prices = secrets.map(s => s.map(n => n % 10));
		// let m = prices.map(p => findMax(p));
		console.log(prices.map(p => findSeq(p, [-2, 1, -1, 3])));
		// let x = m.map(s => prices.map(p => findSeq(p, s)).reduce((a, b) => a + b, 0));
		let b = 0;
		// b = Math.max(...x);
		return { solution: `Sum of secrets: ${a}\nMaximum # of bananas: ${b}` };
	}
}