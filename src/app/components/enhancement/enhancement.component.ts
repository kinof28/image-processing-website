import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HistogramService} from "../../services/histogram.service";
import {BasicService} from "../../services/basic.service";
import {EnhancementService} from "../../services/enhancement.service";

@Component({
  selector: 'app-enhancement',
  templateUrl: './enhancement.component.html',
  styleUrls: ['./enhancement.component.css']
})
export class EnhancementComponent implements OnInit {

  @ViewChild('image') imageInput!: ElementRef;
  imageData!: ImageData;
  msg: string = "";
  @ViewChild('resultImage', {static: false}) imageResult!: ElementRef;
  @ViewChild('resultImageCanvas') resultImageCanvas!: ElementRef;
  context!: CanvasRenderingContext2D;
  canvas!: HTMLCanvasElement;
  resultImageMatrix!: number[][];
  @ViewChild('strength') strength!:ElementRef;

  constructor(private basicService:BasicService,private enhancementService:EnhancementService) {
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
    this.resultImageMatrix = this.basicService.getGreyMatrix(this.imageData.data, this.canvas.height, this.canvas.width);
    this.displayMatrix();
  }
  private displayMatrix(): void {
    let data = this.imageData.data;
    for (let i = 0; i < this.resultImageMatrix.length; i++) {
      for (let j = 0; j < this.resultImageMatrix[0].length; j++) {
        data[(((i * this.resultImageMatrix[i].length) + j) * 4)] = this.resultImageMatrix[i][j];
        data[(((i * this.resultImageMatrix[i].length) + j) * 4) + 1] = this.resultImageMatrix[i][j];
        data[(((i * this.resultImageMatrix[i].length) + j) * 4) + 2] = this.resultImageMatrix[i][j];
      }
    }
    this.context.putImageData(this.imageData, 0, 0);
    this.imageResult.nativeElement.src = this.canvas.toDataURL();
  }
  reduceSaltAndPepperNoise():void{

  }
  createSaltAndPepperNoise():void{
    this.enhancementService.createPepperAndSaltNoiseInMatrix(this.resultImageMatrix,Math.abs(this.strength.nativeElement.value));
    this.displayMatrix();
  }

  save(): void {
    let canvas: HTMLCanvasElement = this.resultImageCanvas.nativeElement;
    let gh = canvas.toDataURL('image/png');
    let a = document.createElement('a');
    a.href = gh;
    a.download = 'image.png';
    a.click()
  }


  ngOnInit(): void {
  }

}
