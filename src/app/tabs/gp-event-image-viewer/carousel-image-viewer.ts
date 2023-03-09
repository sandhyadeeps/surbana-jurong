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
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GpEventImageViewerService } from './gp-event-image-viewer.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as DefaultImage from './gp-default-image';

export interface DialogData {
  eventData: any;
  baseUrl: string;
  width: string;
  height: string;
}
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'carousel-image-viewer',
  templateUrl: 'carousel-image-viewer.html',
  styleUrls: ['carousel-image-viewer.css'],
})
// tslint:disable-next-line: component-class-suffix
export class CarouselImageViewer {
  url = '';
  noWrapSlides = false;
  imageType = '';
  time = '';
  imageMap:any = {};
  constructor(
    public dialogRef: MatDialogRef<CarouselImageViewer>,
    public imageViewrService: GpEventImageViewerService,
    // tslint:disable-next-line: variable-name
    public _DomSanitizationService: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  errorInloading(event:any) {
    this.url = 'data:image/png;base64, ' + DefaultImage.defaultImage;
  }
  async carouselChanged(event:any) {
    if ( this.data.eventData.length > 0 && this.data.eventData[event].Image !== undefined) {
      if (this.imageMap.hasOwnProperty(this.data.eventData[event].id)) {
        this.url = this.imageMap[this.data.eventData[event].id];
      } else {
        if (this.data.baseUrl === '') {
          this.url = '';
          this.imageType = this.data.eventData[event].Classification;
          this.time = this.data.eventData[event].time;
          this.url = this.imageViewrService.getImage(
            this.data.eventData[event].Image
          );
        } else {
          this.url = await this.fetchImg(this.data.baseUrl + this.data.eventData[event].Image);
        }
        this.imageMap[this.data.eventData[event].id] = this.url;
      }
    }
  }
  async fetchImg(url:any) {
    const x: any = await this.imageViewrService.fetchImageFromBaseUrl(url).toPromise();
    this.url = 'data:image/png;base64, ' + x.encodedString;
    return this.url;
  }
}
