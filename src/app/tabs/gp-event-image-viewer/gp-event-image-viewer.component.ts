/*
* Copyright (c) 2019 Software AG, Darmstadt, Germany and/or its licensors
*
* SPDX-License-Identifier: Apache-2.0
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
 */
import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
  Input,
} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { GpEventImageViewerService } from './gp-event-image-viewer.service';
import { EventService, Realtime } from '@c8y/client';
import { DomSanitizer } from '@angular/platform-browser';
import * as DefaultImage from './gp-default-image';
import { CarouselImageViewer } from './carousel-image-viewer';
import { Subscription, switchMap, timer } from 'rxjs';

@Component({
  selector: 'lib-gp-event-image-viewer',
  templateUrl: './gp-event-image-viewer.component.html',
  styleUrls: ['./gp-event-image-viewer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GpEventImageViewerComponent implements OnInit {
  config: any;
  isLinear = false;
  panelOpenState = false;
  url = '';
  selectedIndex = 0;
  realtimeState = true;
  evantData: any;
  displayData: any = [];
  slideshow = false;
  noWrapSlides = false;
  fromDate = '';
  toDate = '';
  imageMap: any;
  isCollapsed1 = false;
  isAnimated: boolean = false;
  subscription: Subscription;
  constructor(
    public dialog: MatDialog,
    public events: EventService,

    public imageViewrService: GpEventImageViewerService,
    // tslint:disable-next-line: variable-name
    public _DomSanitizationService: DomSanitizer
  ) { }

  ngOnInit() {
    if (!this.config) {
      const device = {
        id: '43084821'
      };
      this.config = {
        accessKeyId: '###',
        secretAccessKey: '###',
        signatureVersion: '##',
        region: '##',
        device,
        width: 500,
        height: 500,
        imgSrcType: 's3key',
        eventType: 'C8y_Image_Event',
        bucket: '###'
      };
    }
    this.refresh();
  }
  async refresh() {
    this.fromDate = '';
    this.toDate = '';
    this.subscription = timer(0, 15000).pipe(
      switchMap(() => this.imageViewrService.getPosts())
    ).subscribe((result: any) => {
      this.displayData.push(result);
      this.displayData.forEach((data) => {
        data.temperature_measurement.T.value = data.temperature_measurement.T.value.toFixed(2);
      })
    }
  )}
  errorInloading(event: any) {
    this.url = 'data:image/png;base64, ' + DefaultImage.defaultImage;
  }
  // fetches image from base url and AWS storage
  async loadImage() {
    this.url = '';
    if (this.evantData.length > 0 && this.evantData[this.selectedIndex].Image !== undefined) {
      if (this.imageMap.hasOwnProperty(this.evantData[this.selectedIndex].id)) {
        this.url = this.imageMap[this.evantData[this.selectedIndex].id];
      } else {
        if (this.config.imgSrcType === 'baseUrl') {
          // this.url = await this.fetchImg(
          //this.config.baseUrl + this.evantData[this.selectedIndex].Image
          //);
        } else {
          this.url = this.imageViewrService.getImage(
            this.evantData[this.selectedIndex].Image
          );
        }
        this.imageMap[this.evantData[this.selectedIndex].id] = this.url;
      }
    }
  }
  // to show the events in the slide show.It will open a slide show pop-up
  setSlideShow() {
    this.slideshow = !this.slideshow;
    const dialogRef = this.dialog.open(CarouselImageViewer, {
      width: this.config.width + 'px',
      height: this.config.height + 'px',
      data: {
        eventData: this.evantData,
        baseUrl:
          this.config.imgSrcType === 'baseUrl' ? this.config.baseUrl : '',
        width: Number(this.config.width) - 100 + 'px',
        height: Number(this.config.height) - 100 + 'px',
      },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  // this retrieves the base url image
  async fetchImg() {
    //const x: any = await this.imageViewrService.fetchImageFromBaseUrl().toPromise();
    //return 'data:image/png;base64, ' + x.encodedString;
  }
  // update 'from date' and 'to date' based on date selected
  dateChanged(x: any, event: any) {
    if (x === 'from') {
      this.fromDate = event.value;
    } else {
      this.toDate = event.value;
    }
  }
  // filters the event list based on selected dates
  filter() {
    this.displayData = this.evantData.filter((singleEvent: any) => {
      if (singleEvent.creationTime !== undefined) {
        return (
          Date.parse(singleEvent.creationTime) > Date.parse(this.fromDate) &&
          Date.parse(singleEvent.creationTime) < Date.parse(this.toDate)
        );
      }
      return false;
    });
  }
  openDialog(key: any): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(ImageViewerDialog, {
      width: this.config.width + 'px',
      height: this.config.height + 'px',
      data: { url: this.url },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  // fetches event list from event servcice
  async fetchEvents() {
    const eventFilter = {
      source: this.config.device.id,
      pageSize: 2000,
      type: this.config.eventType,
    };
    // tslint:disable-next-line: deprecation
    await this.events.list(eventFilter)
      .then((data) => {
        if (this.realtimeState) {
          this.evantData = data.data;
          if (this.evantData.length > 0) {
            this.evantData.sort((a: any, b: any): number => {
              if (a.creationTime !== undefined && b.creationTime !== undefined) {
                return a.creationTime > b.creationTime
                  ? -1
                  : a.creationTime < b.creationTime
                    ? 1
                    : 0;
              }
              return 0;
            });
            this.displayData = this.evantData;
            this.displayData.forEach((element: any) => {
              element.isCollapsed1 = true;
            })
            setTimeout(() => this.loadImage(), 2000);
          }
        }
      });
  }
  collapseLogic(eventID: any) {
    this.displayData.forEach((element: any) => {
      if (element.id === eventID) {
        element.isCollapsed1 = !element.isCollapsed1;
      }
      else {
        element.isCollapsed1 = true;
      }
    })
  }
  toggle() {
    this.realtimeState = !this.realtimeState;
    if (this.realtimeState) {
      this.fetchEvents();
    }
  }
  // On selection of particular event it will show the image in the dialog
  stepperselectected(event: any) {
    this.url = '';
    this.selectedIndex = event.selectedIndex;
    this.loadImage();
  }
}

export interface DialogData {
  url: string;
}
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'image-viewer-dialog',
  templateUrl: 'image-viewer-dialog.html',
  styleUrls: ['image-viewer-dialog.css'],
})
// tslint:disable-next-line: component-class-suffix
export class ImageViewerDialog {
  constructor(
    public dialogRef: MatDialogRef<ImageViewerDialog>,
    // tslint:disable-next-line: variable-name
    public _DomSanitizationService: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

