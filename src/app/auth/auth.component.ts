import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { HttpService } from '../services/http.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

export class AuthComponent implements OnInit {
  productsList: any = [];
  productsListSearch:any;
  images: any;
  url: any;
  addnew: boolean = true;
  searchText: any;

  @ViewChild('inputField') inputField!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('createFormModal') createFormModal!: ElementRef;
  productDetails: any;
  deleteuser: any;

  constructor(
    public http: HttpService,
    public fb: FormBuilder,

  ) {

  }

  /**Form  */
  productCreateForm: FormGroup = new FormGroup({
    product_name: new FormControl(''),
    product_price: new FormControl(''),
    category_name: new FormControl(''),
    description: new FormControl(''),
  });

  get formcon(): { [key: string]: AbstractControl } {
    return this.productCreateForm.controls;
  }

  ngOnInit(): void {

    $("#menu-toggle").click(function (e: any) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });

    this.getProduct();

    this.productCreateForm = this.fb.group({
      product_name: ['', [Validators.required, Validators.minLength(3),
      Validators.maxLength(25), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      product_price: ['', [Validators.required, Validators.minLength(2),
      Validators.maxLength(7), Validators.pattern(/^[0-9.]*$/)]],
      category_name: ['', [Validators.required, Validators.minLength(5),
      Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      description: ['', [Validators.required, Validators.minLength(5),
      Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]]
    });
  }

  getProduct() {
    this.http.getMethod("getTask").then((response: any) => {
      this.productsList = response.data;
      this.productsListSearch= response.data;
    }).catch((error)=>{

    });
  }

  openModal() {
    this.fileInput.nativeElement.value = '';
    this.productCreateForm.reset();
    this.images = [];
  }
  closeModal() {
    this.fileInput.nativeElement.value = '';
    this.productCreateForm.reset();
    this.images = [];
    this.createFormModal.nativeElement.click();
  }
  editProduct(data: any) {
    this.fileInput.nativeElement.value = '';
    this.addnew = false;
    this.images = [];
    
    this.productCreateForm = this.fb.group({
      product_name: [data.name, [Validators.required, Validators.minLength(3),
      Validators.maxLength(25), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      product_price: [data.price, [Validators.required, Validators.minLength(2),
      Validators.maxLength(7), Validators.pattern(/^[0-9.]*$/)]],
      category_name: [data.category_name, [Validators.required, Validators.minLength(5),
      Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      description: [data.description, [Validators.required, Validators.minLength(5),
      Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9\s]*$/)]]
    });
    this.images = this.http.imageURL + data.file;
    this.url = data.file;
    this.productDetails = data;
  }

  searchFun(data:any){
    data = data.toLowerCase();
    if (data == "") {
      this.productsList = this.productsListSearch;
    }

    if (data) {
      this.productsList = [];
      this.productsListSearch.map((pro:any) => {
        if ((pro?.name.toLowerCase()).includes((data).toLowerCase())){
            this.productsList.push(pro); 
        }
      });
    }
  }

  fileChangeEvent(event: any) {
    this.images = []
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/gif', 'image/png',];
      
      if (!allowedTypes.includes(file.type)) {
        // Invalid file type
        this.http.showError("Error", "This File Format is Not Accept!")
        this.fileInput.nativeElement.value = ''; //input name clear
      } else {
        this.url = event.target.files[0];

        if (event.target.files && event.target.files[0]) {
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]); // read file as data url
          reader.onload = (event: any) => { // called once readAsDataURL is completed
            this.images = event.target.result;
          }
        }

      }
    }
  }

  deleteProduct() {
    var id = 6;
    this.http.deleteMethod("products/" + id).then((response: any) => {
      if(response.status == true){
        this.getProduct();
      }
    }).catch((error)=>{

    });
  }

  submitButton() {
    if (this.productCreateForm.valid == true) {
      if (this.addnew == true) {

        var formData = new FormData();
        formData.append("name", this.productCreateForm.value.product_name);
        formData.append("price", this.productCreateForm.value.product_price);
        formData.append("description", this.productCreateForm.value.description);
        formData.append("category_name", this.productCreateForm.value.category_name);
        formData.append("file", this.url);

        this.http.postMethod('createTask', formData).then((response: any) => {
          if(response.status == true){
            this.getProduct();
            this.createFormModal.nativeElement.click();
            this.images = [];
            this.fileInput.nativeElement.value = '';
            this.http.showSuccess("Success", "Your product has been added!")
          }
         
        }).catch((error)=>{

        });
      } else {
   
        var formData = new FormData();
        formData.append("name", this.productCreateForm.value.product_name);
        formData.append("price", this.productCreateForm.value.product_price);
        formData.append("description", this.productCreateForm.value.description);
        formData.append("category_name", this.productCreateForm.value.category_name);
        formData.append("file", this.url);

        this.http.postMethod(`${'updateTask?id=' + this.productDetails.id}`, formData).then((response: any) => {
          if(response.status == true){
            this.http.showSuccess("Success", "Your product has been updated successfully!")
            this.getProduct();
            this.createFormModal.nativeElement.click();
            this.images = [];
            this.fileInput.nativeElement.value = '';
            this.addnew = true;
            this.productDetails = '';
          }      

        }).catch((error)=>{

        });
      }

    } else {
      this.http.markFormGroupTouched(this.productCreateForm);
    }
  }

  async deleteUser(item: any) {
    this.deleteuser = await this.http.showDelete(
      'Please Confirm',
      'The Product will be Deleted?',
      'Delete'
    );

    if (this.deleteuser == true) {
      let payload = {
        "id": item.id
      }
      this.http
        .postMethod('deleteTask', payload)
        .then((response: any) => {
          this.http.showSuccess('success', response.message);
          this.getProduct();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  whiteSpaceCheck(event: any) {
    if (event.target.selectionStart == 0 && event.code == "Space") {
      event.preventDefault();
    }
  }

}
