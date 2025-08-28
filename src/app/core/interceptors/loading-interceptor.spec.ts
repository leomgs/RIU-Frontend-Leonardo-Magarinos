import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeroesService } from '../services/heroes/heroes-service';
import { LoadingInterceptor } from './loading-interceptor';

describe('Interceptor with HeroService', () => {
  let service: HeroesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeroesService,
        provideHttpClient(
          // DI-based interceptors must be explicitly enabled.
          withInterceptorsFromDi(),
        ),
        {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
      ]
    });

    service = TestBed.inject(HeroesService);
  });

  it('should return heroes from interceptor', (done) => {
    const heroes = service.getHeroes();

    expect(heroes).toBeTruthy();
    done();
  });

});