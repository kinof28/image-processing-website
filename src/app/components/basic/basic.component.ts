import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HistogramService} from "../../services/histogram.service";
import {BasicService} from "../../services/basic.service";

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css']
})
export class BasicComponent{

  @ViewChild('image') imageInput!: ElementRef;
  imageData!: ImageData;
  msg: string = "";
  greyLevelLabel: number = 256;
  drawMode: boolean = false;
  isGreyLevel: boolean = false;
  @ViewChild('resultImage', {static: false}) imageResult!: ElementRef;
  @ViewChild('resultImageCanvas') resultImageCanvas!: ElementRef;
  context!: CanvasRenderingContext2D;
  canvas!: HTMLCanvasElement;


  constructor(private histogramService:HistogramService,
              private basicService:BasicService) {
  }

  uploadImage(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }
    let mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "Only images are supported";
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL((<any>event.target).files[0]);
    reader.onload = (_event) => {
      this.imageInput.nativeElement.src = <string>reader.result;
    };
    reader.onloadend = () => {
      this.normaliseData();
    };
  }

  private normaliseData(): void {
    this.canvas = this.resultImageCanvas.nativeElement;
    this.canvas.height = this.imageInput.nativeElement.naturalHeight;
    this.canvas.width = this.imageInput.nativeElement.naturalWidth;
    this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    this.context.drawImage(this.imageInput.nativeElement, 0, 0);
    this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  // private getRedMatrix(): number[][] {
  //   return this.getMatrixImplementation(0);
  // }
  //
  // private getGreenMatrix(): number[][] {
  //   return this.getMatrixImplementation(1);
  // }

  // private getBlueMatrix(): number[][] {
  //   return this.getMatrixImplementation(2);
  // }

  // private getMatrixImplementation(color: number): number[][] {
  //   //color =0 =>red
  //   //color =1 =>green
  //   //color =2 =>blue
  //   this.normaliseData();
  //   const data = this.imageData.data;
  //   let matrix: number[][] = [];
  //   for (let i = 0; i < this.canvas.height; i++) {
  //     matrix[i] = [];
  //     for (let j = 0 + color; j < this.canvas.width; j++) {
  //       matrix[i][j] = data[(i * this.canvas.width * 4) + j * 4];
  //     }
  //   }
  //   return matrix;
  // }

  rotateLeft(): void {
    this.canvas.width = 0;
    this.canvas.height = 0;
    this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
    this.canvas.height = this.imageResult.nativeElement.naturalHeight;
    this.canvas.width = this.imageResult.nativeElement.naturalWidth;
    this.context.imageSmoothingEnabled=false;
    this.context.save();
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.context.rotate(-Math.PI / 2);
    this.context.drawImage(this.imageResult.nativeElement, -(this.canvas.width / 2), -(this.canvas.height / 2));
    this.context.restore();
    this.imageResult.nativeElement.src = this.canvas.toDataURL();
  }

  rotateRight(): void {
    this.context.save();
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.context.rotate(Math.PI / 2);
    this.context.drawImage(this.imageResult.nativeElement, -(this.canvas.width / 2), -(this.canvas.height / 2));
    this.context.restore();
    this.imageResult.nativeElement.src = this.canvas.toDataURL();
  }

  // private displayMatrix(matrix: number[][]): void {
  //   let data = this.imageData.data;
  //   for (let i = 0; i < matrix.length; i++) {
  //     for (let j = 0; j < matrix[0].length; j++) {
  //       data[(((i * matrix[i].length) + j) * 4)] = matrix[i][j];
  //       data[(((i * matrix[i].length) + j) * 4) + 1] = matrix[i][j];
  //       data[(((i * matrix[i].length) + j) * 4) + 2] = matrix[i][j];
  //     }
  //   }
  //   this.context.putImageData(this.imageData, 0, 0);
  //   this.imageResult.nativeElement.src = this.canvas.toDataURL();
  // }


  private greyLevelImplementation(level: number): void {
    if (this.imageResult.nativeElement.src) this.normaliseData();
    this.isGreyLevel = true;
    let data = this.imageData.data;
    let avg: number;
    for (let i = 0; i < data.length; i += 4) {
      avg = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
      avg = Math.round(avg / (256 / level));
      avg *= (256 / level);
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }
    this.context.putImageData(this.imageData, 0, 0);
    this.imageResult.nativeElement.src = this.canvas.toDataURL();
  }

  greyLevel(): void {
    this.greyLevelImplementation(256);
  }

  greyLevelPersonalised(): void {
    this.greyLevelImplementation(this.greyLevelLabel);
  }

  plusLevel(): void {
    if (this.greyLevelLabel < 256) this.greyLevelLabel *= 2;
  }

  minusLevel(): void {
    if (this.greyLevelLabel > 2) this.greyLevelLabel /= 2;
  }

  displayHistogram(): void {
    this.normaliseData();
    this.histogramService.calculateHistogram(this.basicService.getGreyMatrix(this.imageData.data,this.canvas.height,this.canvas.width));
  }

  save(): void {
    let canvas: HTMLCanvasElement = this.resultImageCanvas.nativeElement;
    let gh = canvas.toDataURL('image/png');
    let a = document.createElement('a');
    a.href = gh;
    a.download = 'image.png';
    a.click()
  }

  //TODO: draw image feature
  drawImage(): void {
    this.drawMode = true;
  }

}
