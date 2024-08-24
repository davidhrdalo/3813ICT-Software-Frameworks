# 3813ICT-Software-Frameworks

Author: David Hrdalo
Project Description: A project utilising the MEAN stack.

## Git Repository Usage

Git formed a key part of this project.
A GitHub was created under: https://github.com/davidhrdalo/3813ICT-Software-Frameworks
Two branches were established:
Main - A relatively stable build
Pre - Pushing lightly tested changes
Commits were made regularly.
The server was created in a server folder in the root of the project directory.

## Data Structures

There were three key data structures for this project users, groups and channels. The structure is non-relational. The structures were stored in on the server with some initial seeder data. This data was accessed by an Angular service and stored in local storage. The schema can be found below.

### Users

id - number - unique
username - string - unique
email - string - unique
password - string
roles = [],
groups = []

### Groups

constructor(id, name, admins = [], members = [])

### Channels

constructor(id, name, groupId)

## Angular Architecture

### Components

### Services

### Models

### Routes

## Node Server Architecture

### Modules

### Functions

### Files

### Global variables

## Routes

A list of server side routes, parameters, return values, and there purpose

## Client Server Interactions

Describe the details of the interaction between client and server by indicating how the data on server side will be changed and how the display of each angular component page will be updated
