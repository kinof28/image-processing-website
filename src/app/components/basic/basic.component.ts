import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HistogramService} from "../../services/histogram.service";
import {BasicService} from "../../services/basic.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-basic',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.css']
})
export class BasicComponent {

    @ViewChild('image') imageInput!: ElementRef;
    imageData!: ImageData;
    msg: string = "";
    greyLevelLabel: number = 256;
    // drawMode: boolean = false;
    @ViewChild('resultImage') imageResult!: ElementRef;
    @ViewChild('resultImageCanvas') resultImageCanvas!: ElementRef;
    context!: CanvasRenderingContext2D;
    canvas!: HTMLCanvasElement;
    resultImageMatrix!: number[][];

    constructor(private histogramService: HistogramService,
                private basicService: BasicService,
                private router: Router) {
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
    }

    rotateLeft(): void {
        this.rotateCanvas();
        this.resultImageMatrix = this.basicService.rotateMatrixToLeft(this.resultImageMatrix);
        this.displayMatrix();
    }

    rotateRight(): void {
        this.rotateCanvas();
        this.resultImageMatrix = this.basicService.rotateMatrixToRight(this.resultImageMatrix);
        this.displayMatrix();
    }

    private rotateCanvas(): void {
        this.canvas.width = this.resultImageMatrix.length;
        this.canvas.height = this.resultImageMatrix[0].length;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    horizontalFlip(): void {
        this.resultImageMatrix = this.basicService.flipMatrixHorizontally(this.resultImageMatrix);
        this.displayMatrix();
    }

    verticalFlip(): void {
        this.resultImageMatrix = this.basicService.flipMatrixVertically(this.resultImageMatrix);
        this.displayMatrix();
    }

    zoomIn(): void {
        this.resultImageMatrix = this.basicService.zoomInMatrix(this.resultImageMatrix);
        this.imageData = this.context.getImageData(0, 0, this.resultImageMatrix[0].length, this.resultImageMatrix.length);
        this.displayMatrix();
    }

    zoomOut(): void {
        this.resultImageMatrix = this.basicService.zoomOutOfMatrix(this.resultImageMatrix);
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.imageData = this.context.getImageData(0, 0, this.resultImageMatrix[0].length, this.resultImageMatrix.length);
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


    private greyLevelImplementation(level: number): void {
        if (this.imageResult.nativeElement.src) this.normaliseData();
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
        this.histogramService.calculateHistogram(this.basicService.getGreyMatrix(this.imageData.data, this.canvas.height, this.canvas.width));
        this.router.navigate(["/histogram"]);
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
    // drawImage(): void {
    //   this.drawMode = true;
    // }

}
