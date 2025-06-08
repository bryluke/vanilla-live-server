# Vanilla Live Server

A simple, lightweight live-reload server for local web development, built from scratch with Node.js, WebSockets, and Chokidar. This project was created as a learning exercise to understand the tools developers use every day.

---

## Features

* **Zero-Configuration:** Run it in any project directory.
* **Live Reload:** Automatically reloads the browser when you save a file.
* **Lightweight:** Built with minimal dependencies.
* **CLI-Based:** Easy to run from your terminal.

## Why I Built This

As part of my journey to deepen my understanding of web fundamentals, I wanted to demystify the "magic" behind common development tools. Building my own live server from scratch helped me grasp the relationship between the HTTP server, the file system, and real-time client-server communication using WebSockets. You can follow my journey on [my personal site](https://bryanluketan.com).

## Installation

You can clone the repository and install the dependencies locally.

```bash
git clone [https://github.com/your-username/vanilla-live-server.git](https://github.com/your-username/vanilla-live-server.git)
cd vanilla-live-server
npm install
```
*(FUTURE: Add global installation instructions after publishing to npm)*

## Usage

Navigate to your project folder and run the server using the `npm start` script, passing the directory you want to serve as an argument.

```bash
# To serve your project
npm start path/to/your/project
```
The server will start on `http://localhost:3000`.

## Future Improvements

- [ ] **Publish to npm:** Package the tool for easy global installation (`npm install -g vanilla-live-server`).
- [ ] **Hot-reloading for CSS:** Update styles without a full page refresh.
- [ ] **Configurable Port:** Allow the port to be set via a command-line flag (e.g., `-p 8080`).
- [ ] **Directory Listing:** If `index.html` is not found, display a list of files in the directory.
- [ ] **Handling more MIME types:** Expand the list of supported file types.

## License

[MIT](LICENSE)