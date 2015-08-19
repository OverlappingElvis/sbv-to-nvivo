# sbv-to-nvivo
Transform YouTube .sbv files to NVivo .txt format.

## Installation
sbv-to-nvivo works best when globally installed as is available an an npm package:

    $ npm install -g sbv-to-nvivo

If this fails, you may need to run as admin:

    $ sudo npm install -g sbv-to-nvivo

On Windows, right-click the Command Prompt tool and select "Run as Administrator"

Verify that the installation was successful by running `sbv-to-nvivo` from a command prompt.

## Usage
    $ sbv-to-nvivo <filename>.sbv

Produces a file named `<filename>.txt`
