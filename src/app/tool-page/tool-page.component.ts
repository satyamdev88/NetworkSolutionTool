import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';

import { NetworkTools } from '../../data/menu';

@Component({
  selector: 'app-tool-page',
  imports: [CommonModule, NgFor],
  templateUrl: './tool-page.component.html',
  styleUrl: './tool-page.component.scss',
})
export class ToolPageComponent {
  tools = NetworkTools;
  openInNewTab(url: string) {
    window.location.href = url;
    console.log(url);
  }
}
