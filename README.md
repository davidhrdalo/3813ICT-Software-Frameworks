# 3813ICT-Software-Frameworks

**Author:** David Hrdalo

**Project Description:** A project utilizing the MEAN stack to create a robust, real-time chat system with multiple levels of user permissions.

## Git Repository Usage

Git formed a key part of this project.

A GitHub repository was created under: [https://github.com/davidhrdalo/3813ICT-Software-Frameworks](https://github.com/davidhrdalo/3813ICT-Software-Frameworks).

### Branching Strategy

Two branches were established to manage the project's development lifecycle:

- **Main:** This branch serves as the stable build of the project. It contains thoroughly tested and verified code, ensuring a reliable base for deployment.
- **Pre:** This branch is used for pushing lightly tested changes before merging into the main branch. It allows for the testing of new features and functionality in isolation before integrating them into the main project.

### Directory Structure and Version Control Approach

Git was initialized in the root directory of the Angular project, ensuring that the entire codebase, including both frontend and backend components, is tracked within a single repository. This setup simplifies project management and allows for seamless integration between the frontend and backend.

- A `.gitignore` file was created in the Angular root directory to exclude unnecessary files, such as `node_modules`, from being committed to the repository. This ensures that only essential files are included, reducing the repository size and preventing potential conflicts.

- A `server` folder was created within the Angular root directory to house the backend components. Node.js was initialized within this server directory to install necessary dependencies such as Express. A separate `.gitignore` file was also added here to exclude backend `node_modules` and other unnecessary files from being committed.

This organization allows both frontend and backend to reliably exist within the same Git repository, making it easier to manage and track the entire project.

### Version Control Process

The approach taken to version control was methodical and focused on maintaining a stable and functional codebase:

- **Minor Changes:** For each minor change, such as adding a new function to a service, the change was implemented, tested locally, and then deployed to the Pre branch.

- **Testing and Integration:** After completing a feature or service, the entire web application was tested to ensure that the new functionality integrated smoothly with existing components. Only after thorough testing were the changes merged from the Pre branch into the Main branch.

This strategy ensures continuous integration and allows for the gradual development of the project while minimizing the risk of introducing bugs into the stable build.

## Data Structures

The chat system is built around four core data structures: Users, Groups, Channels, and Chats. These structures are non-relational and stored on the server, with some initial seeder data provided. This data is accessed via Angular services and temporarily stored in the client's local storage.

### Users

The Users data structure represents individuals who interact with the chat system. Each user is uniquely identified and associated with specific roles and groups.

| Field       | Type     | Unique | Description                                                      | Example                              |
|-------------|----------|--------|------------------------------------------------------------------|--------------------------------------|
| _id         | ObjectId | Yes    | Unique identifier for each user                                  | `60d5f483f8d2e30d8c8b4567`           |
| username    | String   | Yes    | Unique identifier within the system                              | `john_doe`                           |
| email       | String   | Yes    | Must be unique across the system                                 | `john@example.com`                   |
| password    | String   | No     | Stored as a hash for security purposes                           | `Password123!`                       |
| roles       | Array    | No     | Defines the user’s roles in the system (e.g., super, group, chat) | `["super", "group"]`                 |
| profileImg  | String   | No     | Stores the file path to the user’s profile image                 | `assets/images/37.jpg`               |
| firstName   | String   | No     | The user’s first name                                            | `John`                               |
| lastName    | String   | No     | The user’s last name                                             | `Doe`                                |
| dob         | String   | No     | The user’s date of birth                                         | `2001-08-17`                         |
| status      | String   | No     | Indicates the user’s current status (e.g., Busy)                 | `Busy`                               |

### Groups

The Groups data structure organizes users into collections that can manage channels and communicate within them.

| Field       | Type     | Unique | Description                                     | Example                                                          |
|-------------|----------|--------|-------------------------------------------------|------------------------------------------------------------------|
| _id         | ObjectId | Yes    | Unique identifier for each group                | `60d5f483f8d2e30d8c8b4568`                                       |
| name        | String   | No     | The name of the group                           | `Developers`                                                     |
| admins      | Array    | No     | Holds an array of group admin IDs               | `["60d5f483f8d2e30d8c8b4569"]`                                   |
| members     | Array    | No     | Holds an array of chat user IDs                 | `["60d5f483f8d2e30d8c8b4567", "60d5f483f8d2e30d8c8b4570"]`       |
| interested  | Array    | No     | Holds an array of user IDs interested in the group | `[]`                                                             |
| description | String   | No     | A brief description of the group’s purpose      | `Group for software developers`                                 |
| groupImg    | String   | No     | Stores the file path to the group’s image       | `http://localhost:3000/data/images/groupImages/473.jpg`         |

### Channels

The Channels data structure represents subgroups within a Group where specific topics or conversations occur.

| Field       | Type     | Unique | Description                          | Example                                                                  |
|-------------|----------|--------|--------------------------------------|--------------------------------------------------------------------------|
| _id         | ObjectId | Yes    | Unique identifier for each channel   | `78909ba4f40c4b8f9d5f9f9e`                                               |
| name        | String   | No     | The name of the channel              | `General Discussion`                                                     |
| groupId     | ObjectId | No     | Holds the ID of the parent group     | `60d5f483f8d2e30d8c8b4568`                                               |
| description | String   | No     | A brief description of the channel   | `General chat for all members`                                           |
| members     | Array    | No     | Array containing members of channel  | `["60d5f483f8d2e30d8c8b4567", "60d5f483f8d2e30d8c8b4572"]`           |

### Chats

The Chats data structure handles the messages and events within channels, enabling real-time communication.

| Field       | Type     | Unique | Description                                  | Example                                                                  |
|-------------|----------|--------|----------------------------------------------|--------------------------------------------------------------------------|
| _id         | ObjectId | Yes    | Unique identifier for each chat message/event | `64e09ba4f40c4b8f9d5f9f9e`                                               |
| channelId   | ObjectId | No     | ID of the channel where the chat occurs      | `78909ba4f40c4b8f9d5f9f9e`                                               |
| userId      | ObjectId | No     | ID of the user who sent the message/event    | `64e09ba0f40c4b8f9d5f9f9a`                                               |
| username    | String   | No     | Username of the user                          | `john_doe`                                                               |
| message     | String   | No     | Content of the message (if applicable)        | `Hello, everyone!`                                                       |
| profilePic  | String   | No     | URL to the user's profile picture             | `http://localhost:3000/data/images/profileImages/37.jpg`                |
| imageUrl    | String   | No     | URL to an image attached to the message       | `http://localhost:3000/data/images/chatImages/123.jpg`                  |
| eventType   | String   | No     | Type of event (e.g., join, leave)             | `join`                                                                   |
| timestamp   | Date     | No     | Timestamp of the message/event                 | `2024-04-27T10:20:30Z`                                                   |

### Relationships Between Data Structures

The relationships between these data structures are fundamental to how the chat system functions:

- **Users and Groups:** Users can belong to multiple groups, and each group can have multiple users. The `members` field in the Groups structure holds an array of user IDs, establishing the relationship between users and the groups they are part of.

- **Users and Roles:** Each user has a `roles` field, which determines their permissions within the system (e.g., Super Admin, Group Admin, or Chat User). These roles affect what groups and channels they can manage or participate in.

- **Groups and Channels:** Each group can have multiple channels, which are identified by the `groupId` field in the Channels structure. This field links a channel to its parent group, ensuring that channels are correctly associated with the group they belong to.

- **Admins and Groups:** The `admins` field in the Groups structure holds an array of user IDs representing the group admins. These admins have elevated permissions within their respective groups.

- **Channels and Chats:** Each channel can have multiple chat messages and events, which are stored in the Chats structure. The `channelId` field links each chat entry to its respective channel, ensuring that messages and events are correctly associated with the appropriate channel.

## Angular Architecture

Components, services, and models were utilized to manage the user interface and data interactions efficiently.

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

- #### VideoComponent:
  - The VideoComponent is integrated within the ChannelComponent to embed video support. It facilitates video communication within channels, allowing users to participate in real-time video calls and meetings.

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

- #### PeerService:
  - Manages PeerJS connections to handle peer-to-peer video functionalities. It facilitates the establishment and maintenance of video calls between users, integrating seamlessly with the VideoComponent to provide real-time video communication within channels.

### Models

- #### UserModel:
  - Defines the structure of a user object, including fields like `_id`, `username`, `email`, `roles`, etc.

- #### GroupModel:
  - Defines the structure of a group object, including fields like `_id`, `name`, `admins`, `members`, etc.

- #### ChannelModel:
  - Defines the structure of a channel object, including fields like `_id`, `name`, `groupId`, etc.

- #### ChatModel:
  - Defines the structure of a chat object, including fields like `_id`, `channelId`, `userId`, `username`, `message`, `profilePic`, `imageUrl`, `eventType`, and `timestamp`.

### Routes

Front-end Angular routing was utilized to allow users of the application to navigate.

- **User Login**
  - **Path:** `login`
  - **Component:** `LoginComponent`

- **User Register**
  - **Path:** `register`
  - **Component:** `RegisterComponent`

- **Profile / Home Page**
  - **Path:** `profile`
  - **Component:** `ProfileComponent`
  - **canActivate:** `AuthGuard`

- **Group Details**
  - **Path:** `group/:id`
  - **Dynamic path based on group ID**
  - **Component:** `GroupComponent`
  - **canActivate:** `AuthGuard`

- **Channel Details**
  - **Path:** `group/:id/channel/:channelId`
  - **Dynamic path based on group ID and channel ID**
  - **Component:** `ChannelComponent`
  - **canActivate:** `AuthGuard`

- **Profile / Home Page Redirect**
  - **Path:** ``
  - **Redirect To:** `profile`
  - **Path Match:** `full`

- **Profile / Home Page Wildcard Redirect**
  - **Path:** `**`
  - **Redirect To:** `profile`

- **Chat Routes**
  - **Get Chat History**
    - **Method:** `GET`
    - **Path:** `/api/chat/:channelId`
    - **Description:** Retrieves chat messages for a specific channel.

  - **Post a New Chat Message**
    - **Method:** `POST`
    - **Path:** `/api/chat/:channelId`
    - **Description:** Sends a new chat message to a specific channel.

  - **Upload Chat Image**
    - **Method:** `POST`
    - **Path:** `/api/chat/:channelId/upload`
    - **Description:** Uploads an image to a specific chat channel.

## Node Server Architecture

The server-side architecture is structured to handle various functionalities of the chat system, including user authentication, group management, channel management, chat management, and real-time communication. The server is built using Node.js and Express, with data managed using MongoDB and static files handled through custom scripts.

### Modules

- **Express.js:** The primary framework for building the HTTP server and defining routes.
- **CORS:** Middleware to allow cross-origin requests, crucial for enabling communication between the Angular frontend and the Node.js backend.
- **Body-Parser:** Middleware to parse incoming request bodies in JSON format, facilitating the handling of user input and data.
- **Socket.io:** Manages real-time communication between the server and clients for functionalities such as live chat.
- **Formidable:** Handles file uploads, such as profile images, group images, and chat images.
- **Path:** Provides utilities for working with file and directory paths.
- **PeerServer:** Supports video functionalities within the chat system.
- **MongoClient:** Facilitates interaction with the MongoDB database.
- **StaticDataHandler:** Manages reading and writing static data to `staticData.json` for users and groups.

### Functions

The key functionalities of the server are encapsulated in various files and are responsible for handling specific tasks:

- **server.js:**
  - Configures the Express server and applies middleware such as CORS and Body-Parser.
  - Initializes routes for authentication, user management, group management, channel management, and chat management.
  - Integrates Socket.io for handling real-time messaging.
  - Sets up static file serving for profile images, group images, and chat images.
  - Manages SSL setup for secure connections (if needed in the future).
  - Initializes PeerServer for video support.

- **dropDB.js:**
  - Connects to MongoDB and drops the `softwareFrameworks` database.
  - Clears the `groups`, `users`, and `channels` data in `staticData.json` by setting them to empty arrays.
  - Used for resetting the database and static data during development or testing.

- **setupDB.js:**
  - Connects to MongoDB and sets up initial data for users, groups, and channels.
  - Inserts predefined users, groups, and channels into the respective MongoDB collections.
  - Updates `staticData.json` with the initial users and groups data.
  - Facilitates the initial setup of the database with necessary seed data.

- **staticDataHandler.js:**
  - Provides utility functions to read and update static data stored in `staticData.json`.
  - Ensures that user and group data are synchronized between MongoDB and the static JSON file.
  - Handles cases where the static data file might not exist by initializing it with default structures.

### Files

- **server.js:** The main entry point for the server, responsible for initializing and configuring the server, applying middleware, and setting up routes.
- **dropDB.js:** Script to drop the MongoDB database and clear static data.
- **setupDB.js:** Script to set up the MongoDB database with initial data and update static data.
- **socket.js:** Manages real-time WebSocket events and communication.
- **data/staticDataHandler.js:** Contains functions to read from and write to `staticData.json`.
- **routes/api-auth.js:** Manages authentication routes for user login and registration.
- **routes/api-user.js:** Handles user-related operations such as retrieving user details, creating users, deleting users, and promoting users.
- **routes/api-group.js:** Manages group-related operations, including retrieving and managing groups, registering interest, and handling group image uploads.
- **routes/api-channel.js:** Handles channel-related operations, including retrieving and managing channels, adding/removing members, and handling channel image uploads.
- **routes/api-chat.js:** Manages chat-related operations, including fetching chat history, posting messages, and uploading chat images.

### Global Variables

- **PORT:** Specifies the port on which the server listens (default is `3000`).
- **io:** The Socket.io instance, used globally across the server to manage WebSocket communication.
- **baseUrl:** The base URL used for constructing image URLs (e.g., `http://localhost:3000`).

### Database Management Scripts

- **dropDB.js:**
  - **Purpose:** Drops the existing `softwareFrameworks` database and clears the `groups`, `users`, and `channels` data in `staticData.json`.
  - **Usage:** Run this script when you need to reset the database and static data.
  - **Command:** `node dropDB.js`

- **setupDB.js:**
  - **Purpose:** Sets up the `softwareFrameworks` database with initial users, groups, and channels. It also updates `staticData.json` with the initial users and groups data.
  - **Usage:** Run this script after dropping the database to initialize it with necessary seed data.
  - **Command:** `node setupDB.js`

### Data Persistence

- **Static Data (`staticData.json`):**
  - **Purpose:** Stores user and group data in a JSON file for quick access and backup.
  - **Managed By:** `staticDataHandler.js` handles reading from and writing to this file.
  - **Structure:** Contains arrays for `users` and `groups`. Channels and chats are managed directly through MongoDB.

- **MongoDB:**
  - **Purpose:** Stores channels and chats data, providing robust querying and real-time capabilities.
  - **Collections:**
    - `users`: Stores user information.
    - `groups`: Stores group information.
    - `channels`: Stores channel information.
    - `chats`: Stores chat messages and events.
  - **Management Scripts:** `dropDB.js` and `setupDB.js` manage the lifecycle and initial setup of the database.

## Routes

Below is a list of server-side routes, parameters, return values, and their purposes:

### Authentication Routes (`api-auth.js`)

| Method | Endpoint          | Parameters                                                    | Returns                                                                                                      | Purpose                                                                 |
|--------|-------------------|---------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| POST   | /api/auth/signup  | `firstName`, `lastName`, `username`, `email`, `password`, `dob` | JSON object containing the user's details (excluding the password), including `_id`, `username`, `email`, `roles`, `profileImg`, `firstName`, `lastName`, `dob`, and `status` | Registers a new user, adds them to the `users` list, and sends back their details without the password. |
| POST   | /api/auth         | `username`, `password`                                        | JSON object containing the user's details (excluding the password), including `_id`, `username`, `email`, `roles`, `profileImg`, `firstName`, `lastName`, `dob`, and `status` | Authenticates a user based on their `username` and `password`. If credentials are correct, returns user details. Otherwise, returns an error message. |

### User Routes (`api-user.js`)

| Method | Endpoint                     | Parameters                  | Returns                                      | Purpose                                                                                 |
|--------|------------------------------|-----------------------------|----------------------------------------------|-----------------------------------------------------------------------------------------|
| GET    | /api/users                   | None                        | JSON array of all users (excluding passwords) | Retrieves a list of all users, including their `_id`, `username`, `email`, `roles`, `profileImg`, `firstName`, `lastName`, `dob`, and `status`. |
| POST   | /api/users/create            | `username`, `email`, `password` | JSON object of the created user              | Creates a new user, assigns default roles (`chat`), and adds them to the `users` list. |
| DELETE | /api/users/:id               | `id` (ObjectId in URL)       | None                                         | Deletes the specified user from the `users` list.                                     |
| POST   | /api/users/:id/promote/group | `id` (ObjectId in URL)       | JSON object of the updated user              | Promotes a user to Group Admin by adding the `group` role to their roles array.         |
| POST   | /api/users/:id/promote/super | `id` (ObjectId in URL)       | JSON object of the updated user              | Promotes a user to Super Admin by adding the `super` role to their roles array.         |

### Group Routes (`api-group.js`)

| Method | Endpoint                                    | Parameters                                                          | Returns                                      | Purpose                                                                                 |
|--------|---------------------------------------------|---------------------------------------------------------------------|----------------------------------------------|-----------------------------------------------------------------------------------------|
| GET    | /api/groups                                 | None                                                                | JSON array of all groups                     | Retrieves a list of all groups, including their names, admins, members, interested users, descriptions, and group images. |
| POST   | /api/groups                                 | `name`, `admins`, `members`, `interested`, `description`, `groupImg` | JSON object of the created group             | Creates a new group, adds it to the `groups` list, and saves the updated list.           |
| PUT    | /api/groups/:id                             | Group details to update                                             | JSON object of the updated group             | Updates the details of an existing group.                                               |
| DELETE | /api/groups/:id                             | `id` (ObjectId in URL)                                              | None                                         | Deletes the specified group from the `groups` list.                                     |
| POST   | /api/groups/:id/interested                  | `userId`                                                            | JSON object of the updated group             | Registers a user's interest in a group.                                                 |
| POST   | /api/groups/:id/unregister-interest         | `userId`                                                            | JSON object of the updated group             | Removes a user's interest from a group.                                                 |
| POST   | /api/groups/:groupId/removeUser             | `userId`                                                            | JSON object of the updated group             | Removes a user from the group's members and interested lists.                           |
| POST   | /api/groups/:groupId/allowUserToJoin        | `userId`                                                            | JSON object of the updated group             | Allows a user to join the group by moving them from the interested list to the members list. |
| POST   | /api/groups/:groupId/upload                 | `image` (file)                                                       | JSON object containing upload details        | Uploads a group image and updates the group's `groupImg` path.                          |

### Channel Routes (`api-channel.js`)

| Method | Endpoint                       | Parameters                      | Returns                                      | Purpose                                                                                 |
|--------|--------------------------------|---------------------------------|----------------------------------------------|-----------------------------------------------------------------------------------------|
| GET    | /api/channels                  | None                            | JSON array of all channels                   | Retrieves a list of all channels, including their names, group IDs, descriptions, and members. |
| POST   | /api/channels                  | `name`, `description`, `groupId` | JSON object of the created channel             | Creates a new channel, adds it to the `channels` list, and saves the updated list.      |
| PUT    | /api/channels/:id              | `name`, `description`, `groupId` (optional) | JSON object of the updated channel             | Updates the details of an existing channel.                                              |
| DELETE | /api/channels/:id              | `id` (ObjectId in URL)           | None                                         | Deletes the specified channel from the `channels` list.                                 |
| POST   | /api/channels/:id/addMember    | `userId`                        | JSON object of the updated channel with the added member        | Adds a user to the specified channel.                                                    |
| POST   | /api/channels/:id/removeMember | `userId`                        | JSON object of the updated channel without the removed member   | Removes a user from the specified channel.                                               |
| POST   | /api/channels/:id/upload       | `file` (image)                  | JSON object containing upload details        | Uploads an image to a specific channel and updates the relevant message with the image URL. |

### Chat Routes (`api-chat.js`)

| Method | Endpoint                  | Parameters                                      | Returns                                       | Purpose                                                                                 |
|--------|---------------------------|-------------------------------------------------|-----------------------------------------------|-----------------------------------------------------------------------------------------|
| GET    | /api/chat/:channelId      | `channelId` (URL parameter)                     | JSON array of chat messages                   | Retrieves chat messages for a specific channel, including join and leave events.        |
| POST   | /api/chat/:channelId      | `channelId` (URL parameter), `userId`, `username`, `message`, `profilePic`, `imageUrl` | JSON object of the posted message              | Sends a new chat message to a specific channel.                                         |
| POST   | /api/chat/:channelId/upload | `channelId` (URL parameter), `file` (image)      | JSON object containing upload details        | Uploads an image to a specific chat channel and returns the image URL.                   |

## Client-Server Interactions

The interactions between the client (Angular frontend) and the server (Node.js backend) are designed to maintain a smooth user experience by synchronizing data and ensuring real-time updates.

### User Authentication

- **Signup:**
  - When a user signs up, the client sends a `POST` request to `/api/auth/signup` with user details.
  - The server checks if the username already exists. If it’s unique, it creates a new user, assigns default roles (`chat`), and adds the new user to the `users` list.
  - The user data (excluding the password) is returned to the client.

- **Login:**
  - When a user logs in, the client sends a `POST` request to `/api/auth` with `username` and `password`.
  - The server verifies the credentials. If valid, the user’s details (excluding the password) are returned to the client. Otherwise, an error message is returned.

### Group and Channel Management

- **Group Data:**
  - **Retrieve Groups:** The client sends a `GET` request to `/api/groups` to fetch all groups.
  - **Create Group:** The client sends a `POST` request to `/api/groups` with group details to create a new group.
  - **Update/Delete Group:** The client can update or delete groups by sending `PUT` or `DELETE` requests to `/api/groups/:id`.
  - **Manage User Roles:** The client can promote users to Group Admin or Super Admin via `/api/groups/:groupId/promote/group` or `/api/groups/:groupId/promote/super`.

- **Channel Data:**
  - **Retrieve Channels:** The client sends a `GET` request to `/api/channels` to fetch all channels.
  - **Create Channel:** The client sends a `POST` request to `/api/channels` with channel details to create a new channel.
  - **Update/Delete Channel:** The client can update or delete channels by sending `PUT` or `DELETE` requests to `/api/channels/:id`.
  - **Manage Channel Members:** The client can add or remove users from a channel via `/api/channels/:id/addMember` or `/api/channels/:id/removeMember`.

### Chat Interactions

- **Fetching Chat History:**
  - The client sends a `GET` request to `/api/chat/:channelId` to retrieve the last 100 messages for a specific channel.

- **Sending Messages:**
  - The client sends a `POST` request to `/api/chat/:channelId` with message details (`userId`, `username`, `message`, `profilePic`, `imageUrl`).
  - The server saves the message and broadcasts it to all connected clients in the channel via Socket.io.

- **Uploading Images in Chat:**
  - The client uploads an image by sending a `POST` request to `/api/chat/:channelId/upload` with the image file.
  - The server saves the image and returns the image URL, which can be included in chat messages.

### Real-Time Messaging

- **Socket.io Integration:**
  - **Connection:** When a user connects, a Socket.io connection is established.
  - **Joining Channels:** Users join specific channels, allowing them to receive real-time updates for those channels.
  - **Sending Messages:** Messages are sent in real-time to all users in a channel.
  - **Join/Leave Events:** The server broadcasts join and leave events to notify users when someone enters or exits a channel.

### Data Persistence

- **Static Data (`staticData.json`):**
  - **Purpose:** Stores user and group data in a JSON file for quick access and backup.
  - **Managed By:** `staticDataHandler.js` handles reading from and writing to this file.
  - **Structure:** Contains arrays for `users` and `groups`. Channels and chats are managed directly through MongoDB.

- **MongoDB:**
  - **Purpose:** Stores channels and chats data, providing robust querying and real-time capabilities.
  - **Collections:**
    - `users`: Stores user information.
    - `groups`: Stores group information.
    - `channels`: Stores channel information.
    - `chats`: Stores chat messages and events.
  - **Management Scripts:** `dropDB.js` and `setupDB.js` manage the lifecycle and initial setup of the database.

## Image Uploads

The system supports uploading images for user profiles, groups, and chat messages. Uploaded images are stored in designated directories and their paths are saved in the respective data structures.

- **Profile Images:** Uploaded via `/api/users/:id/upload` and stored in `data/images/profileImages`.
- **Group Images:** Uploaded via `/api/groups/:groupId/upload` and stored in `data/images/groupImages`.
- **Chat Images:** Uploaded via `/api/chat/:channelId/upload` and stored in `data/images/chatImages`.

## Video Support

The project includes video support using PeerServer. SSL can be configured to enable secure video connections.

- **PeerServer Setup:**
  - SSL certificates can be generated using OpenSSL.
  - PeerServer runs on port `3001` and integrates with the main server for video functionalities.

- **SSL Configuration:**
  - SSL options are defined in the server configuration to enable HTTPS connections.
  - To switch to HTTPS, replace `http.listen()` with `https.createServer(sslOptions, app).listen(PORT)`.

## Socket.io Logic

Real-time communication is handled using Socket.io, allowing users to join channels, send messages, and receive updates instantly.

- **Connection Handling:**
  - Logs when a user connects or disconnects.

- **Channel Management:**
  - **joinChannel:** Allows users to join a specific channel and notifies others in the channel.
  - **leaveChannel:** Allows users to leave a specific channel and notifies others in the channel.

- **Messaging:**
  - **channelMessage:** Handles incoming messages and broadcasts them to all users in the channel.

- **Event Handling:**
  - **userEvent:** Manages join and leave events to keep track of user activities within channels.
