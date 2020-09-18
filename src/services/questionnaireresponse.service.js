const { resolveSchema } = require('@asymmetrik/node-fhir-server-core');
const { v4: uuidv4 } = require('uuid');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./src/services/database.json');
const db = low(adapter);

module.exports.search = async (args, context) => {
  let QuestionnaireResponse = resolveSchema(args.base_version, 'questionnaireresponse');
  let patientID = args['patient'];
  let result = await db.get('resources').filter({ 
    resourceType: 'QuestionnaireResponse',
    subject: { reference: 'Patient/' + patientID }
  }).value();
  let results = [];
  result.forEach(r => results.push(new QuestionnaireResponse(r)));
  if (result != null) return results;
  else return null;
};

module.exports.searchById = async (args, context) => {
  let QuestionnaireResponse = resolveSchema(args.base_version, 'questionnaireresponse');
  let questionnaireResponseId = args['id'];
  let result = await db.get('resources').find({ 
    resourceType: 'QuestionnaireResponse',
    id: questionnaireResponseId
  }).value();
  return new QuestionnaireResponse(result);
};

module.exports.create = async (args, context) => {
  let QuestionnaireResponse = resolveSchema(args.base_version, 'questionnaireresponse');
  QuestionnaireResponse.id = uuidv4();
  let doc = new QuestionnaireResponse(context.req.body).toJSON();
  await db.get('resources').push(doc).write();
	return {
		id: QuestionnaireResponse.id,
	};
};