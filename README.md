# hyperledger-recycling-poc

This project is created as a showcase for using the Hyperledger quickstart template for a tire recycling case. It's based on the existing quickstart template available at https://github.com/cegeka/hyperledger-poc-quickstart.

## Downloading the project on Windows 

The git client on Windows has to be configured to work correctly vefore cloning this project. Otherwise you will encouter 2 problems:
- path names too long to download - by default, git for windows enforces the 256 character limit in file paths
- docker scripts unable to start - by default, git for windows will convert all new line characters to Windows syntax (CR\LF), causing most shell scripts to fail. This setting needs to be disabled before cloning the repository.

Run the following commands in an administrative command prompt window.
```
git config --system core.longpaths true
git config --global core.eol lf 
git config --global core.autocrlf input
```

## Starting the project

The project can be started in 2 ways:

1. A local-mode, where everyting is available only running on the local machine. Run the `compose-setup.sh` or `compose-setup.bat` file in the `docker` folder for this mode. You can read more about this in the `docker/README.md` file, but ignore the 'Configure server address' section.
2. A production-mode, where the application can be exposed publicly on the internet. Follow the full instructions in the `docker` folder for this mode.

The main difference between the 2 setups is that in production mode, the web application is configured to run under the full external name of the server, so it can be accessed from anywhere. Under the local mode, it will only work when running locally (http://localhost:8080). Additionally, the local-mode doesn't start the landing page by default, since the standard :80 port is usually taken on non-production machines.

See the instructions in the `docker` folder for wetailed instructions on the project.

## Development environment and customising the project

See the Readme file in the  existing quickstart template repository at https://github.com/cegeka/hyperledger-poc-quickstart.
