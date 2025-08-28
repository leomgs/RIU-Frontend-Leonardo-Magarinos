import { AfterViewInit, Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TEXTS_UI } from '../../core/constants/texts_ui';
import { LoadingService } from '../../core/services/loading/loading-service';

@Component({
  selector: 'app-loading-spinner',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss'
})
export class LoadingSpinner implements AfterViewInit {
  TEXTS_UI = TEXTS_UI;
  statusLoadingRef = false;
  constructor(private loadingService:LoadingService){}
  ngAfterViewInit(): void {
      this.loadingService.statusEvent.subscribe((status)=> {
        this.statusLoadingRef = status;
      })
  }
}
