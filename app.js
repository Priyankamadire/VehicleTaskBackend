const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 5000;
app.use(bodyParser.json());

const DATA_FILE = "./data.json";

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

const writeData = (data, callback) => {
  fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), (err) => {
    callback(err);
  });
};

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

app.post("/scenario", (req, res) => {
  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }

    const newScenario = req.body;
    newScenario.id = Date.now(); // Generate a unique ID
    newScenario.serialNumber = data.scenarios.length + 1; // Generate serial number
    data.scenarios = data.scenarios || [];
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

  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }

    const scenarios = data.scenarios || [];
    const scenario = scenarios.find((scenario) => scenario.id === scenarioId);
    if (!scenario) {
      res.status(404).send("Scenario not found");
      return;
    }

    const vehicles = data.vehicles || [];
    const vehiclesForScenario = vehicles.filter(
      (vehicle) => vehicle.scenarioId === scenarioId
    );

    const vehicleCount = vehiclesForScenario.length;

    res.status(200).json({ scenarioId, vehicleCount });
  });
});

app.get("/getscenariobyid/:id", (req, res) => {
  const scenarioId = parseInt(req.params.id);

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
    res.status(200).json(scenario);
  });
});

app.delete("/scenario/:id", (req, res) => {
  const scenarioId = parseInt(req.params.id);

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
  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
      return;
    }

    data.scenarios = [];

    writeData(data, (err) => {
      if (err) {
        res.status(500).send("Error writing to data file");
        return;
      }

      res.status(204).send();
    });
  });
});

app.delete("/vehicle/:id", (req, res) => {
  const vehicleId = parseInt(req.params.id);

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
  const vehicleId = parseInt(req.params.id);
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

app.get("/getscenario", (req, res) => {
  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
    } else {
      const scenarios = data.scenarios || [];
      res.send(scenarios);
    }
  });
});

app.get("/getvehicle", (req, res) => {
  readData((err, data) => {
    if (err) {
      res.status(500).send("Error reading data file");
    } else {
      const vehicles = data.vehicles || [];
      res.send(vehicles);
    }
  });
});

app.get("/vehicles/:scenarioId", (req, res) => {
  const { scenarioId } = req.params;
  if (!scenarioId) {
    return res.status(400).json({ message: "Missing scenarioId parameter" });
  }

  readData((err, data) => {
    if (err) {
      return res.status(500).send("Error reading data file");
    }

    const filteredVehicles = data.vehicles.filter(
      (vehicle) => vehicle.scenarioId === parseInt(scenarioId)
    );
    res.json(filteredVehicles);
  });
});

app.get("/vehiclesbyid/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Missing id parameter" });
  }

  readData((err, data) => {
    if (err) {
      return res.status(500).send("Error reading data file");
    }

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
    newVehicle.id = Date.now();
    newVehicle.serialNumber = data.vehicles.length + 1;
    data.vehicles = data.vehicles || [];
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
