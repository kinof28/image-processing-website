import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BasicService {

  constructor() { }

  getGreyMatrix(imageData: Uint8ClampedArray, height: number, width: number):number[][]{
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
  rotateMatrixToLeft(matrix:number[][]):void{

  }
  rotateMatrixToRight(matrix:number[][]):void{

  }
  zoomInMatrix(matrix:number[][]):void{

  }
  zoomOutOfMatrix(matrix:number[][]):void{

  }
}
