# MC Picker

MC Picker is available here: https://mcpicker.netlify.app
## What is MC Picker
This is a **online code editor** that you can create Minecraft plugins.
It is a web app powered by [React](https://react.dev/) and [AWS](https://aws.amazon.com/).

## Why I started
Developers build Minecraft plugins on their computers. But what if you don't have access to your computer at the moment?

So I created this web-based tool build Minecraft plugins **at anywhere**, **in anytime**.

## How it works
- **Frontend** - In the frontend, there are only two buttons - **Build** and **Download**, and a code editor
- **Cloud services**
  - **AWS S3 Bucket** - To store the files (source code, config files...)
  - **AWS CodeBuild** - Compile the code and generate target files
  - **API Gateway** - Communications between the frontend and the cloud
  - **Lambda** - Cloud functions that attached to REST APIs and access the cloud services (e.g. S3, CodeBuild)
- **Communication**
  1. Every 5 seconds, the React frontend will **check** if the building is ongoing
  2. **Only when there's no building process**, users can trigger build or download
  3. Once the build is triggered, the frontend will send a request to build
- **Build process**
  1. Store source code to AWS S3 (user's input in code editor)
  2. AWS CodeBuild will compile the code, generate a `.jar` file and store it to S3
  3. Download - Get the file content from S3