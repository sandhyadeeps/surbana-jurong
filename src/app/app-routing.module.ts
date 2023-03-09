import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpRestBasedGridWidgetComponent } from './tabs/gp-rest-based-grid-widget/gp-rest-based-grid-widget.component';
import { TabsComponent } from './tabs/tabs.component';
import { GpEventImageViewerComponent } from './tabs/gp-event-image-viewer/gp-event-image-viewer.component';
const routes: Routes = [
  {
    path: 'telemetry',
    component: GpRestBasedGridWidgetComponent
  },
  {
    path: 'realtime',
    component: GpEventImageViewerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }