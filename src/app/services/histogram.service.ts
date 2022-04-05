import {Injectable} from "@angular/core";

@Injectable()
export class HistogramService {
  histogram: number[] = [];

  public calculateHistogram(matrix: number[][]): void {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        this.histogram[matrix[i][j]]++;
      }
    }
  }
}
