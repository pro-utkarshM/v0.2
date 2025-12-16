# Nerdy Network

**Nerdy Network** is the open-source operating system for our campus. It is a monorepo containing the chaotic (but organized) suite of tools that bridge the gap between academic survival and the student builder lifestyle.

It includes the core social platform, the manifesto website, and the backend infrastructure that powers everything from House Points to Exam Results.

## Table of Contents

- [The Stack](#the-stack)
- [Project Architecture](#project-architecture)
- [Tech Matrix](#tech-matrix)
- [Deployment Protocol](#deployment-protocol)
- [How to Contribute](#how-to-contribute)
- [System Modules](#system-modules)

## The Stack

- [**The Platform**](https://app.nerdynet.co): A Next.js application where the community lives (Gamification, Social, Utilities).
- **The Core Server**: An Express + TypeScript backend handling the logic, data scraping, and API requests.
- **Modular Architecture**: Built with Turbo Repo for high-performance build caching.

## Project Architecture

```bash
/nerdy-network
  /apps
    /platform      # Main App (app.nerdynet.co)
    /website       # Landing Page (nerdynet.co)
  /turbo.json      # Turbo Repo configuration
  /package.json    # Root workspaces config
  /.gitignore      # Git ignore
  /README.md       # This file