const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./src/services/database.json');
const db = low(adapter);

module.exports.search = async (args, context) => {
  let Patient = resolveSchema(args.base_version, 'patient');
  let patientID = args['id'];
  let result = await db.get('resources').find({ 
    resourceType: 'Patient',
    id: patientID
  }).value();
  return new Patient(result);
};

module.exports.searchById = async (args, context) => {
  let Patient = resolveSchema(args.base_version, 'patient');
  let patientID = args['id'];
  let result = await db.get('resources').find({ 
    resourceType: 'Patient',
    id: patientID
  }).value();
  return new Patient(result);
};