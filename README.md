# 3813ICT-Software-Frameworks

Author: David Hrdalo

Project Description: A project utilising the MEAN stack to create a robust, real-time chat system with multiple levels of user permissions.

## Git Repository Usage

Git formed a key part of this project. 

A GitHub was created under: https://github.com/davidhrdalo/3813ICT-Software-Frameworks.

### Branching Strategy

Two branches were established to manage the project's development lifecycle:

- Main: This branch served as the stable build of the project. It contained thoroughly tested and verified code, ensuring a reliable base for deployment.
- Pre: This branch was used for pushing lightly tested changes before merging into the main branch. It allowed for the testing of new features and functionality in isolation before integrating them into the main project.

### Directory Structure and Version Control Approach

Git was initialised in the root directory of the Angular project, which ensured that the entire codebase, including both frontend and backend components, was tracked within a single repository. This setup simplified project management and allowed for seamless integration between the frontend and backend.

- A .gitignore file was created in the Angular root directory to exclude unnecessary files, such as node_modules, from being committed to the repository. This ensured that only essential files were included, reducing the repository size and preventing potential conflicts.

- A server folder was created within the Angular root directory to house the backend components. Node.js was initialised within this server directory to install necessary dependencies such as Express. A separate .gitignore file was also added here to exclude backend node_modules and other unnecessary files from being committed.

This organisation allowed both frontend and backend to reliably exist within the same Git repository, making it easier to manage and track the entire project.

### Version Control Process
The approach taken to version control was methodical and focused on maintaining a stable and functional codebase:

- Minor Changes: For each minor change, such as adding a new function to a service, the change was implemented, tested locally, and then deployed to the Pre branch.

- Testing and Integration: After completing a feature or service, the entire web application was tested to ensure that the new functionality integrated smoothly with existing components. Only after thorough testing were the changes merged from the Pre branch into the Main branch.

This strategy ensured continuous integration and allowed for the gradual development of the project while minimising the risk of introducing bugs into the stable build

## Data Structures

The chat system is built around three core data structures: Users, Groups, and Channels. These structures are non-relational and stored on the server, with some initial seeder data provided. This data is accessed via Angular services and temporarily stored in the client's local storage.

### Users

The Users data structure represents individuals who interact with the chat system. Each user is uniquely identified and associated with specific roles and groups.

| Field       | Type   | Unique | Description                                                      | Example              |
|-------------|--------|--------|------------------------------------------------------------------|----------------------|
| id          | number | Yes    | Unique identifier for each user                                  | 1                    |
| username    | text   | Yes    | Unique identifier within the system                              | john_doe             |
| email       | text   | Yes    | Must be unique across the system                                 | john@example.com     |
| password    | text   | No     | Stored as a hash for security purposes                           | Password123!         |
| role        | text   | No     | Defines the user’s role in the system (e.g., super, group, chat) | super, group, chat   |
| profileImg  | text   | No     | Stores the file path to the user’s profile image                 | assets/images/37.jpg |
| firstName   | text   | No     | The user’s first name                                            | John                 |
| lastName    | text   | No     | The user’s last name                                             | Doe                  |
| dob         | text   | No     | The user’s date of birth                                         | 2001-08-17           |
| status      | text   | No     | Indicates the user’s current status (e.g., Busy)                 | Busy                 |

### Groups

The Groups data structure organises users into collections that can manage channels and communicate within them.

| Field       | Type   | Unique | Description                                     | Example                 |
|-------------|--------|--------|-------------------------------------------------|-------------------------|
| id          | number | Yes    | Unique identifier for each group                | 1                       |
| name        | text   | No     | The name of the group                           | group1                  |
| admins      | array  | No     | Holds an array of group admin IDs               | [2]                     |
| members     | array  | No     | Holds an array of chat user IDs                 | [1,3]                   |
| description | text   | No     | A brief description of the group’s purpose      | Group to chat about dogs!|
| groupImg    | text   | No     | Stores the file path to the group’s image       | assets/images/473.jpg   |

### Channels

The Channels data structure represents subgroups within a Group where specific topics or conversations occur.

| Field       | Type   | Unique | Description                          | Example                 |
|-------------|--------|--------|--------------------------------------|-------------------------|
| id          | number | Yes    | Unique identifier for each channel   | 1                       |
| name        | text   | No     | The name of the channel              | channel1                |
| groupId     | number | No     | Holds the ID of the parent group     | 1                       |
| description | text   | No     | A brief description of the channel   | Group to chat about dogs!|

### Relationships Between Data Structures
The relationships between these data structures are fundamental to how the chat system functions:

- Users and Groups: Users can belong to multiple groups, and each group can have multiple users. The members field in the Groups structure holds an array of user IDs, establishing the relationship between users and the groups they are part of.

- Users and Roles: Each user has a role field, which determines their permissions within the system (e.g., Super Admin, Group Admin, or Chat User). This role affects what groups and channels they can manage or participate in.

- Groups and Channels: Each group can have multiple channels, which are identified by the groupId field in the Channels structure. This field links a channel to its parent group, ensuring that channels are correctly associated with the group they belong to.

- Admins and Groups: The admins field in the Groups structure holds an array of user IDs representing the group admins. These admins have elevated permissions within their respective groups.

## Angular Architecture

Components, services, and models were ustilised to manage the user interface and data interactions efficiently.

### Components

- #### NavbarComponent:
  - The NavbarComponent is present across the entire application and provides navigation links based on the user's role.

- #### SidebarComponent:
  - The SidebarComponent is used throughout the application, displaying context-specific options like available groups and channels.

- #### LoginComponent:
  - The LoginComponent is the entry point for users. It handles user authentication and redirects authenticated users to the appropriate dashboard.

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
   - Path: 'profile'
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

The server-side architecture is structured to handle various functionalities of the chat system, including user authentication, group management, and channel management. The server is built using Node.js and Express, with data seeded using predefined classes and objects.

### Modules

- Express.js: The primary framework for building the HTTP server and defining routes.
- CORS: Middleware to allow cross-origin requests, crucial for enabling communication between the Angular frontend and the Node.js backend.
- Body-Parser: Middleware to parse incoming request bodies in JSON format, facilitating the handling of user input and data.
- Socket.io: Manages real-time communication between the server and clients for functionalities such as live chat.

### Functions

The key functionalities of the server are encapsulated in various files and are responsible for handling specific tasks:

- server.js:
  - Configures the Express server and applies middleware such as CORS and Body-Parser.
  - Initializes routes for authentication, user management, group management, and channel management.
  - Integrates Socket.io for handling real-time messaging.

- listen.js:
  - Contains the function to start the server on a specified port (3000) and logs the start time to the console.

- socket.js:
  - Manages WebSocket connections, handling events such as user connections and message broadcasts in real-time.

- seederData.js:
  - Defines the classes for User, Group, and Channel, and seeds the server with initial data for testing and development purposes.

### Files

- server.js: The main entry point for the server, responsible for initializing and configuring the server, applying middleware, and setting up routes.
- listen.js: Handles server startup and logging.
- socket.js: Manages real-time WebSocket events and communication.
- data/seederData.js: Contains initial data for users, groups, and channels, and exports them for use in routes.
- routes/api-auth.js: Manages authentication routes for user login and registration.
- routes/api-user.js: Handles user-related operations such as retrieving user details.
- routes/api-group.js: Manages group-related operations, including retrieving and managing groups.
- routes/api-channel.js: Handles channel-related operations, including retrieving and managing channels.

### Global variables

- PORT: Specifies the port on which the server listens (default is 3000).
- io: The Socket.io instance, used globally across the server to manage WebSocket communication.

## Routes

Below is a list of server side routes, parameters, return values, and there purpose:

### Authentication Routes (api-auth.js)

| Method | Endpoint           | Parameters                                                  | Returns                                                   | Purpose                                                    |
|--------|--------------------|-------------------------------------------------------------|-----------------------------------------------------------|------------------------------------------------------------|
| POST   | /api/auth/signup    | `firstName`, `lastName`, `username`, `email`, `password`, `dob` | JSON object containing the user's details (excluding the password) | Registers a new user and adds them to the list of users.    |
| POST   | /api/auth           | `username`, `password`                                     | JSON object containing the user's details (excluding the password) | Authenticates a user based on their username and password.  |

### User Routes (api-user.js)

| Method | Endpoint   | Parameters | Returns                          | Purpose                                                              |
|--------|------------|------------|----------------------------------|----------------------------------------------------------------------|
| GET    | /api/users | None       | JSON array of all users (excluding their passwords) | Retrieves a list of all users, showing essential details like username, email, and role. |


### Group Routes (api-group.js)

| Method | Endpoint     | Parameters | Returns                          | Purpose                                                              |
|--------|--------------|------------|----------------------------------|----------------------------------------------------------------------|
| GET    | /api/groups  | None       | JSON array of all groups         | Retrieves a list of all groups, including their names, admins, members, and descriptions. |


### Channel Routes (api-channel.js)
| Method | Endpoint       | Parameters | Returns                          | Purpose                                                              |
|--------|----------------|------------|----------------------------------|----------------------------------------------------------------------|
| GET    | /api/channels  | None       | JSON array of all channels       | Retrieves a list of all channels, including their names, group IDs, and descriptions. |


## Client Server Interactions

The interactions between the client (Angular frontend) and the server (Node.js backend) are designed to maintain a smooth user experience by synchronizing data and ensuring real-time updates:

- User Authentication:
  - When a user signs up or logs in, the client sends a POST request to the relevant authentication route (/api/auth/signup or /api/auth). The server processes this request, verifies the user credentials or creates a new user, and sends back the user's details (excluding sensitive information like the password).

- Group and Channel Management:
  - Upon accessing the user’s profile or a specific group/channel, the client sends GET requests to the appropriate routes (/api/groups, /api/channels) to fetch the necessary data. This data is then used to populate the UI, allowing users to view and interact with their groups and channels.

- Real-Time Messaging:
  - Messages within channels are handled using Socket.io. When a user sends a message, it is emitted to the server via a WebSocket. The server then broadcasts this message to all clients connected to the channel, ensuring that all users see the message in real-time.


