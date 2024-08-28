# 3813ICT-Software-Frameworks

Author: David Hrdalo

Project Description: A project utilising the MEAN stack to create a robust, real-time chat system with multiple levels of user permissions.

## Git Repository Usage

Git formed a key part of this project. 

A GitHub was created under: https://github.com/davidhrdalo/3813ICT-Software-Frameworks.

Two branches were established:
- Main - This branch served as the stable build of the project.
- Pre - This branch was used for pushing lightly tested changes before merging into the main branch.

Commits were made regularly to ensure continuous integration and tracking of progress.

A .gitignore file was implemented to ensure only necessary files were committed, excluding files like node_modules.

The project directory was organized with the server components housed in a /server folder at the root level.

## Data Structures

The chat system is built around three core data structures: Users, Groups, and Channels. These structures are non-relational and stored on the server, with some initial seeder data provided. This data is accessed via Angular services and temporarily stored in the client's local storage.

### Users

The Users data structure represents individuals who interact with the chat system. Each user is uniquely identified and associated with specific roles and groups.

- id
  - Type: number
  - unique
  - Example: 1
- username
  - Type: text
  - unique
  - Example: john_do
- email
  - Type: text
  - unique
  - Example: john@example.com
- password
  - Type: text
  - Example: Password123!
- role
  - Type: text
  - Example (super user): super
  - Example (group user): group
  - Example (chat user): chat
- profileImg
  - Type: text
  - image loaded to static storage then a text reference to its location is added
  - Example: assets/images/37.jpg
- firstName
  - Type: text
  - Example: John
- lastName
  - Type: text
  - Example: Doe
- dob
  - Type: text
  - Example: 2001-08-17
- status
  - Type: text
  - Example: Busy

### Groups

The Groups data structure organises users into collections that can manage channels and communicate within them.

- id
  - Type: number
  - unique
  - Example: 1
- name
  - Type: text
  - Example: group1
- admins
  - Type: array
  - holds an array of group admin ids
  - Example: [2]
- members
  - Type: array
  - holds an array of chat user ids
  - Example: [1,3]
- description‎
  - Type: text
  - Example: Group to chat about dogs!
- groupeImg
  - Type: text
  - image loaded to static storage then a text reference to its location is added
  - Example: assets/images/473.jpg

### Channels

The Channels data structure represents subgroups within a Group where specific topics or conversations occur.

- id
  - Type: number
  - unique
  - Example: 1
- name
  - Type: text
  - Example: channel1
- groupId
  - Type: number
  - holds the parent group id
  - Example: 1
- description‎
  - Type: text
  - Example: Group to chat about dogs!

## Angular Architecture

Components, services, and models were ustilised to manage the user interface and data interactions efficiently.

### Components

- #### NavbarComponent:
  - The NavbarComponent is present across the entire application and provides navigation links based on the user's role.

- #### SidebarComponent:
  - The SidebarComponent is used throughout the application, displaying context-specific options like available groups and channels.

- #### LoginComponent:
  - The LoginComponent is the entry point for users. It handles user authentication and redirects authenticated users to the appropriate dashboard.
  - 
- #### RegisterComponent:
  - The RegisterComponent allows new users to create an account by submitting their details, which are then validated and stored.

- #### ProfileComponent:
  - The ProfileComponent serves as the user's home page, displaying their personal details and status. It also provides options for editing user information.

- #### GroupComponent:
  - The GroupComponent manages the display and interaction of groups. Users can see the groups they belong to and select them to view more details or access channels.

- #### ChannelComponent:
  - The ChannelComponent allows users to interact within a specific channel. Users can view messages, send new ones, and see channel-specific details.

- #### AuthGuard:
  - The AuthGuard ensures that routes are protected and only accessible to authenticated users. It checks the user’s role before allowing access to specific routes.

### Services

- #### ActiveUserService:
  - Manages the currently authenticated user's data, such as their profile, roles, and status. It ensures that the user’s information is available across the application.

- #### ChannelService:
  - Handles the creation, retrieval, and management of channels within groups. It interacts with the backend to fetch and update channel data.

- #### GroupService:
  - Manages group-related operations such as creating, updating, and deleting groups. It also handles the retrieval of group data and member management.

- #### SocketService:
  - Responsible for establishing and maintaining WebSocket connections with the server. It facilitates real-time communication for the chat functionality.

- #### UserService:
  - Handles user-related operations such as registration, login, and profile updates. It interacts with the backend to manage user data and authentication.

### Models

- #### UserModel:
  - Defines the structure of a user object, including fields like id, username, email, role, etc.

- #### GroupModel:
  - Defines the structure of a group object, including fields like id, name, admins, members, etc.

- #### ChannelModel:
  - Defines the structure of a channel object, including fields like id, name, groupId, etc.

### Routes

Front-end Angular routing was utilised to allow users of the application to navigate.

- User Login
  - path: 'login'
  - component: LoginComponent
- User Register
  - path: 'register'
  - component: RegisterComponent
-  Profile / Home Page
  - path: 'profile'
  - component: ProfileComponent
  - canActivate: authGuard
- Group Deatils
  - path: 'group/:id'
  - Dynamic path based off group id
  - component: GroupComponent
  - canActivate: authGuard
- Channel Details
  - path: 'group/:id/channel/:channelId'
  - Dynamic path based off group id and channel id
  - component: ChannelComponent
  - canActivate: authGuard
- Profile / Home Page Redirect
  - path: ''
  - redirectTo: 'profile'
  - pathMatch: 'full'
- Profile / Home Page Wildcard Redirect
  - path: '**'
  - redirectTo: 'profile'

## Node Server Architecture

### Modules

### Functions

### Files

### Global variables

## Routes

A list of server side routes, parameters, return values, and there purpose

## Client Server Interactions

Describe the details of the interaction between client and server by indicating how the data on server side will be changed and how the display of each angular component page will be updated
