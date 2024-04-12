import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  serverURL=" https://demo.emeetify.com:81/skein_mta_demo/projects/";
  imageURL = "https://demo.emeetify.com:5032/";
  constructor(
    public httpClient:HttpClient
  ) { }


  postMethod(path:string,payload:any,flag?: Boolean){
    // let options: any = { headers: this.appendHeaders() }
    return new Promise(async (resolve, reject) => {
      this.httpClient.post(this.serverURL + path, payload).subscribe((data: any) => {
        // this.dataService.dismissLoading();
        if (data.status == false ) {
          // this.dataService.showError("Error", data.message);
        } else {
          resolve(data);
        }
      }, (error) => {
        // this.dataService.dismissLoading();
        // this.dataService.showError("Error", error.error.message);
        reject(error);
      });
    });
  }

  getMethod(path: string, flag?: Boolean) {

    return new Promise(async (resolve, reject) => {  
      this.httpClient.get(this.serverURL + path).subscribe((data: any) => {
        if (data.status == false && !flag) {
      
        } else {
          resolve(data);
        }
      }, (error) => {
   
        reject(error);
      });
    });
  }

  putMethod(path: string, payload: any, flag?: Boolean) {

    return new Promise(async (resolve, reject) => {
      this.httpClient.put(this.serverURL + path, payload).subscribe((data: any) => {
        if (data.status == false && !flag) {
        } else {

          resolve(data);
        }
      }, (error) => {
        reject(error);
      });
    });
  }

  deleteMethod(path: any, flag?: Boolean) {
    return new Promise(async (resolve, reject) => {
      this.httpClient.delete(this.serverURL + path).subscribe((data: any) => {
        if (data.status == false && !flag) {
        } else {
          resolve(data);
        }
      }, (error) => {
      
        reject(error);
      });
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: FormGroup<any>) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  showError(title: any, message: any) {
    Swal.fire({
      title: title,
      position: 'center',
      icon: 'error',
      text: message,
      timerProgressBar: true,
      showConfirmButton: false,
      timer: 2000,
      width: '25rem',
    })
  }
  showSuccess(title:any, message:any) {
    Swal.fire({
      title: title,
      position: 'center',
      icon: 'success',
      text: message,
      timerProgressBar: true,
      showConfirmButton: false,
      timer: 2000,
      width: '25rem'
    })
  }
  showDelete(title = "", text = "", confirmBtn = "") {
    return new Promise(async (resolve, reject) => {
      Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: confirmBtn
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    });
  }
}


