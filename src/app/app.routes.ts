import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './home/details/details.component';


export const routes: Routes = [
    {'path': '', component:DetailsComponent},
    {'path': 'login', component:LoginComponent},
    {'path': 'home', component:HomeComponent},
];
