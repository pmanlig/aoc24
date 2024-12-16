// import React from 'react';
import { BitmapRenderer } from '../util';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

const colors = {
	'#': "#000000",
	'.': "#CFCFCF",
	'-': "#7F7F7F",
	'x': "#FF0000",
	'E': "#00FF00",
	'S': "#0000FF"
}

const east = 1;
const wall = '#';

const right = 1;
const left = 3;

const directions = [
	{ x: 0, y: -1 }, // north
	{ x: 1, y: 0 }, // east
	{ x: 0, y: 1 }, // south
	{ x: -1, y: 0 } // west
]

function dist(p, g) {
	if (p.x === g.x || p.y === g.y) { return Math.abs(g.x - p.x) + Math.abs(g.y - p.y); }
	return Math.abs(g.x - p.x) + Math.abs(g.y - p.y) + 1000;
}

export class S16 extends Solver {
	index(n) {
		return n.dir * 1000000 + n.y * 1000 + n.x;
	}

	add(n) {
		n.wgt = n.score + dist(n, this.goal);
		let idx = this.index(n);
		if (this.best[idx] === undefined || n.score < this.best[idx].score) {
			this.best[idx] = { score: n.score, paths: [] }
			this.paths.push(n);
		} else if (n.score === this.best[idx].score) {
			this.best[idx].paths.push(n);
		}
	}

	turn(p, d) {
		this.add({
			x: p.x,
			y: p.y,
			prev: p,
			dir: (p.dir + d) % 4,
			score: p.score + 1000,
		});
	}

	ahead(p) {
		let n = {
			x: p.x + directions[p.dir].x,
			y: p.y + directions[p.dir].y,
			prev: p,
			dir: p.dir,
			score: p.score + 1
		}
		if (this.map[n.y][n.x] !== wall) {
			this.map[n.y][n.x] = '-';
			this.add(n);
		}
	}

	findPath() {
		let i = 0;
		while (this.paths.length > 0 && i++ < 1000) {
			let p = this.paths.pop();
			if (this.lowest > -1 && this.lowest < p.score) { continue; }
			if (p.x === this.goal.x && p.y === this.goal.y) {
				this.lowest = p.score;
				this.solutions.push(p);
			}
			this.turn(p, right);
			this.turn(p, left);
			this.ahead(p);
			this.paths.sort((a, b) => b.wgt - a.wgt);
		}
	}

	colorSolution() {
		let i = 0;
		while (this.solutions.length > 0 && i++ < 100) {
			for (let p = this.solutions.pop(); p !== null; p = p.prev) {
				this.map[p.y][p.x] = 'x';
				let idx = this.index(p);
				if (!this.visited.has(idx)) {
					this.visited.add(idx);
					this.solutions = this.solutions.concat(this.best[idx].paths);
				}
			}
		}
	}

	countTiles() {
		return this.map.map(l => l.filter(c => c === 'x').length).reduce((a, b) => a + b, 0);
	}

	setup(input) {
		this.map = input.split('\n').map(l => l.split(''));
		this.best = [];
		this.paths = [];
		for (let r = 0; r < this.map.length; r++) {
			for (let c = 0; c < this.map[r].length; c++) {
				if (this.map[r][c] === 'S') { this.paths.push({ x: c, y: r, dir: east, prev: null, score: 0 }); }
				if (this.map[r][c] === 'E') { this.goal = { x: c, y: r }; }
			}
		}
		this.setState({
			solution: `Ingen lösning än`,
			bmp: this.map,
			renderer: new BitmapRenderer(c => colors[c] || "#FF0000", this.map, 3)
		});
		this.solutions = [];
		this.visited = new Set();
		this.limit = 100000;
		this.lowest = -1;
	}

	solve() {
		if (this.paths.length > 0) {
			this.findPath();
		} else if (this.solutions.length > 0) {
			this.colorSolution();
		} else {
			return {
				solution: `Lowest score: ${this.lowest}, # good tiles: ${this.countTiles()}`,
				bmp: this.map,
				renderer: this.state.renderer
			}
		}

		this.setState({
			solution: `Calculating...`,
			bmp: this.map,
			renderer: this.state.renderer
		});
	}
}