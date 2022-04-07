import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HistogramService} from "./services/histogram.service";
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BasicComponent } from './components/basic/basic.component';
import { EnhancementComponent } from './components/enhancement/enhancement.component';
import { CodeBarComponent } from './components/code-bar/code-bar.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { HistogramComponent } from './components/histogram/histogram.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import {NgChartsModule} from "ng2-charts";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BasicComponent,
    EnhancementComponent,
    CodeBarComponent,
    NotFoundPageComponent,
    HistogramComponent,
    DocumentationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule
  ],
  providers: [HistogramService],
  bootstrap: [AppComponent]
})
export class AppModule { }
