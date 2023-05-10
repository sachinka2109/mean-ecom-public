import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatchPasswordDirective } from "./passwordmatch.directive";
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    MatchPasswordDirective,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatPaginatorModule,
    CommonModule,
    NgSelectModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    CommonModule,
    MatchPasswordDirective,
    NgSelectModule,
  ]
})
export class SharedModule {

}
