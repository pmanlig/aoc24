// import React from 'react';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

const directions = [
	{ y: -1, x: 0 },
	{ y: 0, x: 1 },
	{ y: 1, x: 0 },
	{ y: 0, x: -1 }
];

const flags = [1, 2, 4, 8];
const obstacle = 16;

export class S6 extends Solver {
	solve(input) {
		function newPos(pos, d) {
			return {
				x: pos.x + directions[d].x,
				y: pos.y + directions[d].y,
				d: d
			}
		}

		function makeMap(input) {
			return input.map(l => l.map(c => c === '#' ? obstacle : 0));
		}

		function findInitial(input) {
			for (let r = 0; r < input.length; r++) {
				for (let c = 0; c < input[r].length; c++) {
					if (input[r][c] === '^') {
						return {
							y: r,
							x: c,
							d: 0
						}
					}
				}
			}
		}

		function findPath(input, init) {
			let pos = init;
			let path = [pos];
			while (pos.x > 0 && pos.x < input[0].length - 1 && pos.y > 0 && pos.y < input.length - 1) {
				input[pos.y][pos.x] = 'X';
				let d = pos.d;
				for (let n = newPos(pos, d); input[n.y][n.x] === '#'; n = newPos(pos, d)) {
					d = (d + 1) % 4;
				}
				pos = newPos(pos, d);
				path.push(pos);
			}
			input[pos.y][pos.x] = 'X';
			return path;
		}

		/* Meh; this produces too good of a solution!
		function isLoop(input, init, obst) {
			let map = makeMap(input);
			for (let i = 0; i < init.length; i++) {
				map[init[i].y][init[i].x] = map[init[i].y][init[i].x] | flags[init[i].d];
			}
			map[obst.y][obst.x] = obstacle;
			let pos = init.pop();
			while (pos.x > 0 && pos.x < map[0].length - 1 && pos.y > 0 && pos.y < map.length - 1) {
				let d = pos.d;
				for (let n = newPos(pos, d); map[n.y][n.x] === obstacle; n = newPos(pos, d)) {
					d = (d + 1) % 4;
				}
				pos = newPos(pos, d);
				if (map[pos.y][pos.x] & flags[d] > 0) { return true; }
				map[pos.y][pos.x] = map[pos.y][pos.x] | flags[d];
			}
			return false;
		}
		*/

		function isTrueLoop(map, pos) {
			let turns = 0;
			let loop = pos;
			try {
				while (turns === 0 || pos.x !== loop.x || pos.y !== loop.y) {
					let d = pos.d;
					for (let n = newPos(pos, d); map[n.y][n.x] === obstacle; n = newPos(pos, d)) {
						d = (d + 1) % 4;
						turns++;
					}
					pos = newPos(pos, d);
				}
			} catch (e) {
				console.log("error", pos);
			}
			return turns === 4;
		}

		function isLoop(input, init, obst) {
			let map = makeMap(input);
			for (let i = 0; i < init.length; i++) {
				map[init[i].y][init[i].x] = map[init[i].y][init[i].x] | flags[init[i].d];
			}
			map[obst.y][obst.x] = obstacle;
			let pos = init.pop();
			while (pos.x > 0 && pos.x < map[0].length - 1 && pos.y > 0 && pos.y < map.length - 1) {
				let d = pos.d;
				for (let n = newPos(pos, d); map[n.y][n.x] === obstacle; n = newPos(pos, d)) {
					d = (d + 1) % 4;
				}
				pos = newPos(pos, d);
				if (map[pos.y][pos.x] & flags[d] > 0) {
					console.log(pos, obst);
					return true;
					return isTrueLoop(map, pos);
				}
				map[pos.y][pos.x] = map[pos.y][pos.x] | flags[d];
			}
			return false;
		}

		try {
			input = "....#.....\n.........#\n..........\n..#.......\n.......#..\n..........\n.#..^.....\n........#.\n#.........\n......#...";
			input = input.split('\n').map(l => l.split(''));
			let init = findInitial(input);
			let path = findPath(input, init);
			let a = input.map(l => l.filter(e => e === 'X').length).reduce((a, b) => a + b);
			let b = 0;
			for (let i = 1; i < path.length; i++) {
				if (!path.slice(0, i).some(p => p.x === path[i].x && p.y === path[i].y))
					if (isLoop(input, path.slice(0, i), path[i])) {
						// console.log(path[i].x, path[i].y);
						b++;
					}
			}
			// console.log(path[19]);
			// console.log(isLoop(input, path.slice(0,19), path[19]));
			return { solution: `Positions visited: ${a}\n# of possible obstacles: ${b}` };
		} catch (e) {
			console.log(e);
			return { solution: `Något gick fel` };
		}
	}
}