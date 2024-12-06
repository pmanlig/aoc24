// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

export class S5 extends Solver {
	solve(input) {
		function order(rules) {
			let o = [];
			for (let i = 0; i < rules.length; i++) {
				if (o[rules[i][0]] === undefined) { o[rules[i][0]] = { before: [], after: [] }; }
				if (o[rules[i][1]] === undefined) { o[rules[i][1]] = { before: [], after: [] }; }
				o[rules[i][0]].after.push(rules[i][1]);
				o[rules[i][1]].before.push(rules[i][0]);
			}
			return o;
		}

		function isCorrect(update, rules) {
			for (let i = 0; i < update.length; i++) {
				for (let j = 0; j < update.length; j++) {
					if (
						rules[update[i]] &&
						(
							(j < i && rules[update[i]].after.includes(update[j])) ||
							(j > i && rules[update[i]].before.includes(update[j]))
						)
					) {
						// console.log("Invalid", update);
						return false;
					}
				}
			}
			// console.log("Valid", update);
			return true;
		}

		function reorder(update, rules) {
			let u = [...update];
			for (let i = 0; i < u.length;) {
				if (rules[u[i]]) {
					let j = u.length - 1;
					while (j > i) {
						if (rules[u[i]].before.includes(u[j])) {
							let x = u[i];
							u.splice(i, 1);
							u.splice(j, 0, x);
							break;
						}
						j--;
					}
					if (i === j) i++;
				} else i++;
			}
			return u;
		}

		function mid(update) {
			if (update.length % 2 === 0) { console.log("Even number of pages!!!"); }
			return update[Math.floor(update.length / 2)];
		}

		// input = "47|53\n97|13\n97|61\n97|47\n75|29\n61|13\n75|53\n29|13\n97|29\n53|29\n61|53\n97|53\n61|29\n47|13\n75|47\n97|75\n47|61\n75|61\n47|29\n75|13\n53|13\n\n75,47,61,53,29\n97,61,53,29,13\n75,29,13\n75,97,47,61,53\n61,13,29\n97,13,75,29,47";
		if (input === null) return;
		input = input.split("\n\n");
		let rules = input[0].split('\n').map(l => /(\d+)\|(\d+)/.exec(l).slice(1).map(n => parseInt(n, 10)));
		rules = order(rules);
		// console.log(rules);
		// console.log("Reorder", reorder([61, 13, 29], rules));
		let updates = input[1].split('\n').map(l => l.split(',').map(n => parseInt(n, 10)));
		let a = updates.filter(u => isCorrect(u, rules)).map(u => mid(u)).reduce((a, b) => a + b);
		let b = updates.filter(u => !isCorrect(u, rules)).map(u => reorder(u, rules)).map(u => mid(u)).reduce((a, b) => a + b);
		return { solution: `Correct updates sum: ${a}\nInvalid updates sum: ${b}` };
	}
}