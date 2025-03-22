# Habit Builder Frontend

## Overview

The Habit Builder application is designed to help users build and maintain positive habits through a user-friendly interface. This project focuses on providing a professional-looking login page that integrates Google Sign-In for seamless authentication.

## Features

- Google Sign-In integration for easy user authentication.
- Reusable components for buttons and input fields.
- Professional styling for a polished user experience.

## Project Structure

```
habit-builder-frontend
├── src
│   ├── components
│   │   ├── auth
│   │   │   ├── Login.jsx
│   │   │   └── GoogleSignIn.jsx
│   │   └── common
│   │       ├── Button.jsx
│   │       └── Input.jsx
│   ├── styles
│   │   ├── auth.css
│   │   └── common.css
│   ├── utils
│   │   └── auth.js
│   ├── App.jsx
│   └── index.js
├── public
│   └── index.html
├── package.json
├── .env
└── README.md
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd habit-builder-frontend
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and add your Google API credentials.
5. Start the development server:
   ```
   npm start
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
