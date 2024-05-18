const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 5000;
app.use(bodyParser.json());

const DATA_FILE = "./data.json";

// Read data from JSON file

// cors.use();
app.use(cors());
const readData = (callback) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, JSON.parse(data));
    }
  });
};

// Helper function to write data to file
const writeData = (data, callback) => {
  fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), (err) => {
    callback(err);
  });
};

// GET endpoint to retrieve all data
app.get("/data", (req, res) => {
  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
    } else {
      res.send(data);
    }
  });
});
app.get("/", (req, res) => {
  res.send("Hi hello");
});
// POST endpoint to add a scenario
// app.post("/scenario", (req, res) => {
//   readData((err, data) => {
//     if (err) {
//       res.status(500).send("Error reading data file");
//       return;
//     }
//     const newScenario = req.body;
//     newScenario.id = Date.now(); // Generate a unique ID
//     data.scenarios = data.scenarios || [];
//     data.scenarios.push(newScenario);

//     writeData(data, (err) => {
//       if (err) {
//         res.status(500).send("Error writing to data file");
//       } else {
//         res.status(201).send(newScenario);
//       }
//     });
//   });
// });

app.post("/scenario", (req, res) => {
  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }
    const newScenario = req.body;
    data.scenarios = data.scenarios || [];

    // Generate ID as the length of the existing scenarios array plus one
    newScenario.id = data.scenarios.length + 1;

    data.scenarios.push(newScenario);

    writeData(data, (err) => {
      if (err) {
        res.status(500).send("Error writing to data file");
      } else {
        res.status(201).send(newScenario);
      }
    });
  });
});

app.put("/updatescenario/:id", (req, res) => {
  const scenarioId = parseInt(req.params.id); // Convert ID to number
  const updatedScenario = req.body;

  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }

    const index = data.scenarios.findIndex(
      (scenario) => scenario.id === scenarioId
    );
    if (index === -1) {
      res.status(404).send("Scenario not found");
      return;
    }

    // Update the scenario with the provided ID
    data.scenarios[index] = { ...data.scenarios[index], ...updatedScenario };

    writeData(data, (err) => {
      if (err) {
        res.status(500).send("Error writing to data file");
        return;
      }
      res.status(200).send(data.scenarios[index]);
    });
  });
});

app.get("/getvechcount/:id", (req, res) => {
  const scenarioId = parseInt(req.params.id);

  // Read data from JSON file
  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }

    const scenarios = data.scenarios || []; // Extract scenarios from data
    const scenario = scenarios.find((scenario) => scenario.id === scenarioId);
    if (!scenario) {
      res.status(404).send("Scenario not found");
      return;
    }

    // Find vehicles for the given scenarioId
    const vehicles = data.vehicles || []; // Extract vehicles from data
    const vehiclesForScenario = vehicles.filter(
      (vehicle) => vehicle.scenarioId === scenarioId
    );

    // Count the number of vehicles
    const vehicleCount = vehiclesForScenario.length;

    res.status(200).json({ scenarioId, vehicleCount });
  });
});

app.get("/getscenariobyid/:id", (req, res) => {
  const scenarioId = parseInt(req.params.id); // Convert ID to number

  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }

    const scenario = data.scenarios.find(
      (scenario) => scenario.id === scenarioId
    );
    if (!scenario) {
      res.status(404).send("Scenario not found");
      return;
    }

    // Scenario found, send it back as a response
    res.status(200).json(scenario);
  });
});

app.delete("/scenario/:id", (req, res) => {
  const scenarioId = parseInt(req.params.id); // Convert ID to number

  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }

    const index = data.scenarios.findIndex(
      (scenario) => scenario.id === scenarioId
    );
    if (index === -1) {
      res.status(404).send("Scenario not found");
      return;
    }

    // Remove the scenario with the provided ID
    data.scenarios.splice(index, 1);

    writeData(data, (err) => {
      if (err) {
        res.status(500).send("Error writing to data file");
        return;
      }
      res.status(204).send();
    });
  });
});

app.delete("/allscenario", (req, res) => {
  // Read data from the data file
  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }

    // Remove all scenarios from the data
    data.scenarios = [];

    // Write the updated data back to the file
    writeData(data, (err) => {
      if (err) {
        res.status(500).send("Error writing to data file");
        return;
      }
      // Send success response
      res.status(204).send();
    });
  });
});

app.delete("/vehicle/:id", (req, res) => {
  const vehicleId = parseInt(req.params.id); // Convert ID to number

  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }

    const index = data.vehicles.findIndex(
      (vehicle) => vehicle.id === vehicleId
    );
    if (index === -1) {
      res.status(404).send("vehicle not found");
      return;
    }

    // Remove the vehicle with the provided ID
    data.vehicles.splice(index, 1);

    writeData(data, (err) => {
      if (err) {
        res.status(500).send("Error writing to data file");
        return;
      }
      res.status(204).send();
    });
  });
});
app.put("/updatevehicle/:id", (req, res) => {
  const vehicleId = parseInt(req.params.id); // Convert ID to number
  const updatedvehicle = req.body;

  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }

    const index = data.vehicles.findIndex(
      (vehicle) => vehicle.id === vehicleId
    );
    if (index === -1) {
      res.status(404).send("vehicle not found");
      return;
    }

    // Update the vehicle with the provided ID
    data.vehicles[index] = { ...data.vehicles[index], ...updatedvehicle };

    writeData(data, (err) => {
      if (err) {
        res.status(500).send("Error writing to data file");
        return;
      }
      res.status(200).send(data.vehicles[index]);
    });
  });
});

// GET endpoint to retrieve scenarios
app.get("/getscenario", (req, res) => {
  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
    } else {
      const scenarios = data.scenarios || []; // Extract scenarios from data
      res.send(scenarios);
    }
  });
});

// GET endpoint to retrieve vehicles
app.get("/getvehicle", (req, res) => {
  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
    } else {
      const vehicles = data.vehicles || []; // Extract vehicles from data
      res.send(vehicles);
    }
  });
});

app.get("/vehicles/:scenarioId", (req, res) => {
  const { scenarioId } = req.params;
  if (!scenarioId) {
    return res.status(400).json({ message: "Missing scenarioId parameter" });
  }

  // Read data from JSON file
  readData((err, data) => {
    if (err) {
      return res.status(500).send("Error reading data file");
    }

    // Find vehicles by scenarioId
    const filteredVehicles = data.vehicles.filter(
      (vehicle) => vehicle.scenarioId === parseInt(scenarioId)
    );
    res.json(filteredVehicles);
  });
});

app.get("/scenarios", (req, res) => {
  res.json(data.scenarios);
});

app.get("/vehiclesbyid/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Missing id parameter" });
  }

  // Read data from JSON file
  readData((err, data) => {
    if (err) {
      return res.status(500).send("Error reading data file");
    }

    // Find vehicles by scenarioId (assuming id is the scenarioId)
    const filteredVehicles = data.vehicles.filter(
      (vehicle) => vehicle.id === parseInt(id)
    );
    res.json(filteredVehicles);
  });
});

app.post("/vehicle", (req, res) => {
  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }
    const newVehicle = req.body;
    data.vehicles = data.vehicles || [];

    // Generate ID as the length of the existing vehicles array plus one
    newVehicle.id = data.vehicles.length + 1;

    data.vehicles.push(newVehicle);

    writeData(data, (err) => {
      if (err) {
        res.status(500).send("Error writing to data file");
      } else {
        res.status(201).send(newVehicle);
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
