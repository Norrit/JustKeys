JustKeys
=====================
JustKeys is a plugin that lets you use Chrome without a mouse.

Installation
-----------------------
Clone the project and open the `src` folder in the Chrome Plugin Manager.

How to use
---------------------
Press `f` to `follow` a link in the current tab or `g` to `goto` the
linked site in a new one. 

After pressing the key a number will be displayed beside all visible
links. Just type in the number and hit `enter` to complete the
selection and execute the action. To abort the selection press `esc`
or the first key again.

```
|-------+------------------+------------------------------------------------|
| Key   | Function         | Description                                    |
|-------+------------------+------------------------------------------------|
| f     | Follow Link      | Open the selected link in the current tab      |
| g     | Goto Link        | Open the selected link in a new tab            |
| d     | Delete Character | Delete the last insert number in the selection |
| esc   | Reset            | Abort the link selection                       |
|-------+------------------+------------------------------------------------|
```

Screenshots
---------------------
* Before Selection

![Before selection](https://github.com/Norrit/JustKeys/raw/master/img1.png)

* During Selection

![During selection](https://github.com/Norrit/JustKeys/raw/master/img2.png)

Todo
---------------------
* Write TESTS!! Dammit!
* Check if Chrome shortcuts could be used to remove the keybindings in the content scripts
* Add some nice icons
* Config page to set keybindings

Note
---------------------
If you like mockster, consider endorsing me at [coderwall](http://coderwall.com/bertschneider):

![endorse](http://api.coderwall.com/bertschneider/endorsecount.png)]

License
---------------------
Copyright © 2012 Norbert Schneider


