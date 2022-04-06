import {Injectable} from '@angular/core';
import {BasicService} from "./basic.service";
import {UtilsService} from "./utils.service";

@Injectable({
  providedIn: 'root'
})
export class BarCodeService {

  constructor(private basicService: BasicService, private utils: UtilsService) {
  }

  getBarCode(data: Uint8ClampedArray, height: number, width: number): string {
    return this.getBarCodeFromGreyLevelMatrix(this.basicService.getGreyMatrix(data, height, width));
  }

  getBarCodeFromGreyLevelMatrix(matrix: number[][]): string {
    this.utils.convertMatrixToBinary(matrix);
    let pattern: number[] = this.getPattern(matrix[30]);
    return this.getBarCodeFromPattern(pattern);
  }

  getBarCodeFromPattern(pattern: number[]): string {
    let barCode: string = "";
    let encoding = "";
    let iteration = 1;
    let encodingDigit = 0;
    for (let i = 0; i < pattern.length; i++) {
      encoding +=""+ pattern[i];
      encodingDigit++;
      if (iteration == 1 || iteration == 7) {
        if (encodingDigit == 3) {
          encoding = "";
          encodingDigit = 0;
          iteration++;
        }
      } else {
        if (encodingDigit == 7) {
          barCode += this.getDigitFromBinaryEncoding(encoding);
          encoding = "";
          encodingDigit = 0;
          iteration++;
        }
      }

    }
    return barCode;
  }

  getDigitFromBinaryEncoding(encoding: String): string {
    let digit = "";
      switch (encoding) {
        //-------------L-CODE
        case "0001101":
          digit = "0";
          break;
        case "0011001":
          digit = "1";
          break;
        case "0010011":
          digit = "2";
          break;
        case "0111101":
          digit = "3";
          break;
        case "0100011":
          digit = "4";
          break;
        case "0110001":
          digit = "5";
          break;
        case "0101111":
          digit = "6";
          break;
        case "0111011":
          digit = "7";
          break;
        case "0110111":
          digit = "8";
          break;
        case "0001011":
          digit = "9";
          break;
          //-------------------G-CODE
        case "0100111":
          digit = "0";
          break;
        case "0110011":
          digit = "1";
          break;
        case "0011011":
          digit = "2";
          break;
        case "0100001":
          digit = "3";
          break;
        case "0011101":
          digit = "4";
          break;
        case "0111001":
          digit = "5";
          break;
        case "0000101":
          digit = "6";
          break;
        case "0010001":
          digit = "7";
          break;
        case "0001001":
          digit = "8";
          break;
        case "0010111":
          digit = "9";
          break;
          //-------------R-CODE
        case "1110010":
          digit = "0";
          break;
        case "1100110":
          digit = "1";
          break;
        case "1101100":
          digit = "2";
          break;
        case "1000010":
          digit = "3";
          break;
        case "1011100":
          digit = "4";
          break;
        case "1001110":
          digit = "5";
          break;
        case "1010000":
          digit = "6";
          break;
        case "1000100":
          digit = "7";
          break;
        case "1001000":
          digit = "8";
          break;
        case "1110100":
          digit = "9";
          break;
        default:digit="X";break;
    }
    return digit;
  }

  private getPattern(imageRow: number[]): number[] {
    let pattern: number[] = [];
    let areasLengths: number[] = [];
    let areaWidth: number = this.getAreaWidth(imageRow);
    let started = false;
    let currentArea: number = 1;
    let currentAreaLength: number = 0;
    for (let i = 0; i < imageRow.length; i++) {
      if (imageRow[i] == 1 && !started) continue;
      started = true;
      if (currentArea != imageRow[i]) {
        if (currentAreaLength != 0) areasLengths.push(currentAreaLength);
        currentAreaLength = 0;
        currentArea = imageRow[i];
      } else {
        currentAreaLength++;
      }
    }
    let rounds = 0;
    for (let i = 0; i < areasLengths.length; i++) {
      rounds = Math.floor(areasLengths[i] / (areaWidth - (areaWidth * 0.2)));
      for (let j = 0; j < rounds; j++) {
        pattern.push((i + 1) % 2);
      }
    }
    return pattern;
  }

  private getAreaWidth(imageRow: number[]): number {
    let areaWidth = 0;
    let finalAreaWidth = 0;
    let currentValue = 1;
    let init = 0;
    let isCalculating = false;
    for (let i = 0; (i < imageRow.length && init < 4); i++) {
      if (currentValue != imageRow[i]) {
        finalAreaWidth = Math.max(finalAreaWidth, areaWidth);
        areaWidth = 0;
        isCalculating = true;
        areaWidth++;
        currentValue = imageRow[i];
        init++;
        continue;
      }
      if (isCalculating) {
        areaWidth++;
      }
    }
    return finalAreaWidth;
  }
}
