const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./src/services/database.json');
const db = low(adapter);

module.exports.search = async (args, context) => {
  let Condition = require(resolveSchema(args.base_version, 'condition'));
  let patientID = args['patient'];
  let result = await db.get('resources').filter({ 
    resourceType: 'Condition',
    subject: { reference: 'Patient/' + patientID }
  }).value();
  let results = [];
  result.forEach(r => results.push(new Condition(r)));
  if (result != null) return results;
  else return null;
};

module.exports.searchById = async (args, context) => {
  let Condition = require(resolveSchema(args.base_version, 'condition'));
  let conditionId = args['id'];
  let result = await db.get('resources').find({ 
    resourceType: 'Condition',
    id: conditionId
  }).value();
  return new Condition(result);
};