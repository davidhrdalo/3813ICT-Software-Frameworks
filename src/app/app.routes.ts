import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { GroupComponent } from './group/group.component';
import { ChannelComponent } from './channel/channel.component';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
    {path: 'login', component:LoginComponent},
    {path: 'account', component:AccountComponent},
    {path: 'group', component:GroupComponent},
    {path: 'channel', component:ChannelComponent},
    {path: 'chat', component:ChatComponent},
    { path: '', redirectTo: 'account', pathMatch: 'full' }, // Redirect to account if logged in
];
