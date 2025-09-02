import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

});