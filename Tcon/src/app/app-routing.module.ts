import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhoneComponent } from './pages/phone/phone.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { AuthGuard } from './sharepage/guard/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { ModItemComponent } from './admin/mod-item/mod-item.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrderListComponent } from './admin/order-list/order-list.component';
import { PhoneDetailComponent } from './pages/phone/phone-detail/phone-detail.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'phone', component: PhoneComponent},
  {path:'login', component: LoginComponent},
  {path:'register-user', component: SignUpComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'verify-email-address', component: VerifyEmailComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {path: 'admin-dashboard', component: AdminDashboardComponent},
  {path: 'admin-mod', component: ModItemComponent},
  {path: 'cart', component: CartComponent},
  {path: 'order-list', component: OrderListComponent},
  {path: 'phone/:id', component: PhoneDetailComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
