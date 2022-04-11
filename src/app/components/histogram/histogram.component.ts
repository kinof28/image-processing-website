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
  cameraOffset: { x: number, y: number } = {x: 0, y: 0};
  cameraZoom: number = 1;
  MAX_ZOOM: number = 5;
  MIN_ZOOM: number = 0.1;
  SCROLL_SENSITIVITY: number = 0.0005;

  constructor(private histogramService: HistogramService) {
  }

  ngAfterViewInit(): void {
    this.canvas=<HTMLCanvasElement>this.canvasRef.nativeElement;
    this.context=<CanvasRenderingContext2D>this.canvas.getContext('2d');
  }

  ngOnInit(): void {
    this.cameraOffset = {x: window.innerWidth / 2, y: window.innerHeight / 2};
    this.barChartLabels = this.histogramService.getHistogramBarsLabels();
    this.barChartData = [
      {data: this.histogramService.histogram, label: 'pixels'}
      // {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
    ];
  }


  adjustZoom() {

  }

  onPointerDown() {

  }

  onPointerUp() {

  }

  onTouchStart() {

  }

  onTouchEnd() {

  }

  onPointerMove() {

  }

  onTouchMove() {

  }
}
