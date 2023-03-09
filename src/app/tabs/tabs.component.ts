import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {
  constructor(private router: Router) { }
  selectedItem: any;
  ngOnInit() {
    this.navigateToTelemetry('telemetry');
  }
  navigateToTelemetry(item) {
    this.selectedItem = item;
    this.router.navigate(['/telemetry']);
  }
  navigateToRealtime(item) {
    this.selectedItem = item;
    this.router.navigate(['/realtime']);
  }
}
