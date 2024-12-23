// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

export class S23 extends Solver {
	solve(input) {
		function countNetworks(computers) {
			let visited = {}, n = 0;
			for (const [computer, connections] of Object.entries(computers)) {
				visited[computer] = true;
				for (const [second, secondary] of Object.entries(connections)) {
					if (!visited[second]) {
						for (const third of Object.keys(secondary)) {
							if (!visited[third] && connections[third]) {
								if (computer[0] === 't' || second[0] === 't' || third[0] === 't') { n++; }
							}
						}
					}
				}
			}
			return n / 2;
		}

		function findPassword(computers) {
			let networks = [];
			for (const [a, connections] of Object.entries(computers)) {
				for (const n of networks) {
					if (!n[a] && [...Object.keys(n)].every(c => connections[c])) {
						n[a] = connections;
					}
				}
				for (const [b, secondary] of Object.entries(connections)) {
					if (!networks.some(lan => [...Object.keys(lan)].every(c => secondary[c]))) {
						let x = {};
						x[a] = connections;
						x[b] = secondary;
						networks.push(x);
					}
				}
			}
			networks.forEach(n => n.length = [...Object.keys(n)].length)
			networks.sort((a, b) => b.length - a.length);
			return [...Object.keys(networks[0])].filter(k => k !== "length").sort().join(',');
		}

		let computers = {};
		const connect = ([a, b]) => {
			if (computers[a] === undefined) { computers[a] = {} }
			if (computers[b] === undefined) { computers[b] = {} }
			computers[a][b] = computers[b];
			computers[b][a] = computers[a];
		}

		// input = "kh-tc\nqp-kh\nde-cg\nka-co\nyn-aq\nqp-ub\ncg-tb\nvc-aq\ntb-ka\nwh-tc\nyn-cg\nkh-ub\nta-co\nde-co\ntc-td\ntb-wq\nwh-td\nta-ka\ntd-qp\naq-cg\nwq-ub\nub-vc\nde-ta\nwq-aq\nwq-vc\nwh-yn\nka-de\nkh-ta\nco-tc\nwh-qp\ntb-vc\ntd-yn";
		input = input.split('\n').map(l => l.split('-'));
		input.forEach(l => connect(l));
		let a = countNetworks(computers);
		let b = findPassword(computers);
		return { solution: `Candidate networks: ${a}\nPassword: ${b}` };
	}
}