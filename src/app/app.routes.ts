import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './home/details/details.component';
import { SqliteTestComponent } from './home/sqlite-test/sqlite-test.component';


export const routes: Routes = [
    {'path': '', component:SqliteTestComponent},
    {'path': 'login', component:LoginComponent},
    {'path': 'home', component:HomeComponent},
    {'path': 'new-owner', component:DetailsComponent}
];
