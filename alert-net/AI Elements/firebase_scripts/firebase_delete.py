import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1.base_query import FieldFilter


# Fetch the service account key from your Firebase console (Project Settings > Service accounts)
cred = credentials.Certificate(
    "alertnet-f9c61-firebase-adminsdk-fbsvc-bdb23fd094.json")
firebase_admin.initialize_app(cred)


specific_id = 'schema'  # The id of alerts you want to keep


def delete_alerts_without_id():
    db = firestore.client()
    db_alert = db.collection('interactions')

    for record in db_alert.get():
        if record.id != "schema":
            db_alert.document(record.id).delete()


# Run the function to delete alerts without a specified id
delete_alerts_without_id()
