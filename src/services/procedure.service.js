const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./src/services/database.json');
const db = low(adapter);

module.exports.search = async (args, context) => {
  let Procedure = resolveSchema(args.base_version, 'procedure');
  let patientID = args['patient'];
  let result = await db.get('resources').filter({ 
    resourceType: 'Procedure',
    subject: { reference: 'Patient/' + patientID }
  }).value();
  let results = [];
  result.forEach(r => results.push(new Procedure(r)));
  if (result != null) return results;
  else return null;
};

module.exports.searchById = async (args, context) => {
  let Procedure = resolveSchema(args.base_version, 'procedure');
  let procedureId = args['id'];
  let result = await db.get('resources').find({ 
    resourceType: 'Procedure',
    id: procedureId
  }).value();
  return new Procedure(result);
};