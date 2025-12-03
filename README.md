## Semester Project for CPSC 332, Web Development

Created by Ritchie Fu, Fall 2025

### Project name: *"Zags Help Zags"*


### Description:
This is an app designed to help Gonzaga students to ask, receive, and give help to other students! Think of it like a centralized board for people at Gonzaga to connect and help each other. Whether you need a helping hand, looking to borrow some gear, or need help on some digital design work, this platform is meant to facilitate that. It is a ***volunteer board***, so people are expected to only give and request free help. I really wanted to make this to give more people the opportunity to volunteer, allowing people to choose the tasks they are most comfortable with and that would work with their schedule.

12-2-2025: Forked repo into my personal account so that I could host it via Github Pages. My local repo points to two remote repositories"

### Table of Contents:
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

### Installation:
#### Dependencies:
**Node.js**: Currently using 22.21.10, though any version higher than 20.19.0 will also work.<br>
**npm:** Comes with Node.js<br>
**MongoDB:** Not required yet

#### Quick Setup:
1. Clone the project.
```bash
git clone https://github.com/GU-Web-Dev-2025/final-project-ritchie.git
```
2. Install root dependencies
```bash
npm install
```
3. Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```
4. Start the frontend development server (Vite):
``` bash
cd frontend
npm run dev
```
This will start the development server for Vue, and in your terminal, you will see a localhost link with a specific port number. Open that up in your browser to see live updates when you save.

### Usage:
- When you see the website for the first time, you will likely see the home page first. The home page has no content on it yet.
- On the listings page, you will see some pre-populated listings with placeholder data. This is just an example of what the posts might look like.
- On the post tab, you may create your own listing. You must fill out the title and the description, but the tags and the image are optional. Once you click submit, your post will show up in the listings. Just a note, the results are rendered by column instead of rows, so any new listings you add will populate the left most row first. I will work on fixing that for the next deliverable.
- The login screen has no data on it right now.
- The sign up screen has a form where you can enter in some information. You must also click "agree" on the privacy notice before being allowed to sign up. After you click sign up, you should see an alert that indicates that you have signed up. I have not connected this to an authentication flow, but I am working on that for the next release.
### Contributing:
I am working by myself for this project! If someone wanted to help, their best bet would to make a new branch and create pull requests!!
### Credits
Ritchie Fu, Gonzaga University
### License
I don't currently have a license, but I might go with the MIT license. I'm not sure yet.