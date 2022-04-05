import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BasicComponent} from "./components/basic/basic.component";
import {EnhancementComponent} from "./components/enhancement/enhancement.component";
import {CodeBarComponent} from "./components/code-bar/code-bar.component";
import {NotFoundPageComponent} from "./components/not-found-page/not-found-page.component";
import {HistogramComponent} from "./components/histogram/histogram.component";
import {DocumentationComponent} from "./components/documentation/documentation.component";

const routes: Routes = [
  {
    path:"" ,
    component:BasicComponent
  },{
    path:"enhancement" ,
    component:EnhancementComponent
  },{
    path:"bar-code" ,
    component:CodeBarComponent
  },{
    path:"histogram" ,
    component:HistogramComponent
  },{
    path:"documentation" ,
    component:DocumentationComponent
  },{
    path:"**" ,
    component:NotFoundPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
