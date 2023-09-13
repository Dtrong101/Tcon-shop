import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './sharepage/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { PhoneComponent } from './pages/phone/phone.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { environment } from './environments/environment';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HeaderComponent } from './sharepage/header/header.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { AuthService } from './sharepage/services/auth.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { ModItemComponent } from './admin/mod-item/mod-item.component';
import { CartService } from './sharepage/services/cart.service';
import { CartComponent } from './pages/cart/cart.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');
import { OrderListComponent } from './admin/order-list/order-list.component';
import { PhoneDetailComponent } from './pages/phone/phone-detail/phone-detail.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { AdminNavComponent } from './admin/admin-nav/admin-nav.component';
import { NgxStripeModule } from 'ngx-stripe';
import { NgxPayPalModule } from 'ngx-paypal';


@NgModule({
  declarations: [
    FooterComponent,
    HomeComponent,
    PhoneComponent,
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    DashboardComponent,
    AdminDashboardComponent,
    ModItemComponent,
    CartComponent,
    OrderListComponent,
    PhoneDetailComponent,
    AdminNavComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FontAwesomeModule,
    CarouselModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    FormsModule,
    NgxPayPalModule,
    MatSnackBarModule,
    NgxPaginationModule,
    NgxStripeModule.forRoot('pk_test_51Nl1tWArc6gJSMik0852ZaV67fHCzceJ9bkJTu5flGbJABIGrp3dcWD0ORalbhOTgBPoj8vAHPWRNIVkCT0p97OU00mSoqgsG8'),
  ],
  providers: [AuthService, Storage, CartService,],
  bootstrap: [AppComponent],
})
export class AppModule { }
