// import React from 'react';
import { BitmapRenderer } from '../util';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

const up = { x: 0, y: -1 };
const down = { x: 0, y: 1 };
const left = { x: -1, y: 0 };
const right = { x: 1, y: 0 };

const colors = {
	'.': "#CFCFCF",
	'#': "#000000",
	'x': "#FF0000"
}

export class S18 extends Solver {
	solve(input) {
		function initMap(w, h) {
			let map = [];
			for (let r = 0; r < h; r++) {
				map[r] = [];
				for (let c = 0; c < w; c++) {
					map[r][c] = '.';
				}
			}
			return map;
		}

		function sim(map, bytes) {
			for (let i = 0; i < bytes.length; i++) {
				map[bytes[i][1]][bytes[i][0]] = '#';
			}
		}

		function move(p, dir) {
			return { x: p.x + dir.x, y: p.y + dir.y, prev: p, length: p.length + 1 }
		}

		function valid(n, map) {
			return !(n.x < 0 || n.y < 0 || n.y >= map.length || n.x >= map[n.y].length || map[n.y][n.x] === '#');
		}

		function add(paths, p, map, visited) {
			if (valid(p, map) && !visited[p.y][p.x]) { paths.push(p); }
		}

		function weight(p, goal) {
			return p.length + goal.x - p.x + goal.y - p.y;
		}

		function path(map) {
			let goal = { x: map.length - 1, y: map.length - 1 };
			let paths = [{ x: 0, y: 0, prev: null, length: 0 }];
			let visited = map.map(l => l.map(c => false));
			while (paths.length > 0) {
				let p = paths.pop();
				visited[p.y][p.x] = true;
				if (p.x === goal.x && p.y === goal.y) { return p; }
				add(paths, move(p, up), map, visited);
				add(paths, move(p, down), map, visited);
				add(paths, move(p, left), map, visited);
				add(paths, move(p, right), map, visited);
				paths.sort((a, b) => weight(b, goal) - weight(a, goal));
			}
			return null;
		}

		input = input.split('\n').map(l => l.split(',').map(n => parseInt(n, 10)));
		let map = initMap(71, 71);
		sim(map, input.slice(0, 1024));
		let a = path(map);
		// for (let x = a; x !== null; x = x.prev) { map[x.y][x.x] = 'x'; }
		sim(map, input);
		let i = input.length;
		let b = path(map);
		while (b === null) {
			let m = input[--i];
			map[m[1]][m[0]] = '.';
			b = path(map);
		}
		for (let x = b; x !== null; x = x.prev) { map[x.y][x.x] = 'x'; }

		return {
			solution: `Minimum # of steps: ${a.length}\nBlocking memory: ${input[i].join(',')}`,
			bmp: map,
			renderer: new BitmapRenderer(c => colors[c] || "#FFFFFF", map, 5)
		};
	}
}