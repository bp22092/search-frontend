import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Addresses } from '../../../shared/types/addresses';
import { Router } from '@angular/router';
import { NgClass, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-search',
  templateUrl: './pharmacies.component.html',
  styleUrls: ['./pharmacies.component.css'],
  standalone: true,
  imports: [ButtonComponent, FormsModule, NgFor, NgClass],
})
export class PharmaciesComponent implements OnInit {
  addresses: Addresses = {};
  prefectures: string[] = [];
  municipalities: string[] = [];
  selectedPrefecture = '';
  selectedMunicipality = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<Addresses>('assets/addresses.json').subscribe((data) => {
      this.addresses = data;
      this.prefectures = Object.keys(data);
    });
  }

  onPrefectureChange() {
    this.municipalities = this.addresses[this.selectedPrefecture] || [];
  }

  onAddressSearch() {
    if (!this.arePrefectureAndMunicipalitySelected()) {
      window.alert('都道府県と市区町村を選択してください。');
      return;
    }
    this.router.navigate(['/pharmacies/address'], {
      queryParams: {
        todofuken: this.selectedPrefecture,
        shikuchoson: this.selectedMunicipality,
      },
    });
  }

  arePrefectureAndMunicipalitySelected() {
    return this.selectedPrefecture !== '' && this.selectedMunicipality !== '';
  }
}
