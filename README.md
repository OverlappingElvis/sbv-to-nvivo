# sbv-to-nvivo
Transform YouTube .sbv files to NVivo .txt format.

## Installation
sbv-to-nvivo should be installed as a global npm package:

    $ npm install -g sbv-to-nvivo

If this fails, you may need to run as admin:

    $ sudo npm install -g sbv-to-nvivo

On Windows, right-click the Command Prompt tool and select "Run as Administrator"

Verify that the installation was successful by running `sbv-to-nvivo` from a command prompt.

## Usage
    $ sbv-to-nvivo captions.sbv

Creates `captions1.txt`

    $ sbv-to-nvivo captions1.sbv captions2.sbv

Creates `captions1.txt` and `captions2.txt`

    $ sbv-to-nvivo *.sbv

Creates `<filename>.txt` for each `<filename>.sbv` in the current directory
