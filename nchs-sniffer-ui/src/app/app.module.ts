import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularSplitModule } from 'angular-split';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NchsSnifferService } from './nchs-sniffer.service';
import { ConfigLoader } from './util/config-loader';
import { MessageViewComponent } from './message-view/message-view.component';
import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { HomeComponent } from './home/home.component';
import { MessageTableComponent } from './message-view/message-table/message-table.component';
import { MessageDetailsComponent } from './message-view/message-details/message-details.component';
import { ConnectionDialogComponent } from './connection-dialog/connection-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageViewComponent,
    InputDialogComponent,
    InfoDialogComponent,
    HomeComponent,
    MessageTableComponent,
    MessageDetailsComponent,
    ConnectionDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule,
    AngularSplitModule
  ],
  providers: [
    ConfigLoader,
    NchsSnifferService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
