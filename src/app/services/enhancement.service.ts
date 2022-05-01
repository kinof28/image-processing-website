import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnhancementService {

  constructor() { }

  createPepperAndSaltNoiseInMatrix(matrix:number[][],strength:number):void{
    let line:number,column:number,pepperOrSalt;
    for (let i = 0; i < strength*100; i++) {
      line=Math.floor(Math.random()*matrix.length);
      column=Math.floor(Math.random()*matrix[0].length);
      pepperOrSalt=Math.floor(Math.random()*2);
      matrix[line][column]=255*pepperOrSalt;
    }
  }

}
