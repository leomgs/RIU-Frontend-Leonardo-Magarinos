import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HeroesService } from '../services/heroes/heroes-service';
import { LoadingInterceptor } from './loading-interceptor';

describe('Interceptor with HeroService', () => {
  let service: HeroesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeroesService,
        provideHttpClient(
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