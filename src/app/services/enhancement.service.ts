import {Injectable} from '@angular/core';
import {UtilsService} from "./utils.service";

@Injectable({
    providedIn: 'root'
})
export class EnhancementService {

    constructor(private utils: UtilsService) {
    }

    createPepperAndSaltNoiseInMatrix(matrix: number[][], strength: number): void {
        let line: number, column: number, pepperOrSalt;
        for (let i = 0; i < strength * 100; i++) {
            line = Math.floor(Math.random() * matrix.length);
            column = Math.floor(Math.random() * matrix[0].length);
            pepperOrSalt = Math.floor(Math.random() * 2);
            matrix[line][column] = 255 * pepperOrSalt;
        }
    }

    applyMedianFilter(matrix: number[][]): void {
        for (let i = 1; i < matrix.length - 1; i++) {
            for (let j = 1; j < matrix[0].length - 1; j++) {
                let neighbors = this.getNeighbors(matrix, i, j)
                this.utils.sortArray(neighbors);
                matrix[i][j] = neighbors[4];
            }
        }
    }

    applyAverageFilter(matrix: number[][]): void {
        for (let i = 1; i < matrix.length - 1; i++) {
            for (let j = 1; j < matrix[0].length - 1; j++) {
                matrix[i][j] = this.utils.gatArrayAverage(this.getNeighbors(matrix, i, j));
            }
        }
    }

    private getNeighbors(matrix: number[][], i: number, j: number): number[] {
        let neighbors: number[] = [];
        neighbors[0] = matrix[i - 1][j - 1];
        neighbors[1] = matrix[i - 1][j];
        neighbors[2] = matrix[i - 1][j + 1];
        neighbors[3] = matrix[i][j - 1];
        neighbors[4] = matrix[i][j];
        neighbors[5] = matrix[i][j + 1];
        neighbors[6] = matrix[i + 1][j - 1];
        neighbors[7] = matrix[i + 1][j];
        neighbors[8] = matrix[i + 1][j + 1];
        return neighbors;
    }

}
