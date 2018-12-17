# hyperledger-recycling-poc

This project is created as a showcase for using the Hyperledger quickstart template for a tire recycling case. It's based on the existing quickstart template available at https://github.com/cegeka/hyperledger-poc-quickstart.

## Downloading the project on Windows 

The git client on Windows has to be configured to work correctly vefore cloning this project. Otherwise you will encouter 2 problems:
- path names too long to download - by default, git for windows enforces the 256 character limit in file paths
- docker scripts unable to start - by default, git for windows will convert all new line characters to Windows syntax (CR\LF), causing most shell scripts to fail. This setting needs to be disabled before cloning the repository.

Run the following commands in an administrative command prompt window.
`
git config --system core.longpaths true
git config --global core.eol lf 
git config --global core.autocrlf input
`

## Starting the project

See the instructions in the `docker` folder.

## Development environment and customising the project

See the Readme file in the  existing quickstart template repository at https://github.com/cegeka/hyperledger-poc-quickstart.
