# API

gcloud config set project root-app-453615-f3

export DATASTORE_DATASET=root-app-453615-f3
export DATASTORE_EMULATOR_HOST=localhost:8081
export DATASTORE_EMULATOR_HOST_PATH=localhost:8081/datastore
export DATASTORE_HOST=http://localhost:8081
export DATASTORE_PROJECT_ID=root-app-453615-f3
export DATASTORE_USE_PROJECT_ID_AS_APP_ID=true

mvn clean install package appengine:run

# Datastore

gcloud beta emulators datastore start