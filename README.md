## Semester Project for CPSC 332, Web Development

Created by Ritchie Fu, Fall 2025

### Project name: *"Zags Help Zags"*

### Description:
This is an app designed to help Gonzaga students to ask, receive, and give help to other students! Think of it like a centralized board for people at Gonzaga to connect and help each other. Whether you need a helping hand, looking to borrow some gear, or need help on some digital design work, this platform is meant to facilitate that. It is a ***volunteer board***, so people are expected to only give and request free help. I really wanted to make this to give more people the opportunity to volunteer, allowing people to choose the tasks they are most comfortable with and that would work with their schedule.

12-2-2025: Created a public clone of the repo that I use to host my frontend and backend on Render. Intial loading times are slow and the website shuts down if there is no activity. Please try out the hosted website here: https://hosted-final-project-332.onrender.com

### Table of Contents:
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

### Installation:

#### Dependencies:
*   **Node.js**: Currently using 22.21.10 (any version > 20.19.0 should work).
*   **MongoDB**: Required for the backend database. You can use a local instance or a cloud provider like MongoDB Atlas.

#### Quick Setup:

1.  **Clone the project:**
    ```bash
    git clone https://github.com/GU-Web-Dev-2025/final-project-ritchie.git
    ```

2.  **Environment Setup:**

    *   **Frontend**: Create a `.env` file in the `frontend` root directory with the following variable (used for Firebase Cloud Storage):
        ```env
        VITE_GOOGLE_API_KEY=your_google_api_key
        ```

    *   **Backend**: Create a `.env` file in the `backend` root directory with the following variables:
        ```env
        STYTCH_PROJECT_ID=your_stytch_project_id
        STYTCH_PROJECT_ENV=test
        STYTCH_PUBLIC_TOKEN=your_stytch_public_token
        STYTCH_SECRET=your_stytch_secret
        MONGODB_URI=mongodb://localhost:27017/your_db_name  # Or your MongoDB Atlas URI
        ```
        *Note: For local development, `mongodb://localhost:27017` works if you have MongoDB running locally.*
        * If you are the professor of this class, you will know the environment variables and will be able to replicate my development setup.
3.  **Install Dependencies & Start Backend:**
    ```bash
    npm install
    cd backend
    npm run dev  # Starts the backend server on port 3000 (default)
    ```

4.  **Install Dependencies & Start Frontend:**
    Open a new terminal window:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    This will start the Vue development server. Open the localhost link provided in the terminal to view the app.

### Usage:
-   **Home Page**: The landing page for the application.
-   **Listings Page**: Displays all active listings. Users can browse requests for help.
-   **My Listings**: Authenticated users can manage their own posts here. Listings created or updated more than 7 days ago will appear in a "Hidden Listings" section and must be updated to reappear on the main board.
-   **Post**: Authenticated users can create new listings with a title, description, tags, and an optional image.
-   **Authentication**: The app uses Stytch for authentication. Users can sign up via email (restricted to `@zagmail.gonzaga.edu` domains).

### Contributing:
I am working by myself for this project! If someone wanted to help, their best bet would to make a new branch and create pull requests!!

### Credits
Ritchie Fu, Gonzaga University

### License
I don't currently have a license, but I might go with the MIT license. I'm not sure yet.
