gcloud functions deploy prod_ai --gen2 --runtime=python312 --region=europe-central2 --source=. --entry-point=root --trigger-http --allow-unauthenticated