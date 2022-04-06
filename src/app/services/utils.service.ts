import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  convertMatrixToBinary(matrix:number[][]):void{
    for(let i=0;i<matrix.length;i++){
      for(let j=0;j<matrix[i].length;j++){
        matrix[i][j]=Math.floor(matrix[i][j]/128);
      }
    }
  }
}
