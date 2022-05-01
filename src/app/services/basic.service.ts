import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BasicService {

    getGreyMatrix(imageData: Uint8ClampedArray, height: number, width: number): number[][] {
        const data = imageData;
        let matrix: number[][] = [];
        for (let i = 0; i < height; i++) {
            matrix[i] = [];
            for (let j = 0; j < width; j++) {
                matrix[i][j] = (data[(i * width * 4) + j * 4] + data[(i * width * 4) + j * 4 + 1] + data[(i * width * 4) + j * 4 + 2]) / 3;
            }
        }
        return matrix;
    }

    rotateMatrixToLeft(matrix: number[][]): number[][] {
        let matrixResult: number[][] = [];
        let height = matrix[0].length;
        let width = matrix.length;
        for (let i = 0; i < height; i++) {
            matrixResult[i] = [];
        }
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                matrixResult[height - i - 1][j] = matrix[j][i];
            }
        }
        return matrixResult;
    }

    rotateMatrixToRight(matrix: number[][]): number[][] {
        let matrixResult: number[][] = [];
        let height = matrix[0].length;
        let width = matrix.length;
        for (let i = 0; i < height; i++) {
            matrixResult[i] = [];
        }
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                matrixResult[i][width - j - 1] = matrix[j][i];
            }
        }
        return matrixResult;
    }

    zoomInMatrix(matrix: number[][]): number[][] {
        //grow
        let height=matrix.length*2;
        let width=matrix[0].length*2;
        let matrixResult: number[][] = [];
        for (let i = 0; i < height; i++) {
            matrixResult[i] = [];
            for (let j = 0; j < width; j++) {
                matrixResult[i][j]=matrix[Math.floor(i/2)][Math.floor(j/2)];
            }
        }
        return matrixResult;
    }

    zoomOutOfMatrix(matrix: number[][]): number[][] {
        //shrink
        let height=matrix.length/2;
        let width=matrix[0].length/2;
        let matrixResult: number[][] = [];
        for (let i = 0; i < height; i++) {
            matrixResult[i] = [];
            for (let j = 0; j < width; j++) {
                matrixResult[i][j]=matrix[i*2][j*2];
            }
        }
        return matrixResult;
    }

    flipMatrixHorizontally(matrix: number[][]): number[][] {
        let matrixResult: number[][] = [];
        for (let i = 0; i < matrix.length; i++) {
            matrixResult[i] = [];
            for (let j = 0; j < matrix[0].length; j++) {
                matrixResult[i][j] = matrix[matrix.length - i - 1][j];
            }
        }
        return matrixResult;
    }

    flipMatrixVertically(matrix: number[][]): number[][] {
        let matrixResult: number[][] = [];
        for (let i = 0; i < matrix.length; i++) {
            matrixResult[i] = [];
            for (let j = 0; j < matrix[0].length; j++) {
                matrixResult[i][j] = matrix[i][matrix[0].length - j - 1];
            }
        }
        return matrixResult;
    }
}
