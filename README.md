<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://conway-life-simulation.netlify.app/">
    <img src="public/GOL.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">John Conway's Game of Life</h3>

  <p align="center">
    This is a simple implementation of John Conway's Game of Life, also known as Life. It is a cellular automaton, or simulation.
    <br />
    <br />
    <a href="https://conway-life-simulation.netlify.app/">View Demo</a>
    ·
    <a href="https://github.com/jrbarnhart/game-of-life/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<img src="src/assets/GoLSplash.jpg">

My aim with this project was to create a Life simulation capable of simulating a large number of cells at a target of 10fps. I also included the ability to determine the initial state by drawing cells to the grid before starting the simulation.

The performance was achieved through my approach to implementing Life's rules. First I considered the "naive" approach:
1. For every cell, consider the cell's 8 adjacent neighbors on the grid.
2. If the cell is dead and has exactly three living neighbors then it comes to life.
3. If the cell is alive and has less than 2 or more than 3 living neighbors it dies.

For example, consider the following grid:

![Initial state for Life](/src/assets/grid.jpg)

This brute force approch applies the rules to every single cell for every frame. This will work, but you end up with a many to many calculation. This means that adding more cells increases the computation exponentially.

(Every cell with arrows is being put through the algorithm.)

![Naive Approach](/src/assets/naiveApproach.jpg)

There is a better way, but it requires some setup. First I store every cell's data as an unsigned 8 bit integer in a Uint8 array. This is done by using the most significant bit to track if the cell is alive or dead, and the last four bits to track how many living neighbors it has.

For example, a cell that is alive with three living neighbors will have the binary value of 10000011, or 131 as a Uint8.

When the simulation starts all cells have their living neighbor count set. This only needs to be done once.

![Neighbor Count](/src/assets/neighborCount.jpg)

Now that the cell data has been initialized with living neighbor counts a faster algorithm can be used. Instead of every cell the following is applied to just the living cells:
1. If the cell has less than 2 or more than 3 living neighbors then it dies.
2. If the cell dies then update its neighbor's living neighbor count values.
3. If any any of the cell's neighbors now have exactly 3 living neighbors then they come to life.
4. Repeat from step 2 for any neighbor cells that come to life.

This recursive approach means that most dead cells are never touched for most frames which prevents useless calculations that result in no changes.

![Better Approach](/src/assets/betterApproach.jpg)

Finally, I wanted to avoid subpixel rendering so I limited the max grid resolution to the smallest canvas size resolution possible, which is 384 x 216 px. This allows for a maximum total of 82,944 cells. This means the smallest a cell will ever be is one pixel. Even more cells could be calculated and displayed if a zoom functionality were to be implemented. In initial states with many living cells things can be a bit slower but as soon as the excessive cells die off and the grid is sparse performance improves dramatically.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* Typescript
* React
* Vite
* Tailwind
* Vitest

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these steps:

1. Clone the repo
   ```sh
   git clone https://github.com/jrbarnhart/game-of-life.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the dev server
   ```sh
   npm run dev
   ```
4. Navigate to the address in the terminal

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

[My Portfolio](https://joshuarbarnhart.com)

[LinkedIn](https://linkedin.com/in/joshuarbarnhart)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


