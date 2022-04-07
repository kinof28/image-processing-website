import {Injectable} from "@angular/core";

@Injectable()
export class HistogramService {
  histogram: number[] = [];

  public calculateHistogram(matrix: number[][]): void {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        this.histogram[matrix[i][j]]=0;
      }
    }
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        this.histogram[matrix[i][j]]++;
      }
    }
  }
  public getHistogramBarsLabels():number[]{
    let labels:number[]=[];
    for (let i = 0; i < 255; i++) {
      labels.push(i);
    }
    return labels
  }
}
