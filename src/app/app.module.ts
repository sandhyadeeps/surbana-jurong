import { NgModule } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { GpRestBasedGridWidgetComponent } from './tabs/gp-rest-based-grid-widget/gp-rest-based-grid-widget.component';
import { TabsComponent } from './tabs/tabs.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CarouselImageViewer } from './tabs/gp-event-image-viewer/carousel-image-viewer';
import { GpEventImageViewerComponent } from './tabs/gp-event-image-viewer/gp-event-image-viewer.component';
import { EventService } from '@c8y/client';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TabsComponent,
    GpRestBasedGridWidgetComponent,
    CarouselImageViewer,
    GpEventImageViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TabsModule.forRoot(),
    MatTableModule,
    MatSortModule,
    FormsModule,
    MatPaginatorModule,
    PaginationModule.forRoot(),
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    CollapseModule.forRoot(),
    CarouselModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [HttpClient, EventService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
