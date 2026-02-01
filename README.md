## About

A docker manager that mimics OrbStack, created purely out of personal interest.   

![截屏2026-01-26 22.22.38.png](docs/assets/%E6%88%AA%E5%B1%8F2026-01-26%2022.22.38.png)


## Features
- main 
  - image files ([dive](https://github.com/wagoodman/dive)) 

![录屏2026-01-26 21.17.06.gif](docs/assets/%E5%BD%95%E5%B1%8F2026-01-26%2021.17.06.gif)

- term  

![录屏2026-01-26 21.25.17.gif](docs/assets/%E5%BD%95%E5%B1%8F2026-01-26%2021.25.17.gif)


## Development

To run in live development mode, run `wails3 dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes.

To build a redistributable, production mode package, use `wails3 build`.

Technology stack:
- Golang
  - [Wails3](https://v3alpha.wails.io/)
  - [docker SDK (moby)](https://pkg.go.dev/github.com/moby/docker/client)
  - [Dive](https://github.com/wagoodman/dive)
- Frontend
  - [Preact](https://preactjs.com/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [daisyUI](https://daisyui.com/docs/intro/)


## TODOs
- containers
  - [x] create container
    - [ ] list local images
    - [ ] pull image from dockerhub
  - [x] remove container
  - [ ] export container files
  - [ ] export noVNC
- images
  - [ ] add image
    - [ ] pull image from dockerhub
    - [ ] build image from Dockerfile
  - [ ] remove image
  - [ ] export image files
- volumes
  - [ ] create volume
  - [ ] remove volume
  - [ ] show | export volume files
- networks
  - [ ] create network
  - [ ] remove network
- remote docker host
  - [ ] connect docker host by SSH
- Kubernetes
- Settings
  - [ ] theme
