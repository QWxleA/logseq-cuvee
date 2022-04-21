<div id="top"></div>
<!--
*** Thanks for checking out the logseq-cuvee. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/QWxleA/logseq-cuvee">
    <img src="images/icon.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Logseq Cuvee</h3>

  <p align="center">
    Because your data is too precious to *not* be shared!
    <br />
    <a href="https://github.com/QWxleA/logseq-cuvee"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/QWxleA/logseq-cuvee">View Demo</a>
    ·
    <a href="https://github.com/QWxleA/logseq-cuvee/issues">Report Bug</a>
    ·
    <a href="https://github.com/QWxleA/logseq-cuvee/issues">Request Feature</a>
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#configuration">Configuration</a></li>
    <li><a href="#using-the-plugin">Using the plugin</a></li>
    <li><a href="#issues">Issues</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://github.com/QWxleA/logseq-cuvee/)

This plugin makes it possible to export the result of a query as a [CSV](https://en.wikipedia.org/wiki/Comma-separated_values).

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED -->

## Installation

### Preparation

- Click the 3 dots in the righthand corner and go to **Settings**.
- Go to **Advanced** and enable **Plug-in system**.
- Restart the application.
- Click 3 dots and go to Plugins (or `Esc t p`).

### Install plugin from the Marketplace (recommended) 

- Click the `Marketplace` button and then click `Plugins`.
- Find the plugin and click `Install`.

### Install plugin manually

- Download a released version assets from Github.
- Unzip it.
- Click Load unpacked plugin, and select destination directory to the unzipped folder.



<p align="right">(<a href="#top">back to top</a>)</p>



<!-- Configuration -->
## Configuration

- Click the 3 dots in the righthand corner and go to **Settings**.
- Go to **Plugin Settings**.
- Select correct plugin.

Nothing to configure (yet).

<p align="right">(<a href="#top">back to top</a>)</p>

## Using the plugin

Add a placeholder using the *slash-command*: `/Cuvee: insert Export CSV button`, which will insert the following template:

`{{renderer :cuvee, true, query}} `

- `:cuvee` is the name of the plugin
- `true` adding the page name of the found blocks, if not needed, set to `false`
- `query`, replace this with a regular simple query. Can be tested by pressing the **preview** button

**Note:** in the preview the page-name (or date) is not added, just the properties!

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Issues -->
## Issues

See the [open issues](https://github.com/QWxleA/logseq-cuvee/issues) for a full list of proposed features (and known issues).

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

### Image license

### Font License

[OFL](./OFL.txt)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Alex Qwxlea - [@QwxleaA](https://twitter.com/QwxleaA) 

Project Link: [https://github.com/QwxleaA/logseq-cuvee](https://github.com/QwxleaA/logseq-cuvee)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/QWxleA/logseq-cuvee.svg?style=for-the-badge
[contributors-url]: https://github.com/QWxleA/logseq-cuvee/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/QWxleA/logseq-cuvee.svg?style=for-the-badge
[forks-url]: https://github.com/QWxleA/logseq-cuvee/network/members
[stars-shield]: https://img.shields.io/github/stars/QWxleA/logseq-cuvee.svg?style=for-the-badge
[stars-url]: https://github.com/QWxleA/logseq-cuvee/stargazers
[issues-shield]: https://img.shields.io/github/issues/QWxleA/logseq-cuvee.svg?style=for-the-badge
[issues-url]: https://github.com/QWxleA/logseq-cuvee/issues
[license-shield]: https://img.shields.io/github/license/QWxleA/logseq-cuvee.svg?style=for-the-badge
[license-url]: https://github.com/QWxleA/logseq-cuvee/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.gif
[configuration-screenshot]: ./images/configuration.png