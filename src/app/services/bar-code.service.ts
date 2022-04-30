import {Injectable} from '@angular/core';
import {BasicService} from "./basic.service";
import {UtilsService} from "./utils.service";

@Injectable({
  providedIn: 'root'
})
export class BarCodeService {

  private firstDigitEncoding: String = "";

  constructor(private basicService: BasicService, private utils: UtilsService) {
  }

  getBarCode(data: Uint8ClampedArray, height: number, width: number): string {
    return this.getBarCodeFromGreyLevelMatrix(this.basicService.getGreyMatrix(data, height, width));
  }

  getBarCodeFromGreyLevelMatrix(matrix: number[][]): string {
    this.utils.convertMatrixToBinary(matrix);
    let pattern: number[] = this.getPattern(matrix[Math.floor(matrix.length*0.4)]);
    return this.getBarCodeFromPattern(pattern);
  }

  getBarCodeFromPattern(pattern: number[]): string {
    let barCode: string = "";
    this.firstDigitEncoding = "";
    if (!this.checkPattern(pattern)) return "can not read barcode from this image";
    else {
      pattern = this.cropGuards(pattern);
      for (let i = 0; i < 12; i++) {
        barCode += this.getDigitFromBinaryEncoding(pattern.slice(i * 7, (i * 7) + 7).join(''));
      }
      return this.getFirstDigit() + barCode;
    }
  }

  private cropGuards(pattern: number[]): number[] {
    let croppedPattern: number[];
    croppedPattern = pattern.slice(3, 92);
    croppedPattern = croppedPattern.slice(0, Math.floor(croppedPattern.length / 2) - 2).concat(croppedPattern.slice(Math.floor(croppedPattern.length / 2) + 3));
    return croppedPattern;
  }

  private checkPattern(pattern: number[]): boolean {
    let firstGuard = (pattern[0] == 1 && pattern[1] == 0 && pattern[2] == 1);
    let lastGuard = (pattern[pattern.length - 1] == 1 && pattern[pattern.length - 2] == 0 && pattern[pattern.length - 3] == 1);
    let middleGuard = (pattern[44] == 1 && pattern[45] == 0 && pattern[46] == 1 && pattern[47] == 0 && pattern[48] == 1);
    console.log("guard check : " + (firstGuard && middleGuard && lastGuard));
    return firstGuard && middleGuard && lastGuard;

  }

  private getDigitFromBinaryEncoding(encoding: String): string {
    console.log(encoding);
    let digit: string;
    switch (encoding) {
      //-------------L-CODE
      case "0001101":
        digit = "0";
        this.firstDigitEncoding += "L";
        break;
      case "0011001":
        digit = "1";
        this.firstDigitEncoding += "L";
        break;
      case "0010011":
        digit = "2";
        this.firstDigitEncoding += "L";
        break;
      case "0111101":
        digit = "3";
        this.firstDigitEncoding += "L";
        break;
      case "0100011":
        digit = "4";
        this.firstDigitEncoding += "L";
        break;
      case "0110001":
        digit = "5";
        this.firstDigitEncoding += "L";
        break;
      case "0101111":
        digit = "6";
        this.firstDigitEncoding += "L";
        break;
      case "0111011":
        digit = "7";
        this.firstDigitEncoding += "L";
        break;
      case "0110111":
        digit = "8";
        this.firstDigitEncoding += "L";
        break;
      case "0001011":
        digit = "9";
        this.firstDigitEncoding += "L";
        break;
      //-------------------G-CODE
      case "0100111":
        digit = "0";
        this.firstDigitEncoding += "G";
        break;
      case "0110011":
        digit = "1";
        this.firstDigitEncoding += "G";
        break;
      case "0011011":
        digit = "2";
        this.firstDigitEncoding += "G";
        break;
      case "0100001":
        digit = "3";
        this.firstDigitEncoding += "G";
        break;
      case "0011101":
        digit = "4";
        this.firstDigitEncoding += "G";
        break;
      case "0111001":
        digit = "5";
        this.firstDigitEncoding += "G";
        break;
      case "0000101":
        digit = "6";
        this.firstDigitEncoding += "G";
        break;
      case "0010001":
        digit = "7";
        this.firstDigitEncoding += "G";
        break;
      case "0001001":
        digit = "8";
        this.firstDigitEncoding += "G";
        break;
      case "0010111":
        digit = "9";
        this.firstDigitEncoding += "G";
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
      default:
        digit = "X";
        break;
    }
    return digit;
  }

  private getFirstDigit(): string {
    switch (this.firstDigitEncoding) {
      case "LLLLLL":
        return "0";
      case "LLGLGG":
        return "1";
      case "LLGGLG":
        return "2";
      case "LLGGGL":
        return "3";
      case "LGLLGG":
        return "4";
      case "LGGLLG":
        return "5";
      case "LGGGLL":
        return "6";
      case "LGLGLG":
        return "7";
      case "LGLGGL":
        return "8";
      case "LGGLGL":
        return "9";
      default:
        return "";
    }
  }

  private getPattern(imageRow: number[]): number[] {
    let pattern: number[] = [];
    imageRow = this.normaliseImageRow(imageRow);
    let areaWidth: number = imageRow.length / 95;
    for (let i = 0; i < 95; i++) {
      pattern[i] = this.getAreaValue(imageRow.slice(i * areaWidth, (i * areaWidth) + areaWidth));
    }
    return pattern;
  }

  private getAreaValue(area: number[]): number {
    let blackValue = 0, whiteValue = 0;
    for (let i = 0; i < area.length; i++) {
      if (area[i] == 0) blackValue++;
      else if (area[i] == 1) whiteValue++;
      else console.log("something is wrong with this pixel its value is : " + area[i]);
    }
    if (blackValue > whiteValue) return 1;
    else if (whiteValue > blackValue) return 0;
    else {
      console.log("something is wrong white and black pixels are equal in this area :" + area);
      return -1;
    }
  }

  private normaliseImageRow(imageRow: number[]): number[] {
    let firstIndex = 0;
    let lastIndex = imageRow.length - 1;
    while (true) {
      if (imageRow[firstIndex] == 0) break;
      firstIndex++;
    }
    while (true) {
      if (imageRow[lastIndex] == 0) break;
      lastIndex--;
    }
    return imageRow.slice(firstIndex, lastIndex + 1);
  }
}
