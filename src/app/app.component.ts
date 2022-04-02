import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('image') imageInput!:ElementRef;
  imageData!:ImageData;
  msg:string="";
  drawMode:boolean=false;
  @ViewChild('resultImage', {static: false}) imageResult!:ElementRef;
  @ViewChild('resultImageCanvas') resultImageCanvas!:ElementRef;



  uploadImage(event:any):void{
    if(!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }
    let mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "Only images are supported";
      return;
    }
    let reader=new FileReader();
    console.log("image upload :");
    console.log((<any>event.target).files[0]);
    reader.readAsDataURL((<any>event.target).files[0]);
    reader.onload=(_event)=>{
      this.imageInput.nativeElement.src =<string>reader.result;
    };
  }

  rotateLeft():void{
    // let canvas:HTMLCanvasElement=this.resultImageCanvas.nativeElement;
    // canvas.height=this.imageInput.nativeElement.naturalHeight;
    // canvas.width=this.imageInput.nativeElement.naturalWidth;
    //
    // let context:CanvasRenderingContext2D=<CanvasRenderingContext2D>canvas.getContext('2d');
    // context.drawImage(this.imageInput.nativeElement,0,0);
    // this.imageData=context.getImageData(0,0,canvas.width,canvas.height);
    // let data =this.imageData.data;
    // let avg:number;
    // for(let i=0;i<data.length;i+=4){
    //   avg=(data[i]+data[i+1]+data[i+2])/3;
    //   data[i]=avg;
    //   data[i+1]=avg;
    //   data[i+2]=avg;
    // }
    // context.putImageData(this.imageData,0,0);
    // this.imageResult.nativeElement.src=canvas.toDataURL();

  }
  rotateRight():void{

  }
  greyLevel():void{
    let canvas:HTMLCanvasElement=this.resultImageCanvas.nativeElement;
    canvas.height=this.imageInput.nativeElement.naturalHeight;
    canvas.width=this.imageInput.nativeElement.naturalWidth;

    let context:CanvasRenderingContext2D=<CanvasRenderingContext2D>canvas.getContext('2d');
    context.drawImage(this.imageInput.nativeElement,0,0);
    this.imageData=context.getImageData(0,0,canvas.width,canvas.height);
    let data =this.imageData.data;
    let avg:number;
    for(let i=0;i<data.length;i+=4){
      avg=(data[i]+data[i+1]+data[i+2])/3;
      data[i]=avg;
      data[i+1]=avg;
      data[i+2]=avg;
    }
    context.putImageData(this.imageData,0,0);
    this.imageResult.nativeElement.src=canvas.toDataURL();
  }
  greyLevel16():void{

  }
  save():void{
    let canvas:HTMLCanvasElement=this.resultImageCanvas.nativeElement;
    let gh = canvas.toDataURL('image/png');
    let a  = document.createElement('a');
    a.href = gh;
    a.download = 'image.png';
    a.click()
  }

  //TODO: draw image feature
  drawImage():void{
    this.drawMode=true;
  }


}
