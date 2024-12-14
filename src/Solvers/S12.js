// import React from 'react';
import { BitmapRenderer } from '../util';
import Solver from './Solvers';
// import { SearchState, PixelMap } from '../util';

const colors = {
	A: "#3F0000",
	B: "#7F0000",
	C: "#BF0000",
	D: "#FF0000",
	E: "#003F00",
	F: "#007F00",
	G: "#00BF00",
	H: "#00FF00",
	I: "#00003F",
	J: "#00007F",
	K: "#0000BF",
	L: "#0000FF",
	M: "#3F3F00",
	N: "#7F7F00",
	O: "#BFBF00",
	P: "#FFFF00",
	Q: "#003F3F",
	R: "#007F7F",
	S: "#00BFBF",
	T: "#00FFFF",
	U: "#3F003F",
	V: "#7F007F",
	W: "#BF00BF",
	X: "#FF00FF",
	Y: "#3F3F3F",
	Z: "#7F7F7F"
}

function findRegion(x, y, covered, input) {
	let region = {
		crop: covered[y][x],
		area: 1,
		perimeter: 0,
		coordinates: []
	}
	region.coordinates[y] = [];
	region.coordinates[y][x] = true;
	covered[y][x] = false;
	let perimeter = [
		{ x: x - 1, y: y },
		{ x: x + 1, y: y },
		{ x: x, y: y - 1 },
		{ x: x, y: y + 1 }];
	while (perimeter.length > 0) {
		let { x, y } = perimeter.pop();
		if (y < 0 || y >= covered.length || x < 0 || x >= covered[y].length || input[y][x] !== region.crop) {
			region.perimeter++;
		} else if (covered[y][x] === region.crop) {
			covered[y][x] = false;
			region.area++;
			if (region.coordinates[y] === undefined) { region.coordinates[y] = []; }
			region.coordinates[y][x] = true;
			perimeter.push({ x: x - 1, y: y });
			perimeter.push({ x: x + 1, y: y });
			perimeter.push({ x: x, y: y - 1 });
			perimeter.push({ x: x, y: y + 1 });
		} else if (covered[y][x] !== false) {
			region.perimeter++;
		}
	}
	return region;
}

function regionSides(region, input) {
	function isRegion(x, y) {
		if (region.coordinates[y] === undefined) { return false; }
		if (region.coordinates[y][x] === undefined) { return false; }
		return true;
	}

	let sides = 0;
	let terminate = (edge) => {
		if (edge) sides++;
		return false;
	}

	let edge_up = false, edge_down = false;
	for (let r = 0; r < input.length; r++) {
		for (let c = 0; c <= input[r].length; c++) {
			if (isRegion(c, r)) {
				if (!isRegion(c, r - 1)) { edge_up = true; }
				else { edge_up = terminate(edge_up); }
				if (!isRegion(c, r + 1)) { edge_down = true; }
				else { edge_down = terminate(edge_down); }
			} else {
				edge_up = terminate(edge_up);
				edge_down = terminate(edge_down);
			}
		}
	}

	let edge_left = false, edge_right = false;
	for (let c = 0; c < input[0].length; c++) {
		for (let r = 0; r <= input.length; r++) {
			if (isRegion(c, r)) {
				if (!isRegion(c - 1, r)) { edge_left = true; }
				else { edge_left = terminate(edge_left); }
				if (!isRegion(c + 1, r)) { edge_right = true; }
				else { edge_right = terminate(edge_right); }
			} else {
				edge_left = terminate(edge_left);
				edge_right = terminate(edge_right);
			}
		}
	}

	return sides;
}

function findRegions(covered, input) {
	let regions = [];
	for (let r = 0; r < covered.length; r++) {
		for (let c = 0; c < covered[r].length; c++) {
			if (covered[r][c]) {
				let reg = findRegion(c, r, covered, input)
				reg.sides = regionSides(reg, input);
				regions.push(reg);
			}
		}
	}
	return regions;
}

export class S12 extends Solver {
	solve(input) {
		// input = "AAAA\nBBCD\nBBCC\nEEEC";
		input = input.split('\n').map(l => l.split(''));
		let covered = input.map(l => [...l]);
		let regions = findRegions(covered, input);

		let a = regions.map(r => r.area * r.perimeter).reduce((a, b) => a + b, 0);
		let b = regions.map(r => r.area * r.sides).reduce((a, b) => a + b, 0);
		return {
			solution: `Total fence price: ${a}\nBulk fence price: ${b}`,
			bmp: input,
			renderer: new BitmapRenderer(c => colors[c] || "#000000", input, 4)
		};
	}
}