// import React from 'react';
import { BitmapRenderer } from '../util';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

const colors = {
	'#': "#000000",
	'.': "#CFCFCF",
	'S': "#00FF00",
	'E': "#0000FF"
}

const up = { x: 0, y: -1 }
const right = { x: 1, y: 0 }
const down = { x: 0, y: 1 }
const left = { x: -1, y: 0 }

const dist = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
const move = (a, d) => ({ x: a.x + d.x, y: a.y + d.y, length: a.length + 1, prev: a })

function findPath(map) {
	let start = null;
	let end = null;

	const weigh = (a) => a.wgt = a.length + dist(a, end)

	for (let r = 0; r < map.length; r++) {
		for (let c = 0; c < map[r].length; c++) {
			if (map[r][c] === 'S') { start = { x: c, y: r, length: 0, prev: null }; }
			if (map[r][c] === 'E') { end = { x: c, y: r }; }
		}
	}

	let paths = [start]
	const consider = (a, d) => {
		let b = move(a, d);
		if (map[b.y][b.x] !== '#' && (null === a.prev || a.prev.x !== b.x || a.prev.y !== b.y)) {
			weigh(b);
			paths.push(b);
		}
	}

	while (paths.length > 0) {
		let p = paths.pop();
		if (p.x === end.x && p.y === end.y) { return p; }
		consider(p, up);
		consider(p, down);
		consider(p, left);
		consider(p, right);
		paths.sort((a, b) => b.wgt - a.wgt);
	}
}

export class S20 extends Solver {
	solve(input) {
		function shortcuts(route, length, min) {
			let s = 0;
			let max = route.length - length;
			for (let i = 0; i < max; i++) {
				for (let j = i + 3; j < route.length; j++) {
					let d = dist(route[i], route[j]);
					if (d <= length && j - i - d >= min) { s++; }
				}
			}
			return s;
		}

		// input = "###############\n#...#...#.....#\n#.#.#.#.#.###.#\n#S#...#.#.#...#\n#######.#.#.###\n#######.#.#...#\n#######.#.###.#\n###..E#...#...#\n###.#######.###\n#...###...#...#\n#.#####.#.###.#\n#.#...#.#.#...#\n#.#.#.#.#.#.###\n#...#...#...###\n###############";
		input = input.split('\n').map(l => l.split(''));
		let path = findPath(input);
		let route = [];
		for (let p = path; p !== null; p = p.prev) { route.push(p); }
		route = route.reverse();
		let a = shortcuts(route, 2, 100);
		let b = shortcuts(route, 20, 100);
		return {
			solution: `# shortcuts: ${a}\n# updated shortcuts: ${b}`,
			bmp: input,
			renderer: new BitmapRenderer(c => colors[c] || "#FF0000", input, 4)
		};
	}
}