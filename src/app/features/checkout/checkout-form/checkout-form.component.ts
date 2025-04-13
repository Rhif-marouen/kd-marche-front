import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss']
})
export class CheckoutFormComponent {
  @Output() formSubmitted = new EventEmitter<any>();

  checkoutForm = this.fb.group({
    phone: ['', [
      Validators.required,
      Validators.pattern(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
    ]],
    address: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      postal_code: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{5}$/)
      ]],
      country: ['', Validators.required]
    })
  });

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.checkoutForm.valid) {
      const formData = {
        phone: this.checkoutForm.value.phone,
        address: JSON.stringify(this.checkoutForm.value.address),
        items: this.orderService.getTempOrderData()?.items || []
      };
      
      this.orderService.setTempOrderData(formData);
      this.router.navigate(['/checkout-order']);
    }
  }
}