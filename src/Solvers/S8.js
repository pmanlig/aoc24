// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

export class S8 extends Solver {
	solve(input) {
		function findAntennae(input) {
			let a = {}
			for (let r = 0; r < input.length; r++) {
				for (let c = 0; c < input[r].length; c++) {
					if (input[r][c] !== '.') {
						let f = input[r][c];
						if (a[f] === undefined) { a[f] = []; }
						a[f].push({ x: c, y: r });
					}
				}
			}
			return a;
		}

		function calculateAntiNodes(antennae) {
			let ans = [];
			for (let i = 0; i < antennae.length - 1; i++) {
				for (let j = i + 1; j < antennae.length; j++) {
					let dx = antennae[i].x - antennae[j].x;
					let dy = antennae[i].y - antennae[j].y;
					ans.push({ x: antennae[i].x + dx, y: antennae[i].y + dy });
					ans.push({ x: antennae[j].x - dx, y: antennae[j].y - dy });
				}
			}
			return ans;
		}

		function reduce(pt, fac) {
			while (pt.x % fac === 0 && pt.y % fac === 0) {
				pt.x /= fac;
				pt.y /= fac;
			}
		}

		function sub(pt, delta) {
			pt.x -= delta.x;
			pt.y -= delta.y;
		}

		function add(pt, delta) {
			pt.x += delta.x;
			pt.y += delta.y;
		}

		function calculateTNodes(antennae, map) {
			let tns = [];
			for (let i = 0; i < antennae.length - 1; i++) {
				for (let j = i + 1; j < antennae.length; j++) {
					let delta = { x: antennae[i].x - antennae[j].x, y: antennae[i].y - antennae[j].y }
					const primes = [2, 3, 5, 7, 11, 13];
					primes.forEach(p => reduce(delta, p));
					let tn = { x: antennae[i].x, y: antennae[i].y };
					while (tn.y >= 0 && tn.y < map.length) { sub(tn, delta); }
					for (add(tn, delta); tn.y >= 0 && tn.y < map.length; add(tn, delta)) { tns.push({ x: tn.x, y: tn.y }); }
				}
			}
			return tns;
		}

		function within(pt, map) {
			return pt.y >= 0 && pt.y < map.length && pt.x >= 0 && pt.x < map[pt.y].length;
		}

		// input = "............\n........0...\n.....0......\n.......0....\n....0.......\n......A.....\n............\n............\n........A...\n.........A..\n............\n............";
		input = input.split('\n').map(l => l.split(''));
		let antennae = findAntennae(input);
		let antinodes = {};
		for (const [key, value] of Object.entries(antennae)) {
			calculateAntiNodes(value).forEach(an => {
				let hash = an.x + an.y * 1000;
				if (within(an, input) && antinodes[hash] === undefined) {
					antinodes[hash] = 1;
				}
			});
		}

		let tnodes = {};
		for (const [key, value] of Object.entries(antennae)) {
			calculateTNodes(value, input).forEach(tn => {
				let hash = tn.x + tn.y * 1000;
				if (within(tn, input) && tnodes[hash] === undefined) {
					tnodes[hash] = 1;
				}
			});
		}

		return { solution: `# of antinodes: ${Object.keys(antinodes).length}\n# of T-nodes: ${Object.keys(tnodes).length}` };
	}
}