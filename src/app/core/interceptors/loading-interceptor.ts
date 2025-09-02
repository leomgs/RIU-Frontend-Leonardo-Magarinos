import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { filter, finalize, Observable, of } from 'rxjs';
import { LoadingService } from '../services/loading/loading-service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private loadingService = inject(LoadingService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.method === 'POST' || req.method === 'DELETE' || req.method === 'PUT' || req.method === 'GET' ) {
      this.loadingService.addRequest(req.url);

      return of(new HttpResponse({body: 'request result',status: 200})).pipe(
        filter((event) => event instanceof Response),
        finalize(() => {
          this.loadingService.deleteRequest(req.url);
        })
      );
    }
    return next.handle(req);
  }
};
