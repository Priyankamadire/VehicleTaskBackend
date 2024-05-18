Vehicle Simulation Backend
This repository contains the backend code for the Vehicle Simulation application. The backend handles CRUD operations for scenarios and vehicles, 
serving data from a data.json file. The application is successfully deployed on Render(https://vehicletaskbackend.onrender.com/)
and connected with a React frontend deployed on Vercel(https://vehicle-simulation-phi.vercel.app/).

API Documentation
Comprehensive API documentation for the backend is available (https://documenter.getpostman.com/view/25358745/2sA3QmCZbf). 
It includes detailed information on all available endpoints for managing scenarios and vehicles.

Endpoints

Scenario Endpoints

POST /scenario: Add a new scenario
GET /getscenario: Retrieve all scenarios
GET /getvechcount : To check how many vehicles registered for that scenario
GET getscenariobyid : Retrieve   scenario by id
PUT /updatescenario/:id: Update an existing scenario
DELETE /scenario/:id: Delete a scenario
DELETE /scenario :Delete all scenario

Vehicle Endpoints

POST /vehicle: Add a new vehicle
GET /getvehicle: Retrieve all vehicles
GET /vehicles/:scenarioId: Retrieve vehicles for a specific scenario
GET /vehiclesbyid/:id: Retrieve vehicle of that id
PUT /updatevehicle/:id: Update an existing vehicle
DELETE /vehicle/:id: Delete a vehicle

Steps to Clone Backend
Step 1 : Create a folder 
Step 2 : go to power shell type this commands
    -> npm init -y
    -> npm install package-name
   install all packages from package.json file
Step 3 : Copy and Paste app.js and data.json files 
Step 4 : node app.js/nodemon app.js
