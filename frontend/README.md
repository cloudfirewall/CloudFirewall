To run the frontend end server, we go to frontend directory and run the following commands
```
cd frontend
```

Install the dependencies using npm install
```
npm install
```

Then the Next.js development server can be started using command yarn dev

```
yarn dev
```

## Docker Deployment
Build your container with 
```bash
docker build . -t next-cloudfirewall-app
```
 and run it with 
 ```bash 
 docker run -p 3000:3000 next-cloudfirewall-app
 ```
 Then the next web app can be accessed at host:port (Eg.  http://localhost:3000)


## Note
Remember to start the backend server first
The instructions for starting backend server can ba found at branch feature/CRUD-APIs