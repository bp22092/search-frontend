import { Component, OnInit } from '@angular/core';
import { Pharmacy } from '../../../shared/pharmacy';
import { ApiService } from '../../../shared/api.service';
import { ActivatedRoute } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { PharmacyCardComponent } from '../../../shared/ui/pharmacy-card/pharmacy-card.component';
import { AreaTitleCardComponent } from '../../../shared/ui/area-title-card/area-title-card.component';
import { Router } from '@angular/router';
import { ApsPaginationComponent } from 'src/app/shared/ui/aps-pagination/aps-pagination.component';

@Component({
  selector: 'app-pharmacies',
  templateUrl: './results-address.component.html',
  styleUrls: ['./results-address.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, PharmacyCardComponent, AreaTitleCardComponent, ApsPaginationComponent],
})
export class ResultsAddressComponent implements OnInit {
  pharmacies: Pharmacy[] = [];
  todofuken = '';
  shikuchoson = '';
  totalItems = 0;
  loading = true;
  isOutOfHours = '';
  currentPage = 1;
  totalPages = 1;
  pageList: number[] = [];

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.todofuken = params['todofuken'];
      this.shikuchoson = params['shikuchoson'];
      this.isOutOfHours = params['is_out_of_hours'];
      this.getPharmaciesByAddress();
    });
  }

  getPharmaciesByAddress() {
    this.apiService
      .getPharmaciesByAddress(this.todofuken, this.shikuchoson, this.isOutOfHours, this.currentPage)
      .subscribe((apiResponse) => {
        this.pharmacies = apiResponse.results;
        this.totalItems = apiResponse.meta.totalItems;
        this.totalPages = apiResponse.meta.totalPages;
        this.loading = false;
        this.getPageList(this.totalPages);
      });
  }

  getPageList(totalPages: number) {
    this.pageList = [];
    for (let i = 1; i <= totalPages; i++) {
      this.pageList.push(i);
    }
  }

  pager(page: number) {
    this.currentPage = page;
    this.router.navigate(['/pharmacies/address'], {
      queryParams: {
        todofuken: this.todofuken,
        shikuchoson: this.shikuchoson,
        is_out_of_hours: this.isOutOfHours,
        page: this.currentPage,
      },
    });
  }
}
