Charity Hospice Application

Web Application Development 2
Ryan Jackson
S2335470
Prerequisites

Before you begin, ensure you have met the following requirements:
1. Node.js and npm

    Node.js: This application is built using Node.js. You can download and install it from nodejs.org.
    npm: npm (Node Package Manager) is bundled with Node.js. You will use npm to install dependencies.

To check if Node.js and npm are installed, run:

bash

node -v
npm -v

2. NeDB 

    NeDB: This application uses NeDB as the database. NeDB is a lightweight database similar to MongoDB but embedded within your Node.js application.

Note: NeDB is included in the dependencies, so you don’t need to install it separately.
3. Git (Optional)

    Git: If you are cloning the repository from a version control system like GitHub, you’ll need Git. Download it from git-scm.com.

To check if Git is installed, run:

bash

git --version

4. Environment Setup

Ensure the development environment is set up correctly:

    Database File: Make sure the guestbook.db file is present in the root directory of the project.
    Scripts Directory: Verify that the scripts directory contains the necessary scripts for managing the database.

5. Configuration

Set up any necessary environment variables. Create a .env file in the root directory with the following variables if applicable:

PORT=3000
DB_PATH=path_to_your_database

6. Dependencies

To install all required dependencies, run the following command in your terminal from the root directory of your project:

bash

npm install

This command will install all the dependencies listed in your package.json file.
7. Running the Application

After setting up your environment and installing dependencies, start the application within the terminal using:

npm start

8. Accessing the Application

Once the application is running, open your web browser and navigate to:

http://localhost:9000

_______________________________________________________________________________________________________________________________

Missing features:

- When on the available products page, the item does not show the available stores etc, this is due to an error with code that I previously had.

- Manager can't alter the prices, ran into consistent errors with code so have decided to leave it out to avoid ruining the full site.

