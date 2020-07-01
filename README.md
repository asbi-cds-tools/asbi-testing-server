# ASBI Testing Server
This project configures a Node.js server to be used for testing alcohol screening and brief intervention (ASBI) clinical decision support (CDS). It leverages the [Asymmetrick implementation](https://github.com/Asymmetrik/node-fhir-server-core) of the Health Level 7 (HL7<sup>&reg;</sup>) Fast Healthcare Interoperability Resources (FHIR<sup>&reg;</sup>) [specification](https://www.hl7.org/fhir/overview.html).

## Cautions and Limitations

**This project is not intended to provide a fully-implemented and secure FHIR server.** It has been configured to expose synthetic patient data over a [SMART on FHIR<sup>&reg;</sup>](https://docs.smarthealthit.org/) connection to either the [ASBI CDS Screening App](https://github.com/asbi-cds-tools/asbi-screening-app) or the [ASBI CDS Intervention App](https://github.com/asbi-cds-tools/asbi-intervention-app) for the purposes of `localhost` testing. It should not be used in a production system nor should it be used to store or transmit protected health information (PHI) or personally identifiable information (PII).

This project currently only supports the [EHR](http://www.hl7.org/fhir/smart-app-launch/#ehr-launch-sequence) SMART on FHIR<sup>&reg;</sup> launch sequence.

## Components
This project consists of several components.

### FHIR<sup>&reg;</sup>
Asymmetrik's [node-fhir-server-core](https://github.com/Asymmetrik/node-fhir-server-core) provides a FHIR<sup>&reg;</sup> API that has been configured to provide the following resources:
1. Patient
2. Condition
3. Observation
4. Procedure
5. QuestionnaireResponse

Additional resources will be exposed as needed to support ASBI CDS testing.

### OAuth2
The [express-oauth-server](https://github.com/oauthjs/express-oauth-server) provides an OAuth2 endpoint required for the SMART on FHIR<sup>&reg;</sup> connection between the FHIR<sup>&reg;</sup> API and the [ASBI CDS Screening App](https://github.com/asbi-cds-tools/asbi-screening-app). **Note that password authentication has been disabled since this is meant for `localhost` testing only.**

### Database
A flat JSON file is being used as the database from which the FHIR API pulls data.

## Instructions

### Setup
Running `yarn` in the root directory should install all dependencies (see [https://yarnpkg.com/](https://yarnpkg.com/)).

### Start
Running this project assumes you have also installed the [ASBI CDS Screening App](https://github.com/asbi-cds-tools/asbi-screening-app):
1. `yarn start` in the root of this project
2. Go to where you have setup the ASBI CDS Screening App and run `yarn serve`
3. Open a web browser and navigate to [http://localhost:8080/selector.html](http://localhost:8080/selector.html)
4. Select a synthetic patient from the list

This will start the SMART on FHIR<sup>&reg;</sup> launch sequence, which if everything is working should result in the ASBI CDS Screening App being displayed. A series of FHIR<sup>&reg;</sup> queries will be made from the App to this project, which will respond with the appropriate resources.

## License
(C) 2020 The MITRE Corporation. All Rights Reserved. Approved for Public Release: 20-0458. Distribution Unlimited.

Unless otherwise noted, this work is available under an Apache 2.0 license. It was produced by the MITRE Corporation for the National Center on Birth Defects and Developmental Disabilities, Centers for Disease Control and Prevention in accordance with the Statement of Work, contract number 75FCMC18D0047, task order number 75D30119F05691.

This project includes an example (`.src/oauth/memoryModel.js`) from the express-oauth-server project, available under an MIT License. (C) 2015 Seegno.

Any LOINC (http://loinc.org) content is copyright &copy; 1995-2020, Regenstrief Institute, Inc. and the Logical Observation Identifiers Names and Codes (LOINC) Committee and is available at no cost under the license at http://loinc.org/license. LOINC<sup>&reg;</sup> is a registered United States trademark of Regenstrief Institute, Inc.

References to and reproductions of the AUDIT alcohol screening instrument are made by permission from the World Health Organization (WHO). The WHO does not endorse this project, does not provide any warranty, and does not assume any liability for its use. For further information, please see:

Alcohol Use Disorders Identification Test - Guidelines for Use in Primary Care, Second Edition. Geneva, World Health Organization, 2001.

AUDIT (C) World Health Organization 2001

https://www.who.int/substance_abuse/activities/sbi/en/