import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  statusEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  status = false;
  requests: string[] = new Array<string>();
  addRequest(request: string) {
    this.requests.push(request);
    this.verify()
  }
  deleteRequest(request: string) {
    setTimeout(()=> {
      this.requests.splice(this.requests.indexOf(request),1);
      this.verify();
    }, 500);  
  }

  private verify() {
    const status = this.requests.length !== 0;
    if(this.status !== status) {
      this.status = status;
      this.statusEvent.emit(this.status);
    }
  }

}
