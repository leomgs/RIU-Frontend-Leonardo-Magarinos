import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel, ReactiveFormsModule, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UppercaseDirective } from './uppercase';

@Component({
  imports: [UppercaseDirective, FormsModule],
  standalone: true,
  template: `
    <input type="text" appUppercase [(ngModel)]="text" />
  `
})
class TestComponent {
  text = '';
}

describe('UppercaseDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let input: HTMLInputElement;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule,UppercaseDirective, TestComponent],
      declarations: []
    }).compileComponents(); 

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    input = fixture.debugElement.query(By.css('input')).nativeElement;
    fixture.detectChanges();
  });

  it('should transform input value to uppercase', () => {
    input.value = 'hello world';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('HELLO WORLD');
    expect(component.text).toBe('HELLO WORLD');
  });

  it('should not emit valueChanges when setting uppercase value', () => {
    const control = new FormControl('');
    const spy = jasmine.createSpy('valueChanges');
    control.valueChanges.subscribe(spy);

    // Manually create directive with reactive form control
    const directive = new UppercaseDirective({ nativeElement: input }, { control } as any);
    input.value = 'test';
    directive.onInput(new Event('input'));

    expect(control.value).toBe('TEST');
    expect(spy).not.toHaveBeenCalled(); // emitEvent: false prevents emission
  });
});