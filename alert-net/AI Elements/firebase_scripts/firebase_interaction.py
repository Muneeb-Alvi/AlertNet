import csv
import firebase_admin
from datetime import datetime
from firebase_admin import credentials, firestore


cred = credentials.Certificate(
    "alertnet-12de6-firebase-adminsdk-fbsvc-dcb6fb3901.json")
firebase_admin.initialize_app(cred)


def add_data_to_firestore(doc_id, collection_name, data):
    db = firestore.client()
    collection_ref = db.collection(collection_name)

    doc_ref = collection_ref.document(doc_id)
    doc_ref.set(data)


collection_name = 'interactions'

data = []
with open("interactions.csv", 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        id = row['interaction_id']
        del row['interaction_id']
        processed_row = {
        'user_id': row['user_id'],
        'alert_id': row['alert_id'],
        'time_of_reaction': datetime.strptime(row['time_of_reaction'],"%Y-%m-%d %H:%M:%S.%f"),
        'affirmative': row['affirmative'].lower() == 'true',
        }
        # print(processed_row)
        # break
        add_data_to_firestore(id, collection_name, processed_row)
        # break
