import {Component, OnInit} from '@angular/core';
import {HistogramService} from "../../services/histogram.service";

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.css']
})
export class HistogramComponent implements OnInit {

  barChartLabels: number[] = [];
  barChartData: [{ data: number[]; label: string }] = [{data: [], label: ""}];

  constructor(private histogramService: HistogramService) {
  }

  barChartOptions = [{
    scaleShowVerticalLines: true,
    responsive: true
  }];
  public barChartLegend = true;

  ngOnInit(): void {
    this.barChartLabels = this.histogramService.getHistogramBarsLabels();
    this.barChartData = [
      {data: this.histogramService.histogram, label: 'pixels'}
      // {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
    ];
  }


}
