# pwa-icons

![PWA icons](./pwa-icons_2.png)

Angular default PWA icon generator

**Inspired By:** [ngx-pwa-icons](https://github.com/pverhaert/ngx-pwa-icons)

**Supports:** version 6+ | **Last Tested:** version 10.   

Create an icon in the root folder of your Angular project and use `pwa-icons` replace the default PWA icons generated by ```ng add @angular/pwa``` with your own.



### Usage

Add PWA capabilities to an existing Angular app.

    $ ng add @angular/pwa

Create an `icon.png` file in the root folder of your Angular project. 

For good results, your `icon.png` file should be:

- square
- transparant background
- at least 512*512px

### Available Options:

`-h` or `--help` Show help   
`-v` or `--version` Show package version number   
`-d` or `--dry-run` Run through without making any changes  
`-i` or `--icon` Original icon to convert (defaults to **"./icon.png"**)   
`-o` or `--output` Output folder  (defaults to **"./src/assets/icons"**)   
`-fo` or `--faviconOutput` Output folder for favicon.ico  (defaults to **"./src"**) 
`-s` or `--size` Resize icons to px  (defaults to **"512, 384, 192, 152, 144, 128, 96, 72"**)   
`-n` or `--name` Icon name.   
