import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './home/details/details.component';


export const routes: Routes = [
    {'path': '', component:HomeComponent},
    {'path': 'login', component:LoginComponent},
    {'path': 'details', component:DetailsComponent},
];
