# Image Moderation System

## Overview

This project analyzes the content of uploaded images to ensure compliance with moderation policies using **AWS Rekognition**. If an image violates these policies, it will not be uploaded to the system. Accepted images are stored in **AWS S3**, and metadata such as the image path, creation date, and AWS Rekognition analysis results are saved in a **PostgreSQL** database.

## Tech Stack

### Backend (API)
- **Framework**: Nest.js
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Cloud Services**: AWS S3, AWS Rekognition
- **Language**: TypeScript

### Frontend (UI)
- **Framework**: React
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: CSS
- **Libraries**: Axios

## Project Structure

```
API/
  ├── src/
  │   ├── constants/
  │   ├── controllers/
  │   ├── dto/
  │   ├── entities/
  │   ├── models/
  │   ├── services/
  │   ├── types/
  │   ├── utils/
  │   ├── app.module.ts
  │   ├── config.ts
  │   └── main.ts
  ├── test/
  ├── .env
  ├── .eslintrc.js
  ├── .prettierrc
  ├── nest-cli.json
  ├── package.json
  ├── tsconfig.build.json
  └── tsconfig.json
UI/
  ├── src/
  │   ├── components/
  │   ├── hooks/
  │   ├── models/
  │   ├── services/
  │   ├── App.tsx
  │   ├── App.css
  │   └── main.tsx
  ├── public/
  ├── .env
  ├── .gitignore
  ├── eslint.config.js
  ├── index.html
  ├── package.json
  ├── tsconfig.app.json
  ├── tsconfig.json
  ├── tsconfig.node.json
  └── vite.config.ts
```

## Setup and Installation

### Prerequisites
- Node.js (v20 or higher)
- npm or yarn
- PostgreSQL
- AWS Account with S3 and Rekognition services enabled

### Backend (API)

1. Clone the repository:
    ```sh
    git clone https://github.com/cristofima/Demo-AWS-ImageModeration
    cd API
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Copy the `.env` file and rename it to `.env.local`:
   ```sh
   cp .env .env.local
   ```

4. Configure environment variables in `.env.local`:
   ```env
   DB_NAME=
   DB_USER=
   DB_PASSWORD=
   DB_HOST=

   AWS_S3_ACCESS_KEY=
   AWS_S3_SECRET_ACCESS_KEY=
   AWS_S3_REGION=
   AWS_S3_BUCKET_NAME=
   AWS_S3_BUCKET_FOLDER=

   AWS_REKOGNITION_REGION=
   AWS_REKOGNITION_ACCESS_KEY=
   AWS_REKOGNITION_SECRET_ACCESS_KEY=
   ```

5. **Run the application**:
    ```sh
    npm run start:local
    ```

### Frontend (UI)

1. Navigate to the UI directory:
    ```sh
    cd ../UI
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Configure environment variables in `.env`:
    ```env
    REACT_APP_API_BASE_URL=http://localhost:3000/api
    ```

4. Run the application:
    ```sh
    npm run dev
    ```

## Image Moderation

The system classifies images into different categories based on AWS Rekognition's analysis. If an image is flagged as inappropriate, it will either be **blocked** or **blurred** before being stored.

### **Example of Accepted Images**

*(No offensive content)*

![No offensive content](screenshots/no-offensive-content.PNG)

### **Example of Moderated Images (Blurred)**

*(Contains sensitive content, blurred for safety)*

![Sensitive content](screenshots/offensive-content.PNG)

## API Endpoints

### **Upload Image**

- **Endpoint:** `POST /api/Posts`
- **Description:** Uploads an image (Post), processes it with AWS Rekognition, and stores it if it passes moderation.
- **Request:**
  ```json
  {
    "image": "(binary file)"
  }
  ```
- **Response:**
  ```json
    {
        "id": 41,
        "imageIsBlurred": false,
        "createdAt": "2025-03-01T02:20:34.639Z",
        "imagePath": "https://demo.s3.us-west-2.amazonaws.com/images/3.jpg"
    }
  ```

### **Get Images**

- **Endpoint:** `GET /api/Posts?page=1&limit=12`
- **Description:** Retrieves images (Posts).
- **Response:**
  ```json
    {
        "data": [
            {
                "id": 40,
                "imageIsBlurred": true,
                "createdAt": "2025-02-28T21:16:01.583Z",
                "imagePath": "https://demo.s3.us-west-2.amazonaws.com/images/2.jpg"
            },
            {
                "id": 39,
                "imageIsBlurred": true,
                "createdAt": "2025-02-27T01:44:18.111Z",
                "imagePath": "https://demo.s3.us-west-2.amazonaws.com/images/1.jpg"
            },
            ...
        ],
        "metadata": {
            "page": 1,
            "limit": 8,
            "totalRecords": 38,
            "totalPages": 5
        }
    }
  ```

## Author

Cristopher Coronado

## Contributing

If you wish to contribute, follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`
3. Commit your changes: `git commit -m "Added new feature"`
4. Push to the branch: `git push origin feature-branch-name`
5. Open a pull request.

## Acknowledgements

- [Nest.js](https://nestjs.com/)
- [React](https://reactjs.dev/)
- [AWS S3](https://aws.amazon.com/s3/)
- [AWS Rekognition](https://aws.amazon.com/rekognition/)
- [TypeORM](https://typeorm.io/)
- [Vite](https://vitejs.dev/)