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
  sortArray(vector:number[]):void{
    let temp:number;
    for (let i = 0; i < vector.length-1; i++) {
      for (let j = 0; j < vector.length-1; j++) {
        if(vector[j]>vector[j+1]){
          temp=vector[j];
          vector[j]=vector[j+1];
          vector[j+1]=temp;
        }
      }
    }
  }
  gatArrayAverage(vector:number[]):number{
    let average=0;
    for (let i = 0; i < vector.length; i++) {
      average+=vector[i];
    }
    average/=vector.length;
    return average;
  }
}
