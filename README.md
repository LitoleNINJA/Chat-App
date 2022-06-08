<div id="top"></div>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<br />
<div align="center">
  <a href="https://github.com/LitoleNINJA/Chat-App">
    <img src="client/public/favicon.ico" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Hide - Out : ChatApp</h3>

  <p align="center">
    Hide-Out is a real-time web chat application that allows users to communicate with each other.
    <br />
    <a href="https://github.com/LitoleNINJA/Chat-App"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://c-h-a-t-a-p-p1.herokuapp.com/">View Demo</a>
    ·
    <a href="https://github.com/LitoleNINJA/Chat-App/issues">Report Bug</a>
    ·
    <a href="https://github.com/LitoleNINJA/Chat-App/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

# About The Project

## Hide-Out is a real time chat application with amazing additionals features such as one click google login, image and profile picture upload, and emoji support.

<br />

## Built With

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)
- [Socket.io](https://socket.io/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```
- initialize npm
  ```sh
  npm init -y
  ```
- install dependancies
  ```sh
  npm install
  ```
- create frontend folder
  ```sh
  npx create-react-app
  ```
- install frontend dependancies
  ```sh
  cd frontend
  npm install
  ```

### Installation

1. Create free account at at [cloudinary.com](https://cloudinary.com/), [console.cloud.google.com](https://console.cloud.google.com/), [mongodb.com](https://www.mongodb.com/)
2. Create .env file in root folder as below :-
```js
 MONGODB_URI = 'ENTER YOUR MONGODB URI'
 PORT = '5000'
 NODE_ENV = 'development / production'
 JWT_SECRET = 'CREATE A JWT SECRET KEY'
 GOOGLE_CLIENT_ID = 'ENTER YOUR GOOGLE CLIENT ID' 
```
3. Create .env file in client folder as below :-
```js
 REACT_APP_GOOGLE_CLIENT_ID = 'ENTER YOUR GOOGLE CLIENT ID'
 REACT_APP_CLOUDINARY_CLOUD_NAME = 'ENTER YOUR CLOUDINARY CLOUD NAME'
 REACT_APP_CLOUDINARY_UPLOAD_PRESET = 'ENTER YOUR CLOUDINARY UPLOAD PRESET'
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Create Error Handling Snackbar
- [ ] Enable Forgot Password option for users
- [ ] A user profile page for editing user details
- [ ] Add additional features to rigthBar

See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Ritwik Singh - sritwik2@gmail.com

Project Link: [https://github.com/LitoleNINJA/Chat-App](https://github.com/LitoleNINJA/Chat-App)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/LitoleNINJA/Chat-App.svg?style=for-the-badge
[contributors-url]: https://github.com/LitoleNINJA/Chat-App/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/LitoleNINJA/Chat-App.svg?style=for-the-badge
[forks-url]: https://github.com/LitoleNINJA/Chat-App/network/members
[stars-shield]: https://img.shields.io/github/stars/LitoleNINJA/Chat-App.svg?style=for-the-badge
[stars-url]: https://github.com/LitoleNINJA/Chat-App/stargazers
[issues-shield]: https://img.shields.io/github/issues/LitoleNINJA/Chat-App.svg?style=for-the-badge
[issues-url]: https://github.com/LitoleNINJA/Chat-App/issues
[license-shield]: https://img.shields.io/github/license/LitoleNINJA/Chat-App.svg?style=for-the-badge
[license-url]: https://github.com/LitoleNINJA/Chat-App/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/ritwik-singh-7094911ba
[product-screenshot]: images/screenshot.png
