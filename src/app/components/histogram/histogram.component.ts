import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HistogramService} from "../../services/histogram.service";

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.css']
})
export class HistogramComponent implements OnInit, AfterViewInit {

  barChartLabels: number[] = [];
  barChartData: [{ data: number[]; label: string }] = [{data: [], label: ""}];

  barChartOptions = [{
    scaleShowVerticalLines: true,
    responsive: true
  }];
  public barChartLegend = true;
  @ViewChild("canvas") canvasRef!: ElementRef;
  private canvas!:HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private imageData!:ImageData;
  cameraOffset: Location = {x: 0, y: 0};
  cameraZoom: number = 1;
  MAX_ZOOM: number = 5;
  MIN_ZOOM: number = 0.1;
  SCROLL_SENSITIVITY: number = 0.0005;
  isDragging:boolean = false
  dragStart:Location = { x: 0, y: 0 }
  // initialPinchDistance = null;
  lastZoom = this.cameraZoom;

  constructor(private histogramService: HistogramService) {
  }

  ngOnInit(): void {
    this.cameraOffset = {x: window.innerWidth / 2, y: window.innerHeight / 2};
    this.barChartLabels = this.histogramService.getHistogramBarsLabels();
    this.barChartData = [
      {data: this.histogramService.histogram, label: 'pixels'}
      // {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
    ];
  }

  ngAfterViewInit(): void {
    this.canvas=<HTMLCanvasElement>this.canvasRef.nativeElement;
    this.context=<CanvasRenderingContext2D>this.canvas.getContext('2d');
    this.imageData=this.context.getImageData(0,0,this.canvas.width,this.canvas.height);

    window.requestAnimationFrame(()=>{
      this.draw();
    });
  }



  private draw():void{
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context.translate( window.innerWidth / 2, window.innerHeight / 2 )
    this.context.scale(this.cameraZoom, this.cameraZoom)
    this.context.translate( -window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y )
    this.context.clearRect(0,0, window.innerWidth, window.innerHeight);
    //this.context.putImageData(this.imageData,0,0,0,0,window.innerWidth / 2, window.innerHeight / 2);
    window.requestAnimationFrame(()=>{
      this.draw();
    });

  }


  onZoom(event: WheelEvent) {
    this.adjustZoom(event.deltaY*this.SCROLL_SENSITIVITY,0);
  }

  onPointerDown(event: MouseEvent) {
    this.isDragging = true;
    this.dragStart.x = this.getEventLocation(event).x/this.cameraZoom - this.cameraOffset.x;
    this.dragStart.y = this.getEventLocation(event).y/this.cameraZoom - this.cameraOffset.y;
  }

  onPointerUp(event: MouseEvent) {
    this.isDragging = false
    // this.initialPinchDistance = null
    this.lastZoom = this.cameraZoom
  }
  //
  // onTouchStart(event: TouchEvent) {
  //   console.log("on touche start");
  //   this.getEventLocation(event);
  // }

  // onTouchEnd(event: TouchEvent) {
  //   console.log("on touche end");
  //   this.getEventLocation(event);
  // }

  onPointerMove(event: MouseEvent) {
    console.log("on pointer move");
    this.getEventLocation(event);
  }

  // onTouchMove(event: TouchEvent) {
  //   console.log("on touche move");
  //   this.getEventLocation(event);
  // }
  private getEventLocation(event:MouseEvent):Location{
    return { x: event.clientX, y: event.clientY }
  }
  private adjustZoom(zoomAmount:number, zoomFactor:number):void
  {
    if (!this.isDragging)
    {
      if (zoomAmount!==0)
      {
        this.cameraZoom += zoomAmount
      }
      else if (zoomFactor!==0)
      {
        console.log(zoomFactor)
        this.cameraZoom = zoomFactor*this.lastZoom
      }

      this.cameraZoom = Math.min( this.cameraZoom, this.MAX_ZOOM )
      this.cameraZoom = Math.max( this.cameraZoom, this.MIN_ZOOM )

      console.log(zoomAmount)
    }
  }
}
type Location = {
  x:number;y:number;
}
