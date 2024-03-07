# MinePlugin

MinePlugin is available here: https://mineplugin.netlify.app
## What is MinePlugin?
This is an **online code editor** that you can create Minecraft plugins.
It is a web app built with [React](https://react.dev/) and [AWS](https://aws.amazon.com/).
<img alt="" width="640" src="https://github.com/JunweiNotAvailable/mineplugin/assets/89463326/06c9fb93-d1c3-4629-8333-c7db315d20e2">


## Why did I start?
Developers build Minecraft plugins on their computers. But what if you don't have access to your computer at the moment?

That is when this web-based tool comes in, for developers to build Minecraft plugins **anytime**, **anywhere**.

## How does it work?
- **Frontend** - In the frontend, there are only two buttons - **Build** and **Download**, and a code editor
- **Database** - Use MongoDB to store users and plugins data
- **Cloud services**
  - **AWS S3 Bucket** - To store the files (source code, config files...)
  - **AWS CodeBuild** - Compile the code and generate target files **on the cloud**
  - **API Gateway** - Communications between the frontend, database and the cloud
  - **Lambda** - Cloud functions that attached to REST APIs and access the cloud services (e.g. S3, CodeBuild)
- **Communication**
  1. Every 5 seconds, the React frontend will **check** if the building is ongoing
  2. **Only when there's no building process**, users can trigger build or download
  3. Once the build is triggered, the frontend will send a request to build
- **Build process**
  1. Store source code to AWS S3 (user's input in code editor)
  2. AWS CodeBuild will compile the code, generate a `.jar` file and store it to S3
  3. Download - Get the file content from S3

## What's next?
- **Blockly** - To make it user-friendly for wider target audience, even people don't know how to code can build plugins.
