import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { GroupComponent } from './group/group.component';
import { ChannelComponent } from './channel/channel.component';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
    {path: 'login', component:LoginComponent},
    {path: 'profile', component:ProfileComponent},
    {path: 'group', component:GroupComponent},
    {path: 'channel', component:ChannelComponent},
    {path: 'chat', component:ChatComponent},
    { path: '', redirectTo: 'profile', pathMatch: 'full' }, // Redirect to profile if logged in
];
