# API

gcloud config set project glass-gasket-463218-j2

set DATASTORE_DATASET=glass-gasket-463218-j2
set DATASTORE_EMULATOR_HOST=localhost:8081
set DATASTORE_EMULATOR_HOST_PATH=localhost:8081/datastore
set DATASTORE_HOST=http://localhost:8081
set DATASTORE_PROJECT_ID=glass-gasket-463218-j2
set DATASTORE_USE_PROJECT_ID_AS_APP_ID=true

set SMTP_USER="geolinxpt@gmail.com"
set SMTP_PASSWORD= "hhdz bznq tfii cyuz"     //password for geolinx app

mvn clean install package appengine:run

