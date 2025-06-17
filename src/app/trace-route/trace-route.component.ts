import { Component } from '@angular/core';
import { TraceRouteService } from '../../services/trace-route.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-trace-route',
  imports: [FormsModule, CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './trace-route.component.html',
  styleUrl: './trace-route.component.scss'
})
export class TraceRouteComponent {
ipAddress = '';
  traceResult = '';

  constructor(private tracerouteService: TraceRouteService) {}

  trace() {
  this.traceResult = '\nPlease wait.\nTracing...';
  this.tracerouteService.runTraceroute(this.ipAddress).subscribe({
    next: (result) => this.traceResult = result,
    error: (err) => this.traceResult = 'Traceroute failed or server error.'
  });
}

}
