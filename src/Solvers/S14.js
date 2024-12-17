// import React from 'react';
import { BitmapRenderer } from '../util';
import Solver from './Solvers';

const width = 101, height = 103;

const colors = [
	"#DFDFDF",
	"#0000BF",
	"#BF0000",
	"#00BF00"
];

function move(robots, steps, width, height) {
	robots.forEach(r => {
		r[0] += r[2] * steps;
		while (r[0] < 0) r[0] += width;
		r[0] = r[0] % width;
		r[1] += r[3] * steps;
		while (r[1] < 0) r[1] += height;
		r[1] = r[1] % height;
	});
}

function calc(robots, width, height) {
	const midX = Math.floor(width / 2), midY = Math.floor(height / 2);
	let quad = [0, 0, 0, 0];
	robots.forEach(r => {
		if (r[0] !== midX && r[1] !== midY) {
			let q = Math.floor(2 * r[0] / width) + 2 * Math.floor(2 * r[1] / height);
			quad[q]++;
		}
	});
	return quad[0] * quad[1] * quad[2] * quad[3];
}

function createMap(width, height) {
	let map = [];
	for (let r = 0; r < height; r++) {
		map[r] = [];
		for (let c = 0; c < width; c++) {
			map[r][c] = 0;
		}
	}
	return map;
}

function updateMap(map, robots, width, height) {
	for (let r = 0; r < height; r++) {
		map[r] = [];
		for (let c = 0; c < width; c++) {
			map[r][c] = 0;
		}
	}
	robots.forEach(r => map[r[1]][r[0]]++);
}

export class S14 extends Solver {
	setup(input) {
		const robot = (input) => /p=(\d+),(\d+) v=([-\d]+),([-\d]+)/.exec(input).slice(1).map(n => parseInt(n, 10));

		// const width = 11, height = 7;
		// input = "p=0,4 v=3,-3\np=6,3 v=-1,-3\np=10,3 v=-1,2\np=2,0 v=2,-1\np=0,0 v=1,3\np=3,0 v=-2,-2\np=7,6 v=-1,-3\np=3,0 v=-1,-2\np=9,3 v=2,3\np=7,3 v=-1,2\np=2,4 v=2,-3\np=9,5 v=-3,-3";
		this.original = input.split('\n').map(robot);
		this.robots = this.original.map(r => [...r]);
		this.map = createMap(width, height);
		move(this.robots, 100, width, height);
		this.a = calc(this.robots, width, height);
		this.b = 0;
		this.time = 0;
		this.robots = this.original.map(r => [...r]);
		move(this.robots, this.time, width, height);
		updateMap(this.map, this.robots, width, height);
		this.image = [];
		this.renderer = new BitmapRenderer(v => colors[v] || "#000000", this.map, 4);
		this.setState({
			solution: `Time: ${this.time}`,
			bmp: this.map,
			renderer: this.renderer
		});
	}

	solve() {
		const limit = 50000;
		if (this.time >= limit) {
			console.log(this.robots);
			console.log(this.image, Math.max(...this.image.slice(1)));
			// console.log(this.safety, Math.min(...this.safety), Math.max(...this.safety));

			let m = 1;
			for (let i = 1; i < this.image.length; i++) { if (this.image[i] > this.image[m]) m = i; }
			// this.image.indexOf(Math.max(...this.image)) + 1;
			this.robots = this.original.map(r => [...r]);
			move(this.robots, m, width, height);
			updateMap(this.map, this.robots, width, height);
			return { solution: `Safety factor: ${this.a}, Christmas time: ${m}`, bmp: this.map, renderer: this.renderer }
		}

		let i = 0;
		while (i++ < 1000 && this.time++ < limit) {
			move(this.robots, 1, width, height);
			updateMap(this.map, this.robots, width, height);
			this.image[this.time] = this.robots.filter(r => r[0] > 25 && r[0] < 76 && r[1] > 26 && r[1] < 77).length;
		}

		this.setState({
			solution: `Time: ${this.time}`,
			bmp: this.map,
			renderer: this.renderer
		});
	}
}