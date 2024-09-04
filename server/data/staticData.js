const data = {
  "users": [
    {
      "id": 1748532097465,
      "username": "super_admin",
      "email": "superadmin@example.com",
      "password": "123",
      "roles": ["super", "group", "chat"],
      "profileImg": "assets/images/defaultProfile.jpg",
      "firstName": "Super",
      "lastName": "Admin",
      "dob": "1980-01-01",
      "status": "Active"
    },
    {
      "id": 1832456791432,
      "username": "john_doe",
      "email": "john.doe@example.com",
      "password": "pw",
      "roles": ["super", "group", "chat"],
      "profileImg": "assets/images/37.jpg",
      "firstName": "John",
      "lastName": "Doe",
      "dob": "1990-08-17",
      "status": "Busy"
    },
    {
      "id": 1923785069812,
      "username": "jane_smith",
      "email": "jane.smith@example.com",
      "password": "pw",
      "roles": ["chat"],
      "profileImg": "assets/images/58.jpg",
      "firstName": "Jane",
      "lastName": "Smith",
      "dob": "1992-03-26",
      "status": "Available"
    },
    {
      "id": 1748532097491,
      "username": "alice_jones",
      "email": "alice.jones@example.com",
      "password": "pw",
      "roles": ["chat"],
      "profileImg": "assets/images/430.jpg",
      "firstName": "Alice",
      "lastName": "Jones",
      "dob": "1998-06-10",
      "status": "Away"
    },
    {
      "id": 1863458910201,
      "username": "robert_brown",
      "email": "robert.brown@example.com",
      "password": "pw",
      "roles": ["group", "chat"],
      "profileImg": "assets/images/550.jpg",
      "firstName": "Robert",
      "lastName": "Brown",
      "dob": "1985-11-20",
      "status": "Active"
    }
  ],
  "groups": [
    {
      "id": 1789032111453,
      "name": "Developers",
      "admins": [1748532097465],
      "members": [1748532097465, 1832456791432, 1923785069812],
      "interested": [],
      "description": "Group for software developers",
      "groupImg": "assets/images/473.jpg"
    },
    {
      "id": 1901345912045,
      "name": "Project Management",
      "admins": [1863458910201],
      "members": [1863458910201, 1748532097465],
      "interested": [],
      "description": "Group for project management discussions",
      "groupImg": "assets/images/430.jpg"
    },
    {
      "id": 1834561293745,
      "name": "Designers",
      "admins": [1832456791432],
      "members": [1832456791432, 1923785069812, 1748532097491],
      "interested": [],
      "description": "Group for creative design",
      "groupImg": "assets/images/58.jpg"
    },
    {
      "id": 1789032111457,
      "name": "Testers",
      "admins": [1923785069812],
      "members": [1923785069812, 1863458910201],
      "interested": [],
      "description": "Group for testing and quality assurance",
      "groupImg": "assets/images/37.jpg"
    }
  ],
  "channels": [
    {
      "id": 1754392748390,
      "name": "General Discussion",
      "groupId": 1789032111453,
      "description": "General chat for all members",
      "members": [1748532097465, 1832456791432, 1923785069812]
    },
    {
      "id": 1893456124387,
      "name": "Project Updates",
      "groupId": 1901345912045,
      "description": "Project management discussions",
      "members": [1863458910201, 1748532097465]
    },
    {
      "id": 1725431559141,
      "name": "Design Critiques",
      "groupId": 1834561293745,
      "description": "Feedback and critique sessions for design",
      "members": [1832456791432, 1923785069812, 1748532097491]
    },
    {
      "id": 1754392748399,
      "name": "QA Testing",
      "groupId": 1789032111457,
      "description": "Channel for discussing QA testing strategies",
      "members": [1923785069812, 1863458910201]
    }
  ]
}