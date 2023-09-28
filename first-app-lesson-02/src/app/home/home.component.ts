import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { HousingLocation } from '../housinglocation';
import { HousingService } from '../housing.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HousingLocationComponent
  ],
  template: `
    <section>
      <form>
        <input type="text" placeholder="Filter by city" #filter (input)="onFilterChange(filter.value)">
        <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button>
        <div class="validationMessage" *ngIf="showValidationMessage">{{ validationMessage }}</div>
      </form>
    </section>
    <section class="results">
      <app-housing-location
        *ngFor="let housingLocation of filteredLocationList"
        [housingLocation]="housingLocation">
      </app-housing-location>
    </section>
  `,
  styleUrls: ['./home.component.css'],
})

export class HomeComponent {
  housingLocationList: HousingLocation[] = [];
  housingService: HousingService = inject(HousingService);
  filteredLocationList: HousingLocation[] = [];

  constructor() {
    this.housingService.getAllHousingLocations().then((housingLocationList: HousingLocation[]) => {
      this.housingLocationList = housingLocationList;
      this.filteredLocationList = housingLocationList;
    });
  }

  showValidationMessage: boolean = false;
  validationMessage: string = '';

  filterResults(text: string) {
    if (!text) {
      this.filteredLocationList = this.housingLocationList;
    }

    this.filteredLocationList = this.housingLocationList.filter(
      housingLocation => housingLocation?.city.toLowerCase().includes(text.toLowerCase())
    );
  }

  onFilterChange(text: string) {
    text = text.trim();
    if(text.length < 3) {
      this.showValidationMessage = true;
      this.validationMessage = 'Please enter at least 3 characters.'
      return
    }
    if(/[^a-zåäöA-zÅÄÖ\s]/.test(text)) {
      this.showValidationMessage = true;
      this.validationMessage = 'No special characters is allowed.'
      return
    }
this.showValidationMessage = false;
this.validationMessage = '';

  }
}
