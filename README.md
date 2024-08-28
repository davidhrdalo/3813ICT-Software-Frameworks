# 3813ICT-Software-Frameworks

Author: David Hrdalo

Project Description: A project utilising the MEAN stack.

## Git Repository Usage

Git formed a key part of this project. 

A GitHub was created under: https://github.com/davidhrdalo/3813ICT-Software-Frameworks.

Two branches were established:
- Main - A relatively stable build
- Pre - Pushing lightly tested changes

Commits were made regularly.

A gitignore file was utilised to ensure only nessisary files were added

The server was created in a server folder in the root of the project directory.

## Data Structures

There were three key data structures for this project users, groups and channels. The structure is non-relational. The structures were stored in on the server with some initial seeder data. This data was accessed by an Angular service and stored in local storage. The schema can be found below.

### Users

- id
  - number
  - unique
  - example: 1
- username
  - text
  - unique
  - example: john_do
- email
  - text
  - unique
  - example: john@example.com
- password
  - text
  - example: Password123!
- role
  - text
  - example super user: super
  - example group user: group
  - example chat user: chat
- profileImg
  - text
  - image loaded to static storage then a text reference to its location is added
  - assets/images/37.jpg
- firstName
  - text
  - example: John
- lastName
  - text
  - example: Doe
- dob
  - text
  - example: 2001-08-17
- status
  - text
  - example: Busy

### Groups

- id
  - number
  - unique
  - example: 1
- name
  - text
  - example: group1
- admins
  - array
  - holds an array of group admin ids
  - example: [2]
- members
  - array
  - holds an array of chat user ids
  - example: [1,3]
- description‎
  - text
  - example: Group to chat about dogs!
- groupeImg
  - text
  - image loaded to static storage then a text reference to its location is added
  - assets/images/473.jpg

### Channels

- id
  - number
  - unique
  - example: 1
- name
  - text
  - example: channel1
- groupId
  - number
  - holds the parent group id
  - example: 1
- description‎
  - text
  - example: Group to chat about dogs!

## Angular Architecture

### Components



#### navbar

navbar is used throughout the entire application.

#### sidebar

sidebar is used throughout the entire application.

#### login

login is the first page that any sure will see.

#### register

register is used for new users to create accounts.

#### profile

profile can also be seen as the home page. It contains user details 

#### group



#### channel



#### guard (Angular Auth Guard)



### Services

#### activeUser



#### channel



#### group



#### socket



#### user



### Models

### Routes

- {path: 'login', component:LoginComponent},
- {path: 'register', component:RegisterComponent},
- {path: 'profile', component:ProfileComponent, canActivate: [authGuard]},
- {path: 'group/:id', component:GroupComponent, canActivate: [authGuard]},
- {path: 'group/:id/channel/:channelId', component:ChannelComponent, canActivate: [authGuard]},
- { path: '', redirectTo: 'profile', pathMatch: 'full' }, // Redirect to profile if logged in
- { path: '**', redirectTo: 'profile' } // Wildcard route for handling 404s

## Node Server Architecture

### Modules

### Functions

### Files

### Global variables

## Routes

A list of server side routes, parameters, return values, and there purpose

## Client Server Interactions

Describe the details of the interaction between client and server by indicating how the data on server side will be changed and how the display of each angular component page will be updated
