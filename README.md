## Backend Setup

### Configure the Environment Variables
Create a `.env` file inside the `/backend` directory and add the following:

Example .env
```env
DB_USER=user
DB_PASSWORD=password
DB_NAME=library
JWT_SECRET_KEY=QE5jUmZValhuMnI1dTh4L0E/RChHK0tiUGRTZ1ZrWXA=
```

### Start the Backend with Docker
Navigate to the /backend directory and run:

`docker-compose up`

## Frontend Setup
### Navigate to the Frontend Directory
Move to the frontend project folder:
cd frontend
### Install Dependencies
Run the following command to install required dependencies:
`npm install`
### Start the Frontend dev server
`ng serve`
