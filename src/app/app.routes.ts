import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { GroupComponent } from './group/group.component';
import { ChannelComponent } from './channel/channel.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    {path: 'login', component:LoginComponent},
    {path: 'register', component:RegisterComponent},
    {path: 'profile', component:ProfileComponent, canActivate: [authGuard]},
    {path: 'group/:id', component:GroupComponent, canActivate: [authGuard]},
    {path: 'group/:id/channel/:channelId', component:ChannelComponent, canActivate: [authGuard]},
    { path: '', redirectTo: 'profile', pathMatch: 'full' }, // Redirect to profile if logged in
    { path: '**', redirectTo: 'profile' } // Wildcard route for handling 404s
];
