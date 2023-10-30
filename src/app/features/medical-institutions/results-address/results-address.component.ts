import { Component, OnInit } from '@angular/core';
import { MedicalInstitution } from '../../../shared/medical-institution';
import { ApiService } from '../../../shared/api.service';
import { ActivatedRoute } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MedicalInstitutionCardComponent } from '../../../shared/ui/medical-institution-card/medical-institution-card.component';
import { AreaTitleCardComponent } from '../../../shared/ui/area-title-card/area-title-card.component';

@Component({
  selector: 'app-medical-institutions',
  templateUrl: './results-address.component.html',
  styleUrls: ['./results-address.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, MedicalInstitutionCardComponent, AreaTitleCardComponent],
})
export class ResultsAddressComponent implements OnInit {
  medicalInstitutions: MedicalInstitution[] = [];
  todofuken = '';
  shikuchoson = '';
  totalItems = 0;
  loading = true;
  is_open_sunday = '';
  is_open_holiday = '';
  currentPage = 1;
  totalPages = 1;
  pageList: number[] = [];

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.todofuken = params['todofuken'];
      this.shikuchoson = params['shikuchoson'];
      this.is_open_sunday = params['is_open_sunday'];
      this.is_open_holiday = params['is_open_holiday'];
      this.getMedicalInstitutionsByAddress();
    });
  }

  getMedicalInstitutionsByAddress() {
    this.apiService
      .getMedicalInstitutionsByAddress(
        this.todofuken, 
        this.shikuchoson, 
        this.is_open_sunday, 
        this.is_open_holiday, 
        this.currentPage
      )
      .subscribe((apiResponse) => {
        this.medicalInstitutions = apiResponse.results;
        this.totalItems = apiResponse.meta.totalItems;
        this.totalPages = apiResponse.meta.totalPages;
        this.loading = false;
        this.getPageList(this.totalPages)
      });
  }

  getPageList(totalPages: number) {
    this.pageList = [];
    for (let i = 1; i <= totalPages; i++) {
      this.pageList.push(i)
    }
  }

  pager(page: number) {
    this.currentPage = page;
    this.getMedicalInstitutionsByAddress();
  }
}
