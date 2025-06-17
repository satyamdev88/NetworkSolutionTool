import { Component } from '@angular/core';
import { MacfinderService } from '../../services/macfinder.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-mac-finder',
  imports: [CommonModule, FormsModule, HeaderComponent,FooterComponent],
  templateUrl: './mac-finder.component.html',
  styleUrl: './mac-finder.component.scss'
})
export class MacFinderComponent {
mac = '';
  vendor: any;

  constructor(private macService: MacfinderService) {}

  find() {
    this.macService.lookup(this.mac.trim()).subscribe({
      next: (data) => {
        this.vendor = data.vendor;
      },
      error: (err) => {
        if (err.status === 404) {
          this.vendor = 'Vendor not found for this MAC';
        } else {
          this.vendor = 'MAC lookup failed';
        }
      },
    });

    console.log(this.vendor);
  }
}
