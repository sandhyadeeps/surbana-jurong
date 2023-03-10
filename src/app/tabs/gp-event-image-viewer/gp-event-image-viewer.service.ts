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
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import * as AWS from 'aws-sdk';

@Injectable({providedIn:'root'})
export class GpEventImageViewerService {
  urlChanged = new Subject<string>();
  imgSrc = '';
  s3: any;
  config: any;
  private url = 'https://wmiowsdev.int-aws-de.webmethods.io/runflow/run/sync/lO81aK4pc';
  httpClient: any;
  constructor(private http: HttpClient) { }

  fetchImageFromBaseUrl(image:any) {
    return this.http.get('url'+image); //add url
  }
  // to make a connection with AWS
  fetchS3(config:any) {
    this.config = config;
    if (config !== undefined) {
      const awsConfig = new AWS.Config({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        signatureVersion: config.signatureVersion,
        region: config.region,
      });
      this.s3 = new AWS.S3(awsConfig);
    }
  }
  // fetches the image from AWS
  getImage = (key:any) => {
    if (this.s3 !== undefined) {
      const url = this.s3.getSignedUrl('getObject', {
        Bucket: this.config.bucket,
        Key: key + '',
      });
      return url;
    }
    return '';
  }
  getPosts(){
    return this.http.get(this.url);
  }
  
}
