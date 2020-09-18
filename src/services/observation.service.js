const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./src/services/database.json');
const db = low(adapter);

module.exports.search = async (args, context) => {
  let Observation = resolveSchema(args.base_version, 'observation');
  let patientID = args['patient'];
  let result = await db.get('resources').filter({ 
    resourceType: 'Observation',
    subject: { reference: 'Patient/' + patientID }
  }).value();
  let results = [];
  result.forEach(r => results.push(new Observation(r)));
  if (result != null) return results;
  else return null;
};

module.exports.searchById = async (args, context) => {
  let Observation = resolveSchema(args.base_version, 'observation');
  let observationId = args['id'];
  let result = await db.get('resources').find({ 
    resourceType: 'Observation',
    id: observationId
  }).value();
  return new Observation(result);
};