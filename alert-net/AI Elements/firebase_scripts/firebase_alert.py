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


# Timestamps
# doc_ref.set({
#     'custom_timestamp': 
# })

collection_name = 'alerts'

alert_data = []
with open("cat_alerts.csv", 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        alert_id = row['alert_id']
        del row['alert_id']
        processed_row = {
            'creator_user_id': row['creator_user_id'],
            'title': row['title'],
            'entry_date_time': datetime.strptime(row['entry_date_time'],"%Y-%m-%d %H:%M:%S.%f"),
            'event_date_time': datetime.strptime(row['event_date_time'],"%Y-%m-%d %H:%M:%S.%f"),
            'description': row['description'],
            'latitude': float(row['latitude']),
            'longitude': float(row['longitude']),
            'location_description': row['location_description'],
            'num_affirmatives': int(row['num_affirmatives']),
            'num_responses': int(row['num_responses']),
            'cluster': int(row['cluster']),
            'prob_true_random_forrest': float(row['prob_true_random_forrest']),
            'category': row['category']
        }
        add_data_to_firestore(alert_id, "alerts", processed_row)
