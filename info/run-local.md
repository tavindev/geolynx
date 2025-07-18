# API

gcloud config set project glass-gasket-463218-j2

export DATASTORE_DATASET=glass-gasket-463218-j2
export DATASTORE_EMULATOR_HOST=localhost:8081
export DATASTORE_EMULATOR_HOST_PATH=localhost:8081/datastore
export DATASTORE_HOST=http://localhost:8081
export DATASTORE_PROJECT_ID=glass-gasket-463218-j2
export DATASTORE_USE_PROJECT_ID_AS_APP_ID=true

export SMTP_USER="geolinxpt@gmail.com"
export SMTP_PASSWORD= //password for geolinx app

mvn clean install package appengine:run

