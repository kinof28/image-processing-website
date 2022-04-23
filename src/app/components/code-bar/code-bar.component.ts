import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BarCodeService} from "../../services/bar-code.service";

@Component({
  selector: 'app-code-bar',
  templateUrl: './code-bar.component.html',
  styleUrls: ['./code-bar.component.css']
})
export class CodeBarComponent implements OnInit {

  @ViewChild('image') imageInput!: ElementRef;
  result: string = "";
  msg: string = "";
  context!: CanvasRenderingContext2D;
  canvas!: HTMLCanvasElement;
  imageData!: ImageData;
  @ViewChild('resultImage', {static: false}) imageResult!: ElementRef;
  @ViewChild('resultImageCanvas') resultImageCanvas!: ElementRef;

  constructor(private barCodeService: BarCodeService) {
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
    this.msg = "";
    reader.onloadend = (event) => {
      this.canvas = this.resultImageCanvas.nativeElement;
      this.canvas.height = this.imageInput.nativeElement.naturalHeight;
      this.canvas.width = this.imageInput.nativeElement.naturalWidth;
      this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');
      this.context.drawImage(this.imageInput.nativeElement, 0, 0);
      this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      this.result = this.barCodeService.getBarCode(this.imageData.data, this.canvas.height, this.canvas.width);
    };
  }


  ngOnInit(): void {
  }

}
