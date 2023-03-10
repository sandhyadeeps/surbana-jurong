/**
 * Copyright (c) 2020 Software AG, Darmstadt, Germany and/or its licensors
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

import { Component, OnInit, Input, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GpRestBasedGridWidgetService } from './gp-rest-based-grid-widget.service';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'lib-gp-rest-based-grid-widget',
  templateUrl: 'gp-rest-based-grid-widget.html',
  styleUrls: ['material-grid.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GpRestBasedGridWidgetComponent implements OnInit, AfterViewInit {
  responseData: any;
  config: any;
  ServiceRequest: string | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  date: any;
  posts: any;

  constructor(private iotSrService: GpRestBasedGridWidgetService, private datePipe: DatePipe) { }

  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['measurementID', 'measurementTime', 'measurementValue', 'measurementUnit'];
  displayedColumnValues: string[] = [];
  expandedDetail: string[] = [];
  expandedDetailValues: string[] = [];
  mainList: string = '';
  subList: string = '';
  columns: any = [];
  expandedColumns: any;
  isExpandable: boolean = false;
  deviceExtId: string = '';
  realtimeState = true;
  isDeviceSelected = false;
  currentPage = 1;
  pageSize: any;
  totalRecord = -1;
  filterValue: any;
  expandedElement: any | null;
  ApiUrl: string = '';
  tableColumnNames = "Measurement ID,Measurement Time,Measurement Value,Measurement Unit";
  tableColumnValues = "measurementID,measurementTime,measurementValue,measurementUnit";

  async ngOnInit() {



    this.date = this.datePipe.transform(new Date(), 'dd-MM-yy');
    const response = await this.iotSrService.getRestItems();
    this.isDeviceSelected = false; //hardcode device id

    this.pageSize = 5

    if (this.isDeviceSelected) {
      // this.deviceExtId = await this.iotSrService.getExternalIdForDevice(); //hardcode device id
      // this.ApiUrl = 'hsgadhsfdh' + this.deviceExtId;
      this.isDeviceSelected = false;
    } else {
      this.ApiUrl = 'http://wmiowsdev.int-aws-de.webmethods.io/runflow/run/sync/jVHJzLzqN';  //hardcode api url
    }

    this.isExpandable = false;

    this.mainList = '';
    this.subList = '';

    /*this.displayedColumns = this.tableColumnNames.split(',');
    this.displayedColumnValues = this.tableColumnValues.split(',');

    this.displayedColumns.forEach((iterator, index) => {
      this.columns.push({ columnDef: iterator, header: iterator, cell: (element: any) => `${element[this.displayedColumnValues[index]]}` },)

    });*/

    if (this.isExpandable) {
      this.expandedDetail = this.config.subTableColumnNames.split(',');
      this.expandedDetailValues = this.config.subTableColumnValues.split(',');

      this.expandedDetail.forEach((iterator1, index1) => {
        this.expandedColumns.push({ columnDef: iterator1, header: iterator1, cell: (element: any) => `${element[this.expandedDetailValues[index1]]}` },)


      });

    }


    if (response && response.length > 0) {
      this.totalRecord = response.length;
      this.responseData = response;
      const pageData = response.slice(0, (this.pageSize));
      this.responseData.forEach((data: any) => {
        data.measurementTime = this.datePipe.transform(data.measurementTime, 'dd/MM/yyyy hh:mm:ss aa')
      });
      this.dataSource.data = this.responseData;
      this.sort.direction = 'desc';
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  // Refresh
  async refresh() {

    if (this.config.isDevice) {
      this.isDeviceSelected = this.config.isDevice;

    }
    if (this.isDeviceSelected) {
      // this.deviceExtId = await this.iotSrService.getExternalIdForDevice();
      //  this.ApiUrl = this.config.url + this.deviceExtId;
      this.isDeviceSelected = false;
    } else {
      this.ApiUrl = this.config.url;
    }

    this.isExpandable = this.config.theCheckbox;
    this.mainList = this.config.mainListName;
    this.subList = this.config.subListName;

    this.displayedColumns = [];
    this.displayedColumnValues = [];
    this.columns = [];

    this.expandedDetail = [];
    this.expandedDetailValues = [];
    this.expandedColumns = [];

    this.displayedColumns = this.config.tableColumnNames.split(',');
    this.displayedColumnValues = this.config.tableColumnValues.split(',');

    this.displayedColumns.forEach((iterator, index) => {
      this.columns.push({ columnDef: iterator, header: iterator, cell: (element: any) => `${element[this.displayedColumnValues[index]]}` },)
    });

    if (this.isExpandable) {
      this.expandedDetail = this.config.subTableColumnNames.split(',');
      this.expandedDetailValues = this.config.subTableColumnValues.split(',');

      this.expandedDetail.forEach((iterator1, index1) => {
        this.expandedColumns.push({ columnDef: iterator1, header: iterator1, cell: (element: any) => `${element[this.expandedDetailValues[index1]]}` },)

      });

    }

    this.responseData = [];
    this.totalRecord = -1;
    this.currentPage = 1;
    const response = await this.iotSrService.getRestItems();
    if (response && response[this.mainList].length > 0) {
      this.totalRecord = response[this.mainList].length;
      this.responseData = response[this.mainList];
      const pageData = this.responseData.slice(0, (this.pageSize));
      this.dataSource.data = pageData;
      this.dataSource.sort = this.sort;
    }

  }
  // Search Filter
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }
  /**
   * This method will called during page navigation
   */
  getPageEvent(pageEvent: any) {
    this.currentPage = pageEvent.page;
    this.dataSource.data = this.responseData.slice(((this.currentPage - 1) * this.pageSize), (this.currentPage * this.pageSize))
  }

}
