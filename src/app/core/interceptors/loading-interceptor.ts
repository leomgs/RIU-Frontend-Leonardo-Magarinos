import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, finalize, Observable, of } from 'rxjs';
import { LoadingService } from '../services/loading/loading-service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor { 
  private mockData = [
    { id: 1, name: 'Batman' },
    { id: 2, name: 'Superman' },
    { id: 3, name: 'Wonder Woman' }
  ];
  
  constructor(private loadingService:LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Match a request (for example GET /api/heroes)
    if (req.method === 'POST' || req.method === 'DELETE' || req.method === 'PUT' || req.method === 'GET' ) {
      this.loadingService.addRequest(req.url);

      return of(new HttpResponse({body: 'request result',status: 200})).pipe(
        filter((event) => event instanceof Response),
        finalize(() => {
          this.loadingService.deleteRequest(req.url);
        })
      );
    }
    return next.handle(req); // fallback for other requests
  }
};
